import { NextResponse } from 'next/server';
import { blogAPI, projectAPI } from '@/lib/api';

// Debug endpoint to check Supabase data
export async function GET() {
    try {
        // Fetch all data from Supabase
        const [blogs, blogsForCards, blogsAdmin, projects, projectsForCards, projectsAdmin] = await Promise.all([
            blogAPI.getAll().catch(e => ({ error: e.message })),
            blogAPI.getAllForCards().catch(e => ({ error: e.message })),
            blogAPI.getAllAdmin().catch(e => ({ error: e.message })),
            projectAPI.getAll().catch(e => ({ error: e.message })),
            projectAPI.getAllForCards().catch(e => ({ error: e.message })),
            projectAPI.getAllAdmin().catch(e => ({ error: e.message })),
        ]);
        
        return NextResponse.json({
            timestamp: new Date().toISOString(),
            source: 'Supabase',
            blogs: {
                published: {
                    count: Array.isArray(blogs) ? blogs.length : 0,
                    items: Array.isArray(blogs) ? blogs.map((b: any) => ({
                        id: b.id,
                        slug: b.slug,
                        title: b.title?.substring(0, 40),
                        status: b.status,
                        thumbnail: b.thumbnail ? 'YES' : 'NO',
                    })) : blogs,
                },
                forCards: {
                    count: Array.isArray(blogsForCards) ? blogsForCards.length : 0,
                    items: Array.isArray(blogsForCards) ? blogsForCards.map((b: any) => ({
                        slug: b.slug,
                        thumbnail: b.thumbnail ? 'YES' : 'NO',
                    })) : blogsForCards,
                },
                admin: {
                    count: Array.isArray(blogsAdmin) ? blogsAdmin.length : 0,
                    items: Array.isArray(blogsAdmin) ? blogsAdmin.map((b: any) => ({
                        slug: b.slug,
                        status: b.status,
                    })) : blogsAdmin,
                },
            },
            projects: {
                published: {
                    count: Array.isArray(projects) ? projects.length : 0,
                    items: Array.isArray(projects) ? projects.map((p: any) => ({
                        id: p.id,
                        slug: p.slug,
                        name: p.name?.substring(0, 40),
                        status: p.status,
                        thumbnail: p.thumbnail ? 'YES' : 'NO',
                    })) : projects,
                },
                forCards: {
                    count: Array.isArray(projectsForCards) ? projectsForCards.length : 0,
                    items: Array.isArray(projectsForCards) ? projectsForCards.map((p: any) => ({
                        slug: p.slug,
                        thumbnail: p.thumbnail ? 'YES' : 'NO',
                    })) : projectsForCards,
                },
                admin: {
                    count: Array.isArray(projectsAdmin) ? projectsAdmin.length : 0,
                    items: Array.isArray(projectsAdmin) ? projectsAdmin.map((p: any) => ({
                        slug: p.slug,
                        status: p.status,
                    })) : projectsAdmin,
                },
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
