'use client';

import { Download, FileText, Archive, FileImage, FileSpreadsheet, File } from 'lucide-react';
import type { PostDownloadItem } from '@/types/post';

interface PostDownloadsProps {
    items: PostDownloadItem[];
    title?: string;
}

const fileTypeConfig = {
    pdf: { icon: FileText, color: 'bg-[#FF6B6B]' },
    zip: { icon: Archive, color: 'bg-[#9C27B0]' },
    doc: { icon: FileText, color: 'bg-[#2196F3]' },
    xlsx: { icon: FileSpreadsheet, color: 'bg-[#5CB85C]' },
    image: { icon: FileImage, color: 'bg-[#F5C542]' },
    other: { icon: File, color: 'bg-[#5A5A5A]' },
};

export function PostDownloads({ items, title = 'Downloads' }: PostDownloadsProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-3 border-black">
                <div className="w-10 h-10 bg-[#5CB85C] border-2 border-black flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black text-[#1A1A1A] uppercase tracking-wider">
                    {title}
                </h3>
                <span className="ml-auto px-2 py-1 bg-black text-white text-xs font-bold">
                    {items.length} files
                </span>
            </div>

            {/* List */}
            <div className="space-y-3">
                {items.map((item, index) => {
                    const config = fileTypeConfig[item.fileType] || fileTypeConfig.other;
                    const Icon = config.icon;

                    return (
                        <a
                            key={item.id || index}
                            href={item.fileUrl}
                            download
                            className="group flex items-center gap-4 p-3 bg-[#F5F5F0] border-3 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 ${config.color} border-2 border-black flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-[#1A1A1A] truncate group-hover:text-[#2196F3] transition-colors">
                                    {item.label}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-[#5A5A5A] font-bold mt-1">
                                    <span className="uppercase">{item.fileType}</span>
                                    {item.fileSize && (
                                        <>
                                            <span>•</span>
                                            <span>{item.fileSize}</span>
                                        </>
                                    )}
                                </div>
                                {item.description && (
                                    <p className="text-sm text-[#5A5A5A] mt-1 line-clamp-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            {/* Download Icon */}
                            <div className="w-10 h-10 border-2 border-black bg-white group-hover:bg-[#2196F3] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                                <Download className="w-5 h-5" />
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
