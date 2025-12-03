"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Images, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { GalleryItem } from "@/types";

// Normalize helper - converts string URLs to GalleryItem objects
function normalizeGalleryItems(items: (string | GalleryItem)[]): GalleryItem[] {
  if (!items || items.length === 0) return [];
  
  return items.map((item, index) => {
    // Already a GalleryItem object
    if (typeof item === 'object' && item !== null && 'url' in item) {
      return {
        id: item.id || `gallery-${index}`,
        type: item.type || 'image',
        url: item.url,
        thumbnail: item.thumbnail || item.thumbnailUrl,
        alt: item.alt || item.altText,
        altText: item.altText || item.alt,
        caption: item.caption,
        orderIndex: item.orderIndex ?? index,
      } as GalleryItem;
    }
    
    // String URL - convert to GalleryItem
    return {
      id: `gallery-${index}`,
      type: 'image' as const,
      url: item as string,
      alt: `Gallery image ${index + 1}`,
      orderIndex: index,
    };
  });
}

interface MediaGalleryProps {
  images: (string | GalleryItem)[];  // Accept both string[] and GalleryItem[]
  title?: string;
}

export function MediaGallery({ images: rawImages, title = "Gallery" }: MediaGalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // Normalize images to GalleryItem[] format
  const images = useMemo(() => normalizeGalleryItems(rawImages), [rawImages]);

  if (!images || images.length === 0) return null;

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const closeViewer = () => setViewerOpen(false);

  const goNext = () => setViewerIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setViewerIndex((prev) => (prev - 1 + images.length) % images.length);
  
  const currentItem = images[viewerIndex];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          GALLERY CARD - Chunky Brutalist
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="
          bg-[#F5F1E8] border-[4px] border-[#2C2416]
          shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
          p-6
        "
      >
        <h3 className="text-[18px] font-black text-[#2C2416] mb-5 flex items-center gap-3 pb-4 border-b-[3px] border-[#2C2416]">
          <div className="w-8 h-8 bg-[#2196F3] border-[2px] border-[#2C2416] flex items-center justify-center shadow-[2px_2px_0_0_#2C2416]">
            <Images className="w-4 h-4 text-white" />
          </div>
          {title}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {images.slice(0, 4).map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => openViewer(index)}
              className="
                relative aspect-square overflow-hidden
                border-[3px] border-[#2C2416]
                shadow-[3px_3px_0_0_#2C2416]
                hover:shadow-[1px_1px_0_0_#2C2416]
                hover:translate-x-[2px] hover:translate-y-[2px]
                transition-all duration-150
                group
              "
            >
              <Image
                src={item.thumbnail || item.url}
                alt={item.alt || item.caption || `Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Video indicator */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
              )}
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-[#2C2416]/70 flex items-center justify-center">
                  <span className="text-[#F5F1E8] font-black text-xl">+{images.length - 4}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LIGHTBOX VIEWER - Chunky Brutalist
      ═══════════════════════════════════════════════════════════ */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 bg-[#2C2416]/95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeViewer}
            className="
              absolute top-4 right-4 w-12 h-12
              bg-[#FF6B6B] border-[3px] border-[#F5F1E8]
              shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]
              hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-150
              flex items-center justify-center
            "
          >
            <X className="w-6 h-6 text-white" strokeWidth={3} />
          </button>

          {/* Navigation */}
          <button
            onClick={goPrev}
            className="
              absolute left-4 w-12 h-12
              bg-[#F5F1E8] border-[3px] border-[#2C2416]
              shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]
              hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-150
              flex items-center justify-center
            "
          >
            <ChevronLeft className="w-6 h-6 text-[#2C2416]" strokeWidth={3} />
          </button>

          <button
            onClick={goNext}
            className="
              absolute right-4 w-12 h-12
              bg-[#F5F1E8] border-[3px] border-[#2C2416]
              shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]
              hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-150
              flex items-center justify-center
            "
          >
            <ChevronRight className="w-6 h-6 text-[#2C2416]" strokeWidth={3} />
          </button>

          {/* Image/Video */}
          <div className="relative max-w-4xl max-h-[80vh] border-[4px] border-[#F5F1E8] shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]">
            {currentItem.type === 'video' ? (
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="max-h-[80vh]"
              />
            ) : currentItem.type === 'embed' ? (
              <iframe
                src={currentItem.url}
                className="w-full h-[80vh]"
                allowFullScreen
              />
            ) : (
              <Image
                src={currentItem.url}
                alt={currentItem.alt || currentItem.caption || `Gallery image ${viewerIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh]"
              />
            )}
          </div>

          {/* Caption */}
          {currentItem.caption && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#F5F1E8] border-[3px] border-[#2C2416] max-w-md">
              <p className="text-sm text-[#2C2416] text-center">{currentItem.caption}</p>
            </div>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#F5F1E8] border-[3px] border-[#2C2416] shadow-[3px_3px_0_0_#2C2416]">
            <span className="font-black text-[#2C2416]">
              {viewerIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
