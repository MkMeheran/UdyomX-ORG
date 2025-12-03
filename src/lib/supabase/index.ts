/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUPABASE API INDEX - Unified export for all Supabase operations
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Usage:
 *   import { db } from '@/lib/supabase';
 *   
 *   // Posts
 *   const posts = await db.posts.getAll();
 *   const post = await db.posts.getBySlug('my-post');
 *   
 *   // Projects
 *   const projects = await db.projects.getAll();
 *   
 *   // Content (for a post)
 *   const content = await db.contents.getByParent(postId, 'post');
 *   
 *   // Gallery
 *   const gallery = await db.gallery.getByParent(postId, 'post');
 *   
 *   // Full post with all data
 *   const fullPost = await db.getFullPost('my-post');
 */

// Re-export client
export { supabase } from './client';
export { createServerClient, getServerClient } from './server';

// Re-export types
export type { Database, Tables, InsertTables, UpdateTables } from './database.types';

// Import APIs
import { postsAPI } from './posts';
import { projectsAPI } from './projects';
import { contentsAPI } from './contents';
import { galleryAPI } from './gallery';
import { downloadsAPI } from './downloads';
import { faqsAPI } from './faqs';
import { recommendedAPI } from './recommended';
import { relatedProjectsAPI } from './related-projects';
import { seoAPI } from './seo';

// Re-export individual APIs
export { postsAPI } from './posts';
export { projectsAPI } from './projects';
export { contentsAPI } from './contents';
export { galleryAPI } from './gallery';
export { downloadsAPI } from './downloads';
export { faqsAPI } from './faqs';
export { recommendedAPI } from './recommended';
export { relatedProjectsAPI } from './related-projects';
export { seoAPI } from './seo';

// Types
import type { BlogPost, Project } from '@/types';
import type { GalleryItem, DownloadItem, FAQItem, RecommendedItem, SEOData } from '@/types/common';

