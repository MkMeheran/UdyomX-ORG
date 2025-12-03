'use client';

import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import { MediaItem } from '@/types';

interface MediaViewerProps {
  items: MediaItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  items,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentItem = items[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < items.length - 1;

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentIndex(currentIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        aria-label="Close"
      >
        <Icon name="X" size={32} />
      </button>

      {/* Navigation */}
      {canGoPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 text-white hover:text-gray-300 z-10"
          aria-label="Previous"
        >
          <Icon name="ChevronLeft" size={48} />
        </button>
      )}

      {canGoNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 text-white hover:text-gray-300 z-10"
          aria-label="Next"
        >
          <Icon name="ChevronRight" size={48} />
        </button>
      )}

      {/* Media Content */}
      <div
        className="max-w-7xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem?.type === 'image' && (
          <img
            src={currentItem.url}
            alt={currentItem.alt || currentItem.caption}
            className="w-full h-full object-contain"
          />
        )}
        {currentItem?.type === 'video' && (
          <video
            src={currentItem.url}
            controls
            className="w-full h-full"
            autoPlay
          />
        )}
        
        {/* Caption */}
        {currentItem?.caption && (
          <div className="mt-4 text-center text-white">
            <p className="text-sm">{currentItem.caption}</p>
          </div>
        )}

        {/* Counter */}
        <div className="mt-2 text-center text-white/60 text-sm">
          {currentIndex + 1} / {items.length}
        </div>
      </div>
    </div>
  );
};

export default MediaViewer;
