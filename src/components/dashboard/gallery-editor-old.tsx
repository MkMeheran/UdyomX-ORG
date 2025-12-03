'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Video, Link as LinkIcon, Upload, HardDrive, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/slug-utils';
import type { EditorMediaItem } from '@/types/editor';

interface GalleryEditorProps {
    items: EditorMediaItem[];
    onChange: (items: EditorMediaItem[]) => void;
    maxItems?: number;
}

export function GalleryEditor({ items, onChange, maxItems = 20 }: GalleryEditorProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [addMode, setAddMode] = useState<'url' | 'upload' | 'drive'>('url');
    const [newItem, setNewItem] = useState<Partial<EditorMediaItem>>({
        type: 'image',
        url: '',
        altText: '',
        source: 'url'
    });
    
    const addItem = useCallback(() => {
        if (!newItem.url || !newItem.altText) return;
        
        const item: EditorMediaItem = {
            id: generateId(),
            type: newItem.type || 'image',
            url: newItem.url,
            altText: newItem.altText,
            caption: newItem.caption,
            source: addMode,
            thumbnailUrl: newItem.type === 'video' ? newItem.thumbnailUrl : undefined,
            orderIndex: items.length
        };
        
        onChange([...items, item]);
        setNewItem({ type: 'image', url: '', altText: '', source: 'url' });
        setShowAddModal(false);
    }, [newItem, items, onChange, addMode]);
    
    const removeItem = useCallback((id: string) => {
        onChange(items.filter(item => item.id !== id).map((item, idx) => ({
            ...item,
            orderIndex: idx
        })));
    }, [items, onChange]);
    
    const updateItem = useCallback((id: string, updates: Partial<EditorMediaItem>) => {
        onChange(items.map(item => 
            item.id === id ? { ...item, ...updates } : item
        ));
    }, [items, onChange]);
    
    const moveItem = useCallback((fromIndex: number, toIndex: number) => {
        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        onChange(newItems.map((item, idx) => ({ ...item, orderIndex: idx })));
    }, [items, onChange]);
    
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#2C2416]">Gallery ({items.length}/{maxItems})</h3>
                {items.length < maxItems && (
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] border-4 border-[#2C2416] font-bold text-sm hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Media
                    </button>
                )}
            </div>
            
            {/* Items Grid */}
            {items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative group bg-white border-4 border-[#2C2416] overflow-hidden"
                        >
                            {/* Drag Handle */}
                            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    className="p-1 bg-white/90 border-2 border-[#2C2416] cursor-grab"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <GripVertical className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Actions */}
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="p-1 bg-red-500 text-white border-2 border-[#2C2416] hover:bg-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Media Preview */}
                            <div className="aspect-video bg-[#F5F1E8] flex items-center justify-center">
                                {item.type === 'video' ? (
                                    item.thumbnailUrl ? (
                                        <img 
                                            src={item.thumbnailUrl} 
                                            alt={item.altText}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Video className="w-12 h-12 text-[#2C2416]/50" />
                                    )
                                ) : (
                                    <img 
                                        src={item.url} 
                                        alt={item.altText}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23F5F1E8" width="100" height="100"/><text x="50%" y="50%" font-size="12" text-anchor="middle" fill="%232C2416">No Image</text></svg>';
                                        }}
                                    />
                                )}
                            </div>
                            
                            {/* Type Badge */}
                            <div className="absolute bottom-2 left-2">
                                <span className="px-2 py-0.5 text-xs font-bold bg-[#F5C542] border-2 border-[#2C2416]">
                                    {item.type.toUpperCase()}
                                </span>
                            </div>
                            
                            {/* Alt Text */}
                            <div className="p-2 bg-white border-t-4 border-[#2C2416]">
                                <input
                                    type="text"
                                    value={item.altText}
                                    onChange={(e) => updateItem(item.id, { altText: e.target.value })}
                                    placeholder="Alt text..."
                                    className="w-full text-xs bg-transparent outline-none font-medium"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-[#2C2416]/30 mb-2" />
                    <p className="text-[#2C2416]/50 font-medium">No media items yet</p>
                    <p className="text-sm text-[#2C2416]/40">Click "Add Media" to add images or videos</p>
                </div>
            )}
            
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#F5F1E8] border-4 border-[#2C2416] shadow-[8px_8px_0_rgba(44,36,22,0.4)] p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-black text-[#2C2416]">Add Media</h4>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="p-1 hover:bg-[#2C2416]/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Source Tabs */}
                        <div className="flex gap-2 mb-4">
                            {[
                                { key: 'url', icon: LinkIcon, label: 'URL' },
                                { key: 'upload', icon: Upload, label: 'Upload' },
                                { key: 'drive', icon: HardDrive, label: 'Drive' }
                            ].map(({ key, icon: Icon, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setAddMode(key as 'url' | 'upload' | 'drive')}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-[#2C2416] transition-all',
                                        addMode === key 
                                            ? 'bg-[#2C2416] text-white' 
                                            : 'bg-white hover:bg-[#F5C542]'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                        
                        {/* Type Selection */}
                        <div className="mb-4">
                            <label className="block font-bold text-[#2C2416] mb-2">Type</label>
                            <div className="flex gap-2">
                                {['image', 'video'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setNewItem({ ...newItem, type: type as 'image' | 'video' })}
                                        className={cn(
                                            'flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-[#2C2416] transition-all',
                                            newItem.type === type
                                                ? 'bg-[#F5C542]'
                                                : 'bg-white hover:bg-[#F5C542]/50'
                                        )}
                                    >
                                        {type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* URL Input */}
                        {addMode === 'url' && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">
                                    {newItem.type === 'video' ? 'Video URL' : 'Image URL'}
                                </label>
                                <input
                                    type="url"
                                    value={newItem.url || ''}
                                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                />
                            </div>
                        )}
                        
                        {/* File Upload */}
                        {addMode === 'upload' && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">Upload File</label>
                                <div 
                                    className="relative p-8 border-4 border-dashed border-[#2C2416]/50 bg-white text-center cursor-pointer hover:border-[#2C2416]"
                                    onClick={() => {
                                        const input = document.getElementById('gallery-file-input') as HTMLInputElement;
                                        input?.click();
                                    }}
                                >
                                    <Upload className="w-8 h-8 mx-auto text-[#2C2416]/50 mb-2" />
                                    <p className="font-medium text-[#2C2416]/70">Click to select file</p>
                                    <p className="text-sm text-[#2C2416]/50">Max 10MB • JPG, PNG, GIF, MP4, WebM</p>
                                </div>
                                <input
                                    id="gallery-file-input"
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Convert to data URL for preview
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const url = event.target?.result as string;
                                                setNewItem({ ...newItem, url });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                        // Reset the input
                                        e.target.value = '';
                                    }}
                                />
                                {newItem.url && newItem.url.startsWith('data:') && (
                                    <div className="mt-2 p-2 bg-green-100 border-2 border-green-500 text-green-800 text-sm font-medium">
                                        ✓ File selected - preview will show after adding
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Drive */}
                        {addMode === 'drive' && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">Google Drive Image/Video</label>
                                
                                {/* Instructions */}
                                <div className="p-3 bg-blue-50 border-2 border-blue-300 mb-3 text-sm">
                                    <p className="font-bold text-blue-800 mb-1">📋 How to use:</p>
                                    <ol className="list-decimal list-inside text-blue-700 space-y-1">
                                        <li>Click "Open Google Drive" button below</li>
                                        <li>Right-click your image/video → "Get link"</li>
                                        <li>Set sharing to "Anyone with the link"</li>
                                        <li>Copy the link and paste it below</li>
                                    </ol>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.open('https://drive.google.com/drive/my-drive', '_blank', 'width=1000,height=700');
                                    }}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border-4 border-[#2C2416] font-bold hover:bg-[#F5C542] hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all mb-3"
                                >
                                    <HardDrive className="w-5 h-5" />
                                    Open Google Drive
                                </button>
                                
                                <div>
                                    <label className="block font-bold text-[#2C2416] mb-2">Paste Drive Link</label>
                                    <input
                                        type="url"
                                        value={newItem.url || ''}
                                        onChange={(e) => {
                                            let url = e.target.value;
                                            // Auto-convert Google Drive sharing link to direct view link
                                            if (url.includes('drive.google.com')) {
                                                const fileIdMatch = url.match(/\/d\/([^\/\?]+)/);
                                                if (fileIdMatch) {
                                                    url = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                                                }
                                            }
                                            setNewItem({ ...newItem, url });
                                        }}
                                        placeholder="https://drive.google.com/file/d/..."
                                        className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                    />
                                    {newItem.url && newItem.url.includes('drive.google.com') && (
                                        <p className="mt-1 text-xs text-green-600 font-medium">✓ Link converted to direct view URL</p>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-[#2C2416]/50">Make sure the file is shared as "Anyone with the link can view"</p>
                            </div>
                        )}
                        
                        {/* Video Thumbnail */}
                        {newItem.type === 'video' && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">Thumbnail URL (optional)</label>
                                <input
                                    type="url"
                                    value={newItem.thumbnailUrl || ''}
                                    onChange={(e) => setNewItem({ ...newItem, thumbnailUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                />
                            </div>
                        )}
                        
                        {/* Alt Text */}
                        <div className="mb-4">
                            <label className="block font-bold text-[#2C2416] mb-2">Alt Text <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={newItem.altText || ''}
                                onChange={(e) => setNewItem({ ...newItem, altText: e.target.value })}
                                placeholder="Describe the media..."
                                className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                            />
                        </div>
                        
                        {/* Caption */}
                        <div className="mb-6">
                            <label className="block font-bold text-[#2C2416] mb-2">Caption (optional)</label>
                            <input
                                type="text"
                                value={newItem.caption || ''}
                                onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                                placeholder="Optional caption..."
                                className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                            />
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-white hover:bg-[#F5F1E8] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={addItem}
                                disabled={!newItem.url || !newItem.altText}
                                className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-[#F5C542] hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Media
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
