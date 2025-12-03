// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORT UNIVERSAL TYPES
// ═══════════════════════════════════════════════════════════════════════════
export type {
  ContentFormat,
  GalleryItem,
  DownloadItem,
  FAQItem,
  RecommendedItem,
  TOCItem,
  SEOData,
  BaseContent,
  FAQ,  // Legacy support
} from './common';

export {
  createGalleryItem,
  normalizeGallery,
  createDownloadItem,
  createFAQItem,
  normalizeFAQ,
  createRecommendedItem,
  getRecommendedUrl,
} from './common';

// ═══════════════════════════════════════════════════════════════════════════
// BLOG POST TYPE - Uses universal types
// ═══════════════════════════════════════════════════════════════════════════
import type { 
  GalleryItem, 
  DownloadItem, 
  FAQItem, 
  RecommendedItem, 
  TOCItem, 
  SEOData,
  ContentFormat 
} from './common';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  coverImage?: string;
  excerpt: string;
  content: string;
  contentFormat?: ContentFormat;
  category: string;
  publishDate: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  authorAvatar?: string;
  tags?: string[];
  readTime?: string;
  isPremium?: boolean;
  layout?: 'standard' | 'research';
  status?: 'draft' | 'published';
  
  // Universal sections (same structure for all content types)
  gallery?: GalleryItem[];
  downloads?: DownloadItem[];
  faqs?: FAQItem[];
  recommended?: RecommendedItem[];
  toc?: TOCItem[];
  seo?: SEOData;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT TYPE - Uses universal types
// ═══════════════════════════════════════════════════════════════════════════
export interface Project {
  id: string;
  name: string;
  title?: string;  // Alias for name
  slug: string;
  thumbnail?: string;
  images?: string[];  // Legacy: multiple cover images
  coverImage?: string;
  description: string;
  excerpt?: string;  // Alias for short description
  content?: string;
  contentFormat?: ContentFormat;
  techStack?: string[];
  category?: string;
  liveLink?: string;
  repoLink?: string;
  publishDate: string;
  updatedAt?: string;
  featured?: boolean;
  status?: 'draft' | 'published';
  projectStatus?: 'completed' | 'in-progress' | 'paused';
  progress?: number;
  clientInfo?: string;
  
  // Universal sections (same structure for all content types)
  gallery?: GalleryItem[];
  downloads?: DownloadItem[];
  faqs?: FAQItem[];
  recommended?: RecommendedItem[];
  toc?: TOCItem[];
  seo?: SEOData;
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE TYPE - Uses universal types
// ═══════════════════════════════════════════════════════════════════════════
export interface Service {
  id: string;
  name: string;
  title?: string;  // Alias for name
  slug: string;
  thumbnail?: string;
  coverImage?: string;
  category?: string;
  priceRange?: string;
  deliveryTime?: string;
  features?: string[];
  description: string;
  excerpt?: string;
  content?: string;
  contentFormat?: ContentFormat;
  publishDate?: string;
  updatedAt?: string;
  status?: 'draft' | 'published' | 'active' | 'inactive';
  
  // Universal sections (same structure for all content types)
  gallery?: GalleryItem[];
  downloads?: DownloadItem[];
  faqs?: FAQItem[];
  recommended?: RecommendedItem[];
  seo?: SEOData;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORDER TYPE
// ═══════════════════════════════════════════════════════════════════════════
export interface Order {
  id: string;
  name: string;
  email: string;
  serviceId: string;
  serviceName: string;
  description: string;
  budget?: string;
  timeline?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER TYPE
// ═══════════════════════════════════════════════════════════════════════════
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// LEGACY TYPES - For backward compatibility (deprecated)
// ═══════════════════════════════════════════════════════════════════════════

/** @deprecated Use SEOData instead */
export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

/** @deprecated Use SEOData instead */
export interface ComprehensiveSEO {
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  schemaType?: string;
  robotsMeta?: {
    index?: boolean;
    follow?: boolean;
    maxImagePreview?: 'none' | 'standard' | 'large';
  };
  twitterCard?: {
    title?: string;
    description?: string;
    image?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
}
