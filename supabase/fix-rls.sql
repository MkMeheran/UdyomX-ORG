-- ═══════════════════════════════════════════════════════════════════════════
-- FIX RLS POLICIES - Allow public write operations
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Option 1: Simplest - Disable RLS temporarily for development
-- (NOT recommended for production)

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role full access posts" ON posts;
DROP POLICY IF EXISTS "Service role full access projects" ON projects;
DROP POLICY IF EXISTS "Service role full access contents" ON contents;
DROP POLICY IF EXISTS "Service role full access gallery" ON gallery;
DROP POLICY IF EXISTS "Service role full access downloads" ON downloads;
DROP POLICY IF EXISTS "Service role full access faqs" ON faqs;
DROP POLICY IF EXISTS "Service role full access recommended" ON recommended;
DROP POLICY IF EXISTS "Service role full access related_projects" ON related_projects;
DROP POLICY IF EXISTS "Service role full access seo" ON seo;

-- Create new policies that allow all operations for now
-- Posts - allow all
CREATE POLICY "Allow all posts" ON posts FOR ALL USING (true) WITH CHECK (true);

-- Projects - allow all
CREATE POLICY "Allow all projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- Contents - allow all
DROP POLICY IF EXISTS "Public read contents" ON contents;
CREATE POLICY "Allow all contents" ON contents FOR ALL USING (true) WITH CHECK (true);

-- Gallery - allow all
DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Allow all gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);

-- Downloads - allow all
DROP POLICY IF EXISTS "Public read downloads" ON downloads;
CREATE POLICY "Allow all downloads" ON downloads FOR ALL USING (true) WITH CHECK (true);

-- FAQs - allow all
DROP POLICY IF EXISTS "Public read faqs" ON faqs;
CREATE POLICY "Allow all faqs" ON faqs FOR ALL USING (true) WITH CHECK (true);

-- Recommended - allow all
DROP POLICY IF EXISTS "Public read recommended" ON recommended;
CREATE POLICY "Allow all recommended" ON recommended FOR ALL USING (true) WITH CHECK (true);

-- Related projects - allow all
DROP POLICY IF EXISTS "Public read related_projects" ON related_projects;
CREATE POLICY "Allow all related_projects" ON related_projects FOR ALL USING (true) WITH CHECK (true);

-- SEO - allow all
DROP POLICY IF EXISTS "Public read seo" ON seo;
CREATE POLICY "Allow all seo" ON seo FOR ALL USING (true) WITH CHECK (true);

-- Note: For production, you should implement proper authentication
-- and restrict write operations to authenticated admin users only.
