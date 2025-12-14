import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://udyomxorg.vercel.app';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ISR: Revalidate every 6 hours (services change less frequently)
export const revalidate = 21600;

export async function GET() {
  const baseUrl = SITE_URL;
  
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching services:', error);
      return new NextResponse('Error generating sitemap', { status: 500 });
    }

    const serviceUrls = (services || []).map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastmod: service.updated_at || service.created_at,
      changefreq: 'monthly',
      priority: '0.9',
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${serviceUrls
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    console.log(`✅ Services sitemap: ${serviceUrls.length} services`);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=21600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('❌ Error generating services sitemap:', error);
    
    // Return empty sitemap instead of error
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(emptyXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate',
      },
    });
  }
}
