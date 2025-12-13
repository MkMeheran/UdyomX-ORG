'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface MediaLightboxProps {
    trigger?: string; // CSS selector for images/videos to trigger lightbox
}

export function MediaLightbox({ trigger = '.lightbox-trigger' }: MediaLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSrc, setCurrentSrc] = useState('');
    const [currentType, setCurrentType] = useState<'image' | 'video' | 'youtube'>('image');
    const [allMedia, setAllMedia] = useState<Array<{ src: string; type: 'image' | 'video' | 'youtube'; alt?: string; youtubeId?: string }>>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Video controls
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Extract YouTube ID from URL
    const getYouTubeId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleClick = (e: Event) => {
            const target = e.target as HTMLElement;
            
            // Check if clicked element or its parent matches the trigger
            const clickedMedia = target.closest(trigger) as HTMLImageElement | HTMLVideoElement | null;
            
            if (!clickedMedia) return;
            
            e.preventDefault();
            e.stopPropagation();

            // Collect all lightbox media from the page
            const mediaElements = Array.from(document.querySelectorAll(trigger));
            const mediaList = mediaElements.map((el) => {
                const element = el as HTMLImageElement | HTMLVideoElement | HTMLIFrameElement;
                
                // Check for YouTube video (data-youtube attribute or iframe)
                const youtubeId = element.getAttribute('data-youtube');
                if (youtubeId) {
                    return {
                        src: element.tagName === 'IMG' ? (element as HTMLImageElement).src : '',
                        type: 'youtube' as const,
                        youtubeId: youtubeId,
                        alt: (element as HTMLImageElement).alt || '',
                    };
                }
                
                // Check if it's an iframe (YouTube embed)
                if (element.tagName === 'IFRAME') {
                    const iframeSrc = (element as HTMLIFrameElement).src;
                    const extractedId = getYouTubeId(iframeSrc);
                    if (extractedId) {
                        return {
                            src: iframeSrc,
                            type: 'youtube' as const,
                            youtubeId: extractedId,
                            alt: '',
                        };
                    }
                }
                
                const isVideo = element.tagName === 'VIDEO';
                
                return {
                    src: isVideo ? (element as HTMLVideoElement).src : (element as HTMLImageElement).src,
                    type: (isVideo ? 'video' : 'image') as 'image' | 'video',
                    alt: (element as HTMLImageElement).alt || '',
                };
            });

            const clickedIndex = mediaElements.indexOf(clickedMedia);
            const clickedItem = mediaList[clickedIndex];

            setAllMedia(mediaList);
            setCurrentIndex(clickedIndex);
            setCurrentSrc(clickedItem.src);
            setCurrentType(clickedItem.type);
            setIsOpen(true);
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [trigger]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % allMedia.length;
        setCurrentIndex(nextIndex);
        setCurrentSrc(allMedia[nextIndex].src);
        setCurrentType(allMedia[nextIndex].type);
        setIsPlaying(false);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + allMedia.length) % allMedia.length;
        setCurrentIndex(prevIndex);
        setCurrentSrc(allMedia[prevIndex].src);
        setCurrentType(allMedia[prevIndex].type);
        setIsPlaying(false);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
        >
            {/* Close Button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 border-2 border-white/30 transition-colors"
                aria-label="Close"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {allMedia.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 border-2 border-white/30 transition-colors"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 border-2 border-white/30 transition-colors"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </>
            )}

            {/* Counter */}
            {allMedia.length > 1 && (
                <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/50 border-2 border-white/30 text-white font-bold">
                    {currentIndex + 1} / {allMedia.length}
                </div>
            )}

            {/* Media Content */}
            <div 
                className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {currentType === 'image' ? (
                    <img
                        src={currentSrc}
                        alt={allMedia[currentIndex]?.alt || 'Media'}
                        className="max-w-full max-h-[90vh] object-contain border-4 border-white/20"
                    />
                ) : currentType === 'youtube' ? (
                    <div className="relative w-full max-w-[90vw] aspect-video">
                        <iframe
                            src={`https://www.youtube.com/embed/${allMedia[currentIndex]?.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                            title={allMedia[currentIndex]?.alt || 'YouTube Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-4 border-white/20"
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <video
                            key={currentSrc}
                            src={currentSrc}
                            controls
                            autoPlay={isPlaying}
                            muted={isMuted}
                            className="max-w-full max-h-[90vh] object-contain border-4 border-white/20"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
