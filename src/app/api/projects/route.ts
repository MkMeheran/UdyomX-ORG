import { NextRequest, NextResponse } from 'next/server';
import { projectAPI } from '@/lib/api';
import type { Project } from '@/types';

// GET all projects or by slug
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const fields = searchParams.get('fields'); // 'card' for light response
    const admin = searchParams.get('admin'); // 'true' to get all statuses
    
    try {
        if (slug) {
            const project = await projectAPI.getBySlug(slug);
            console.log('📖 GET /api/projects?slug=' + slug, '- Found:', project ? { id: project.id } : 'NOT FOUND');
            if (project) {
                return NextResponse.json(project);
            }
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        
        // Light response for card views - only essential fields
        if (fields === 'card') {
            const lightProjects = await projectAPI.getAllForCards();
            console.log('📚 GET /api/projects?fields=card - Returning', lightProjects.length, 'light projects');
            return NextResponse.json(lightProjects);
        }
        
        // Admin view - get all statuses
        if (admin === 'true') {
            const allProjects = await projectAPI.getAllAdmin();
            console.log('📚 GET /api/projects?admin=true - Returning', allProjects.length, 'projects');
            return NextResponse.json(allProjects);
        }
        
        // Default - get published only
        const projects = await projectAPI.getAll();
        console.log('📚 GET /api/projects - Returning', projects.length, 'projects');
        return NextResponse.json(projects);
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        const newProject = await projectAPI.create(data);
        console.log('➕ POST /api/projects - Created new:', { id: newProject.id });
        
        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('❌ Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

// PUT update project
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        console.log('📝 PUT /api/projects - Received:', { 
            id: data.id, 
            slug: data.slug
        });
        
        if (!data.id) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
        }
        
        const updatedProject = await projectAPI.update(data.id, data);
        
        if (!updatedProject) {
            console.log('❌ PUT /api/projects - Project not found');
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        
        console.log('✅ PUT /api/projects - Updated:', { id: updatedProject.id });
        
        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('❌ Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE project
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        
        await projectAPI.delete(id);
        
        console.log('🗑️ DELETE /api/projects - Deleted:', id);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
