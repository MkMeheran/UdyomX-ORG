-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor to create all tables
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════
-- POSTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    cover_image TEXT,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    author TEXT,
    author_avatar TEXT,
    read_time TEXT,
    is_premium BOOLEAN DEFAULT false,
    layout TEXT DEFAULT 'standard',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    publish_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_publish_date ON posts(publish_date DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- PROJECTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    cover_image TEXT,
    description TEXT NOT NULL,
    category TEXT,
    tech_stack TEXT[],
    live_link TEXT,
    repo_link TEXT,
    featured BOOLEAN DEFAULT false,
    project_status TEXT DEFAULT 'completed' CHECK (project_status IN ('completed', 'in-progress', 'paused')),
    progress INTEGER,
    client_info TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    publish_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- ═══════════════════════════════════════════════════════════════════════════
-- CONTENTS TABLE (1:1 with posts/projects/services)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('post', 'project', 'service')),
    content TEXT NOT NULL,
    content_format TEXT DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'mdx', 'html')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_id, parent_type)
);

CREATE INDEX IF NOT EXISTS idx_contents_parent ON contents(parent_id, parent_type);

-- ═══════════════════════════════════════════════════════════════════════════
-- GALLERY TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('post', 'project', 'service')),
    url TEXT NOT NULL,
    type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video', 'embed')),
    alt TEXT,
    caption TEXT,
    thumbnail TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_parent ON gallery(parent_id, parent_type);

-- ═══════════════════════════════════════════════════════════════════════════
-- DOWNLOADS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('post', 'project', 'service')),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT,
    description TEXT,
    is_premium BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_downloads_parent ON downloads(parent_id, parent_type);

-- ═══════════════════════════════════════════════════════════════════════════
-- FAQS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('post', 'project', 'service')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_parent ON faqs(parent_id, parent_type);

-- ═══════════════════════════════════════════════════════════════════════════
-- RECOMMENDED TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS recommended (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('post', 'project', 'service')),
    type TEXT NOT NULL CHECK (type IN ('blog', 'project', 'service', 'external')),
    title TEXT NOT NULL,
    slug TEXT,
    url TEXT,
    thumbnail TEXT,
    excerpt TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommended_parent ON recommended(parent_id, parent_type);

-- ═══════════════════════════════════════════════════════════════════════════
-- RELATED_PROJECTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS related_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    related_project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, related_project_id)
);

CREATE INDEX IF NOT EXISTS idx_related_projects_project ON related_projects(project_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEO TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS seo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('post', 'project', 'service')),
    title TEXT,
    description TEXT,
    keywords TEXT[],
    og_image TEXT,
    canonical_url TEXT,
    robots_index BOOLEAN DEFAULT true,
    robots_follow BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_id, parent_type)
);

