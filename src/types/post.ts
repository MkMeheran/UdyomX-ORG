// Post System Types - Neu-Brutalism Design System

// ============================================
// MEDIA ITEM
// ============================================
export interface MediaItem {
    id: string;
    src: string;
    alt: string;
    caption?: string;
    type: 'image' | 'video' | 'embed';
    width?: number;
    height?: number;
    thumbnail?: string;
}

// ============================================
// AUTHOR
// ============================================
export interface Author {
    id: string;
    name: string;
    avatar?: string;
    affiliation?: string;
    bio?: string;
    socialLinks?: {
        twitter?: string;
        github?: string;
        linkedin?: string;
        website?: string;
    };
}

// ============================================
// DOWNLOAD ITEM
// ============================================
export interface PostDownloadItem {
    id: string;
    label: string;
    fileUrl: string;
    fileSize?: string;
    fileType: 'pdf' | 'zip' | 'doc' | 'xlsx' | 'image' | 'other';
    description?: string;
}

// ============================================
// RECOMMENDED CONTENT
// ============================================
export interface RecommendedPost {
    id: string;
    title: string;
    slug: string;
    coverPhoto?: string;
    excerpt?: string;
    type: 'post' | 'playlist' | 'project';
}

export interface RecommendedContent {
    posts?: RecommendedPost[];
    playlists?: RecommendedPost[];
    projects?: RecommendedPost[];
}

// ============================================
// SEO
// ============================================
export interface PostSEO {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
}

// ============================================
// AUDIENCE TYPE
// ============================================
export type AudienceType = 'public' | 'premium' | 'both' | 'link';

// ============================================
// POST LAYOUT TYPE
// ============================================
export type PostLayoutType = 'StandardPost' | 'ResearchPaper';

// ============================================
// POST STATUS
// ============================================
export type PostStatus = 'draft' | 'published' | 'archived';

// ============================================
// TABLE OF CONTENTS ITEM
// ============================================
export interface TOCItem {
    id: string;
    text: string;
    level: number;
    children?: TOCItem[];
}

// ============================================
// MAIN POST TYPE
// ============================================
export interface Post {
    // Core identifiers
    id: string;
    slug: string;
    
    // Content
    title: string;
    excerpt: string;
    content: string; // MDX content
    
    // Media
    coverPhoto?: string;
    coverPhotoAlt?: string;
    gallery?: MediaItem[];
    
    // Authors
    authors: Author[];
    
    // Classification
    category: string;
    tags?: string[];
    audienceType: AudienceType;
    
    // Layout
    layout: PostLayoutType;
    
    // Downloads & Recommendations
    downloads?: PostDownloadItem[];
    recommended?: RecommendedContent;
    
    // Meta
    publishedDate: string;
    updatedDate?: string;
    readTime?: string;
    status: PostStatus;
    
    // SEO
    seo?: PostSEO;
    
    // Research Paper specific
    abstract?: string;
    tableOfContents?: TOCItem[];
}

// ============================================
// POST CARD PROPS (for list views)
// ============================================
export interface PostCardData {
    id: string;
    title: string;
    slug: string;
    coverPhoto?: string;
    excerpt: string;
    category: string;
    audienceType: AudienceType;
    publishedDate: string;
    readTime?: string;
    authors: Pick<Author, 'name' | 'avatar'>[];
}

// ============================================
// BUSINESS INFO
// ============================================
export interface BusinessInfo {
    name: string;
    logo?: string;
    url: string;
    description?: string;
    socialLinks?: {
        twitter?: string;
        github?: string;
        linkedin?: string;
        youtube?: string;
    };
}

// ============================================
// USER (extended)
// ============================================
export interface PostUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'editor' | 'author' | 'user';
    avatar?: string;
    isPremium?: boolean;
    createdAt: string;
}

// ============================================
// THEME TYPES
// ============================================
export type ResearchPaperTheme = 'default' | 'academic' | 'minimal' | 'dark';

export interface ThemeConfig {
    name: ResearchPaperTheme;
    colors: {
        background: string;
        surface: string;
        border: string;
        text: string;
        textSecondary: string;
        accent: string;
        shadow: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
    };
}
