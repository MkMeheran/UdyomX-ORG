# Migration Guide: MockAPI → Supabase

## Overview

This guide walks you through migrating from MockAPI (development) to Supabase (production).

## Phase 1: Development with MockAPI

### Why MockAPI First?

1. **Rapid Prototyping** - Quick setup, no database config
2. **UI Testing** - Focus on frontend without backend complexity
3. **Schema Validation** - Test data structures before committing to SQL
4. **Iterate Quickly** - Easy to modify and experiment

### MockAPI Setup

1. Go to [mockapi.io](https://mockapi.io)
2. Create a new project
3. Create these resources:

#### Resources to Create

```
/posts
/projects  
/services
/orders
/testimonials
```

### MockAPI Schema Examples

#### Posts Schema
```json
{
  "id": "1",
  "slug": "my-first-post",
  "title": "My First Blog Post",
  "excerpt": "Short description...",
  "content": "Full markdown content here...",
  "coverPhoto": "https://...",
  "coverPhotoAlt": "Image description",
  "authors": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "bio": "Developer and writer",
      "isCorresponding": true,
      "affiliation": "Company Name"
    }
  ],
  "category": "Technology",
  "tags": ["nextjs", "react", "typescript"],
  "publishDate": "2024-01-15T10:00:00.000Z",
  "readTime": 5,
  "seo": {
    "metaTitle": "My First Blog Post - Portfolio",
    "metaDescription": "Learn about...",
    "keywords": ["nextjs", "tutorial"],
    "ogImage": "https://..."
  },
  "faqs": [
    {
      "id": "1",
      "question": "What is Next.js?",
      "answer": "Next.js is a React framework...",
      "isPremium": false
    }
  ],
  "galleryItems": [
    {
      "id": "1",
      "type": "image",
      "url": "https://...",
      "caption": "Example image",
      "alt": "Alt text"
    }
  ],
  "downloadItems": [],
  "showGallery": true,
  "showDownloads": false,
  "isPremium": false,
  "isPublished": true
}
```

#### Projects Schema
```json
{
  "id": "1",
  "slug": "portfolio-website",
  "name": "Portfolio Website",
  "title": "Modern Portfolio Website",
  "shortDescription": "A beautiful portfolio...",
  "description": "Full description in markdown...",
  "coverImage": "https://...",
  "images": ["https://...", "https://..."],
  "techStack": ["Next.js", "TypeScript", "Tailwind"],
  "liveLink": "https://example.com",
  "repoLink": "https://github.com/...",
  "publishDate": "2024-01-15T10:00:00.000Z",
  "seo": {
    "metaTitle": "Portfolio Website Project",
    "metaDescription": "A modern portfolio...",
    "keywords": ["portfolio", "nextjs"]
  },
  "category": "Web Development",
  "featured": true,
  "isPublished": true
}
```

#### Services Schema
```json
{
  "id": "1",
  "slug": "web-development",
  "name": "Web Development",
  "title": "Professional Web Development",
  "shortDescription": "Build modern websites...",
  "description": "Full service description...",
  "coverPhoto": "https://...",
  "problemStatement": [
    "Your business needs a web presence",
    "Outdated website holding you back"
  ],
  "solutionStatement": [
    "Modern, fast, responsive websites",
    "SEO optimized from day one"
  ],
  "serviceFeatures": [
    {
      "icon": "Code",
      "title": "Clean Code",
      "description": "Maintainable and scalable code"
    }
  ],
  "packages": [
    {
      "id": "1",
      "name": "Basic",
      "description": "Perfect for startups",
      "price": 999,
      "currency": "USD",
      "deliveryTime": "2 weeks",
      "features": ["5 pages", "Responsive design", "SEO basics"],
      "isPopular": false
    },
    {
      "id": "2",
      "name": "Professional",
      "description": "For growing businesses",
      "price": 2499,
      "currency": "USD",
      "deliveryTime": "4 weeks",
      "features": ["10 pages", "CMS integration", "Advanced SEO"],
      "isPopular": true
    }
  ],
  "priceRange": "$999 - $2499",
  "deliveryTime": "2-4 weeks",
  "seo": {
    "metaTitle": "Web Development Services",
    "metaDescription": "Professional web development...",
    "keywords": ["web development", "nextjs"]
  },
  "faqs": [
    {
      "id": "1",
      "question": "What's included?",
      "answer": "Everything you need...",
      "isPremium": false
    }
  ],
  "galleryItems": [],
  "downloadItems": [],
  "showGallery": false,
  "showDownloads": false,
  "category": "Development",
  "featured": true,
  "isPublished": true
}
```

#### Orders Schema
```json
{
  "id": "1",
  "userId": "optional-user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "serviceId": "1",
  "serviceName": "Web Development",
  "packageId": "2",
  "description": "I need a website for my business...",
  "budget": "$3000",
  "timeline": "1 month",
  "status": "pending",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "notes": "Admin notes here"
}
```

#### Testimonials Schema
```json
{
  "id": "1",
  "name": "Jane Smith",
  "role": "CEO",
  "company": "Tech Corp",
  "avatar": "https://...",
  "content": "Excellent work! Very professional...",
  "rating": 5,
  "serviceId": "1",
  "projectId": null,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

## Phase 2: Supabase Migration

### Prerequisites

1. All UI features tested and working with MockAPI
2. Data schemas finalized
3. Supabase project created

### Step 1: Export MockAPI Data

```bash
# Use the MockAPI export feature or write a script
node scripts/export-mockapi-data.js
```

This creates JSON files:
- `data/posts.json`
- `data/projects.json`
- `data/services.json`
- `data/orders.json`
- `data/testimonials.json`

### Step 2: Create Supabase Tables

Run the SQL in `supabase-schema.sql` (see docs folder):

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  is_premium BOOLEAN DEFAULT false,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_photo TEXT,
  cover_photo_alt TEXT,
  authors JSONB NOT NULL DEFAULT '[]',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  read_time INTEGER,
  seo JSONB NOT NULL,
  faqs JSONB DEFAULT '[]',
  gallery_items JSONB DEFAULT '[]',
  download_items JSONB DEFAULT '[]',
  show_gallery BOOLEAN DEFAULT false,
  show_downloads BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  live_link TEXT,
  repo_link TEXT,
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  seo JSONB NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  cover_photo TEXT,
  problem_statement TEXT[],
  solution_statement TEXT[],
  service_features JSONB DEFAULT '[]',
  packages JSONB DEFAULT '[]',
  price_range TEXT,
  delivery_time TEXT,
  seo JSONB NOT NULL,
  faqs JSONB DEFAULT '[]',
  gallery_items JSONB DEFAULT '[]',
  download_items JSONB DEFAULT '[]',
  show_gallery BOOLEAN DEFAULT false,
  show_downloads BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service_id UUID REFERENCES public.services NOT NULL,
  service_name TEXT NOT NULL,
  package_id TEXT,
  description TEXT NOT NULL,
  budget TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  service_id UUID REFERENCES public.services,
  project_id UUID REFERENCES public.projects,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public services are viewable by everyone"
  ON public.services FOR SELECT
  USING (is_published = true);

-- Admin full access (create admin role in profiles first)
CREATE POLICY "Admins can do everything with posts"
  ON public.posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Similar policies for other tables...
```

### Step 3: Import Data

```bash
node scripts/import-to-supabase.js
```

Or use Supabase Studio UI to import CSV/JSON.

### Step 4: Update API Calls

Replace MockAPI calls with Supabase queries:

**Before (MockAPI)**:
```typescript
import { postsAPI } from '@/lib/mockapi';
const posts = await postsAPI.getAll();
```

**After (Supabase)**:
```typescript
import { supabase } from '@/lib/supabase';
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .eq('is_published', true)
  .order('publish_date', { ascending: false });
```

### Step 5: Update Environment Variables

```env
# Remove or comment out MockAPI
# NEXT_PUBLIC_MOCKAPI_URL=...

# Ensure Supabase vars are set
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Step 6: Create Supabase Service Layer

Create `src/lib/supabase-api.ts`:

```typescript
import { supabase } from './supabase';
import { Post, Project, Service, Order } from '@/types';

export const postsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('publish_date', { ascending: false });
    
    if (error) throw error;
    return data as Post[];
  },
  
  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data as Post;
  },
  
  // Add create, update, delete...
};

