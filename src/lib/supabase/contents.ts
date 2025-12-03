/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTENTS API - Content for posts/projects/services
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { ContentFormat } from '@/types/common';

export type ContentRow = Tables<'contents'>;
export type ContentInsert = InsertTables<'contents'>;
export type ContentUpdate = UpdateTables<'contents'>;
export type ParentType = 'post' | 'project' | 'service';

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

export interface ContentItem {
  id: string;
  parentId: string;
  parentType: ParentType;
  content: string;
  contentFormat: ContentFormat;
  createdAt: string;
  updatedAt: string;
}

// Convert DB row to app type
function toAppType(row: ContentRow): ContentItem {
  return {
    id: row.id,
    parentId: row.parent_id,
    parentType: row.parent_type,
    content: row.content,
    contentFormat: row.content_format,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const contentsAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET CONTENT BY PARENT
  // ═══════════════════════════════════════════════════════════════════════════
  async getByParent(parentId: string, parentType: ParentType): Promise<ContentItem | null> {
    const { data, error } = await getClient()
      .from('contents')
      .select('*')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? toAppType(data) : null;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE OR UPDATE CONTENT (Upsert)
  // ═══════════════════════════════════════════════════════════════════════════
  async upsert(
    parentId: string,
    parentType: ParentType,
    content: string,
    contentFormat: ContentFormat = 'markdown'
  ): Promise<ContentItem> {
    // Check if content exists
    const existing = await this.getByParent(parentId, parentType);

    if (existing) {
      // Update existing
      const { data, error } = await getClient()
        .from('contents')
        .update({
          content,
          content_format: contentFormat,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return toAppType(data);
    } else {
      // Create new
      const { data, error } = await getClient()
        .from('contents')
        .insert({
          parent_id: parentId,
          parent_type: parentType,
          content,
          content_format: contentFormat,
        })
        .select()
        .single();

      if (error) throw error;
      return toAppType(data);
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE CONTENT
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(parentId: string, parentType: ParentType): Promise<void> {
    const { error } = await getClient()
      .from('contents')
      .delete()
      .eq('parent_id', parentId)
      .eq('parent_type', parentType);

    if (error) throw error;
  },
};

export default contentsAPI;
