-- ═══════════════════════════════════════════════════════════════════════════
-- SERVICES TABLES (New - Run this if you already have existing schema)
-- ═══════════════════════════════════════════════════════════════════════════

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
    
    -- BASIC SEO FIELDS
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    seo_image TEXT,
    canonical_url TEXT,
    
    -- SERVICE INFO FIELDS (For AI Overview & LLM SEO)
    short_summary TEXT,
    long_summary TEXT,
    pain_points TEXT[],
    solutions_offered TEXT[],
    key_benefits TEXT[],
    pricing TEXT,
    use_cases TEXT[],
    target_audience TEXT,
    tools_used TEXT[],
    
    -- VISUAL FIELDS
    client_logos TEXT[],
    
    -- TECHNICAL SEO FIELDS
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_card TEXT DEFAULT 'summary_large_image' CHECK (twitter_card IN ('summary', 'summary_large_image')),
    indexable BOOLEAN DEFAULT true,
    sitemap_priority DECIMAL(2,1) DEFAULT 0.5 CHECK (sitemap_priority >= 0.0 AND sitemap_priority <= 1.0),
    last_updated TIMESTAMPTZ,
    
    -- CONTACT INFO (Custom per service, override defaults)
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
-- TRIGGER FOR SERVICES updated_at
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
