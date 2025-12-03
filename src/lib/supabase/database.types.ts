/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATABASE TYPES - Supabase Database Schema
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * These types define the database schema for Supabase.
 * Run `npx supabase gen types typescript` to auto-generate after schema changes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ═══════════════════════════════════════════════════════════════════════════
      // POSTS TABLE
      // ═══════════════════════════════════════════════════════════════════════════
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          thumbnail: string | null;
          cover_image: string | null;
          excerpt: string;
          category: string;
          tags: string[] | null;
          author: string | null;
          author_avatar: string | null;
          read_time: string | null;
          is_premium: boolean;
          layout: string | null;
          status: 'draft' | 'published';
          publish_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          thumbnail?: string | null;
          cover_image?: string | null;
          excerpt: string;
          category: string;
          tags?: string[] | null;
          author?: string | null;
          author_avatar?: string | null;
          read_time?: string | null;
          is_premium?: boolean;
          layout?: string | null;
          status?: 'draft' | 'published';
          publish_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          thumbnail?: string | null;
          cover_image?: string | null;
          excerpt?: string;
          category?: string;
          tags?: string[] | null;
          author?: string | null;
          author_avatar?: string | null;
          read_time?: string | null;
          is_premium?: boolean;
          layout?: string | null;
          status?: 'draft' | 'published';
          publish_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // PROJECTS TABLE
      // ═══════════════════════════════════════════════════════════════════════════
      projects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          thumbnail: string | null;
          cover_image: string | null;
          description: string;
          category: string | null;
          tech_stack: string[] | null;
          live_link: string | null;
          repo_link: string | null;
          featured: boolean;
          project_status: 'completed' | 'in-progress' | 'paused';
          progress: number | null;
          client_info: string | null;
          status: 'draft' | 'published';
          publish_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          thumbnail?: string | null;
          cover_image?: string | null;
          description: string;
          category?: string | null;
          tech_stack?: string[] | null;
          live_link?: string | null;
          repo_link?: string | null;
          featured?: boolean;
          project_status?: 'completed' | 'in-progress' | 'paused';
          progress?: number | null;
          client_info?: string | null;
          status?: 'draft' | 'published';
          publish_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          thumbnail?: string | null;
          cover_image?: string | null;
          description?: string;
          category?: string | null;
          tech_stack?: string[] | null;
          live_link?: string | null;
          repo_link?: string | null;
          featured?: boolean;
          project_status?: 'completed' | 'in-progress' | 'paused';
          progress?: number | null;
          client_info?: string | null;
          status?: 'draft' | 'published';
          publish_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // CONTENTS TABLE - Stores content for posts/projects (1:1 relationship)
      // ═══════════════════════════════════════════════════════════════════════════
      contents: {
        Row: {
          id: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          content: string;
          content_format: 'markdown' | 'mdx' | 'html';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          content: string;
          content_format?: 'markdown' | 'mdx' | 'html';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          parent_type?: 'post' | 'project' | 'service';
          content?: string;
          content_format?: 'markdown' | 'mdx' | 'html';
          created_at?: string;
          updated_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // GALLERY TABLE - Images/Videos for posts/projects
      // ═══════════════════════════════════════════════════════════════════════════
      gallery: {
        Row: {
          id: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          url: string;
          type: 'image' | 'video' | 'embed';
          alt: string | null;
          caption: string | null;
          thumbnail: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          url: string;
          type?: 'image' | 'video' | 'embed';
          alt?: string | null;
          caption?: string | null;
          thumbnail?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          parent_type?: 'post' | 'project' | 'service';
          url?: string;
          type?: 'image' | 'video' | 'embed';
          alt?: string | null;
          caption?: string | null;
          thumbnail?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // DOWNLOADS TABLE - Downloadable files
      // ═══════════════════════════════════════════════════════════════════════════
      downloads: {
        Row: {
          id: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          title: string;
          url: string;
          file_size: string | null;
          file_type: string | null;
          description: string | null;
          is_premium: boolean;
          download_count: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          title: string;
          url: string;
          file_size?: string | null;
          file_type?: string | null;
          description?: string | null;
          is_premium?: boolean;
          download_count?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          parent_type?: 'post' | 'project' | 'service';
          title?: string;
          url?: string;
          file_size?: string | null;
          file_type?: string | null;
          description?: string | null;
          is_premium?: boolean;
          download_count?: number;
          sort_order?: number;
          created_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // FAQS TABLE - FAQ items
      // ═══════════════════════════════════════════════════════════════════════════
      faqs: {
        Row: {
          id: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          question: string;
          answer: string;
          is_premium: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          question: string;
          answer: string;
          is_premium?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          parent_type?: 'post' | 'project' | 'service';
          question?: string;
          answer?: string;
          is_premium?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // RECOMMENDED TABLE - Recommended content links
      // ═══════════════════════════════════════════════════════════════════════════
      recommended: {
        Row: {
          id: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          type: 'blog' | 'project' | 'service' | 'external';
          title: string;
          slug: string | null;
          url: string | null;
          thumbnail: string | null;
          excerpt: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          type: 'blog' | 'project' | 'service' | 'external';
          title: string;
          slug?: string | null;
          url?: string | null;
          thumbnail?: string | null;
          excerpt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          parent_type?: 'post' | 'project' | 'service';
          type?: 'blog' | 'project' | 'service' | 'external';
          title?: string;
          slug?: string | null;
          url?: string | null;
          thumbnail?: string | null;
          excerpt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // RELATED_PROJECTS TABLE - Project relationships
      // ═══════════════════════════════════════════════════════════════════════════
      related_projects: {
        Row: {
          id: string;
          project_id: string;
          related_project_id: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          related_project_id: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          related_project_id?: string;
          sort_order?: number;
          created_at?: string;
        };
      };

      // ═══════════════════════════════════════════════════════════════════════════
      // SEO TABLE - SEO metadata
      // ═══════════════════════════════════════════════════════════════════════════
      seo: {
        Row: {
          id: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          title: string | null;
          description: string | null;
          keywords: string[] | null;
          og_image: string | null;
          canonical_url: string | null;
          robots_index: boolean;
          robots_follow: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          parent_type: 'post' | 'project' | 'service';
          title?: string | null;
          description?: string | null;
          keywords?: string[] | null;
          og_image?: string | null;
          canonical_url?: string | null;
          robots_index?: boolean;
          robots_follow?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          parent_type?: 'post' | 'project' | 'service';
          title?: string | null;
          description?: string | null;
          keywords?: string[] | null;
          og_image?: string | null;
          canonical_url?: string | null;
          robots_index?: boolean;
          robots_follow?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
