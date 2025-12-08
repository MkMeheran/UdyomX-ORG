'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, AlertTriangle, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
    generateUniqueSlug, 
    isValidSlug, 
    checkSlugAvailability,
    suggestAlternativeSlugs,
    getSlugsByType
} from '@/lib/slug-utils';

interface SlugInputProps {
    value: string;
    onChange: (value: string) => void;
    type: 'post' | 'project' | 'service';
    title?: string;
    excludeId?: string;
    className?: string;
}

export function SlugInput({ 
    value, 
    onChange, 
    type, 
    title,
    excludeId,
    className 
}: SlugInputProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [validation, setValidation] = useState<{
        valid: boolean;
        message?: string;
        available?: boolean;
        suggestions?: string[];
    } | null>(null);
    
    // Validate and check availability when slug changes
    useEffect(() => {
        if (!value) {
            setValidation(null);
            setIsChecking(false);
            return;
        }
        
        // First validate format
        const formatValid = isValidSlug(value);
        if (!formatValid) {
            setValidation({
                valid: false,
                message: 'Only lowercase letters, numbers, and hyphens are allowed.'
            });
            setIsChecking(false);
            return;
        }
        
        // Then check availability
        setIsChecking(true);
        
        // Simulate async check (in real app, this would be an API call)
        let cancelled = false;
        const timer = setTimeout(() => {
            (async () => {
                try {
                    const availability = await checkSlugAvailability(value, type, excludeId);
                    if (cancelled) return;
                    if (availability.available) {
                        setValidation({
                            valid: true,
                            available: true,
                            message: 'Slug is available!'
                        });
                    } else {
                        const suggestions = await suggestAlternativeSlugs(value, type);
                        if (cancelled) return;
                        setValidation({
                            valid: false,
                            available: false,
                            message: availability.message || 'Slug already exists.',
                            suggestions,
                        });
                    }
                } catch (error) {
                    console.error('Slug availability check failed', error);
                    if (!cancelled) {
                        setValidation({
                            valid: false,
                            message: 'Could not verify slug. Please try again.'
                        });
                    }
                } finally {
                    if (!cancelled) {
                        setIsChecking(false);
                    }
                }
            })();
        }, 300);
        
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [value, type, excludeId]);
    
    // Auto-generate slug from title
    const generateFromTitle = useCallback(() => {
        if (!title) return;

        (async () => {
            try {
                const existingSlugs = await getSlugsByType(type);
                const newSlug = await generateUniqueSlug(title, existingSlugs);
                onChange(newSlug);
            } catch (error) {
                console.error('Failed to auto-generate slug', error);
            }
        })();
    }, [title, type, onChange]);
    
    // Handle input change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // Auto-format: lowercase, replace spaces with hyphens, remove invalid chars
        const formatted = e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-');
        
        onChange(formatted);
    }, [onChange]);
    
    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center gap-2">
                <label className="font-bold text-[#2C2416]">
                    Slug <span className="text-red-500">*</span>
                </label>
                {title && (
                    <button
                        type="button"
                        onClick={generateFromTitle}
                        className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-[#F5C542] border-2 border-[#2C2416] hover:shadow-[2px_2px_0_rgba(44,36,22,0.3)] transition-all"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Auto-generate
                    </button>
                )}
            </div>
            
            <div className="relative">
                {/* URL Prefix */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-[#2C2416]/50 font-mono text-sm pointer-events-none">
                    <LinkIcon className="w-4 h-4 mr-1" />
                    /{type === 'post' ? 'blog' : type === 'project' ? 'projects' : 'services'}/
                </div>
                
                {/* Input */}
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="your-content-slug"
                    className={cn(
                        'w-full pl-36 pr-10 py-3 font-mono text-sm bg-white border-4 transition-all',
                        validation?.valid === false 
                            ? 'border-red-500' 
                            : validation?.valid === true 
                                ? 'border-green-500' 
                                : 'border-[#2C2416]',
                        'shadow-[4px_4px_0_rgba(44,36,22,0.2)]',
                        'focus:outline-none focus:shadow-[6px_6px_0_rgba(44,36,22,0.3)]'
                    )}
                />
                
                {/* Status Icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isChecking ? (
                        <RefreshCw className="w-5 h-5 text-[#2C2416]/40 animate-spin" />
                    ) : validation?.valid === true ? (
                        <Check className="w-5 h-5 text-green-500" />
                    ) : validation?.valid === false ? (
                        <X className="w-5 h-5 text-red-500" />
                    ) : null}
                </div>
            </div>
            
            {/* Validation Message */}
            {validation && (
                <div className={cn(
                    'flex items-start gap-2 text-sm font-medium',
                    validation.valid ? 'text-green-600' : 'text-red-600'
                )}>
                    {validation.valid ? (
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        <p>{validation.message}</p>
                        
                        {/* Suggestions */}
                        {validation.suggestions && validation.suggestions.length > 0 && (
                            <div className="mt-1">
                                <span className="text-[#2C2416]/60">Try: </span>
                                {validation.suggestions.map((suggestion, index) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => onChange(suggestion)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {suggestion}
                                        {index < validation.suggestions!.length - 1 && ', '}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Helper Text */}
            {!value && (
                <p className="text-xs text-[#2C2416]/50">
                    Leave empty to auto-generate from title. Only lowercase letters, numbers, and hyphens allowed.
                </p>
            )}
        </div>
    );
}
