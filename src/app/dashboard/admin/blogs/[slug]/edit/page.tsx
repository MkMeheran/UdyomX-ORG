'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PostEditorPage } from '@/components/dashboard/post-editor';
import { blogAPI } from '@/lib/api';
import type { PostEditorData, EditorMediaItem, EditorDownloadItem, EditorFAQItem, EditorRecommendedItem, SEOData } from '@/types/editor';
import type { BlogPost } from '@/types';

// Helper function to convert BlogPost to PostEditorData
function convertToEditorData(existingPost: BlogPost): Partial<PostEditorData> {
    // Convert gallery (array of URLs) to EditorMediaItem format
    const gallery: EditorMediaItem[] = (existingPost.gallery || []).map((url, index) => ({
        id: `gallery-${index}`,
        type: 'image' as const,
        url: typeof url === 'string' ? url : (url as any).url || '',
        altText: `Gallery image ${index + 1}`,
        source: 'url' as const,
        orderIndex: index
    }));
    
    // Convert downloads to EditorDownloadItem format
    const downloads: EditorDownloadItem[] = (existingPost.downloads || []).map((dl, index) => ({
        id: `download-${index}`,
        title: (dl as any).label || (dl as any).title || 'Download',
        url: (dl as any).fileUrl || (dl as any).url || '',
        fileType: (dl as any).fileType || '',
        fileSize: (dl as any).fileSize || '',
        source: 'url' as const,
        orderIndex: index
    }));
    
    // Convert FAQs to EditorFAQItem format
    const faqs: EditorFAQItem[] = (existingPost.faqs || []).map((faq, index) => ({
        id: `faq-${index}`,
        question: (faq as any).question || '',
        answer: (faq as any).answer || '',
        orderIndex: index
    }));
    
    // Convert recommended to EditorRecommendedItem format
    const recommended: EditorRecommendedItem[] = (existingPost.recommendedContent || []).map((rec, index) => ({
        id: `rec-${index}`,
        slug: (rec as any).url?.replace('/blog/', '').replace('/projects/', '').replace('/services/', '') || '',
        type: ((rec as any).type || 'post') as 'post' | 'project' | 'service',
        orderIndex: index
    }));
    
    // Convert SEO data
    const seo: SEOData | undefined = (existingPost as any).seo ? {
        seoTitle: (existingPost as any).seo.seoTitle || (existingPost as any).seo.title,
        metaDescription: (existingPost as any).seo.metaDescription || (existingPost as any).seo.description,
        primaryKeyword: (existingPost as any).seo.primaryKeyword,
        secondaryKeywords: (existingPost as any).seo.secondaryKeywords || (existingPost as any).seo.keywords,
        searchIntent: (existingPost as any).seo.searchIntent,
        schemaType: (existingPost as any).seo.schemaType,
        robotsMeta: (existingPost as any).seo.robotsMeta,
        twitterCard: (existingPost as any).seo.twitterCard,
        openGraph: (existingPost as any).seo.openGraph,
    } : undefined;
    
    return {
        id: existingPost.id,
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt || '',
        content: existingPost.content || '',
        contentFormat: (existingPost as any).contentFormat || 'markdown',
        coverImage: existingPost.thumbnail || existingPost.coverImage || '',
        category: existingPost.category || '',
        tags: existingPost.tags || [],
        status: (existingPost.status as 'draft' | 'published') || 'published',
        visibility: 'public',
        author: existingPost.author || '',
        authorAvatar: existingPost.authorAvatar || '',
        toc: existingPost.toc || [],
        gallery,
        downloads,
        faqs,
        recommended,
        publishDate: existingPost.publishDate || new Date().toISOString().split('T')[0],
        layout: existingPost.layout || 'standard',
        readTime: existingPost.readTime || '1 min read',
        seo,
    };
}

export default function EditBlogPage() {
    const params = useParams();
    const slug = params.slug as string;
    
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Load post from API (uses localStorage in development)
    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);
                const fetchedPost = await blogAPI.getBySlug(slug);
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    setError('Post not found');
                }
            } catch (err) {
                console.error('Error loading post:', err);
                setError('Failed to load post');
            } finally {
                setLoading(false);
            }
        }
        
        loadPost();
    }, [slug]);
    
    if (loading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-[#F5C542] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[#2C2416] font-bold">Loading post...</span>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error || !post) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                    <h1 className="text-2xl font-black text-[#2C2416] mb-2">Post Not Found</h1>
                    <p className="text-[#2C2416]/60">The blog post with slug &quot;{slug}&quot; does not exist.</p>
                </div>
            </div>
        );
    }
    
    const initialData = convertToEditorData(post);
    
    return <PostEditorPage initialData={initialData} postId={post.id} />;
}
