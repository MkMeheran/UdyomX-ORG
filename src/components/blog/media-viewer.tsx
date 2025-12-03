'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface MediaViewerProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

export function MediaViewer({ images, initialIndex, onClose }: MediaViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-earth-white rounded-full hover:bg-earth-cream transition-colors z-10"
                    aria-label="Close"
                >
                    <X className="w-6 h-6 text-earth-ink" />
                </button>

                {/* Previous Button */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                        }}
                        className="absolute left-4 p-3 bg-earth-white rounded-full hover:bg-earth-cream transition-colors"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6 text-earth-ink" />
                    </button>
                )}

                {/* Image */}
                <motion.div
                    key={currentIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-5xl max-h-[90vh] w-full h-full"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>

                {/* Next Button */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        className="absolute right-4 p-3 bg-earth-white rounded-full hover:bg-earth-cream transition-colors"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6 text-earth-ink" />
                    </button>
                )}

                {/* Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-earth-white rounded-full text-sm font-medium text-earth-ink">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
