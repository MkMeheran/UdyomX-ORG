'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Trash2, GripVertical, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/slug-utils';
import type { EditorFAQItem } from '@/types/editor';

interface FAQEditorProps {
    items: EditorFAQItem[];
    onChange: (items: EditorFAQItem[]) => void;
    maxItems?: number;
}

export function FAQEditor({ items, onChange, maxItems = 20 }: FAQEditorProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    
    const addItem = useCallback(() => {
        const newItem: EditorFAQItem = {
            id: generateId(),
            question: '',
            answer: '',
            orderIndex: items.length
        };
        onChange([...items, newItem]);
        setExpandedId(newItem.id);
    }, [items, onChange]);
    
    const removeItem = useCallback((id: string) => {
        onChange(items.filter(item => item.id !== id).map((item, idx) => ({
            ...item,
            orderIndex: idx
        })));
        if (expandedId === id) {
            setExpandedId(null);
        }
    }, [items, onChange, expandedId]);
    
    const updateItem = useCallback((id: string, updates: Partial<EditorFAQItem>) => {
        onChange(items.map(item => 
            item.id === id ? { ...item, ...updates } : item
        ));
    }, [items, onChange]);
    
    const moveItem = useCallback((fromIndex: number, direction: 'up' | 'down') => {
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || toIndex >= items.length) return;
        
        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        onChange(newItems.map((item, idx) => ({ ...item, orderIndex: idx })));
    }, [items, onChange]);
    
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#2C2416]">FAQs ({items.length}/{maxItems})</h3>
                {items.length < maxItems && (
                    <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] border-4 border-[#2C2416] font-bold text-sm hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add FAQ
                    </button>
                )}
            </div>
            
            {/* Items List */}
            {items.length > 0 ? (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className={cn(
                                'bg-white border-4 border-[#2C2416] transition-all',
                                expandedId === item.id && 'shadow-[4px_4px_0_rgba(44,36,22,0.3)]'
                            )}
                        >
                            {/* Header */}
                            <div 
                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F5F1E8]"
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            >
                                {/* Drag Handle */}
                                <button
                                    type="button"
                                    className="p-1 cursor-grab hover:bg-[#F5F1E8]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <GripVertical className="w-5 h-5 text-[#2C2416]/50" />
                                </button>
                                
                                {/* Move Buttons */}
                                <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                        className="p-0.5 hover:bg-[#F5C542] disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === items.length - 1}
                                        className="p-0.5 hover:bg-[#F5C542] disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Question Number */}
                                <span className="w-8 h-8 flex items-center justify-center bg-[#F5C542] border-2 border-[#2C2416] font-black text-sm">
                                    {index + 1}
                                </span>
                                
                                {/* Question Preview */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[#2C2416] truncate">
                                        {item.question || 'New Question...'}
                                    </p>
                                </div>
                                
                                {/* Expand Icon */}
                                <ChevronDown className={cn(
                                    'w-5 h-5 text-[#2C2416] transition-transform',
                                    expandedId === item.id && 'rotate-180'
                                )} />
                                
                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(item.id);
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Expanded Content */}
                            {expandedId === item.id && (
                                <div className="p-4 border-t-4 border-[#2C2416] bg-[#F5F1E8]">
                                    {/* Question Input */}
                                    <div className="mb-4">
                                        <label className="block font-bold text-[#2C2416] mb-2">
                                            Question <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={item.question}
                                            onChange={(e) => updateItem(item.id, { question: e.target.value })}
                                            placeholder="Enter the question..."
                                            className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                        />
                                    </div>
                                    
                                    {/* Answer Input */}
                                    <div>
                                        <label className="block font-bold text-[#2C2416] mb-2">
                                            Answer <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={item.answer}
                                            onChange={(e) => updateItem(item.id, { answer: e.target.value })}
                                            placeholder="Enter the answer... (supports Markdown)"
                                            rows={4}
                                            className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium resize-none"
                                        />
                                        <p className="mt-1 text-xs text-[#2C2416]/50">
                                            Supports Markdown formatting: **bold**, *italic*, `code`, [links](url)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30 text-center">
                    <HelpCircle className="w-12 h-12 mx-auto text-[#2C2416]/30 mb-2" />
                    <p className="text-[#2C2416]/50 font-medium">No FAQs yet</p>
                    <p className="text-sm text-[#2C2416]/40">Click "Add FAQ" to add frequently asked questions</p>
                </div>
            )}
        </div>
    );
}
