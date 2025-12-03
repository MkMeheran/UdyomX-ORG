-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA - Run this in Supabase SQL Editor after schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- Sample Blog Post 1
INSERT INTO posts (title, slug, excerpt, category, author, tags, read_time, status, publish_date, thumbnail)
VALUES (
    'Getting Started with Next.js 14 App Router',
    'getting-started-nextjs-14',
    'Learn how to build modern web applications with Next.js 14 App Router, Server Components, and the latest React features.',
    'Development',
    'Mokammel Morshed',
    ARRAY['Next.js', 'React', 'TypeScript', 'Web Development'],
    '8 min read',
    'published',
    NOW(),
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'
);

-- Get the post ID and add content
INSERT INTO contents (parent_id, parent_type, content, content_format)
SELECT id, 'post', '# Getting Started with Next.js 14

Next.js 14 introduces the App Router, a new way to build React applications with improved performance and developer experience.

## What is the App Router?

The App Router is built on React Server Components, enabling you to build applications that span the server and client.

## Key Features

- **Server Components**: Render on the server for better performance
- **Streaming**: Progressive rendering of UI
- **Data Fetching**: Simplified data fetching with async/await
- **Layouts**: Nested layouts that preserve state

## Getting Started

```bash
npx create-next-app@latest my-app
```

## Conclusion

Next.js 14 is a powerful framework for building modern web applications. Start experimenting today!', 'markdown'
FROM posts WHERE slug = 'getting-started-nextjs-14';

-- Sample Blog Post 2
INSERT INTO posts (title, slug, excerpt, category, author, tags, read_time, status, publish_date, thumbnail)
VALUES (
    'Mastering Tailwind CSS for Beautiful UIs',
    'mastering-tailwind-css',
    'Discover how to create stunning user interfaces with Tailwind CSS utility-first approach and best practices.',
    'Design',
    'Mokammel Morshed',
    ARRAY['CSS', 'Tailwind', 'UI Design', 'Frontend'],
    '6 min read',
    'published',
    NOW() - INTERVAL '2 days',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
);

INSERT INTO contents (parent_id, parent_type, content, content_format)
SELECT id, 'post', '# Mastering Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to build custom designs quickly.

## Why Tailwind?

- No more naming CSS classes
- Responsive design made easy
- Dark mode support built-in
- Highly customizable

## Basic Usage

```html
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  Hello Tailwind!
</div>
```

## Best Practices

1. Use component extraction for repeated patterns
2. Leverage the configuration file
3. Use plugins for additional functionality

Happy styling!', 'markdown'
FROM posts WHERE slug = 'mastering-tailwind-css';

-- Sample Blog Post 3 (Draft)
INSERT INTO posts (title, slug, excerpt, category, author, tags, read_time, status, publish_date, thumbnail)
VALUES (
    'Building a Full-Stack App with Supabase',
    'fullstack-supabase-guide',
    'A comprehensive guide to building full-stack applications using Supabase as your backend.',
    'Backend',
    'Mokammel Morshed',
    ARRAY['Supabase', 'PostgreSQL', 'Authentication', 'Full-Stack'],
    '12 min read',
    'draft',
    NOW(),
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'
);

-- Sample Project 1
INSERT INTO projects (name, slug, description, category, tech_stack, featured, project_status, status, publish_date, thumbnail, live_link, repo_link)
VALUES (
    'UdyomX Portfolio',
    'udyomx-portfolio',
    'A modern portfolio website built with Next.js 14, featuring Neu-Brutalism design, blog system, and Supabase backend.',
    'Web Development',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
    true,
    'completed',
    'published',
    NOW(),
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://udyomx.org',
    'https://github.com/udyomx/portfolio'
);

INSERT INTO contents (parent_id, parent_type, content, content_format)
SELECT id, 'project', '# UdyomX Portfolio

A comprehensive portfolio website showcasing projects, blog posts, and services.

## Features

- Modern Neu-Brutalism design
- Blog with multiple layouts
- Project showcase
- Service listings
- Admin dashboard
- Google OAuth authentication

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Supabase Auth with Google OAuth

## Screenshots

Coming soon...', 'markdown'
FROM projects WHERE slug = 'udyomx-portfolio';

-- Sample Project 2
INSERT INTO projects (name, slug, description, category, tech_stack, featured, project_status, status, publish_date, thumbnail)
VALUES (
    'E-Commerce Dashboard',
    'ecommerce-dashboard',
    'A comprehensive admin dashboard for managing e-commerce operations with real-time analytics.',
    'Web Application',
    ARRAY['React', 'Node.js', 'MongoDB', 'Chart.js', 'Redux'],
    true,
    'completed',
    'published',
    NOW() - INTERVAL '1 week',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
);

-- Sample Project 3 (In Progress)
INSERT INTO projects (name, slug, description, category, tech_stack, featured, project_status, progress, status, publish_date, thumbnail)
VALUES (
    'AI Chat Assistant',
    'ai-chat-assistant',
    'An intelligent chat assistant powered by GPT-4 with custom training capabilities.',
    'AI/ML',
    ARRAY['Python', 'FastAPI', 'OpenAI', 'React', 'WebSocket'],
    false,
    'in-progress',
    65,
    'published',
    NOW(),
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
);

-- Add FAQ to first blog post
INSERT INTO faqs (parent_id, parent_type, question, answer, sort_order)
SELECT id, 'post', 'What is Next.js?', 'Next.js is a React framework that enables server-side rendering and static site generation.', 0
FROM posts WHERE slug = 'getting-started-nextjs-14';

INSERT INTO faqs (parent_id, parent_type, question, answer, sort_order)
SELECT id, 'post', 'Do I need to know React?', 'Yes, basic React knowledge is required to use Next.js effectively.', 1
FROM posts WHERE slug = 'getting-started-nextjs-14';

-- Add Gallery to first project
INSERT INTO gallery (parent_id, parent_type, url, type, alt, sort_order)
SELECT id, 'project', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200', 'image', 'Homepage Screenshot', 0
FROM projects WHERE slug = 'udyomx-portfolio';

INSERT INTO gallery (parent_id, parent_type, url, type, alt, sort_order)
SELECT id, 'project', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200', 'image', 'Dashboard View', 1
FROM projects WHERE slug = 'udyomx-portfolio';

-- Add Download to first blog
INSERT INTO downloads (parent_id, parent_type, title, url, file_type, file_size, sort_order)
SELECT id, 'post', 'Next.js Cheat Sheet', 'https://example.com/nextjs-cheatsheet.pdf', 'PDF', '2.5 MB', 0
FROM posts WHERE slug = 'getting-started-nextjs-14';

-- Add Recommended content
INSERT INTO recommended (parent_id, parent_type, type, title, slug, sort_order)
SELECT id, 'post', 'blog', 'Mastering Tailwind CSS', 'mastering-tailwind-css', 0
FROM posts WHERE slug = 'getting-started-nextjs-14';

-- Verify data
SELECT 'Posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Contents', COUNT(*) FROM contents
UNION ALL
SELECT 'FAQs', COUNT(*) FROM faqs
UNION ALL
SELECT 'Gallery', COUNT(*) FROM gallery
UNION ALL
SELECT 'Downloads', COUNT(*) FROM downloads
UNION ALL
SELECT 'Recommended', COUNT(*) FROM recommended;