CREATE INDEX IF NOT EXISTS idx_seo_parent ON seo(parent_id, parent_type);

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTION: Increment download count
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION increment_download_count(download_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE downloads 
    SET download_count = download_count + 1 
    WHERE id = download_id;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTION: Auto-update updated_at timestamp
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS contents_updated_at ON contents;
CREATE TRIGGER contents_updated_at
    BEFORE UPDATE ON contents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS seo_updated_at ON seo;
CREATE TRIGGER seo_updated_at
    BEFORE UPDATE ON seo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommended ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read published posts" ON posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read published projects" ON projects
    FOR SELECT USING (status = 'published');

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access posts" ON posts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access projects" ON projects
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access contents" ON contents
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access gallery" ON gallery
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access downloads" ON downloads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access faqs" ON faqs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access recommended" ON recommended
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access related_projects" ON related_projects
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo" ON seo
    FOR ALL USING (auth.role() = 'service_role');

-- Public read for related tables (if parent is published)
CREATE POLICY "Public read contents" ON contents
    FOR SELECT USING (true);

CREATE POLICY "Public read gallery" ON gallery
    FOR SELECT USING (true);

CREATE POLICY "Public read downloads" ON downloads
    FOR SELECT USING (true);

CREATE POLICY "Public read faqs" ON faqs
    FOR SELECT USING (true);

CREATE POLICY "Public read recommended" ON recommended
    FOR SELECT USING (true);

CREATE POLICY "Public read related_projects" ON related_projects
    FOR SELECT USING (true);

CREATE POLICY "Public read seo" ON seo
    FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICES TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    hook_line TEXT,
    description TEXT,
    content_format TEXT DEFAULT 'mdx' CHECK (content_format IN ('mdx', 'html')),
    category TEXT,
    thumbnail TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    show_gallery BOOLEAN DEFAULT false,
    show_downloads BOOLEAN DEFAULT false,
    publish_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- ═══════════════════════════════════════════════════════════════
    -- BASIC SEO FIELDS
    -- ═══════════════════════════════════════════════════════════════
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    seo_image TEXT,
    canonical_url TEXT,
    
    -- ═══════════════════════════════════════════════════════════════
    -- SERVICE INFO FIELDS (For AI Overview & LLM SEO)
    -- ═══════════════════════════════════════════════════════════════
    short_summary TEXT,           -- 60-80 chars for AI Overview snippet
    long_summary TEXT,            -- Service detail
    pain_points TEXT[],           -- Helps AEO (Answer Engine Optimization)
    solutions_offered TEXT[],     -- LLM SEO
    key_benefits TEXT[],          -- AI Overview
    pricing TEXT,                 -- Pricing info
    use_cases TEXT[],             -- Helps AI comprehension
    target_audience TEXT,         -- Who is it for?
    tools_used TEXT[],            -- n8n, OpenAI, Supabase etc
    
    -- ═══════════════════════════════════════════════════════════════
    -- VISUAL FIELDS
    -- ═══════════════════════════════════════════════════════════════
    client_logos TEXT[],          -- Client logo URLs for social proof
    
    -- ═══════════════════════════════════════════════════════════════
    -- TECHNICAL SEO FIELDS
    -- ═══════════════════════════════════════════════════════════════
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_card TEXT DEFAULT 'summary_large_image' CHECK (twitter_card IN ('summary', 'summary_large_image')),
    indexable BOOLEAN DEFAULT true,
    sitemap_priority DECIMAL(2,1) DEFAULT 0.5 CHECK (sitemap_priority >= 0.0 AND sitemap_priority <= 1.0),
    last_updated TIMESTAMPTZ,
    
    -- ═══════════════════════════════════════════════════════════════
    -- CONTACT INFO (Custom per service, override defaults)
    -- ═══════════════════════════════════════════════════════════════
    contact_whatsapp TEXT,
    contact_telegram TEXT,
    contact_twitter TEXT,
    contact_instagram TEXT,
    contact_facebook TEXT,
    contact_linkedin TEXT,
    contact_email TEXT
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_publish_date ON services(publish_date DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE FEATURES TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    icon TEXT,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_features_service ON service_features(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE PACKAGES TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    features TEXT[] DEFAULT '{}',
    delivery_time TEXT,
    revisions INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_packages_service ON service_packages(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE PROBLEMS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_problems_service ON service_problems(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE SOLUTIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_solutions_service ON service_solutions(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE TESTIMONIALS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    quote TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_testimonials_service ON service_testimonials(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE GALLERY TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video', 'pdf')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_gallery_service ON service_gallery(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE DOWNLOADS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    label TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT,
    download_count INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_downloads_service ON service_downloads(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE FAQS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_faqs_service ON service_faqs(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICE RELATED PROJECTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_related_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_service_related_projects_service ON service_related_projects(service_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS FOR SERVICES
-- ═══════════════════════════════════════════════════════════════════════════
DROP TRIGGER IF EXISTS services_updated_at ON services;
CREATE TRIGGER services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY FOR SERVICES
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_related_projects ENABLE ROW LEVEL SECURITY;

-- Public read access for published services
CREATE POLICY "Public read published services" ON services
    FOR SELECT USING (status = 'published');

-- Service role has full access
CREATE POLICY "Service role full access services" ON services
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_features" ON service_features
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_packages" ON service_packages
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_problems" ON service_problems
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_solutions" ON service_solutions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_testimonials" ON service_testimonials
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_gallery" ON service_gallery
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_downloads" ON service_downloads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_faqs" ON service_faqs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access service_related_projects" ON service_related_projects
    FOR ALL USING (auth.role() = 'service_role');

-- Public read for service related tables
CREATE POLICY "Public read service_features" ON service_features
    FOR SELECT USING (true);

CREATE POLICY "Public read service_packages" ON service_packages
    FOR SELECT USING (true);

CREATE POLICY "Public read service_problems" ON service_problems
    FOR SELECT USING (true);

CREATE POLICY "Public read service_solutions" ON service_solutions
    FOR SELECT USING (true);

CREATE POLICY "Public read service_testimonials" ON service_testimonials
    FOR SELECT USING (true);

CREATE POLICY "Public read service_gallery" ON service_gallery
    FOR SELECT USING (true);

CREATE POLICY "Public read service_downloads" ON service_downloads
    FOR SELECT USING (true);

CREATE POLICY "Public read service_faqs" ON service_faqs
    FOR SELECT USING (true);

CREATE POLICY "Public read service_related_projects" ON service_related_projects
    FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA (Optional - for testing)
-- ═══════════════════════════════════════════════════════════════════════════
-- Uncomment below to insert sample data

/*
-- Sample Post
INSERT INTO posts (title, slug, excerpt, category, author, status, publish_date)
VALUES (
    'Getting Started with Next.js 14',
    'getting-started-nextjs-14',
    'Learn how to build modern web applications with Next.js 14 App Router',
    'Development',
    'Mokammel Morshed',
    'published',
    NOW()
);

-- Sample Project  
INSERT INTO projects (name, slug, description, category, tech_stack, featured, project_status, status, publish_date)
VALUES (
    'UdyomX Portfolio',
    'udyomx-portfolio',
    'A modern portfolio website built with Next.js 14',
    'Web Development',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    true,
    'completed',
    'published',
    NOW()
);

-- Sample Service
INSERT INTO services (title, slug, hook_line, description, category, status, publish_date)
VALUES (
    'AI Automation Service',
    'ai-automation-service',
    'Transform your business with intelligent automation',
    'We help businesses automate their workflows using AI and modern tools.',
    'Automation',
    'published',
    NOW()
);
*/
