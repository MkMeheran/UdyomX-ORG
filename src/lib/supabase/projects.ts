/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECTS API - CRUD operations for projects table
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { Project } from '@/types';

export type ProjectRow = Tables<'projects'>;
export type ProjectInsert = InsertTables<'projects'>;
export type ProjectUpdate = UpdateTables<'projects'>;

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

// Convert DB row to Project type
function toAppType(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    title: row.name, // Alias
    slug: row.slug,
    thumbnail: row.thumbnail || undefined,
    coverImage: row.cover_image || undefined,
    images: row.thumbnail ? [row.thumbnail] : undefined, // Legacy support
    description: row.description,
    excerpt: row.description, // Alias
    content: '', // Content loaded separately
    category: row.category || undefined,
    techStack: row.tech_stack || undefined,
    liveLink: row.live_link || undefined,
    repoLink: row.repo_link || undefined,
    featured: row.featured,
    projectStatus: row.project_status,
    status: row.status,
    progress: row.progress || undefined,
    clientInfo: row.client_info || undefined,
    publishDate: row.publish_date,
    updatedAt: row.updated_at,
  };
}

// Convert app type to DB row
function toDbType(project: Partial<Project>): ProjectInsert | ProjectUpdate {
  return {
    name: project.name || project.title,
    slug: project.slug,
    thumbnail: project.thumbnail || project.coverImage || project.images?.[0] || null,
    cover_image: project.coverImage || project.thumbnail || null,
    description: project.description || project.excerpt || '',
    category: project.category || null,
    tech_stack: project.techStack || null,
    live_link: project.liveLink || null,
    repo_link: project.repoLink || null,
    featured: project.featured || false,
    project_status: project.projectStatus || 'completed',
    status: project.status || 'draft',
    progress: project.progress || null,
    client_info: project.clientInfo || null,
    publish_date: project.publishDate || new Date().toISOString(),
  };
}

export const projectsAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL PROJECTS
  // ═══════════════════════════════════════════════════════════════════════════
  async getAll(options?: { status?: 'draft' | 'published' }): Promise<Project[]> {
    let query = getClient()
      .from('projects')
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
  // GET LIGHT DATA (for cards)
  // ═══════════════════════════════════════════════════════════════════════════
  async getAllLight(options?: { status?: 'draft' | 'published' }) {
    let query = getClient()
      .from('projects')
      .select('id, slug, name, description, thumbnail, tech_stack, featured, project_status')
      .order('publish_date', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      thumbnail: row.thumbnail,
      techStack: row.tech_stack,
      featured: row.featured,
      status: row.project_status,
    }));
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET BY SLUG
  // ═══════════════════════════════════════════════════════════════════════════
  async getBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await getClient()
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? toAppType(data) : null;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET BY ID
  // ═══════════════════════════════════════════════════════════════════════════
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await getClient()
      .from('projects')
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
  // CREATE PROJECT
  // ═══════════════════════════════════════════════════════════════════════════
  async create(project: Partial<Project>): Promise<Project> {
    const dbData = toDbType(project) as ProjectInsert;
    
    const { data, error } = await getClient()
      .from('projects')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE PROJECT
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, project: Partial<Project>): Promise<Project> {
    const dbData = toDbType(project);
    
    const { data, error } = await getClient()
      .from('projects')
      .update({ ...dbData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE PROJECT
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string): Promise<void> {
    const { error } = await getClient()
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET FEATURED PROJECTS
  // ═══════════════════════════════════════════════════════════════════════════
  async getFeatured(): Promise<Project[]> {
    const { data, error } = await getClient()
      .from('projects')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('publish_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(toAppType);
  },
};

export default projectsAPI;
