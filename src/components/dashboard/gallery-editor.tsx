'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Video, Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/slug-utils';
import { uploadGalleryImage, formatFileSize, ALLOWED_TYPES, FILE_LIMITS } from '@/lib/supabase/storage';
import type { EditorMediaItem } from '@/types/editor';

interface GalleryEditorProps {
    items: EditorMediaItem[];
    onChange: (items: EditorMediaItem[]) => void;
    maxItems?: number;
    folder?: string; // Folder name for organizing uploads (e.g., post slug)
}

export function GalleryEditor({ items, onChange, maxItems = 20, folder }: GalleryEditorProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const [pendingItems, setPendingItems] = useState<EditorMediaItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Handle file upload to Supabase
    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        setUploading(true);
        setUploadError(null);
        
        const uploaded: EditorMediaItem[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);
            
            const result = await uploadGalleryImage(file, folder);
            
            if (result.success && result.url) {
                const item: EditorMediaItem = {
                    id: generateId(),
                    type: result.fileType === 'video' ? 'video' : 'image',
                    url: result.url,
                    altText: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
                    caption: '',
                    source: 'upload',
                    storagePath: result.path,
                    orderIndex: items.length + uploaded.length
                };
                uploaded.push(item);
            } else {
                setUploadError(`Failed to upload ${file.name}: ${result.error}`);
            }
        }
        
        setPendingItems(uploaded);
        setUploading(false);
        setUploadProgress('');
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [items, folder]);
    
    // Add pending items to gallery
    const handleAddPendingItems = useCallback(() => {
        onChange([...items, ...pendingItems]);
        setPendingItems([]);
        setShowAddModal(false);
    }, [items, pendingItems, onChange]);
    
    // Update pending item metadata
    const updatePendingItem = useCallback((id: string, updates: Partial<EditorMediaItem>) => {
        setPendingItems(prev => prev.map(item => 
            item.id === id ? { ...item, ...updates } : item
        ));
    }, []);
    
    const removeItem = useCallback((id: string) => {
        // TODO: Also delete from Supabase storage if needed
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
    
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileUpload(e.dataTransfer.files);
    }, [handleFileUpload]);
    
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#2C2416]">
                    Gallery ({items.length}/{maxItems})
                </h3>
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
                                    <video 
                                        src={item.url}
                                        className="w-full h-full object-cover"
                                        muted
                                    />
                                ) : (
                                    <img 
                                        src={item.url} 
                                        alt={item.altText}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23F5F1E8" width="100" height="100"/><text x="50%" y="50%" font-size="10" text-anchor="middle" fill="%232C2416">Error</text></svg>';
                                        }}
                                    />
                                )}
                            </div>
                            
                            {/* Type Badge */}
                            <div className="absolute bottom-12 left-2">
                                <span className="px-2 py-0.5 text-xs font-bold bg-[#F5C542] border-2 border-[#2C2416]">
                                    {item.type.toUpperCase()}
                                </span>
                            </div>
                            
                            {/* Alt Text & Caption */}
                            <div className="p-2 bg-white border-t-4 border-[#2C2416] space-y-1">
                                <input
                                    type="text"
                                    value={item.altText}
                                    onChange={(e) => updateItem(item.id, { altText: e.target.value })}
                                    placeholder="Alt text (for SEO & accessibility)..."
                                    className="w-full text-xs bg-transparent outline-none font-medium border-b border-[#2C2416]/20 pb-1"
                                />
                                <input
                                    type="text"
                                    value={item.caption || ''}
                                    onChange={(e) => updateItem(item.id, { caption: e.target.value })}
                                    placeholder="Caption (displayed below image)..."
                                    className="w-full text-xs bg-transparent outline-none font-medium text-[#2C2416]/70"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div 
                    className="p-8 bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30 text-center cursor-pointer hover:border-[#2C2416]/50 transition-all"
                    onClick={() => setShowAddModal(true)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <ImageIcon className="w-12 h-12 mx-auto text-[#2C2416]/30 mb-2" />
                    <p className="text-[#2C2416]/50 font-medium">No media items yet</p>
                    <p className="text-sm text-[#2C2416]/40">Click or drag files to upload</p>
                </div>
            )}
            
            {/* Upload Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#F5F1E8] border-4 border-[#2C2416] shadow-[8px_8px_0_rgba(44,36,22,0.4)] p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-black text-[#2C2416]">Upload Media</h4>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setUploadError(null);
                                }}
                                className="p-1 hover:bg-[#2C2416]/10"
                                disabled={uploading}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Error Message */}
                        {uploadError && (
                            <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm font-medium">{uploadError}</span>
                            </div>
                        )}
                        
                        {/* Upload Area */}
                        {pendingItems.length === 0 ? (
                            <div 
                                className={cn(
                                    "relative p-8 border-4 border-dashed bg-white text-center transition-all",
                                    uploading 
                                        ? "border-[#F5C542] bg-[#F5C542]/10" 
                                        : "border-[#2C2416]/50 hover:border-[#2C2416] cursor-pointer"
                                )}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-10 h-10 mx-auto text-[#F5C542] animate-spin mb-2" />
                                        <p className="font-bold text-[#2C2416]">{uploadProgress || 'Uploading...'}</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 mx-auto text-[#2C2416]/50 mb-2" />
                                        <p className="font-bold text-[#2C2416]">Click or drag files to upload</p>
                                        <p className="text-sm text-[#2C2416]/60 mt-1">
                                            Images: JPG, PNG, GIF, WebP (max {formatFileSize(FILE_LIMITS.IMAGE)})
                                        </p>
                                        <p className="text-sm text-[#2C2416]/60">
                                            Videos: MP4, WebM (max {formatFileSize(FILE_LIMITS.VIDEO)})
                                        </p>
                                        <p className="text-xs text-[#2C2416]/40 mt-2">
                                            You can select multiple files
                                        </p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                                <p className="text-sm font-bold text-[#2C2416] mb-2">
                                    ✅ {pendingItems.length} file(s) uploaded. Add alt text & caption:
                                </p>
                                {pendingItems.map((item) => (
                                    <div key={item.id} className="bg-white border-3 border-[#2C2416] p-3 space-y-2">
                                        <div className="flex gap-3">
                                            <img 
                                                src={item.url} 
                                                alt={item.altText}
                                                className="w-20 h-20 object-cover border-2 border-[#2C2416]"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <label className="text-xs font-bold text-[#2C2416] block mb-1">
                                                        Alt Text (SEO & Accessibility) *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.altText}
                                                        onChange={(e) => updatePendingItem(item.id, { altText: e.target.value })}
                                                        placeholder="Describe the image..."
                                                        className="w-full px-2 py-1 text-sm border-2 border-[#2C2416] focus:border-[#F5C542] outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#2C2416] block mb-1">
                                                        Caption (Display below image)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.caption || ''}
                                                        onChange={(e) => updatePendingItem(item.id, { caption: e.target.value })}
                                                        placeholder="Optional caption..."
                                                        className="w-full px-2 py-1 text-sm border-2 border-[#2C2416] focus:border-[#F5C542] outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={[...ALLOWED_TYPES.IMAGE, ...ALLOWED_TYPES.VIDEO].join(',')}
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            disabled={uploading}
                        />
                        
                        {/* Info */}
                        <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-300 text-sm">
                            <p className="font-bold text-blue-800 mb-1">💡 Tips:</p>
                            <ul className="text-blue-700 space-y-1 list-disc list-inside">
                                <li>Files are uploaded to Supabase Storage</li>
                                <li>Images are publicly accessible via URL</li>
                                <li>Alt text is auto-generated from filename</li>
                            </ul>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setPendingItems([]);
                                    setUploadError(null);
                                }}
                                className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-white hover:bg-[#F5F1E8] transition-all"
                                disabled={uploading}
                            >
                                {pendingItems.length > 0 ? 'Cancel' : 'Close'}
                            </button>
                            {pendingItems.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleAddPendingItems}
                                    className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-[#F5C542] hover:bg-[#D35400] hover:text-white transition-all"
                                >
                                    Add to Gallery
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
