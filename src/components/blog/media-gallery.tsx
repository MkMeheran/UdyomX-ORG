"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Images
} from "lucide-react";
import type { GalleryItem } from "@/types";

// Normalize helper - converts string URLs to GalleryItem objects
function normalizeGalleryItems(items: (string | GalleryItem)[]): GalleryItem[] {
  if (!items || items.length === 0) return [];
  
  return items.map((item, index) => {
    if (typeof item === 'object' && item !== null && 'url' in item) {
      return {
        id: item.id || `gallery-${index}`,
        type: item.type || 'image',
        url: item.url,
        thumbnail: item.thumbnail,
        alt: item.alt,
        caption: item.caption,
        order: item.order ?? index,
      } as GalleryItem;
    }
    
    return {
      id: `gallery-${index}`,
      type: 'image' as const,
      url: item as string,
      alt: `Gallery image ${index + 1}`,
      order: index,
    };
  });
}

interface MediaGalleryProps {
  images: (string | GalleryItem)[];
  title?: string;
}

export function MediaGallery({ images: rawImages, title = "Gallery" }: MediaGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const images = useMemo(() => normalizeGalleryItems(rawImages), [rawImages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset video on slide change
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  const currentItem = images[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      const time = (value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Gallery Grid Trigger */}
      <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416] shadow-[6px_6px_0_0_#2C2416] p-6">
        <h3 className="text-xl font-black text-[#2C2416] mb-6 flex items-center gap-3 pb-4 border-b-[3px] border-[#2C2416]">
          <div className="w-10 h-10 bg-[#2196F3] border-[3px] border-[#2C2416] flex items-center justify-center shadow-[2px_2px_0_0_#2C2416]">
            <Images className="w-5 h-5 text-white" />
          </div>
          {title}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.slice(0, 6).map((item, index) => (
            <div key={item.id} className="group relative">
              <button
                onClick={() => {
                  setCurrentIndex(index);
                  setIsOpen(true);
                }}
                className="w-full aspect-[4/3] relative border-[3px] border-[#2C2416] shadow-[4px_4px_0_0_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#2C2416] transition-all bg-white overflow-hidden"
              >
                <Image
                  src={item.thumbnail || item.url}
                  alt={item.alt || "Gallery Item"}
                  fill
                  className="object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-10 h-10 bg-[#FF6B6B] border-[3px] border-[#2C2416] flex items-center justify-center shadow-[2px_2px_0_0_#2C2416]">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>
                )}
                {index === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-[#2C2416]/80 flex items-center justify-center">
                    <span className="text-2xl font-black text-[#F5F1E8]">+{images.length - 4}</span>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Neubrutalist Viewer Modal */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100000] bg-[#F5F1E8] flex flex-col">
          
          {/* Top Bar */}
          <div className="h-20 border-b-[4px] border-[#2C2416] bg-white flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="font-black text-xl text-[#2C2416] hidden md:block">
              MEDIA VIEWER
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              {/* Counter Badge */}
              <div className="px-4 py-2 bg-[#FF6B6B] border-[3px] border-[#2C2416] shadow-[4px_4px_0_0_#2C2416] font-black text-white">
                {currentIndex + 1} / {images.length}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 bg-[#2C2416] text-[#F5F1E8] flex items-center justify-center hover:bg-[#FF6B6B] hover:text-[#2C2416] hover:border-[3px] hover:border-[#2C2416] transition-all"
              >
                <X className="w-8 h-8" strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-between p-4 md:p-8 overflow-hidden gap-4">
            
            {/* Previous Button (Desktop) - Left Side */}
            <button
              onClick={handlePrev}
              className="hidden md:flex shrink-0 w-16 h-16 bg-white border-[4px] border-[#2C2416] shadow-[4px_4px_0_0_#2C2416] items-center justify-center hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#2C2416] active:shadow-none transition-all"
            >
              <ChevronLeft className="w-10 h-10 text-[#2C2416]" strokeWidth={3} />
            </button>

            {/* Center Content Column */}
            <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full gap-4">
              
              {/* Caption Area (Top) */}
              {currentItem.caption && (
                <div className="w-full bg-white border-l-[6px] border-[#FF6B6B] p-3 shadow-sm shrink-0">
                  <p className="text-lg font-bold text-[#2C2416] line-clamp-2">{currentItem.caption}</p>
                </div>
              )}

              {/* Media Frame */}
              <div className="relative w-full flex-1 min-h-0 bg-black border-[4px] border-[#2C2416] shadow-[8px_8px_0_0_#2C2416] flex items-center justify-center overflow-hidden">
                {currentItem.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      src={currentItem.url}
                      className="w-full h-full object-contain max-h-full"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                      onClick={togglePlay}
                      playsInline
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full bg-[#F5F1E8]">
                    <Image
                      src={currentItem.url}
                      alt={currentItem.alt || "Gallery Image"}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Video Controls (Bottom) */}
              {currentItem.type === 'video' && (
                <div className="w-full bg-white border-[4px] border-[#2C2416] p-4 shadow-[4px_4px_0_0_#2C2416] flex flex-col gap-3 shrink-0">
                  {/* Progress */}
                  <div className="flex items-center gap-3 font-mono font-bold text-[#2C2416]">
                    <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="flex-1 h-4 bg-[#F5F1E8] border-[2px] border-[#2C2416] appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF6B6B] [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-[#2C2416] cursor-pointer"
                    />
                    <span>{formatTime(duration)}</span>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 bg-[#2196F3] border-[3px] border-[#2C2416] shadow-[2px_2px_0_0_#2C2416] flex items-center justify-center hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#2C2416] active:shadow-none transition-all"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 text-white fill-current" /> : <Play className="w-6 h-6 text-white fill-current" />}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="w-12 h-12 bg-white border-[3px] border-[#2C2416] shadow-[2px_2px_0_0_#2C2416] flex items-center justify-center hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#2C2416] active:shadow-none transition-all"
                    >
                      {isMuted ? <VolumeX className="w-6 h-6 text-[#2C2416]" /> : <Volume2 className="w-6 h-6 text-[#2C2416]" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Next Button (Desktop) - Right Side */}
            <button
              onClick={handleNext}
              className="hidden md:flex shrink-0 w-16 h-16 bg-white border-[4px] border-[#2C2416] shadow-[4px_4px_0_0_#2C2416] items-center justify-center hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#2C2416] active:shadow-none transition-all"
            >
              <ChevronRight className="w-10 h-10 text-[#2C2416]" strokeWidth={3} />
            </button>

          </div>

          {/* Mobile Navigation (Bottom Bar) */}
          <div className="md:hidden h-16 border-t-[4px] border-[#2C2416] bg-white flex items-center justify-between px-4 shrink-0">
             <button
              onClick={handlePrev}
              className="w-10 h-10 bg-white border-[3px] border-[#2C2416] shadow-[2px_2px_0_0_#2C2416] flex items-center justify-center active:shadow-none active:translate-y-[2px]"
            >
              <ChevronLeft className="w-6 h-6 text-[#2C2416]" strokeWidth={3} />
            </button>
            
            <span className="font-bold text-[#2C2416] text-sm uppercase tracking-widest">Swipe / Tap</span>
            
            <button
              onClick={handleNext}
              className="w-10 h-10 bg-white border-[3px] border-[#2C2416] shadow-[2px_2px_0_0_#2C2416] flex items-center justify-center active:shadow-none active:translate-y-[2px]"
            >
              <ChevronRight className="w-6 h-6 text-[#2C2416]" strokeWidth={3} />
            </button>
          </div>

        </div>,
        document.body
      )}
    </>
  );
}
