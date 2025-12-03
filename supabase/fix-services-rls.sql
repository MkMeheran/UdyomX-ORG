-- ═══════════════════════════════════════════════════════════════════════════
-- FIX RLS POLICIES FOR SERVICES
-- Run this in Supabase SQL Editor to allow anon key to insert/update/delete
-- ═══════════════════════════════════════════════════════════════════════════

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role full access services" ON services;
DROP POLICY IF EXISTS "Service role full access service_features" ON service_features;
DROP POLICY IF EXISTS "Service role full access service_packages" ON service_packages;
DROP POLICY IF EXISTS "Service role full access service_problems" ON service_problems;
DROP POLICY IF EXISTS "Service role full access service_solutions" ON service_solutions;
DROP POLICY IF EXISTS "Service role full access service_testimonials" ON service_testimonials;
DROP POLICY IF EXISTS "Service role full access service_gallery" ON service_gallery;
DROP POLICY IF EXISTS "Service role full access service_downloads" ON service_downloads;
DROP POLICY IF EXISTS "Service role full access service_faqs" ON service_faqs;
DROP POLICY IF EXISTS "Service role full access service_related_projects" ON service_related_projects;

-- Allow all operations for services (for development)
-- In production, you should restrict this based on authenticated users
CREATE POLICY "Allow all services operations" ON services
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_features operations" ON service_features
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_packages operations" ON service_packages
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_problems operations" ON service_problems
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_solutions operations" ON service_solutions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_testimonials operations" ON service_testimonials
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_gallery operations" ON service_gallery
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_downloads operations" ON service_downloads
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_faqs operations" ON service_faqs
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all service_related_projects operations" ON service_related_projects
    FOR ALL USING (true) WITH CHECK (true);

-- Also update the public read policy to allow reading all statuses for admin
DROP POLICY IF EXISTS "Public read published services" ON services;
CREATE POLICY "Public read all services" ON services
    FOR SELECT USING (true);
