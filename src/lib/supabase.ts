/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUPABASE - Main re-export file
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file re-exports from the new modular structure in /lib/supabase/
 * For new code, import directly from '@/lib/supabase' (the folder index)
 */

// Re-export everything from the new modular structure
export * from './supabase/index';
export { default as db } from './supabase/index';

// Re-export client for backward compatibility
import { supabase } from './supabase/client';
export { supabase };

// ═══════════════════════════════════════════════════════════════════════════
// AUTH HELPERS (kept for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user',
        },
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  const { user } = await auth.getUser();
  if (!user) return false;
  
  // Check if email matches admin email
  const adminEmail = process.env.ADMIN_EMAIL || 'mdmokammelmorshed@gmail.com';
  if (user.email === adminEmail) return true;
  
  // Also check user metadata
  return user.user_metadata?.role === 'admin';
};