// ═══════════════════════════════════════════════════════════════════════════
// FULL POST TYPE - Post with all related data
// ═══════════════════════════════════════════════════════════════════════════
export interface FullPost extends BlogPost {
  gallery: GalleryItem[];
  downloads: DownloadItem[];
  faqs: FAQItem[];
  recommended: RecommendedItem[];
  seo: SEOData | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL PROJECT TYPE - Project with all related data
// ═══════════════════════════════════════════════════════════════════════════
export interface FullProject extends Project {
  gallery: GalleryItem[];
  downloads: DownloadItem[];
  faqs: FAQItem[];
  recommended: RecommendedItem[];
  relatedProjects: Project[];
  seo: SEOData | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED DATABASE API
// ═══════════════════════════════════════════════════════════════════════════
export const db = {
  posts: postsAPI,
  projects: projectsAPI,
  contents: contentsAPI,
  gallery: galleryAPI,
  downloads: downloadsAPI,
  faqs: faqsAPI,
  recommended: recommendedAPI,
  relatedProjects: relatedProjectsAPI,
  seo: seoAPI,

  // ═══════════════════════════════════════════════════════════════════════════
  // GET FULL POST (with all related data)
  // ═══════════════════════════════════════════════════════════════════════════
  async getFullPost(slug: string): Promise<FullPost | null> {
    const post = await postsAPI.getBySlug(slug);
    if (!post) return null;

    // Fetch all related data in parallel
    const [content, gallery, downloads, faqs, recommended, seo] = await Promise.all([
      contentsAPI.getByParent(post.id, 'post'),
      galleryAPI.getByParent(post.id, 'post'),
      downloadsAPI.getByParent(post.id, 'post'),
      faqsAPI.getByParent(post.id, 'post'),
      recommendedAPI.getByParent(post.id, 'post'),
      seoAPI.getByParent(post.id, 'post'),
    ]);

    return {
      ...post,
      content: content?.content || '',
      contentFormat: content?.contentFormat || 'markdown',
      gallery,
      downloads,
      faqs,
      recommended,
      seo,
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET FULL PROJECT (with all related data)
  // ═══════════════════════════════════════════════════════════════════════════
  async getFullProject(slug: string): Promise<FullProject | null> {
    const project = await projectsAPI.getBySlug(slug);
    if (!project) return null;

    // Fetch all related data in parallel
    const [content, gallery, downloads, faqs, recommended, relatedProjects, seo] = await Promise.all([
      contentsAPI.getByParent(project.id, 'project'),
      galleryAPI.getByParent(project.id, 'project'),
      downloadsAPI.getByParent(project.id, 'project'),
      faqsAPI.getByParent(project.id, 'project'),
      recommendedAPI.getByParent(project.id, 'project'),
      relatedProjectsAPI.getByProject(project.id),
      seoAPI.getByParent(project.id, 'project'),
    ]);

    return {
      ...project,
      content: content?.content || '',
      contentFormat: content?.contentFormat || 'markdown',
      gallery,
      downloads,
      faqs,
      recommended,
      relatedProjects,
      seo,
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SAVE FULL POST (post + all related data)
  // ═══════════════════════════════════════════════════════════════════════════
  async saveFullPost(
    postId: string,
    data: {
      post?: Partial<BlogPost>;
      content?: string;
      contentFormat?: 'markdown' | 'mdx' | 'html';
      gallery?: GalleryItem[];
      downloads?: DownloadItem[];
      faqs?: FAQItem[];
      recommended?: RecommendedItem[];
      seo?: SEOData;
    }
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Save post first (required)
    if (data.post) {
      try {
        await postsAPI.update(postId, data.post);
      } catch (error: any) {
        errors.push(`Post update failed: ${error.message}`);
        console.error('Post update error:', error);
      }
    }

    // Save related data - continue even if some fail
    if (data.content !== undefined) {
      try {
        await contentsAPI.upsert(postId, 'post', data.content, data.contentFormat || 'markdown');
      } catch (error: any) {
        errors.push(`Content save failed: ${error.message}`);
        console.error('Content save error:', error);
      }
    }

    if (data.gallery && data.gallery.length > 0) {
      try {
        await galleryAPI.replaceAll(postId, 'post', data.gallery);
      } catch (error: any) {
        errors.push(`Gallery save failed: ${error.message}`);
        console.error('Gallery save error:', error);
      }
    }

    if (data.downloads && data.downloads.length > 0) {
      try {
        await downloadsAPI.replaceAll(postId, 'post', data.downloads);
      } catch (error: any) {
        errors.push(`Downloads save failed: ${error.message}`);
        console.error('Downloads save error:', error);
      }
    }

    if (data.faqs && data.faqs.length > 0) {
      try {
        await faqsAPI.replaceAll(postId, 'post', data.faqs);
      } catch (error: any) {
        errors.push(`FAQs save failed: ${error.message}`);
        console.error('FAQs save error:', error);
      }
    }

    if (data.recommended && data.recommended.length > 0) {
      try {
        await recommendedAPI.replaceAll(postId, 'post', data.recommended);
      } catch (error: any) {
        errors.push(`Recommended save failed: ${error.message}`);
        console.error('Recommended save error:', error);
      }
    }

    if (data.seo) {
      try {
        await seoAPI.upsert(postId, 'post', data.seo);
      } catch (error: any) {
        errors.push(`SEO save failed: ${error.message}`);
        console.error('SEO save error:', error);
      }
    }

    return { success: errors.length === 0, errors };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SAVE FULL PROJECT (project + all related data)
  // ═══════════════════════════════════════════════════════════════════════════
  async saveFullProject(
    projectId: string,
    data: {
      project?: Partial<Project>;
      content?: string;
      contentFormat?: 'markdown' | 'mdx' | 'html';
      gallery?: GalleryItem[];
      downloads?: DownloadItem[];
      faqs?: FAQItem[];
      recommended?: RecommendedItem[];
      relatedProjectIds?: string[];
      seo?: SEOData;
    }
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (data.project) {
      try {
        await projectsAPI.update(projectId, data.project);
      } catch (error: any) {
        errors.push(`Project update failed: ${error.message}`);
        console.error('Project update error:', error);
      }
    }

    if (data.content !== undefined) {
      try {
        await contentsAPI.upsert(projectId, 'project', data.content, data.contentFormat || 'markdown');
      } catch (error: any) {
        errors.push(`Content save failed: ${error.message}`);
        console.error('Content save error:', error);
      }
    }

    if (data.gallery && data.gallery.length > 0) {
      try {
        await galleryAPI.replaceAll(projectId, 'project', data.gallery);
      } catch (error: any) {
        errors.push(`Gallery save failed: ${error.message}`);
        console.error('Gallery save error:', error);
      }
    }

    if (data.downloads && data.downloads.length > 0) {
      try {
        await downloadsAPI.replaceAll(projectId, 'project', data.downloads);
      } catch (error: any) {
        errors.push(`Downloads save failed: ${error.message}`);
        console.error('Downloads save error:', error);
      }
    }

    if (data.faqs && data.faqs.length > 0) {
      try {
        await faqsAPI.replaceAll(projectId, 'project', data.faqs);
      } catch (error: any) {
        errors.push(`FAQs save failed: ${error.message}`);
        console.error('FAQs save error:', error);
      }
    }

    if (data.recommended && data.recommended.length > 0) {
      try {
        await recommendedAPI.replaceAll(projectId, 'project', data.recommended);
      } catch (error: any) {
        errors.push(`Recommended save failed: ${error.message}`);
        console.error('Recommended save error:', error);
      }
    }

    if (data.relatedProjectIds && data.relatedProjectIds.length > 0) {
      try {
        await relatedProjectsAPI.replaceAll(projectId, data.relatedProjectIds);
      } catch (error: any) {
        errors.push(`Related projects save failed: ${error.message}`);
        console.error('Related projects save error:', error);
      }
    }

    if (data.seo) {
      try {
        await seoAPI.upsert(projectId, 'project', data.seo);
      } catch (error: any) {
        errors.push(`SEO save failed: ${error.message}`);
        console.error('SEO save error:', error);
      }
    }

    return { success: errors.length === 0, errors };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE POST WITH ALL DATA
  // ═══════════════════════════════════════════════════════════════════════════
  async deletePost(postId: string): Promise<void> {
    // Delete all related data first
    await Promise.all([
      contentsAPI.delete(postId, 'post'),
      galleryAPI.replaceAll(postId, 'post', []),
      downloadsAPI.replaceAll(postId, 'post', []),
      faqsAPI.replaceAll(postId, 'post', []),
      recommendedAPI.replaceAll(postId, 'post', []),
      seoAPI.delete(postId, 'post'),
    ]);

    // Delete the post
    await postsAPI.delete(postId);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE PROJECT WITH ALL DATA
  // ═══════════════════════════════════════════════════════════════════════════
  async deleteProject(projectId: string): Promise<void> {
    // Delete all related data first
    await Promise.all([
      contentsAPI.delete(projectId, 'project'),
      galleryAPI.replaceAll(projectId, 'project', []),
      downloadsAPI.replaceAll(projectId, 'project', []),
      faqsAPI.replaceAll(projectId, 'project', []),
      recommendedAPI.replaceAll(projectId, 'project', []),
      relatedProjectsAPI.replaceAll(projectId, []),
      seoAPI.delete(projectId, 'project'),
    ]);

    // Delete the project
    await projectsAPI.delete(projectId);
  },
};

export default db;
