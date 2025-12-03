/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIVERSAL TYPES - Shared across Blog, Project, Service
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * These types ensure consistent data structure across all content types.
 * UI can customize display, but backend structure remains unified.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT FORMAT - Universal for all content types
// ═══════════════════════════════════════════════════════════════════════════
export type ContentFormat = 'markdown' | 'mdx' | 'html';

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY ITEM - Universal gallery item for Blog, Project, Service
// ═══════════════════════════════════════════════════════════════════════════
export interface GalleryItem {
    id: string;
    url: string;
    type: 'image' | 'video' | 'embed';
    alt?: string;          // Alt text for accessibility
    caption?: string;      // Optional caption
    thumbnail?: string;    // Thumbnail for videos/embeds
    order?: number;        // Sort order
}

// Helper to create gallery item from string URL
export function createGalleryItem(url: string, index: number = 0): GalleryItem {
    return {
        id: `gallery-${Date.now()}-${index}`,
        url,
        type: 'image',
        alt: '',
        order: index,
    };
}

// Helper to normalize gallery (string[] or GalleryItem[])
export function normalizeGallery(gallery: (string | GalleryItem)[] | undefined): GalleryItem[] {
    if (!gallery) return [];
    return gallery.map((item, index) => {
        if (typeof item === 'string') {
            return createGalleryItem(item, index);
        }
        return {
            ...item,
            id: item.id || `gallery-${index}`,
            type: item.type || 'image',
            order: item.order ?? index,
        };
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// DOWNLOAD ITEM - Universal download for Blog, Project, Service
// ═══════════════════════════════════════════════════════════════════════════
export interface DownloadItem {
    id: string;
    title: string;          // Display title
    url: string;            // Download URL
    fileSize?: string;      // e.g., "2.5 MB"
    fileType?: string;      // e.g., "PDF", "ZIP", "PSD"
    description?: string;   // Optional description
    isPremium?: boolean;    // Requires premium access
    downloadCount?: number; // Track downloads
}

// Helper to create download item
export function createDownloadItem(title: string, url: string): DownloadItem {
    return {
        id: `download-${Date.now()}`,
        title,
        url,
        isPremium: false,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// FAQ ITEM - Universal FAQ for Blog, Project, Service
// ═══════════════════════════════════════════════════════════════════════════
export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    order?: number;
    isPremium?: boolean;    // Answer requires premium
}

// Helper to create FAQ item
export function createFAQItem(question: string, answer: string): FAQItem {
    return {
        id: `faq-${Date.now()}`,
        question,
        answer,
        isPremium: false,
    };
}

// Legacy FAQ type support (question/answer only)
export interface FAQ {
    question: string;
    answer: string;
}

// Normalize FAQ (FAQ or FAQItem)
export function normalizeFAQ(faq: FAQ | FAQItem, index: number = 0): FAQItem {
    if ('id' in faq) {
        return faq;
    }
    return {
        id: `faq-${index}`,
        question: faq.question,
        answer: faq.answer,
        order: index,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// RECOMMENDED ITEM - Universal recommendations for Blog, Project, Service
// ═══════════════════════════════════════════════════════════════════════════
export interface RecommendedItem {
    id: string;
    type: 'blog' | 'project' | 'service' | 'external';
    title: string;
    slug?: string;          // For internal links
    url?: string;           // For external links or override
    thumbnail?: string;     // Preview image
    excerpt?: string;       // Short description
}

// Helper to create recommended item
export function createRecommendedItem(
    type: RecommendedItem['type'],
    title: string,
    slug: string
): RecommendedItem {
    return {
        id: `rec-${Date.now()}`,
        type,
        title,
        slug,
    };
}

// Get URL for recommended item
export function getRecommendedUrl(item: RecommendedItem): string {
    if (item.url) return item.url;
    if (!item.slug) return '#';
    
    switch (item.type) {
        case 'blog': return `/blog/${item.slug}`;
        case 'project': return `/projects/${item.slug}`;
        case 'service': return `/services/${item.slug}`;
        default: return item.url || '#';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TOC ITEM - Universal Table of Contents
// ═══════════════════════════════════════════════════════════════════════════
export interface TOCItem {
    id: string;
    text: string;
    level: number;          // h1=1, h2=2, h3=3, etc.
}

// ═══════════════════════════════════════════════════════════════════════════
// SEO DATA - Universal SEO for all content types
// ═══════════════════════════════════════════════════════════════════════════
export interface SEOData {
    // Basic SEO
    seoTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    
    // Keywords
    primaryKeyword?: string;
    secondaryKeywords?: string[];
    
    // Search Intent
    searchIntent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
    
    // Schema
    schemaType?: 'article' | 'blogPosting' | 'techArticle' | 'howTo' | 'faqPage' | 'product' | 'softwareApplication';
    
    // Robots
    robotsMeta?: {
        index?: boolean;
        follow?: boolean;
        noarchive?: boolean;
        maxImagePreview?: 'none' | 'standard' | 'large';
    };
    
    // Social Cards
    openGraph?: {
        title?: string;
        description?: string;
        image?: string;
        type?: string;
    };
    twitterCard?: {
        title?: string;
        description?: string;
        image?: string;
        cardType?: 'summary' | 'summary_large_image';
    };
    
    // Breadcrumb
    breadcrumb?: {
        enabled?: boolean;
        customPath?: string;
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// BASE CONTENT - Shared fields for Blog, Project, Service
// ═══════════════════════════════════════════════════════════════════════════
export interface BaseContent {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    contentFormat: ContentFormat;
    
    // Media
    thumbnail?: string;
    coverImage?: string;
    
    // Metadata
    publishDate: string;
    updatedAt?: string;
    author?: string;
    authorAvatar?: string;
    
    // Status
    status: 'draft' | 'published';
    
    // Universal sections
    gallery?: GalleryItem[];
    downloads?: DownloadItem[];
    faqs?: FAQItem[];
    recommended?: RecommendedItem[];
    toc?: TOCItem[];
    
    // SEO
    seo?: SEOData;
}
