import { NextRequest, NextResponse } from 'next/server';
import { blogAPI } from '@/lib/api';
import type { BlogPost } from '@/types';

// GET all blogs or by slug
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const fields = searchParams.get('fields'); // 'card' for light response
    const admin = searchParams.get('admin'); // 'true' to get all statuses
    
    try {
        if (slug) {
            const blog = await blogAPI.getBySlug(slug);
            console.log('📖 GET /api/blogs?slug=' + slug, '- Found:', blog ? { id: blog.id } : 'NOT FOUND');
            if (blog) {
                return NextResponse.json(blog);
            }
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        
        // Light response for card views - only essential fields
        if (fields === 'card') {
            const lightBlogs = await blogAPI.getAllForCards();
            console.log('📚 GET /api/blogs?fields=card - Returning', lightBlogs.length, 'light blogs');
            return NextResponse.json(lightBlogs);
        }
        
        // Admin view - get all statuses
        if (admin === 'true') {
            const allBlogs = await blogAPI.getAllAdmin();
            console.log('📚 GET /api/blogs?admin=true - Returning', allBlogs.length, 'blogs');
            return NextResponse.json(allBlogs);
        }
        
        // Default - get published only
        const blogs = await blogAPI.getAll();
        console.log('📚 GET /api/blogs - Returning', blogs.length, 'blogs');
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('❌ Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

// POST create new blog
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        const newBlog = await blogAPI.create(data);
        console.log('➕ POST /api/blogs - Created new:', { id: newBlog.id });
        
        return NextResponse.json(newBlog, { status: 201 });
    } catch (error) {
        console.error('❌ Error creating blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}

// PUT update blog
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        console.log('📝 PUT /api/blogs - Received:', { 
            id: data.id, 
            slug: data.slug
        });
        
        if (!data.id) {
            return NextResponse.json({ error: 'Blog ID required' }, { status: 400 });
        }
        
        const updatedBlog = await blogAPI.update(data.id, data);
        
        if (!updatedBlog) {
            console.log('❌ PUT /api/blogs - Blog not found');
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        
        console.log('✅ PUT /api/blogs - Updated:', { id: updatedBlog.id });
        
        return NextResponse.json(updatedBlog);
    } catch (error) {
        console.error('❌ Error updating blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

// DELETE blog
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        
        await blogAPI.delete(id);
        
        console.log('🗑️ DELETE /api/blogs - Deleted:', id);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
