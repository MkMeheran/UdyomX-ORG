import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://udyomxorg.vercel.app';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ISR: Revalidate every hour (blog posts change frequently)
export const revalidate = 3600;

export async function GET() {
  const baseUrl = SITE_URL;
  
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching blog posts:', error);
      return new NextResponse('Error generating sitemap', { status: 500 });
    }

    const postUrls = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updated_at || post.created_at,
      changefreq: 'weekly',
      priority: '0.9',
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postUrls
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

    console.log(`✅ Blog sitemap: ${postUrls.length} posts`);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('❌ Error generating blog sitemap:', error);
    
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
