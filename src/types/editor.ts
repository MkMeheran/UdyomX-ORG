// ============================================
// EDITOR TYPES - Admin Dashboard Content Management
// ============================================

// Media Item for Gallery
export interface EditorMediaItem {
    id: string;
    type: 'image' | 'video' | 'embed';
    url: string;
    thumbnailUrl?: string;
    altText: string;
    caption?: string;
    source: 'url' | 'upload' | 'drive';
    storagePath?: string; // Supabase storage path for uploaded files
    width?: number;
    height?: number;
    duration?: string; // For videos
    orderIndex: number;
}

// Download Item for Editor
export interface EditorDownloadItem {
    id: string;
    title: string;
    url: string;
    fileSize?: string;
    fileType?: string;
    source: 'url' | 'upload' | 'drive';
    storagePath?: string; // Supabase storage path for uploaded files
    orderIndex: number;
}

// FAQ Item
export interface EditorFAQItem {
    id: string;
    question: string;
    answer: string;
    orderIndex: number;
}

// Recommended Content Reference
export interface EditorRecommendedItem {
    id: string;
    slug: string;
    type: 'post' | 'project' | 'service';
    // Fetched data
    title?: string;
    thumbnail?: string;
    excerpt?: string;
    orderIndex: number;
}

// TOC Item (Auto-generated)
export interface EditorTOCItem {
    id: string;
    text: string;
    level: number; // h1, h2, h3, etc.
    children?: EditorTOCItem[];
}

// Content Format
export type ContentFormat = 'mdx' | 'markdown' | 'html';

// Content Status
export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';

// ============================================
// SEO DATA TYPES
// ============================================

// Search Intent Type
export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

// Schema Type
export type SchemaType = 'article' | 'blogPosting' | 'newsArticle' | 'techArticle' | 'howTo' | 'faqPage' | 'product' | 'service';

// Robots Meta Options
export interface RobotsMeta {
    index: boolean;
    follow: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
}

// Social Card Data
export interface SocialCard {
    title?: string;
    description?: string;
    image?: string;
}

// Comprehensive SEO Data
export interface SEOData {
    // Basic SEO Metadata (A)
    seoTitle?: string;           // Auto from title, 50-60 chars
    metaDescription?: string;    // 150-160 chars
    slug?: string;               // Auto from slug input
    canonicalUrl?: string;       // Canonical URL

    // Keywords & Targeting (B)
    primaryKeyword?: string;     // Main focus keyword
    secondaryKeywords?: string[];// LSI/Related keywords
    searchIntent?: SearchIntent; // Search intent type

    // Structured Data / Schema (C)
    schemaType?: SchemaType;     // Article type for schema.org
    authorName?: string;         // Auto from author
    authorImage?: string;        // Auto from authorAvatar
    publishDate?: string;        // Auto from publishDate
    modifiedDate?: string;       // Last modified date
    // FAQs auto-implemented from faqs array

    // Categories & Tags (E)
    // Auto from category and tags

    // Social / Sharing (F)
    twitterCard?: SocialCard;
    openGraph?: SocialCard;

    // Technical SEO / Advanced (G)
    robotsMeta?: RobotsMeta;
    breadcrumbPath?: string[];   // For breadcrumb markup
    internalLinks?: string[];    // Suggested internal links

    // Content Analysis
    wordCount?: number;          // Auto-calculated
    headingStructure?: {         // Auto from TOC
        h1Count: number;
        h2Count: number;
        h3Count: number;
    };
    readabilityScore?: number;   // Optional AI-powered
    contentScore?: number;       // Overall SEO score
}

// ============================================
// POST EDITOR TYPE
// ============================================
export interface PostEditorData {
    id?: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    contentFormat: ContentFormat;
    coverImage?: string;
    coverImageAlt?: string;
    category: string;
    tags: string[];
    author: string;
    authorAvatar?: string;
    publishDate: string;
    status: ContentStatus;
    layout: 'standard' | 'research';
    visibility: 'public' | 'private';  // public = visible on site, private = admin only
    // Sections
    gallery: EditorMediaItem[];
    downloads: EditorDownloadItem[];
    faqs: EditorFAQItem[];
    recommended: EditorRecommendedItem[];
    // Auto-generated
    toc: EditorTOCItem[];
    readTime: string;
    // Comprehensive SEO
    seo?: SEOData;
    // Legacy SEO fields (for backward compatibility)
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoImage?: string;
}

