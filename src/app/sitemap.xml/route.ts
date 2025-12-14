import { NextResponse } from 'next/server';

const SITE_URL = 'https://udyomxorg.vercel.app';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = SITE_URL;
  const currentDate = new Date().toISOString();

  // Sitemap Index XML - Only references to sub-sitemaps, NO individual URLs
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-posts.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-projects.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  console.log('✅ Sitemap Index generated with 4 sub-sitemaps');

  return new NextResponse(sitemapIndexXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate',
    },
  });
}
