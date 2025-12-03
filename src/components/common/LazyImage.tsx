'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
    brutal?: boolean;
    // New props for progressive loading
    blurDataURL?: string;
    showSkeleton?: boolean;
    onLoadComplete?: () => void;
}

// Simple blur placeholder - a tiny colored rectangle
const DEFAULT_BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEU0REMiLz48L3N2Zz4=';

export function LazyImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    aspectRatio = 'auto',
    brutal = true,
    blurDataURL = DEFAULT_BLUR,
    showSkeleton = true,
    onLoadComplete,
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority); // Start true if priority
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (priority) return; // Don't observe if priority
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' } // Load 100px before visible
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoadComplete?.();
    };

    const handleError = () => {
        setHasError(true);
    };

    const aspectClasses = {
        video: 'aspect-video',
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
        auto: '',
    };

    const brutalStyles = brutal
        ? 'border-4 border-[#2C2416] shadow-[4px_4px_0_0_rgba(44,36,22,0.5)]'
        : '';

    return (
        <div
            ref={imgRef}
            className={cn(
                'relative overflow-hidden bg-[#E8E4DC]',
                aspectClasses[aspectRatio],
                brutalStyles,
                className
            )}
        >
            {/* Skeleton/Blur Placeholder */}
            {showSkeleton && !isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[#E8E4DC]" />
            )}
            
            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#E8E4DC]">
                    <span className="text-[#7A7267] text-sm font-medium">Failed to load</span>
                </div>
            )}
            
            {/* Image - Load when in view */}
            {(isInView || priority) && !hasError && (
                <Image
                    src={src}
                    alt={alt}
                    fill={!width && !height}
                    width={width}
                    height={height}
                    className={cn(
                        'object-cover transition-all duration-500',
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    )}
                    onLoad={handleLoad}
                    onError={handleError}
                    priority={priority}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            )}
            
            {/* Loading Spinner - Show while loading */}
            {isInView && !isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-[#2C2416]/30 border-t-[#2C2416] rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
