'use client';

import { StandardPostLayout } from './layouts/StandardPostLayout';
import type { Post, BusinessInfo } from '@/types/post';

interface PostLayoutProps {
    post: Post;
    businessInfo?: BusinessInfo;
}

export function PostLayout({ post, businessInfo }: PostLayoutProps) {
    // Only StandardPostLayout - no other layouts
    return <StandardPostLayout post={post} businessInfo={businessInfo} />;
}

// Export all post components for easy imports
export { StandardPostLayout } from './layouts/StandardPostLayout';
export { PostCard } from './PostCard';
export { PostAuthors } from './PostAuthors';
export { PostMeta } from './PostMeta';
export { PostTOC } from './PostTOC';
export { PostGallery } from './PostGallery';
export { PostDownloads } from './PostDownloads';
export { PostRecommended } from './PostRecommended';
export { AudienceBadge } from './AudienceBadge';
