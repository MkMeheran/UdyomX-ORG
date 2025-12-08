'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Plus, Trash2, GripVertical, Download, Upload, X, Loader2, AlertCircle, FileText, FileSpreadsheet, FileImage, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/slug-utils';
import { uploadDownloadFile, formatFileSize, ALLOWED_TYPES, FILE_LIMITS } from '@/lib/supabase/storage';
import type { EditorDownloadItem } from '@/types/editor';

interface DownloadEditorProps {
    items: EditorDownloadItem[];
    onChange: (items: EditorDownloadItem[]) => void;
    maxItems?: number;
    folder?: string;
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

export function DownloadEditor({ items, onChange, maxItems = 10, folder }: DownloadEditorProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Handle file upload to Supabase
    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        setUploading(true);
        setUploadError(null);
        
        const newItems: EditorDownloadItem[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);
            
            const result = await uploadDownloadFile(file, folder);
            
            if (result.success && result.url) {
                const item: EditorDownloadItem = {
                    id: generateId(),
                    title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
                    url: result.url,
                    fileType: result.fileType || '',
                    fileSize: result.fileSize,
                    source: 'upload',
                    storagePath: result.path,
                    orderIndex: items.length + newItems.length
                };
                newItems.push(item);
            } else {
                setUploadError(`Failed to upload ${file.name}: ${result.error}`);
            }
        }
        
        if (newItems.length > 0) {
            onChange([...items, ...newItems]);
        }
        
        setUploading(false);
        setUploadProgress('');
        setShowAddModal(false);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [items, onChange, folder]);
    
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
                    Downloads ({items.length}/{maxItems})
                </h3>
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
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-white border-4 border-[#2C2416] group"
                        >
                            {/* Drag Handle */}
                            <button
                                type="button"
                                className="p-1 cursor-grab opacity-50 hover:opacity-100"
                            >
                                <GripVertical className="w-5 h-5" />
                            </button>
                            
                            {/* File Icon */}
                            <div className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416]">
                                {getFileIcon(item.fileType)}
                            </div>
                            
                            {/* File Info */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                    className="w-full font-bold text-[#2C2416] bg-transparent border-2 border-transparent focus:border-[#2C2416] px-2 py-1 outline-none"
                                    placeholder="File title..."
                                />
                                <input
                                    type="text"
                                    value={item.altText || ''}
                                    onChange={(e) => updateItem(item.id, { altText: e.target.value })}
                                    className="w-full text-sm text-[#2C2416]/70 bg-transparent border-2 border-transparent focus:border-[#2C2416] px-2 py-1 outline-none"
                                    placeholder="Alt text (optional)..."
                                />
                                <div className="flex items-center gap-2 text-sm text-[#2C2416]/60">
                                    {item.fileType && (
                                        <span className="px-1.5 py-0.5 bg-[#F5C542] text-[#2C2416] font-bold text-xs">
                                            {item.fileType}
                                        </span>
                                    )}
                                    {item.fileSize && <span>{item.fileSize}</span>}
                                </div>
                            </div>
                            
                            {/* Preview Link */}
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-[#F5F1E8] transition-all"
                                title="Preview"
                            >
                                <Download className="w-5 h-5 text-[#2C2416]" />
                            </a>
                            
                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-red-500 hover:bg-red-100 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
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
                    <Download className="w-12 h-12 mx-auto text-[#2C2416]/30 mb-2" />
                    <p className="text-[#2C2416]/50 font-medium">No download files yet</p>
                    <p className="text-sm text-[#2C2416]/40">Click or drag files to upload</p>
                </div>
            )}
            
            {/* Upload Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#F5F1E8] border-4 border-[#2C2416] shadow-[8px_8px_0_rgba(44,36,22,0.4)] p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-black text-[#2C2416]">Upload Files</h4>
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
                                        PDF, DOC, DOCX, XLS, XLSX, ZIP, RAR, Images
                                    </p>
                                    <p className="text-sm text-[#2C2416]/60">
                                        Max file size: {formatFileSize(FILE_LIMITS.DOWNLOAD)}
                                    </p>
                                    <p className="text-xs text-[#2C2416]/40 mt-2">
                                        You can select multiple files
                                    </p>
                                </>
                            )}
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ALLOWED_TYPES.DOWNLOAD.join(',')}
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
                                <li>Downloads are publicly accessible</li>
                                <li>File title is auto-generated from filename</li>
                            </ul>
                        </div>
                        
                        {/* Close Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setUploadError(null);
                                }}
                                className="px-6 py-2 font-bold border-4 border-[#2C2416] bg-white hover:bg-[#F5F1E8] transition-all"
                                disabled={uploading}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
