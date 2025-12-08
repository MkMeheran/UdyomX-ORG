'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, FileText, Film, Image as ImageIcon, Images } from 'lucide-react';
import Image from 'next/image';
import type { GalleryItem, DownloadItem } from '@/types/service';

interface GalleryDownloadsProps {
    gallery?: GalleryItem[];
    downloads?: DownloadItem[];
    showGallery: boolean;
    showDownloads: boolean;
}

export function GalleryDownloads({ gallery = [], downloads = [], showGallery, showDownloads }: GalleryDownloadsProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (!showGallery && !showDownloads) return null;
    if (gallery.length === 0 && downloads.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Film className="w-6 h-6" />;
            case 'pdf':
                return <FileText className="w-6 h-6" />;
            default:
                return <ImageIcon className="w-6 h-6" />;
        }
    };

    const getFileIcon = (fileType?: string) => {
        switch (fileType?.toLowerCase()) {
            case 'pdf':
                return '📄';
            case 'zip':
            case 'rar':
                return '📦';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            default:
                return '📎';
        }
    };

    const handlePrevious = () => {
        if (lightboxIndex !== null && lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        }
    };

    const handleNext = () => {
        if (lightboxIndex !== null && lightboxIndex < gallery.length - 1) {
            setLightboxIndex(lightboxIndex + 1);
        }
    };

    return (
        <section className="py-6 md:py-10 bg-[#F0F0F3]">
            <div className="max-w-7xl mx-auto px-4">
                {/* Gallery Section */}
                {showGallery && gallery.length > 0 && (
                    <div className={showDownloads && downloads.length > 0 ? 'mb-12' : ''}>
                        {/* Gallery Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="
                                    w-10 h-10 flex items-center justify-center
                                    bg-[#2196F3] text-white
                                    border-[3px] border-[#2C2416]
                                    shadow-[3px_3px_0_0_#2C2416]
                                "
                            >
                                <Images className="w-5 h-5" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-[#2C2416]">Gallery</h3>
                        </div>

                        {/* Gallery Grid - 2-4 columns */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {gallery.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setLightboxIndex(index)}
                                    className="
                                        relative aspect-square overflow-hidden cursor-pointer group
                                        bg-[#F5F1E8] border-[3px] border-[#2C2416]
                                        shadow-[3px_3px_0_0_rgba(44,36,22,0.3)]
                                        hover:shadow-[4px_4px_0_0_rgba(44,36,22,0.4)]
                                        transition-all duration-150
                                    "
                                >
                                    {item.type === 'image' && (
                                        <Image
                                            src={item.thumbnailUrl || item.url}
                                            alt={`Gallery item ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    {item.type === 'video' && (
                                        <div className="w-full h-full bg-[#2C2416] flex items-center justify-center">
                                            <Film className="w-10 h-10 text-white" />
                                        </div>
                                    )}
                                    {item.type === 'pdf' && (
                                        <div className="w-full h-full bg-[#F5F1E8] flex items-center justify-center">
                                            <FileText className="w-10 h-10 text-[#DC2626]" />
                                        </div>
                                    )}
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                            {getIcon(item.type)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Downloads Section */}
                {showDownloads && downloads.length > 0 && (
                    <div>
                        {/* Downloads Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="
                                    w-10 h-10 flex items-center justify-center
                                    bg-[#16A34A] text-white
                                    border-[3px] border-[#2C2416]
                                    shadow-[3px_3px_0_0_#2C2416]
                                "
                            >
                                <Download className="w-5 h-5" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-[#2C2416]">Downloads</h3>
                        </div>

                        {/* Downloads Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {downloads.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.fileUrl}
                                    download
                                    className="
                                        group flex items-center gap-4 p-4
                                        bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                        shadow-[4px_4px_0_0_rgba(44,36,22,0.3)]
                                        hover:-translate-x-1 hover:-translate-y-1
                                        hover:shadow-[6px_6px_0_0_rgba(44,36,22,0.3)]
                                        transition-all duration-150
                                    "
                                >
                                    {/* File Icon */}
                                    <div
                                        className="
                                            w-14 h-14 flex items-center justify-center flex-shrink-0
                                            bg-[#16A34A] text-white text-2xl
                                            border-[3px] border-[#2C2416]
                                            shadow-[3px_3px_0_0_#2C2416]
                                            group-hover:scale-105 transition-transform duration-150
                                        "
                                    >
                                        {getFileIcon(item.fileType)}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-[#2C2416] text-[15px] truncate group-hover:text-[#16A34A] transition-colors">
                                            {item.label}
                                        </p>
                                        {(item.fileSize || item.fileType) && (
                                            <p className="text-[13px] text-[#7A7568] font-semibold mt-0.5">
                                                {item.fileType && <span className="uppercase">{item.fileType}</span>}
                                                {item.fileSize && item.fileType && <span> • </span>}
                                                {item.fileSize}
                                            </p>
                                        )}
                                    </div>

                                    {/* Download Arrow */}
                                    <Download 
                                        className="w-6 h-6 text-[#7A7568] group-hover:text-[#16A34A] flex-shrink-0 transition-colors" 
                                        strokeWidth={2.5} 
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxIndex(null)}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setLightboxIndex(null)}
                            className="
                                absolute top-4 right-4 z-10
                                w-12 h-12 flex items-center justify-center
                                bg-white text-[#2C2416]
                                border-[3px] border-[#2C2416]
                                shadow-[3px_3px_0_0_#2C2416]
                                hover:bg-[#F5C542] transition-colors
                            "
                        >
                            <X className="w-6 h-6" strokeWidth={3} />
                        </button>

                        {/* Previous Button */}
                        {lightboxIndex > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevious();
                                }}
                                className="
                                    absolute left-4 z-10
                                    w-12 h-12 flex items-center justify-center
                                    bg-white text-[#2C2416]
                                    border-[3px] border-[#2C2416]
                                    shadow-[3px_3px_0_0_#2C2416]
                                    hover:bg-[#F5C542] transition-colors
                                "
                            >
                                <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                            </button>
                        )}

                        {/* Next Button */}
                        {lightboxIndex < gallery.length - 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                className="
                                    absolute right-4 z-10
                                    w-12 h-12 flex items-center justify-center
                                    bg-white text-[#2C2416]
                                    border-[3px] border-[#2C2416]
                                    shadow-[3px_3px_0_0_#2C2416]
                                    hover:bg-[#F5C542] transition-colors
                                "
                            >
                                <ChevronRight className="w-6 h-6" strokeWidth={3} />
                            </button>
                        )}

                        {/* Content */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl max-h-[85vh] border-[4px] border-[#2C2416] shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]"
                        >
                            {gallery[lightboxIndex]?.type === 'image' && (
                                <Image
                                    src={gallery[lightboxIndex].url}
                                    alt={`Gallery item ${lightboxIndex + 1}`}
                                    width={1200}
                                    height={800}
                                    className="max-w-full max-h-[85vh] object-contain bg-[#F5F1E8]"
                                />
                            )}
                            {gallery[lightboxIndex]?.type === 'video' && (
                                <video
                                    src={gallery[lightboxIndex].url}
                                    controls
                                    className="max-w-full max-h-[85vh] bg-black"
                                />
                            )}
                        </motion.div>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#2C2416] text-white font-bold text-sm border-[2px] border-white">
                            {lightboxIndex + 1} / {gallery.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
