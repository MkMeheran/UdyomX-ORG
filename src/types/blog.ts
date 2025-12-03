/**
 * Blog-specific types
 * Uses universal types from common.ts
 */

// Re-export universal types for convenience
export type {
    GalleryItem,
    DownloadItem,
    FAQItem,
    RecommendedItem,
    TOCItem,
    SEOData,
    ContentFormat,
} from './common';

// Legacy exports for backward compatibility
export type { FAQ } from './common';

import type {
    GalleryItem,
    DownloadItem,
    FAQItem,
    RecommendedItem,
    TOCItem,
    SEOData,
    ContentFormat,
} from './common';

// Blog post types - using universal types
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    contentFormat?: ContentFormat;
    coverImage?: string;
    thumbnail?: string;
    author?: string;
    authorAvatar?: string;
    publishedAt?: string;
    publishDate?: string;
    updatedAt?: string;
    category: string;
    tags?: string[];
    readTime?: string;
    isPremium?: boolean;
    layout?: 'standard' | 'research';
    status?: 'draft' | 'published';
    
    // Universal sections (same for all content types)
    gallery?: GalleryItem[];
    downloads?: DownloadItem[];
    faqs?: FAQItem[];
    recommended?: RecommendedItem[];
    toc?: TOCItem[];
    seo?: SEOData;
    
    // Legacy field aliases (deprecated - for backward compatibility)
    /** @deprecated Use recommended instead */
    recommendedContent?: RecommendedItem[];
}

export interface BlogTheme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        shadow: string;
    };
    typography: {
        heading: string;
        body: string;
        code: string;
    };
}

export type ThemeName = 'earth-ink' | 'ocean-depths' | 'forest-twilight' | 'sunset-ember' | 'academic';
