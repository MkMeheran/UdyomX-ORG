/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POSTS API - CRUD operations for posts table
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { BlogPost } from '@/types';

export type PostRow = Tables<'posts'>;
export type PostInsert = InsertTables<'posts'>;
export type PostUpdate = UpdateTables<'posts'>;

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

// Convert DB row to BlogPost type
function toAppType(row: PostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    thumbnail: row.thumbnail || undefined,
    coverImage: row.cover_image || undefined,
    excerpt: row.excerpt,
    content: '', // Content is loaded separately
    category: row.category,
    tags: row.tags || undefined,
    author: row.author || undefined,
    authorAvatar: row.author_avatar || undefined,
    readTime: row.read_time || undefined,
    isPremium: row.is_premium,
    layout: (row.layout as 'standard' | 'research') || 'standard',
    status: row.status,
    publishDate: row.publish_date,
    publishedAt: row.publish_date,
    updatedAt: row.updated_at,
  };
}

// Convert app type to DB row
function toDbType(post: Partial<BlogPost>): PostInsert | PostUpdate {
  return {
    title: post.title,
    slug: post.slug,
    thumbnail: post.thumbnail || post.coverImage || null,
    cover_image: post.coverImage || post.thumbnail || null,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags || null,
    author: post.author || null,
    author_avatar: post.authorAvatar || null,
    read_time: post.readTime || null,
    is_premium: post.isPremium || false,
    layout: post.layout || 'standard',
    status: post.status || 'draft',
    publish_date: post.publishDate || post.publishedAt || new Date().toISOString(),
  };
}

export const postsAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL POSTS (light - for listing)
  // ═══════════════════════════════════════════════════════════════════════════
  async getAll(options?: { status?: 'draft' | 'published' }): Promise<BlogPost[]> {
    let query = getClient()
      .from('posts')
      .select('*')
      .order('publish_date', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(toAppType);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET LIGHT DATA (for cards - minimal fields)
  // ═══════════════════════════════════════════════════════════════════════════
  async getAllLight(options?: { status?: 'draft' | 'published' }) {
    let query = getClient()
      .from('posts')
      .select('id, slug, title, excerpt, thumbnail, cover_image, category, publish_date, read_time, author')
      .order('publish_date', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      thumbnail: row.thumbnail || row.cover_image,
      category: row.category,
      publishDate: row.publish_date,
      readTime: row.read_time,
      author: row.author,
    }));
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET BY SLUG
  // ═══════════════════════════════════════════════════════════════════════════
  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await getClient()
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data ? toAppType(data) : null;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET BY ID
  // ═══════════════════════════════════════════════════════════════════════════
  async getById(id: string): Promise<BlogPost | null> {
    const { data, error } = await getClient()
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? toAppType(data) : null;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE POST
  // ═══════════════════════════════════════════════════════════════════════════
  async create(post: Partial<BlogPost>): Promise<BlogPost> {
    const dbData = toDbType(post) as PostInsert;
    
    const { data, error } = await getClient()
      .from('posts')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE POST
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    const dbData = toDbType(post);
    
    const { data, error } = await getClient()
      .from('posts')
      .update({ ...dbData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE POST
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string): Promise<void> {
    const { error } = await getClient()
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET BY CATEGORY
  // ═══════════════════════════════════════════════════════════════════════════
  async getByCategory(category: string): Promise<BlogPost[]> {
    const { data, error } = await getClient()
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('publish_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(toAppType);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH POSTS
  // ═══════════════════════════════════════════════════════════════════════════
  async search(query: string): Promise<BlogPost[]> {
    const { data, error } = await getClient()
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('publish_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(toAppType);
  },
};

export default postsAPI;
