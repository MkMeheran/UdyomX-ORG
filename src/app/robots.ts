import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.urls.website.replace(/\/$/, ''); // Remove trailing slash

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/udyomx-admin/',
          '/auth/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/udyomx-admin/',
          '/auth/',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-pages.xml`,
      `${baseUrl}/sitemap-posts.xml`,
      `${baseUrl}/sitemap-services.xml`,
      `${baseUrl}/sitemap-projects.xml`,
    ],
    host: baseUrl,
  };
}
