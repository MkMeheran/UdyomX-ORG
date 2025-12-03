/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GALLERY API - Gallery items for posts/projects/services
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { GalleryItem } from '@/types/common';

export type GalleryRow = Tables<'gallery'>;
export type GalleryInsert = InsertTables<'gallery'>;
export type GalleryUpdate = UpdateTables<'gallery'>;
export type ParentType = 'post' | 'project' | 'service';

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

// Convert DB row to GalleryItem type
function toAppType(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    url: row.url,
    type: row.type,
    alt: row.alt || undefined,
    caption: row.caption || undefined,
    thumbnail: row.thumbnail || undefined,
    order: row.sort_order,
  };
}

// Convert GalleryItem to DB row
function toDbType(item: GalleryItem, parentId: string, parentType: ParentType): GalleryInsert {
  return {
    parent_id: parentId,
    parent_type: parentType,
    url: item.url,
    type: item.type || 'image',
    alt: item.alt || null,
    caption: item.caption || null,
    thumbnail: item.thumbnail || null,
    sort_order: item.order || 0,
  };
}

export const galleryAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL GALLERY ITEMS FOR A PARENT
  // ═══════════════════════════════════════════════════════════════════════════
  async getByParent(parentId: string, parentType: ParentType): Promise<GalleryItem[]> {
    const { data, error } = await getClient()
      .from('gallery')
      .select('*')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(toAppType);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD GALLERY ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async add(item: GalleryItem, parentId: string, parentType: ParentType): Promise<GalleryItem> {
    const dbData = toDbType(item, parentId, parentType);
    
    const { data, error } = await getClient()
      .from('gallery')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE GALLERY ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const updateData: GalleryUpdate = {
      url: item.url,
      type: item.type,
      alt: item.alt || null,
      caption: item.caption || null,
      thumbnail: item.thumbnail || null,
      sort_order: item.order,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof GalleryUpdate] === undefined) {
        delete updateData[key as keyof GalleryUpdate];
      }
    });

    const { data, error } = await getClient()
      .from('gallery')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE GALLERY ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string): Promise<void> {
    const { error } = await getClient()
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REPLACE ALL GALLERY ITEMS (Delete all & insert new)
  // ═══════════════════════════════════════════════════════════════════════════
  async replaceAll(
    parentId: string,
    parentType: ParentType,
    items: GalleryItem[]
  ): Promise<GalleryItem[]> {
    // Delete existing
    await getClient()
      .from('gallery')
      .delete()
      .eq('parent_id', parentId)
      .eq('parent_type', parentType);

    if (items.length === 0) return [];

    // Insert new items
    const dbItems = items.map((item, index) => ({
      ...toDbType(item, parentId, parentType),
      sort_order: item.order ?? index,
    }));

    const { data, error } = await getClient()
      .from('gallery')
      .insert(dbItems)
      .select();

    if (error) throw error;
    return (data || []).map(toAppType);
  },
};

export default galleryAPI;
