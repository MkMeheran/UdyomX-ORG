'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Link as LinkIcon, Search, X, FileText, Briefcase, Settings, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorRecommendedItem } from '@/types/editor';

interface RecommendedEditorProps {
    items: EditorRecommendedItem[];
    onChange: (items: EditorRecommendedItem[]) => void;
    allowedTypes?: ('post' | 'project' | 'service')[];
    maxItems?: number;
    title?: string;
}

// Generate unique ID
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Fetch content by slug using API
async function fetchContentBySlug(slug: string, type: 'post' | 'project' | 'service'): Promise<{
    title: string;
    thumbnail?: string;
    excerpt?: string;
} | null> {
    try {
        const endpoint = type === 'post' ? 'blogs' : type === 'project' ? 'projects' : 'services';
        const res = await fetch(`/api/${endpoint}/${slug}`);
        if (!res.ok) return null;
        const data = await res.json();
        
        if (type === 'post') {
            return {
                title: data.title,
                thumbnail: data.thumbnail,
                excerpt: data.excerpt
            };
        } else if (type === 'project') {
            return {
                title: data.name,
                thumbnail: data.images?.[0] || data.thumbnail,
                excerpt: data.description
            };
        } else {
            return {
                title: data.title || data.name,
                thumbnail: data.thumbnail,
                excerpt: data.hookLine || data.description
            };
        }
    } catch {
        return null;
    }
}

// Get all content slugs from API
async function getAllContentSlugs(): Promise<Array<{ slug: string; type: 'post' | 'project' | 'service'; title: string }>> {
    const results: Array<{ slug: string; type: 'post' | 'project' | 'service'; title: string }> = [];
    
    try {
        const [blogs, projects, services] = await Promise.all([
            fetch('/api/blogs').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/api/projects').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/api/services').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);
        
        blogs.forEach((b: any) => results.push({ slug: b.slug, type: 'post', title: b.title }));
        projects.forEach((p: any) => results.push({ slug: p.slug, type: 'project', title: p.name }));
        services.forEach((s: any) => results.push({ slug: s.slug, type: 'service', title: s.title || s.name }));
    } catch {
        // Return empty if API fails
    }
    
    return results;
}

