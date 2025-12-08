/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATA API - Unified data layer (Direct Supabase)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BlogPost, Project, Service, Order } from '@/types';
import type { GalleryItem, DownloadItem, FAQItem, RecommendedItem, SEOData } from '@/types/common';
import { db } from './supabase';

// ═══════════════════════════════════════════════════════════════════════════
// SUPABASE API (direct import - better tree shaking)
// ═══════════════════════════════════════════════════════════════════════════
const getSupabaseAPI = () => db;

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL API HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}/api`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOG API
// ═══════════════════════════════════════════════════════════════════════════
export const blogAPI = {
  /**
   * Get all blogs (full data)
   */
  getAll: (): Promise<BlogPost[]> => {
    return db.posts.getAll({ status: 'published' });
  },
  
  /**
   * Get all blogs for admin (all statuses)
   */
  getAllAdmin: (): Promise<BlogPost[]> => {
    return db.posts.getAll();
  },
  
  /**
   * Get all blogs for cards (light data - faster)
   */
  getAllForCards: async (): Promise<Partial<BlogPost>[]> => {
    const light = await db.posts.getAllLight({ status: 'published' });
    return light.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      thumbnail: p.thumbnail,
      category: p.category,
      publishDate: p.publishDate,
      readTime: p.readTime,
      author: p.author,
    }));
  },

  /**
   * Get single blog by ID
   */
  getOne: async (id: string): Promise<BlogPost | undefined> => {
    const post = await db.posts.getById(id);
    return post || undefined;
  },
  
  /**
   * Get single blog by slug (with full data including content, gallery, etc.)
   */
  getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    const fullPost = await db.getFullPost(slug);
    if (!fullPost) return undefined;
    
    // Convert FullPost to BlogPost
    return {
      ...fullPost,
      gallery: fullPost.gallery,
      downloads: fullPost.downloads,
      faqs: fullPost.faqs,
      recommended: fullPost.recommended,
      seo: fullPost.seo || undefined,
    };
  },
  
  /**
   * Create new blog
   */
  create: async (data: Partial<BlogPost>): Promise<BlogPost> => {
    const post = await db.posts.create(data);
    
    // Save related data if provided
    if (data.content) {
      await db.contents.upsert(post.id, 'post', data.content, data.contentFormat || 'markdown');
    }
    if (data.gallery && data.gallery.length > 0) {
      await db.gallery.replaceAll(post.id, 'post', data.gallery);
    }
    if (data.downloads && data.downloads.length > 0) {
      await db.downloads.replaceAll(post.id, 'post', data.downloads);
    }
    if (data.faqs && data.faqs.length > 0) {
      await db.faqs.replaceAll(post.id, 'post', data.faqs);
    }
    if (data.recommended && data.recommended.length > 0) {
      await db.recommended.replaceAll(post.id, 'post', data.recommended);
    }
    if (data.seo) {
      await db.seo.upsert(post.id, 'post', data.seo);
    }
    
    return { ...post, ...data };
  },
  
  /**
   * Update blog
   */
  update: async (id: string, data: Partial<BlogPost>): Promise<BlogPost> => {
    // Save all data with better error handling
    const result = await db.saveFullPost(id, {
      post: data,
      content: data.content,
      contentFormat: data.contentFormat,
      gallery: data.gallery,
      downloads: data.downloads,
      faqs: data.faqs,
      recommended: data.recommended,
      seo: data.seo,
    });
    
    if (!result.success) {
      console.warn('Some data failed to save:', result.errors);
    }
    
    const updated = await db.posts.getById(id);
    return updated || ({ ...data, id } as BlogPost);
  },
  
  /**
   * Delete blog
   */
  delete: (id: string): Promise<void> => db.deletePost(id),
};

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT API
// ═══════════════════════════════════════════════════════════════════════════
export const projectAPI = {
  /**
   * Get all projects (full data - published only)
   */
  getAll: (): Promise<Project[]> => db.projects.getAll({ status: 'published' }),
  
  /**
   * Get all projects for admin (all statuses)
   */
  getAllAdmin: (): Promise<Project[]> => db.projects.getAll(),
  
  /**
   * Get all projects for cards (light data)
   */
  getAllForCards: async (): Promise<Partial<Project>[]> => {
    const light = await db.projects.getAllLight({ status: 'published' });
    return light.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      thumbnail: p.thumbnail,
      techStack: p.techStack,
      featured: p.featured,
      status: p.status,
    }));
  },

  /**
   * Get single project by ID
   */
  getOne: async (id: string): Promise<Project | undefined> => {
    const project = await db.projects.getById(id);
    return project || undefined;
  },
  
  /**
   * Get single project by slug (with full data)
   */
  getBySlug: async (slug: string): Promise<Project | undefined> => {
    const fullProject = await db.getFullProject(slug);
    if (!fullProject) return undefined;
    
    return {
      ...fullProject,
      gallery: fullProject.gallery,
      downloads: fullProject.downloads,
      faqs: fullProject.faqs,
      recommended: fullProject.recommended,
      seo: fullProject.seo || undefined,
    };
  },
  
  /**
   * Create new project
   */
  create: async (data: Partial<Project>): Promise<Project> => {
    const project = await db.projects.create(data);
    
    // Save related data
    if (data.content) {
      await db.contents.upsert(project.id, 'project', data.content, data.contentFormat || 'markdown');
    }
    if (data.gallery && data.gallery.length > 0) {
      await db.gallery.replaceAll(project.id, 'project', data.gallery);
    }
    if (data.downloads && data.downloads.length > 0) {
      await db.downloads.replaceAll(project.id, 'project', data.downloads);
    }
    if (data.faqs && data.faqs.length > 0) {
      await db.faqs.replaceAll(project.id, 'project', data.faqs);
    }
    if (data.recommended && data.recommended.length > 0) {
      await db.recommended.replaceAll(project.id, 'project', data.recommended);
    }
    if (data.seo) {
      await db.seo.upsert(project.id, 'project', data.seo);
    }
    
    return { ...project, ...data };
  },
  
  /**
   * Update project
   */
  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    const result = await db.saveFullProject(id, {
      project: data,
      content: data.content,
      contentFormat: data.contentFormat,
      gallery: data.gallery,
      downloads: data.downloads,
      faqs: data.faqs,
      recommended: data.recommended,
      seo: data.seo,
    });
    
    if (!result.success) {
      console.warn('Some project data failed to save:', result.errors);
    }
    
    const updated = await db.projects.getById(id);
    return updated || ({ ...data, id } as Project);
  },
  
  /**
   * Delete project
   */
  delete: (id: string): Promise<void> => db.deleteProject(id),
  
  /**
   * Get featured projects
   */
  getFeatured: (): Promise<Project[]> => db.projects.getFeatured(),
};

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE API - Direct Supabase (optimized, no HTTP round-trip)
// ═══════════════════════════════════════════════════════════════════════════
import { supabase } from './supabase';

export const serviceAPI = {
  getAll: async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('serviceAPI.getAll error:', error);
      return [];
    }
    return (data || []).map(transformService);
  },
  
  getAllForAdmin: async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('serviceAPI.getAllForAdmin error:', error);
      return [];
    }
    return (data || []).map(transformService);
  },
  
  getBySlug: async (slug: string): Promise<Service | undefined> => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_features (*),
        service_packages (*),
        service_problems (*),
        service_solutions (*),
        service_testimonials (*),
        service_gallery (*),
        service_downloads (*),
        service_faqs (*)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('serviceAPI.getBySlug error:', error);
      return undefined;
    }
    return data ? transformServiceFull(data) : undefined;
  },
  
  create: async (data: Partial<Service>): Promise<Service> => {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create service');
    return response.json();
  },
  
  update: async (slug: string, data: Partial<Service>): Promise<Service> => {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/services/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(errorData.error || 'Failed to update service');
      error.details = errorData.details;
      error.code = errorData.code;
      throw error;
    }
    return response.json();
  },
  
  delete: async (slug: string): Promise<void> => {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/services/${slug}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete service');
  },
};

// Transform snake_case DB row to camelCase Service
function transformService(row: any): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    hookLine: row.hook_line,
    description: row.description,
    category: row.category,
    thumbnail: row.thumbnail,
    coverImage: row.cover_image,
    status: row.status,
    publishDate: row.publish_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as Service;
}

// Transform full service with relations
function transformServiceFull(row: any): Service {
  return {
    ...transformService(row),
    showGallery: row.show_gallery ?? false,
    showDownloads: row.show_downloads ?? false,
    features: (row.service_features || []).map((f: any) => ({
      id: f.id,
      icon: f.icon,
      title: f.title,
      description: f.description,
      orderIndex: f.order_index
    })),
    packages: (row.service_packages || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      discountPrice: p.discount_price,
      features: p.features || [],
      deliveryTime: p.delivery_time,
      revisions: p.revisions,
      isPopular: p.is_popular,
      orderIndex: p.order_index
    })),
    problems: (row.service_problems || []).map((p: any) => ({
      id: p.id,
      text: p.text,
      orderIndex: p.order_index
    })),
    solutions: (row.service_solutions || []).map((s: any) => ({
      id: s.id,
      text: s.text,
      orderIndex: s.order_index
    })),
    testimonials: (row.service_testimonials || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      rating: t.rating,
      quote: t.quote,
      orderIndex: t.order_index
    })),
    gallery: (row.service_gallery || []).map((g: any) => ({
      id: g.id,
      type: g.type,
      url: g.url,
      thumbnailUrl: g.thumbnail_url,
      caption: g.caption,
      orderIndex: g.order_index
    })),
    downloads: (row.service_downloads || []).map((d: any) => ({
      id: d.id,
      fileUrl: d.file_url,
      label: d.label,
      fileSize: d.file_size,
      fileType: d.file_type,
      orderIndex: d.order_index
    })),
    faqs: (row.service_faqs || []).map((f: any) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      orderIndex: f.order_index
    })),
  } as Service;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORDER API (placeholder)
// ═══════════════════════════════════════════════════════════════════════════
export const orderAPI = {
  getAll: async (): Promise<Order[]> => {
    return [];
  },
  
  create: async (data: Partial<Order>): Promise<Order> => {
    return { ...data, id: `order-${Date.now()}` } as Order;
  },
  
  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    return { ...data, id } as Order;
  },
};

// Default export for backward compatibility
export default { blogAPI, projectAPI, serviceAPI, orderAPI };
