/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FAQS API - FAQ items for posts/projects/services
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { supabase } from './client';
import { getServerClient } from './server';
import type { Tables, InsertTables, UpdateTables } from './database.types';
import type { FAQItem } from '@/types/common';

export type FAQRow = Tables<'faqs'>;
export type FAQInsert = InsertTables<'faqs'>;
export type FAQUpdate = UpdateTables<'faqs'>;
export type ParentType = 'post' | 'project' | 'service';

// Use service role client for server-side operations (bypasses RLS)
function getClient() {
  if (typeof window === 'undefined') {
    return getServerClient();
  }
  return supabase;
}

// Convert DB row to FAQItem type
function toAppType(row: FAQRow): FAQItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    order: row.sort_order,
    isPremium: row.is_premium,
  };
}

// Convert FAQItem to DB row
function toDbType(item: FAQItem, parentId: string, parentType: ParentType): FAQInsert {
  return {
    parent_id: parentId,
    parent_type: parentType,
    question: item.question,
    answer: item.answer,
    is_premium: item.isPremium || false,
    sort_order: item.order || 0,
  };
}

export const faqsAPI = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL FAQS FOR A PARENT
  // ═══════════════════════════════════════════════════════════════════════════
  async getByParent(parentId: string, parentType: ParentType): Promise<FAQItem[]> {
    const { data, error } = await getClient()
      .from('faqs')
      .select('*')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(toAppType);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD FAQ ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async add(item: FAQItem, parentId: string, parentType: ParentType): Promise<FAQItem> {
    const dbData = toDbType(item, parentId, parentType);
    
    const { data, error } = await getClient()
      .from('faqs')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE FAQ ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, item: Partial<FAQItem>): Promise<FAQItem> {
    const updateData: FAQUpdate = {
      question: item.question,
      answer: item.answer,
      is_premium: item.isPremium,
      sort_order: item.order,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof FAQUpdate] === undefined) {
        delete updateData[key as keyof FAQUpdate];
      }
    });

    const { data, error } = await getClient()
      .from('faqs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toAppType(data);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE FAQ ITEM
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string): Promise<void> {
    const { error } = await getClient()
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REPLACE ALL FAQS (Delete all & insert new)
  // ═══════════════════════════════════════════════════════════════════════════
  async replaceAll(
    parentId: string,
    parentType: ParentType,
    items: FAQItem[]
  ): Promise<FAQItem[]> {
    // Delete existing
    await getClient()
      .from('faqs')
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
      .from('faqs')
      .insert(dbItems)
      .select();

    if (error) throw error;
    return (data || []).map(toAppType);
  },
};

export default faqsAPI;
