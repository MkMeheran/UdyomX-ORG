/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOWNLOADS API - Download items for posts/projects/services
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { DownloadItem } from '@/types/common';

export type DownloadRow = Tables<'downloads'>;
export type DownloadInsert = InsertTables<'downloads'>;
export type DownloadUpdate = UpdateTables<'downloads'>;
export type ParentType = 'post' | 'project' | 'service';

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

// Convert DB row to DownloadItem type
function toAppType(row: DownloadRow): DownloadItem {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    fileSize: row.file_size || undefined,
    fileType: row.file_type || undefined,
    description: row.description || undefined,
    isPremium: row.is_premium,
    downloadCount: row.download_count,
  };
}

// Convert DownloadItem to DB row
function toDbType(item: DownloadItem, parentId: string, parentType: ParentType): DownloadInsert {
  return {
    parent_id: parentId,
    parent_type: parentType,
    title: item.title,
    url: item.url,
    file_size: item.fileSize || null,
    file_type: item.fileType || null,
    description: item.description || null,
    is_premium: item.isPremium || false,
    download_count: item.downloadCount || 0,
    sort_order: 0,
  };
}

export const downloadsAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL DOWNLOADS FOR A PARENT
  // ═══════════════════════════════════════════════════════════════════════════
  async getByParent(parentId: string, parentType: ParentType): Promise<DownloadItem[]> {
    const { data, error } = await getClient()
      .from('downloads')
      .select('*')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(toAppType);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD DOWNLOAD ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async add(item: DownloadItem, parentId: string, parentType: ParentType): Promise<DownloadItem> {
    const dbData = toDbType(item, parentId, parentType);
    
    const { data, error } = await getClient()
      .from('downloads')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE DOWNLOAD ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, item: Partial<DownloadItem>): Promise<DownloadItem> {
    const updateData: DownloadUpdate = {
      title: item.title,
      url: item.url,
      file_size: item.fileSize || null,
      file_type: item.fileType || null,
      description: item.description || null,
      is_premium: item.isPremium,
      download_count: item.downloadCount,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof DownloadUpdate] === undefined) {
        delete updateData[key as keyof DownloadUpdate];
      }
    });

    const { data, error } = await getClient()
      .from('downloads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE DOWNLOAD ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string): Promise<void> {
    const { error } = await getClient()
      .from('downloads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REPLACE ALL DOWNLOADS (Delete all & insert new)
  // ═══════════════════════════════════════════════════════════════════════════
  async replaceAll(
    parentId: string,
    parentType: ParentType,
    items: DownloadItem[]
  ): Promise<DownloadItem[]> {
    // Delete existing
    await getClient()
      .from('downloads')
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
      .from('downloads')
      .insert(dbItems)
      .select();

    if (error) throw error;
    return (data || []).map(toAppType);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INCREMENT DOWNLOAD COUNT
  // ═══════════════════════════════════════════════════════════════════════════
  async incrementDownloadCount(id: string): Promise<void> {
    const { error } = await getClient().rpc('increment_download_count', { download_id: id });
    if (error) {
      // Fallback: manual increment if RPC not available
      const { data: current } = await getClient()
        .from('downloads')
        .select('download_count')
        .eq('id', id)
        .single();
      
      if (current) {
        await getClient()
          .from('downloads')
          .update({ download_count: (current.download_count || 0) + 1 })
          .eq('id', id);
      }
    }
  },
};

export default downloadsAPI;
