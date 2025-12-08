import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.urls.website.replace(/\/$/, ''); // Remove trailing slash
  const currentDate = new Date().toISOString();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    // Fetch all published blog posts
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updated_at || blog.created_at,
      changeFrequency: 'daily',
      priority: 1.0,
    }));

    // Fetch all published projects
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updated_at || project.created_at,
      changeFrequency: 'daily',
      priority: 1.0,
    }));

    // Fetch all published services
    const { data: services } = await supabase
      .from('services')
      .select('slug, updated_at, created_at')
      .eq('is_published', true)
      .order('updated_at', { ascending: false });

    const serviceRoutes: MetadataRoute.Sitemap = (services || []).map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updated_at || service.created_at,
      changeFrequency: 'daily',
      priority: 1.0,
    }));

    // Combine all routes
    return [...staticRoutes, ...blogRoutes, ...projectRoutes, ...serviceRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static routes if database fetch fails
    return staticRoutes;
  }
}
