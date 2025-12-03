'use client';

import { useState } from 'react';
import { Images, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { LazyImage } from '@/components/common/LazyImage';
import type { MediaItem } from '@/types/post';

interface PostGalleryProps {
    items: MediaItem[];
    title?: string;
}

export function PostGallery({ items, title = 'Gallery' }: PostGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!items || items.length === 0) return null;

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);
    
    const goToPrev = () => {
        if (selectedIndex !== null) {
            setSelectedIndex(selectedIndex === 0 ? items.length - 1 : selectedIndex - 1);
        }
    };
    
    const goToNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex(selectedIndex === items.length - 1 ? 0 : selectedIndex + 1);
        }
    };

    return (
        <>
            <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-3 border-black">
                    <div className="w-10 h-10 bg-[#9C27B0] border-2 border-black flex items-center justify-center">
                        <Images className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-[#1A1A1A] uppercase tracking-wider">
                        {title}
                    </h3>
                    <span className="ml-auto px-2 py-1 bg-black text-white text-xs font-bold">
                        {items.length} items
                    </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {items.map((item, index) => (
                        <button
                            key={item.id || index}
                            onClick={() => openLightbox(index)}
                            className="group relative aspect-square border-3 border-black overflow-hidden shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
                        >
                            <LazyImage
                                src={item.thumbnail || item.src}
                                alt={item.alt}
                                aspectRatio="square"
                                brutal={false}
                                className="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-12 h-12 bg-white border-3 border-black flex items-center justify-center shadow-[3px_3px_0_0_rgba(255,255,255,0.3)] hover:bg-[#FF6B6B] hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-3 border-black flex items-center justify-center shadow-[3px_3px_0_0_rgba(255,255,255,0.3)] hover:bg-[#2196F3] hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-3 border-black flex items-center justify-center shadow-[3px_3px_0_0_rgba(255,255,255,0.3)] hover:bg-[#2196F3] hover:text-white transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div
                        className="max-w-5xl max-h-[80vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={items[selectedIndex].src}
                            alt={items[selectedIndex].alt}
                            className="max-w-full max-h-[80vh] object-contain border-4 border-white"
                        />
                        {items[selectedIndex].caption && (
                            <p className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 font-semibold text-center">
                                {items[selectedIndex].caption}
                            </p>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white border-3 border-black font-black">
                        {selectedIndex + 1} / {items.length}
                    </div>
                </div>
            )}
        </>
    );
}