// ============================================
// PROJECT EDITOR TYPE
// ============================================
export interface ProjectEditorData {
    id?: string;
    slug: string;
    name: string;
    description: string;
    content: string;
    contentFormat: ContentFormat;
    thumbnail?: string;
    images: EditorMediaItem[];
    techStack: string[];
    category?: string;
    liveLink?: string;
    repoLink?: string;
    publishDate: string;
    status: ContentStatus;
    projectStatus: 'completed' | 'in-progress' | 'paused';
    progress: number;
    featured: boolean;
    clientInfo?: string;
    // Sections
    gallery: EditorMediaItem[];
    downloads: EditorDownloadItem[];
    faqs: EditorFAQItem[];
    recommended: EditorRecommendedItem[];
    // Auto-generated
    toc: EditorTOCItem[];
    // Comprehensive SEO
    seo?: SEOData;
    // Legacy SEO fields (for backward compatibility)
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoImage?: string;
}

// ============================================
// SERVICE EDITOR TYPE
// ============================================
export interface ServiceFeatureEditor {
    id: string;
    icon: string;
    title: string;
    description: string;
    orderIndex: number;
}

export interface ServicePackageEditor {
    id: string;
    title: string;
    price: number;
    discountPrice?: number;
    features: string[];
    deliveryTime: string;
    revisions: number;
    isPopular: boolean;
    orderIndex: number;
}

export interface ServiceProblemEditor {
    id: string;
    text: string;
    orderIndex: number;
}

export interface ServiceSolutionEditor {
    id: string;
    text: string;
    orderIndex: number;
}

export interface TestimonialEditor {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    quote: string;
    createdAt: string;
    orderIndex: number;
}

export interface ServiceEditorData {
    id?: string;
    slug: string;
    title: string;
    hookLine?: string;
    description: string;
    contentFormat: ContentFormat;
    category?: string;
    thumbnail?: string;
    coverImage?: string;
    publishDate: string;
    status: ContentStatus;
    theme: 'earth-ink' | 'ocean' | 'forest' | 'sunset' | 'academic';
    showGallery: boolean;
    showDownloads: boolean;
    // Features
    features: ServiceFeatureEditor[];
    packages: ServicePackageEditor[];
    problems: ServiceProblemEditor[];
    solutions: ServiceSolutionEditor[];
    testimonials: TestimonialEditor[];
    // Sections
    gallery: EditorMediaItem[];
    downloads: EditorDownloadItem[];
    faqs: EditorFAQItem[];
    relatedProjects: EditorRecommendedItem[]; // Related project slugs
    // Auto-generated
    toc: EditorTOCItem[];
    
    // ═══════════════════════════════════════════════════════════════
    // BASIC SEO FIELDS
    // ═══════════════════════════════════════════════════════════════
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoImage?: string;
    canonicalUrl?: string;
    
    // ═══════════════════════════════════════════════════════════════
    // SERVICE INFO FIELDS (For AI Overview & LLM SEO)
    // ═══════════════════════════════════════════════════════════════
    shortSummary?: string;        // 60-80 chars for AI Overview snippet
    longSummary?: string;         // Service detail
    painPoints?: string[];        // Helps AEO (Answer Engine Optimization)
    solutionsOffered?: string[];  // LLM SEO
    keyBenefits?: string[];       // AI Overview
    pricing?: string;             // Pricing info
    useCases?: string[];          // Helps AI comprehension
    targetAudience?: string;      // Who is it for?
    toolsUsed?: string[];         // n8n, OpenAI, Supabase etc
    
    // ═══════════════════════════════════════════════════════════════
    // VISUAL FIELDS
    // ═══════════════════════════════════════════════════════════════
    portfolioGallery?: EditorMediaItem[];  // Portfolio/examples
    clientLogos?: string[];               // Client logo URLs for social proof
    
    // ═══════════════════════════════════════════════════════════════
    // TECHNICAL SEO FIELDS
    // ═══════════════════════════════════════════════════════════════
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    indexable?: boolean;          // Control crawling
    sitemapPriority?: number;     // 0.0-1.0 SEO weight
    lastUpdated?: string;         // Helps freshness
    
    // ═══════════════════════════════════════════════════════════════
    // CONTACT INFO
    // ═══════════════════════════════════════════════════════════════
    contactWhatsApp?: string;
    contactTelegram?: string;
    contactTwitter?: string;
    contactInstagram?: string;
    contactFacebook?: string;
    contactLinkedIn?: string;
    contactEmail?: string;
}

// ============================================
// CONTENT VALIDATION
// ============================================
export interface ValidationError {
    field: string;
    message: string;
}

export interface ContentValidation {
    isValid: boolean;
    errors: ValidationError[];
}

// ============================================
// SLUG CHECK
// ============================================
export interface SlugCheckResult {
    isAvailable: boolean;
    suggestions?: string[];
    existingContent?: {
        type: 'post' | 'project' | 'service';
        title: string;
    };
}