// Similar for projects, services, orders...
```

### Step 7: Testing

Test everything again:

- [ ] Homepage loads
- [ ] Blog list and single posts
- [ ] Projects list and single projects
- [ ] Services list and single services
- [ ] Order submission
- [ ] Admin dashboard CRUD operations
- [ ] Authentication flow

### Step 8: Remove MockAPI

Once everything works:

1. Delete `src/lib/mockapi.ts`
2. Remove MockAPI environment variable
3. Update imports throughout the app
4. Delete MockAPI project (optional)

## Migration Checklist

- [ ] Export all MockAPI data
- [ ] Create Supabase tables with SQL schema
- [ ] Import data to Supabase
- [ ] Create Supabase API layer
- [ ] Update all API calls in components
- [ ] Update environment variables
- [ ] Test all functionality
- [ ] Test admin dashboard
- [ ] Test authentication
- [ ] Deploy to production
- [ ] Remove MockAPI dependencies

## Troubleshooting

### Issue: Data import fails
- Check JSON structure matches SQL schema
- Verify JSONB fields are valid JSON
- Check foreign key constraints

### Issue: RLS policies blocking access
- Review policies in Supabase dashboard
- Test with different user roles
- Check auth.uid() in policies

### Issue: Slow queries
- Add indexes on frequently queried columns
- Use select() to limit returned fields
- Implement pagination

## Support

For issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- Project GitHub Issues

---

**Migration estimated time: 2-4 hours**
