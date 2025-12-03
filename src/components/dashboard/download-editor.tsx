'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Trash2, GripVertical, Download, Link as LinkIcon, Upload, HardDrive, X, FileText, FileSpreadsheet, FileImage, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/slug-utils';
import type { EditorDownloadItem } from '@/types/editor';

interface DownloadEditorProps {
    items: EditorDownloadItem[];
    onChange: (items: EditorDownloadItem[]) => void;
    maxItems?: number;
}

const fileTypeIcons: Record<string, React.ReactNode> = {
    pdf: <FileText className="w-5 h-5 text-red-500" />,
    doc: <FileText className="w-5 h-5 text-blue-500" />,
    docx: <FileText className="w-5 h-5 text-blue-500" />,
    xls: <FileSpreadsheet className="w-5 h-5 text-green-500" />,
    xlsx: <FileSpreadsheet className="w-5 h-5 text-green-500" />,
    zip: <File className="w-5 h-5 text-yellow-600" />,
    rar: <File className="w-5 h-5 text-yellow-600" />,
    png: <FileImage className="w-5 h-5 text-purple-500" />,
    jpg: <FileImage className="w-5 h-5 text-purple-500" />,
    jpeg: <FileImage className="w-5 h-5 text-purple-500" />,
};

export function DownloadEditor({ items, onChange, maxItems = 10 }: DownloadEditorProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [addMode, setAddMode] = useState<'url' | 'upload' | 'drive'>('url');
    const [newItem, setNewItem] = useState<Partial<EditorDownloadItem>>({
        title: '',
        url: '',
        fileType: '',
        fileSize: ''
    });
    
    const addItem = useCallback(() => {
        if (!newItem.url || !newItem.title) return;
        
        // Try to detect file type from URL
        let fileType = newItem.fileType || '';
        if (!fileType && newItem.url) {
            const match = newItem.url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
            if (match) {
                fileType = match[1].toUpperCase();
            }
        }
        
        const item: EditorDownloadItem = {
            id: generateId(),
            title: newItem.title,
            url: newItem.url,
            fileType,
            fileSize: newItem.fileSize,
            source: addMode,
            orderIndex: items.length
        };
        
        onChange([...items, item]);
        setNewItem({ title: '', url: '', fileType: '', fileSize: '' });
        setShowAddModal(false);
    }, [newItem, items, onChange, addMode]);
    
    const removeItem = useCallback((id: string) => {
        onChange(items.filter(item => item.id !== id).map((item, idx) => ({
            ...item,
            orderIndex: idx
        })));
    }, [items, onChange]);
    
    const updateItem = useCallback((id: string, updates: Partial<EditorDownloadItem>) => {
        onChange(items.map(item => 
            item.id === id ? { ...item, ...updates } : item
        ));
    }, [items, onChange]);
    
    const getFileIcon = (fileType?: string) => {
        if (!fileType) return <Download className="w-5 h-5 text-[#2C2416]" />;
        const type = fileType.toLowerCase();
        return fileTypeIcons[type] || <File className="w-5 h-5 text-[#2C2416]" />;
    };
    
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#2C2416]">Downloads ({items.length}/{maxItems})</h3>
                {items.length < maxItems && (
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] border-4 border-[#2C2416] font-bold text-sm hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Download
                    </button>
                )}
            </div>
            
            {/* Items List */}
            {items.length > 0 ? (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-white border-4 border-[#2C2416] group"
                        >
                            {/* Drag Handle */}
                            <button
                                type="button"
                                className="p-1 cursor-grab hover:bg-[#F5F1E8]"
                            >
                                <GripVertical className="w-5 h-5 text-[#2C2416]/50" />
                            </button>
                            
                            {/* File Icon */}
                            <div className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416]">
                                {getFileIcon(item.fileType)}
                            </div>
                            
                            {/* Title Input */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                    placeholder="File title..."
                                    className="w-full font-bold text-[#2C2416] bg-transparent outline-none"
                                />
                                <div className="flex items-center gap-2 text-xs text-[#2C2416]/60">
                                    {item.fileType && <span className="font-medium">{item.fileType}</span>}
                                    {item.fileSize && <span>• {item.fileSize}</span>}
                                    <span className="truncate max-w-xs">{item.url}</span>
                                </div>
                            </div>
                            
                            {/* Source Badge */}
                            <span className={cn(
                                'px-2 py-0.5 text-xs font-bold border-2 border-[#2C2416]',
                                item.source === 'drive' && 'bg-blue-100',
                                item.source === 'upload' && 'bg-green-100',
                                item.source === 'url' && 'bg-[#F5C542]'
                            )}>
                                {item.source?.toUpperCase() || 'URL'}
                            </span>
                            
                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30 text-center">
                    <Download className="w-12 h-12 mx-auto text-[#2C2416]/30 mb-2" />
                    <p className="text-[#2C2416]/50 font-medium">No downloads yet</p>
                    <p className="text-sm text-[#2C2416]/40">Click "Add Download" to add files</p>
                </div>
            )}
            
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#F5F1E8] border-4 border-[#2C2416] shadow-[8px_8px_0_rgba(44,36,22,0.4)] p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-black text-[#2C2416]">Add Download</h4>
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
                        
                        {/* Title Input */}
                        <div className="mb-4">
                            <label className="block font-bold text-[#2C2416] mb-2">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={newItem.title || ''}
                                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                placeholder="e.g., Project Documentation"
                                className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                            />
                        </div>
                        
                        {/* URL/Upload Input */}
                        {addMode === 'url' && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">File URL <span className="text-red-500">*</span></label>
                                <input
                                    type="url"
                                    value={newItem.url || ''}
                                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                />
                            </div>
                        )}
                        
                        {addMode === 'upload' && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">Upload File</label>
                                <div 
                                    className="relative p-8 border-4 border-dashed border-[#2C2416]/50 bg-white text-center cursor-pointer hover:border-[#2C2416]"
                                    onClick={() => {
                                        const input = document.getElementById('download-file-input') as HTMLInputElement;
                                        input?.click();
                                    }}
                                >
                                    <Upload className="w-8 h-8 mx-auto text-[#2C2416]/50 mb-2" />
                                    <p className="font-medium text-[#2C2416]/70">Click to select file</p>
                                    <p className="text-sm text-[#2C2416]/50">Max 50MB • PDF, DOC, XLS, ZIP, etc.</p>
                                </div>
                                <input
                                    id="download-file-input"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const url = event.target?.result as string;
                                                const ext = file.name.split('.').pop()?.toUpperCase() || '';
                                                const size = file.size < 1024 * 1024 
                                                    ? `${(file.size / 1024).toFixed(1)} KB`
                                                    : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
                                                setNewItem({ 
                                                    ...newItem, 
                                                    url, 
                                                    fileType: ext,
                                                    fileSize: size,
                                                    title: newItem.title || file.name.replace(/\.[^/.]+$/, '')
                                                });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                        e.target.value = '';
                                    }}
                                />
                                {newItem.url && newItem.url.startsWith('data:') && (
                                    <div className="mt-2 p-2 bg-green-100 border-2 border-green-500 text-green-800 text-sm font-medium">
                                        ✓ File selected: {newItem.fileType} ({newItem.fileSize})
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {addMode === 'drive' && (
                            <div className="mb-4">
                                <label className="block font-bold text-[#2C2416] mb-2">Google Drive File</label>
                                
                                {/* Instructions */}
                                <div className="p-3 bg-blue-50 border-2 border-blue-300 mb-3 text-sm">
                                    <p className="font-bold text-blue-800 mb-1">📋 How to use:</p>
                                    <ol className="list-decimal list-inside text-blue-700 space-y-1">
                                        <li>Click "Open Google Drive" button below</li>
                                        <li>Right-click your file → "Get link"</li>
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
                                            // Auto-convert Google Drive sharing link to direct download link
                                            if (url.includes('drive.google.com')) {
                                                const fileIdMatch = url.match(/\/d\/([^\/\?]+)/);
                                                if (fileIdMatch) {
                                                    url = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
                                                }
                                            }
                                            setNewItem({ ...newItem, url });
                                        }}
                                        placeholder="https://drive.google.com/file/d/..."
                                        className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                    />
                                    {newItem.url && newItem.url.includes('drive.google.com') && (
                                        <p className="mt-1 text-xs text-green-600 font-medium">✓ Link converted to direct download URL</p>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-[#2C2416]/50">Make sure the file is shared as "Anyone with the link can view"</p>
                            </div>
                        )}
                        
                        {/* File Type & Size */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block font-bold text-[#2C2416] mb-2">File Type</label>
                                <input
                                    type="text"
                                    value={newItem.fileType || ''}
                                    onChange={(e) => setNewItem({ ...newItem, fileType: e.target.value.toUpperCase() })}
                                    placeholder="PDF, ZIP, etc."
                                    className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-[#2C2416] mb-2">File Size</label>
                                <input
                                    type="text"
                                    value={newItem.fileSize || ''}
                                    onChange={(e) => setNewItem({ ...newItem, fileSize: e.target.value })}
                                    placeholder="2.5 MB"
                                    className="w-full px-4 py-3 border-4 border-[#2C2416] bg-white font-medium"
                                />
                            </div>
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
                                disabled={!newItem.url || !newItem.title}
                                className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-[#F5C542] hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