export function RecommendedEditor({ 
    items, 
    onChange, 
    allowedTypes = ['post', 'project', 'service'],
    maxItems = 6,
    title = 'Recommended Content'
}: RecommendedEditorProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [slug, setSlug] = useState('');
    const [selectedType, setSelectedType] = useState<'post' | 'project' | 'service'>(allowedTypes[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<{
        title: string;
        thumbnail?: string;
        excerpt?: string;
    } | null>(null);
    
    // Available slugs for autocomplete
    const [allSlugs, setAllSlugs] = useState<Array<{ slug: string; type: 'post' | 'project' | 'service'; title: string }>>([]);
    const [suggestions, setSuggestions] = useState<typeof allSlugs>([]);
    
    // Load all slugs on mount
    useEffect(() => {
        getAllContentSlugs().then(setAllSlugs);
    }, []);
    
    // Filter suggestions based on input
    useEffect(() => {
        if (slug.length >= 2) {
            const filtered = allSlugs.filter(s => 
                s.slug.includes(slug.toLowerCase()) && 
                s.type === selectedType &&
                !items.some(item => item.slug === s.slug && item.type === s.type)
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }, [slug, selectedType, items, allSlugs]);
    
    // Fetch content preview when slug changes
    const fetchPreview = useCallback(async () => {
        if (!slug) {
            setPreview(null);
            setError(null);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const content = await fetchContentBySlug(slug, selectedType);
            if (content) {
                setPreview(content);
                setError(null);
            } else {
                setPreview(null);
                setError(`No ${selectedType} found with slug "${slug}"`);
            }
        } catch {
            setError('Failed to fetch content');
            setPreview(null);
        } finally {
            setLoading(false);
        }
    }, [slug, selectedType]);
    
    // Debounced fetch on slug change
    useEffect(() => {
        const timer = setTimeout(fetchPreview, 500);
        return () => clearTimeout(timer);
    }, [fetchPreview]);
    
    const addItem = useCallback(() => {
        if (!preview || !slug) return;
        
        const newItem: EditorRecommendedItem = {
            id: generateId(),
            slug,
            type: selectedType,
            title: preview.title,
            thumbnail: preview.thumbnail,
            excerpt: preview.excerpt,
            orderIndex: items.length
        };
        
        onChange([...items, newItem]);
        setSlug('');
        setPreview(null);
        setShowAddModal(false);
    }, [slug, selectedType, preview, items, onChange]);
    
    const removeItem = useCallback((id: string) => {
        onChange(items.filter(item => item.id !== id).map((item, idx) => ({
            ...item,
            orderIndex: idx
        })));
    }, [items, onChange]);
    
    const getTypeIcon = (type: 'post' | 'project' | 'service') => {
        switch (type) {
            case 'post': return <FileText className="w-4 h-4" />;
            case 'project': return <Briefcase className="w-4 h-4" />;
            case 'service': return <Settings className="w-4 h-4" />;
        }
    };
    
    const getTypeColor = (type: 'post' | 'project' | 'service') => {
        switch (type) {
            case 'post': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'project': return 'bg-purple-100 text-purple-700 border-purple-300';
            case 'service': return 'bg-green-100 text-green-700 border-green-300';
        }
    };
    
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#2C2416]">{title} ({items.length}/{maxItems})</h3>
                {items.length < maxItems && (
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] border-4 border-[#2C2416] font-bold text-sm hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add {title.includes('Project') ? 'Project' : 'Content'}
                    </button>
                )}
            </div>
            
            {/* Items Grid */}
            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 bg-white border-4 border-[#2C2416] group"
                        >
                            {/* Thumbnail */}
                            <div className="w-16 h-16 flex-shrink-0 bg-[#F5F1E8] border-2 border-[#2C2416] overflow-hidden">
                                {item.thumbnail ? (
                                    <img 
                                        src={item.thumbnail} 
                                        alt={item.title || ''}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {getTypeIcon(item.type)}
                                    </div>
                                )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <span className={cn(
                                    'inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold border mb-1',
                                    getTypeColor(item.type)
                                )}>
                                    {getTypeIcon(item.type)}
                                    {item.type.toUpperCase()}
                                </span>
                                <p className="font-bold text-sm text-[#2C2416] truncate">
                                    {item.title || item.slug}
                                </p>
                                <p className="text-xs text-[#2C2416]/50 font-mono truncate">
                                    /{item.type === 'post' ? 'blog' : item.type === 'project' ? 'projects' : 'services'}/{item.slug}
                                </p>
                            </div>
                            
                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="p-1 text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30 text-center">
                    <LinkIcon className="w-12 h-12 mx-auto text-[#2C2416]/30 mb-2" />
                    <p className="text-[#2C2416]/50 font-medium">No recommended content yet</p>
                    <p className="text-sm text-[#2C2416]/40">Add related posts, projects, or services by their slug</p>
                </div>
            )}
            
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#F5F1E8] border-4 border-[#2C2416] shadow-[8px_8px_0_rgba(44,36,22,0.4)] p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-black text-[#2C2416]">Add {title.includes('Project') ? 'Related Project' : 'Recommended Content'}</h4>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSlug('');
                                    setPreview(null);
                                    setError(null);
                                }}
                                className="p-1 hover:bg-[#2C2416]/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Type Selection */}
                        {allowedTypes.length > 1 && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">Content Type</label>
                                <div className="flex gap-2">
                                    {allowedTypes.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                setSelectedType(type);
                                                setSlug('');
                                                setPreview(null);
                                                setError(null);
                                            }}
                                            className={cn(
                                                'flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-[#2C2416] transition-all',
                                                selectedType === type
                                                    ? 'bg-[#2C2416] text-white'
                                                    : 'bg-white hover:bg-[#F5C542]'
                                            )}
                                        >
                                            {getTypeIcon(type)}
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Slug Input */}
                        <div className="mb-4 relative">
                            <label className="block font-bold text-[#2C2416] mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2416]/40" />
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    placeholder={`Enter ${selectedType} slug...`}
                                    className="w-full pl-10 pr-10 py-3 border-4 border-[#2C2416] bg-white font-mono"
                                />
                                {loading && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2416]/40 animate-spin" />
                                )}
                            </div>
                            
                            {/* Suggestions Dropdown */}
                            {suggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border-4 border-[#2C2416] shadow-lg max-h-48 overflow-auto">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s.slug}
                                            type="button"
                                            onClick={() => setSlug(s.slug)}
                                            className="w-full px-3 py-2 text-left hover:bg-[#F5C542] transition-colors border-b last:border-0 border-[#2C2416]/20"
                                        >
                                            <span className="font-mono text-sm">{s.slug}</span>
                                            <span className="block text-xs text-[#2C2416]/60 truncate">{s.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border-4 border-red-500 text-red-700 font-medium">
                                {error}
                            </div>
                        )}
                        
                        {/* Preview */}
                        {preview && (
                            <div className="mb-4 p-4 bg-white border-4 border-[#2C2416]">
                                <p className="text-xs font-bold text-[#2C2416]/50 mb-2">PREVIEW</p>
                                <div className="flex items-start gap-3">
                                    {preview.thumbnail && (
                                        <div className="w-20 h-20 flex-shrink-0 border-2 border-[#2C2416] overflow-hidden">
                                            <img 
                                                src={preview.thumbnail} 
                                                alt={preview.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[#2C2416]">{preview.title}</p>
                                        {preview.excerpt && (
                                            <p className="text-sm text-[#2C2416]/60 line-clamp-2 mt-1">{preview.excerpt}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSlug('');
                                    setPreview(null);
                                    setError(null);
                                }}
                                className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-white hover:bg-[#F5F1E8] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={addItem}
                                disabled={!preview || loading}
                                className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-[#F5C542] hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Content
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
