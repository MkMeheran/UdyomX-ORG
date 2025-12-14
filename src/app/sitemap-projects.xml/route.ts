import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://udyomxorg.vercel.app';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ISR: Revalidate every 6 hours (projects change less frequently)
export const revalidate = 21600;

export async function GET() {
  const baseUrl = SITE_URL;
  
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching projects:', error);
      return new NextResponse('Error generating sitemap', { status: 500 });
    }

    const projectUrls = (projects || []).map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastmod: project.updated_at || project.created_at,
      changefreq: 'monthly',
      priority: '0.7',
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${projectUrls
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

    console.log(`✅ Projects sitemap: ${projectUrls.length} projects`);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=21600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('❌ Error generating projects sitemap:', error);
    
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
