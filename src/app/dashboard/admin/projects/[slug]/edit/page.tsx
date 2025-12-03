'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProjectEditorPage } from '@/components/dashboard/project-editor';
import { projectAPI } from '@/lib/api';
import { ProjectEditorData, EditorMediaItem, EditorDownloadItem, EditorFAQItem, EditorRecommendedItem, SEOData } from '@/types/editor';
import type { Project } from '@/types';

// Helper function to convert Project to ProjectEditorData
function convertToEditorData(existingProject: Project): ProjectEditorData {
    // Convert gallery to EditorMediaItem format
    const gallery: EditorMediaItem[] = ((existingProject as any).gallery || existingProject.images || []).map((item: any, index: number) => ({
        id: `gallery-${index}`,
        type: 'image' as const,
        url: typeof item === 'string' ? item : item.url || '',
        altText: typeof item === 'string' ? `Project image ${index + 1}` : item.altText || `Project image ${index + 1}`,
        source: 'url' as const,
        orderIndex: index
    }));
    
    // Convert downloads to EditorDownloadItem format
    const downloads: EditorDownloadItem[] = ((existingProject as any).downloads || []).map((dl: any, index: number) => ({
        id: `download-${index}`,
        title: dl.title || dl.label || 'Download',
        url: dl.url || dl.fileUrl || '',
        fileType: dl.fileType || '',
        fileSize: dl.fileSize || '',
        source: 'url' as const,
        orderIndex: index
    }));
    
    // Convert FAQs to EditorFAQItem format
    const faqs: EditorFAQItem[] = ((existingProject as any).faqs || []).map((faq: any, index: number) => ({
        id: faq.id || `faq-${index}`,
        question: faq.question || '',
        answer: faq.answer || '',
        orderIndex: index
    }));
    
    // Convert recommended to EditorRecommendedItem format
    const recommended: EditorRecommendedItem[] = ((existingProject as any).recommended || []).map((rec: any, index: number) => ({
        id: rec.id || `rec-${index}`,
        slug: rec.slug || '',
        type: rec.type || 'project',
        title: rec.title,
        thumbnail: rec.thumbnail,
        orderIndex: index
    }));
    
    // Convert SEO data
    const seo: SEOData | undefined = (existingProject as any).seo ? {
        seoTitle: (existingProject as any).seo.seoTitle || (existingProject as any).seo.title,
        metaDescription: (existingProject as any).seo.metaDescription || (existingProject as any).seo.description,
        primaryKeyword: (existingProject as any).seo.primaryKeyword,
        secondaryKeywords: (existingProject as any).seo.secondaryKeywords || (existingProject as any).seo.keywords,
        searchIntent: (existingProject as any).seo.searchIntent,
        schemaType: (existingProject as any).seo.schemaType,
        robotsMeta: (existingProject as any).seo.robotsMeta,
        twitterCard: (existingProject as any).seo.twitterCard,
        openGraph: (existingProject as any).seo.openGraph,
    } : undefined;
    
    return {
        id: existingProject.id,
        name: existingProject.name,
        slug: existingProject.slug,
        description: existingProject.description,
        content: (existingProject as any).content || '',
        contentFormat: 'markdown',
        thumbnail: existingProject.images?.[0] || '',
        images: gallery,
        techStack: existingProject.techStack || [],
        category: '',
        liveLink: existingProject.liveLink || '',
        repoLink: existingProject.repoLink || '',
        publishDate: existingProject.publishDate || new Date().toISOString().split('T')[0],
        status: (existingProject.status as any) === 'completed' || (existingProject.status as any) === 'in-progress' ? 'published' : 'draft',
        projectStatus: ((existingProject as any).projectStatus || existingProject.status || 'in-progress') as 'completed' | 'in-progress' | 'paused',
        progress: existingProject.progress || 0,
        featured: existingProject.featured || false,
        clientInfo: (existingProject as any).clientInfo || '',
        gallery,
        downloads,
        faqs,
        recommended,
        toc: [],
        seo,
    };
}

export default function EditProjectPage() {
    const params = useParams();
    const slug = params.slug as string;
    
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Load project from API (uses localStorage in development)
    useEffect(() => {
        async function loadProject() {
            try {
                setLoading(true);
                const fetchedProject = await projectAPI.getBySlug(slug);
                if (fetchedProject) {
                    setProject(fetchedProject);
                } else {
                    setError('Project not found');
                }
            } catch (err) {
                console.error('Error loading project:', err);
                setError('Failed to load project');
            } finally {
                setLoading(false);
            }
        }
        
        loadProject();
    }, [slug]);
    
    if (loading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-[#F5C542] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[#2C2416] font-bold">Loading project...</span>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error || !project) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                    <h1 className="text-2xl font-black text-[#2C2416] mb-2">Project Not Found</h1>
                    <p className="text-[#2C2416]/60">The project with slug &quot;{slug}&quot; does not exist.</p>
                </div>
            </div>
        );
    }
    
    const initialData = convertToEditorData(project);
    
    return <ProjectEditorPage initialData={initialData} projectId={project.id} />;
}
