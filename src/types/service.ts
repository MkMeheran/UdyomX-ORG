import type { Project, FAQ } from './index';

// Extended service type with all new features
export interface ServiceFull {
    id: string;
    slug: string;
    title: string;
    hookLine?: string;
    description?: string;
    contentFormat: 'mdx' | 'html';
    category?: string;
    thumbnail?: string;
    coverImage?: string;
    status: 'draft' | 'published' | 'archived';
    showGallery: boolean;
    showDownloads: boolean;
    publishDate?: string;
    createdAt: string;
    updatedAt: string;
    // SEO Fields
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoImage?: string;
    canonicalUrl?: string;
    // AI/LLM SEO Fields
    shortSummary?: string;
    longSummary?: string;
    painPoints?: string[];
    solutionsOffered?: string[];
    keyBenefits?: string[];
    pricing?: string;
    useCases?: string[];
    targetAudience?: string;
    toolsUsed?: string[];
    // Visual
    clientLogos?: string[];
    // Technical SEO
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    indexable?: boolean;
    sitemapPriority?: number;
    lastUpdated?: string;
    // Contact Info
    contactWhatsApp?: string;
    contactTelegram?: string;
    contactTwitter?: string;
    contactInstagram?: string;
    contactFacebook?: string;
    contactLinkedIn?: string;
    contactEmail?: string;
    // Relations
    features?: ServiceFeature[];
    packages?: ServicePackage[];
    problems?: ServiceProblem[];
    solutions?: ServiceSolution[];
    gallery?: GalleryItem[];
    downloads?: DownloadItem[];
    testimonials?: Testimonial[];
    projects?: Project[];
    faqs?: FAQ[];
}

export interface ServiceFeature {
    id: string;
    serviceId: string;
    icon: string;
    title: string;
    description: string;
    orderIndex: number;
}

export interface ServicePackage {
    id: string;
    serviceId: string;
    title: string;
    price: number;
    discountPrice?: number;
    features: string[];
    deliveryTime: string;
    revisions: number;
    isPopular: boolean;
    orderIndex: number;
}

export interface ServiceProblem {
    id: string;
    serviceId: string;
    text: string;
    orderIndex: number;
}

export interface ServiceSolution {
    id: string;
    serviceId: string;
    text: string;
    orderIndex: number;
}

export interface GalleryItem {
    id: string;
    serviceId: string;
    type: 'image' | 'video' | 'pdf';
    url: string;
    thumbnailUrl?: string;
    orderIndex: number;
}

export interface DownloadItem {
    id: string;
    serviceId: string;
    fileUrl: string;
    label: string;
    fileSize?: string;
    fileType?: string;
}

export interface Testimonial {
    id: string;
    serviceId?: string;
    name: string;
    avatar?: string;
    rating: number;
    quote: string;
    createdAt: string;
}

// Theme types
export type ThemeName = 'earth-ink' | 'ocean' | 'forest' | 'sunset' | 'academic';

export interface ThemeConfig {
    name: ThemeName;
    displayName: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
    };
}
