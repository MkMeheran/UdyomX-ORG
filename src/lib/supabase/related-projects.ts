/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RELATED PROJECTS API - Related project relationships
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { Project } from '@/types';

export type RelatedProjectRow = Tables<'related_projects'>;
export type RelatedProjectInsert = InsertTables<'related_projects'>;
export type RelatedProjectUpdate = UpdateTables<'related_projects'>;

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

export const relatedProjectsAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL RELATED PROJECTS FOR A PROJECT
  // ═══════════════════════════════════════════════════════════════════════════
  async getByProject(projectId: string): Promise<Project[]> {
    const { data, error } = await getClient()
      .from('related_projects')
      .select(`
        related_project_id,
        sort_order,
        projects:related_project_id (*)
      `)
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    // Extract project data from join
    return (data || [])
      .filter(row => row.projects)
      .map(row => {
        const p = row.projects as any;
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          thumbnail: p.thumbnail,
          coverImage: p.cover_image,
          description: p.description,
          category: p.category,
          techStack: p.tech_stack,
          liveLink: p.live_link,
          repoLink: p.repo_link,
          featured: p.featured,
          projectStatus: p.project_status,
          progress: p.progress,
          clientInfo: p.client_info,
          status: p.status,
          publishDate: p.publish_date,
        } as Project;
      });
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GET RELATED PROJECT IDS ONLY
  // ═══════════════════════════════════════════════════════════════════════════
  async getRelatedIds(projectId: string): Promise<string[]> {
    const { data, error } = await getClient()
      .from('related_projects')
      .select('related_project_id')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(row => row.related_project_id);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD RELATED PROJECT
  // ═══════════════════════════════════════════════════════════════════════════
  async add(projectId: string, relatedProjectId: string, order: number = 0): Promise<void> {
    const { error } = await getClient()
      .from('related_projects')
      .insert({
        project_id: projectId,
        related_project_id: relatedProjectId,
        sort_order: order,
      });

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REMOVE RELATED PROJECT
  // ═══════════════════════════════════════════════════════════════════════════
  async remove(projectId: string, relatedProjectId: string): Promise<void> {
    const { error } = await getClient()
      .from('related_projects')
      .delete()
      .eq('project_id', projectId)
      .eq('related_project_id', relatedProjectId);

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REPLACE ALL RELATED PROJECTS (Delete all & insert new)
  // ═══════════════════════════════════════════════════════════════════════════
  async replaceAll(projectId: string, relatedProjectIds: string[]): Promise<void> {
    // Delete existing
    await getClient()
      .from('related_projects')
      .delete()
      .eq('project_id', projectId);

    if (relatedProjectIds.length === 0) return;

    // Insert new relationships
    const insertData = relatedProjectIds.map((relatedId, index) => ({
      project_id: projectId,
      related_project_id: relatedId,
      sort_order: index,
    }));

    const { error } = await getClient()
      .from('related_projects')
      .insert(insertData);

    if (error) throw error;
  },
};

export default relatedProjectsAPI;
