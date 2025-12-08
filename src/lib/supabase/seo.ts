/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SEO API - SEO metadata for posts/projects/services
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { SEOData } from '@/types/common';

export type SEORow = Tables<'seo'>;
export type SEOInsert = InsertTables<'seo'>;
export type SEOUpdate = UpdateTables<'seo'>;
export type ParentType = 'post' | 'project' | 'service';

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

// Convert DB row to SEOData type
function toAppType(row: SEORow): SEOData {
  return {
    seoTitle: row.title || undefined,
    metaDescription: row.description || undefined,
    secondaryKeywords: row.keywords || undefined,
    canonicalUrl: row.canonical_url || undefined,
    openGraph: row.og_image ? { image: row.og_image } : undefined,
    robotsMeta: {
      index: row.robots_index,
      follow: row.robots_follow,
    },
  };
}

// Convert SEOData to DB row
function toDbType(seo: SEOData, parentId: string, parentType: ParentType): SEOInsert {
  return {
    parent_id: parentId,
    parent_type: parentType,
    title: seo.seoTitle || null,
    description: seo.metaDescription || null,
    keywords: seo.secondaryKeywords || null,
    og_image: seo.openGraph?.image || null,
    canonical_url: seo.canonicalUrl || null,
    robots_index: seo.robotsMeta?.index ?? true,
    robots_follow: seo.robotsMeta?.follow ?? true,
  };
}

export const seoAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET SEO FOR A PARENT
  // ═══════════════════════════════════════════════════════════════════════════
  async getByParent(parentId: string, parentType: ParentType): Promise<SEOData | null> {
    const { data, error } = await getClient()
      .from('seo')
      .select('*')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data ? toAppType(data) : null;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE OR UPDATE SEO (Upsert)
  // ═══════════════════════════════════════════════════════════════════════════
  async upsert(parentId: string, parentType: ParentType, seo: SEOData): Promise<SEOData> {
    const dbData = toDbType(seo, parentId, parentType);
    
    // Check if exists
    const { data: existing } = await getClient()
      .from('seo')
      .select('id')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .single();

    if (existing) {
      // Update
      const { data, error } = await getClient()
        .from('seo')
        .update({ ...dbData, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return toAppType(data);
    } else {
      // Insert
      const { data, error } = await getClient()
        .from('seo')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;
      return toAppType(data);
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE SEO
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(parentId: string, parentType: ParentType): Promise<void> {
    const { error } = await getClient()
      .from('seo')
      .delete()
      .eq('parent_id', parentId)
      .eq('parent_type', parentType);

    if (error) throw error;
  },
};

export default seoAPI;
