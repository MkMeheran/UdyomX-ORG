'use client';

import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// BASE SKELETON - Animated placeholder
// ═══════════════════════════════════════════════════════════════════════════

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circle' | 'image';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-[#E8E4DC]';
  
  const variantClasses = {
    default: 'rounded',
    card: 'border-[3px] border-[#2C2416]/20',
    text: 'h-4 rounded',
    circle: 'rounded-full',
    image: 'border-[3px] border-[#2C2416]/20',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOG CARD SKELETON - For blog listing pages
// ═══════════════════════════════════════════════════════════════════════════

export function BlogCardSkeleton() {
  return (
    <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416]/30 overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton variant="image" className="w-full aspect-video" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <Skeleton className="w-20 h-5" />
        
        {/* Title */}
        <div className="space-y-2">
          <Skeleton variant="text" className="w-full h-5" />
          <Skeleton variant="text" className="w-3/4 h-5" />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-1.5">
          <Skeleton variant="text" className="w-full h-3" />
          <Skeleton variant="text" className="w-full h-3" />
          <Skeleton variant="text" className="w-2/3 h-3" />
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center gap-3 pt-2">
          <Skeleton variant="circle" className="w-6 h-6" />
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT CARD SKELETON - For project listing pages
// ═══════════════════════════════════════════════════════════════════════════

export function ProjectCardSkeleton() {
  return (
    <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416]/30 overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton variant="image" className="w-full aspect-video" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status Badge */}
        <Skeleton className="w-24 h-5" />
        
        {/* Title */}
        <Skeleton variant="text" className="w-full h-6" />
        
        {/* Description */}
        <div className="space-y-1.5">
          <Skeleton variant="text" className="w-full h-3" />
          <Skeleton variant="text" className="w-4/5 h-3" />
        </div>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-14 h-6" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RECOMMENDED CARD SKELETON - For sidebar recommendations
// ═══════════════════════════════════════════════════════════════════════════

export function RecommendedCardSkeleton() {
  return (
    <div className="flex gap-2 p-2 bg-[#E8E4DC]/50 border-[2px] border-[#2C2416]/20">
      {/* Thumbnail */}
      <Skeleton variant="image" className="w-14 h-14 flex-shrink-0" />
      
      {/* Content */}
      <div className="flex-1 space-y-1.5 py-1">
        <Skeleton variant="text" className="w-full h-3" />
        <Skeleton variant="text" className="w-3/4 h-3" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY SKELETON - For gallery section
// ═══════════════════════════════════════════════════════════════════════════

export function GallerySkeleton() {
  return (
    <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416]/30 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-20 h-5" />
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton variant="image" className="aspect-square" />
        <Skeleton variant="image" className="aspect-square" />
        <Skeleton variant="image" className="aspect-square" />
        <Skeleton variant="image" className="aspect-square" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DOWNLOAD SKELETON - For download section
// ═══════════════════════════════════════════════════════════════════════════

export function DownloadSkeleton() {
  return (
    <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416]/30 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-24 h-4" />
      </div>
      
      {/* Items */}
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-[#E8E4DC]/50 border-[2px] border-[#2C2416]/20">
            <Skeleton className="w-7 h-7" />
            <div className="flex-1 space-y-1">
              <Skeleton variant="text" className="w-32 h-3" />
              <Skeleton variant="text" className="w-20 h-2" />
            </div>
            <Skeleton className="w-6 h-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT SKELETON - For main content area
// ═══════════════════════════════════════════════════════════════════════════

export function ContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Paragraph */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-3/4 h-4" />
      </div>
      
      {/* Heading */}
      <Skeleton variant="text" className="w-1/2 h-7 mt-8" />
      
      {/* Another paragraph */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-5/6 h-4" />
      </div>
      
      {/* Code block */}
      <Skeleton variant="card" className="w-full h-32" />
      
      {/* More text */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-2/3 h-4" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOG DETAIL SKELETON - Full page skeleton for blog detail
// ═══════════════════════════════════════════════════════════════════════════

export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Hero Image */}
      <div className="max-w-[1400px] mx-auto px-4 pt-6">
        <Skeleton variant="image" className="w-full h-[350px]" />
      </div>
      
      {/* Content Grid */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[240px_1fr_260px] gap-8">
          {/* Left Sidebar - TOC */}
          <aside className="hidden lg:block">
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4 ml-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4 ml-4" />
              <Skeleton className="w-2/3 h-4 ml-4" />
            </div>
          </aside>
          
          {/* Main Content */}
          <main>
            {/* Title Section */}
            <div className="border-b-[4px] border-[#2C2416]/30 pb-6 mb-8">
              <Skeleton className="w-full h-10 mb-4" />
              <Skeleton className="w-3/4 h-10 mb-5" />
              
              {/* Tags */}
              <div className="flex gap-3 mb-5">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-24 h-5" />
                <Skeleton className="w-16 h-5" />
              </div>
              
              {/* Meta */}
              <div className="flex gap-4">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
            
            {/* Content */}
            <ContentSkeleton />
          </main>
          
          {/* Right Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <RecommendedSidebarSkeleton />
            <GallerySkeleton />
            <DownloadSkeleton />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RECOMMENDED SIDEBAR SKELETON
// ═══════════════════════════════════════════════════════════════════════════

export function RecommendedSidebarSkeleton() {
  return (
    <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416]/30 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-[2px] border-[#2C2416]/20">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-28 h-4" />
      </div>
      
      {/* Items */}
      <div className="space-y-2">
        <RecommendedCardSkeleton />
        <RecommendedCardSkeleton />
        <RecommendedCardSkeleton />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GRID SKELETON - For listing pages
// ═══════════════════════════════════════════════════════════════════════════

interface GridSkeletonProps {
  count?: number;
  type?: 'blog' | 'project';
  columns?: 2 | 3 | 4;
}

export function GridSkeleton({ count = 6, type = 'blog', columns = 3 }: GridSkeletonProps) {
  const Card = type === 'blog' ? BlogCardSkeleton : ProjectCardSkeleton;
  
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridClasses[columns])}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  );
}
