/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RECOMMENDED API - Recommended content for posts/projects/services
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { RecommendedItem } from '@/types/common';

export type RecommendedRow = Tables<'recommended'>;
export type RecommendedInsert = InsertTables<'recommended'>;
export type RecommendedUpdate = UpdateTables<'recommended'>;
export type ParentType = 'post' | 'project' | 'service';

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

// Convert DB row to RecommendedItem type
function toAppType(row: RecommendedRow): RecommendedItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug || undefined,
    url: row.url || undefined,
    thumbnail: row.thumbnail || undefined,
    excerpt: row.excerpt || undefined,
  };
}

// Convert RecommendedItem to DB row
function toDbType(item: RecommendedItem, parentId: string, parentType: ParentType): RecommendedInsert {
  return {
    parent_id: parentId,
    parent_type: parentType,
    type: item.type,
    title: item.title,
    slug: item.slug || null,
    url: item.url || null,
    thumbnail: item.thumbnail || null,
    excerpt: item.excerpt || null,
    sort_order: 0,
  };
}

export const recommendedAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL RECOMMENDED FOR A PARENT
  // ═══════════════════════════════════════════════════════════════════════════
  async getByParent(parentId: string, parentType: ParentType): Promise<RecommendedItem[]> {
    const { data, error } = await getClient()
      .from('recommended')
      .select('*')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(toAppType);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD RECOMMENDED ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async add(item: RecommendedItem, parentId: string, parentType: ParentType): Promise<RecommendedItem> {
    const dbData = toDbType(item, parentId, parentType);
    
    const { data, error } = await getClient()
      .from('recommended')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE RECOMMENDED ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, item: Partial<RecommendedItem>): Promise<RecommendedItem> {
    const updateData: RecommendedUpdate = {
      type: item.type,
      title: item.title,
      slug: item.slug || null,
      url: item.url || null,
      thumbnail: item.thumbnail || null,
      excerpt: item.excerpt || null,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof RecommendedUpdate] === undefined) {
        delete updateData[key as keyof RecommendedUpdate];
      }
    });

    const { data, error } = await getClient()
      .from('recommended')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE RECOMMENDED ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string): Promise<void> {
    const { error } = await getClient()
      .from('recommended')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REPLACE ALL RECOMMENDED (Delete all & insert new)
  // ═══════════════════════════════════════════════════════════════════════════
  async replaceAll(
    parentId: string,
    parentType: ParentType,
    items: RecommendedItem[]
  ): Promise<RecommendedItem[]> {
    // Delete existing
    await getClient()
      .from('recommended')
      .delete()
      .eq('parent_id', parentId)
      .eq('parent_type', parentType);

    if (items.length === 0) return [];

    // Insert new items
    const dbItems = items.map((item, index) => ({
      ...toDbType(item, parentId, parentType),
      sort_order: index,
    }));

    const { data, error } = await getClient()
      .from('recommended')
      .insert(dbItems)
      .select();

    if (error) throw error;
    return (data || []).map(toAppType);
  },
};

export default recommendedAPI;
