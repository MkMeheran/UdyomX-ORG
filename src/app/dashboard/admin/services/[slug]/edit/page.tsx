'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ServiceEditorPage } from '@/components/dashboard/service-editor';
import { serviceAPI } from '@/lib/api';
import { ServiceEditorData } from '@/types/editor';
import { Loader2 } from 'lucide-react';

export default function EditServicePage() {
    const params = useParams();
    const slug = params.slug as string;
    const [initialData, setInitialData] = useState<ServiceEditorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchService = async () => {
            try {
                const service = await serviceAPI.getBySlug(slug);
                if (!service) {
                    setError('Service not found');
                    return;
                }
                
                // Convert API response to editor format
                const editorData: ServiceEditorData = {
                    id: service.id,
                    slug: service.slug,
                    title: service.title || '',
                    hookLine: (service as any).hookLine || '',
                    description: service.description || '',
                    contentFormat: (service as any).contentFormat || 'html',
                    category: service.category || '',
                    thumbnail: service.thumbnail || '',
                    coverImage: (service as any).coverImage || service.thumbnail || '',
                    publishDate: ((service as any).publishDate || new Date().toISOString()).split('T')[0],
                    status: service.status || 'draft',
                    theme: 'earth-ink',
                    showGallery: (service as any).showGallery ?? false,
                    showDownloads: (service as any).showDownloads ?? false,
                    // Features
                    features: ((service as any).features || []).map((f: any) => ({
                        id: f.id || Math.random().toString(36).slice(2),
                        icon: f.icon || '',
                        title: f.title || '',
                        description: f.description || ''
                    })),
                    packages: ((service as any).packages || []).map((p: any) => ({
                        id: p.id || Math.random().toString(36).slice(2),
                        title: p.title || '',
                        price: p.price || 0,
                        discountPrice: p.discountPrice,
                        features: Array.isArray(p.features) ? p.features : [],
                        deliveryTime: p.deliveryTime || p.delivery_time || '',
                        revisions: p.revisions || 1,
                        isPopular: p.isPopular || p.is_popular || false
                    })),
                    problems: ((service as any).problems || []).map((p: any) => ({
                        id: p.id || Math.random().toString(36).slice(2),
                        text: p.text || ''
                    })),
                    solutions: ((service as any).solutions || []).map((s: any) => ({
                        id: s.id || Math.random().toString(36).slice(2),
                        text: s.text || ''
                    })),
                    testimonials: ((service as any).testimonials || []).map((t: any) => ({
                        id: t.id || Math.random().toString(36).slice(2),
                        name: t.name || '',
                        avatar: t.avatar || '',
                        rating: t.rating || 5,
                        quote: t.quote || ''
                    })),
                    // Sections
                    gallery: ((service as any).gallery || []).map((g: any) => ({
                        id: g.id || Math.random().toString(36).slice(2),
                        type: g.type || 'image',
                        url: g.url || '',
                        thumbnailUrl: g.thumbnailUrl || '',
                        caption: g.caption || ''
                    })),
                    downloads: ((service as any).downloads || []).map((d: any) => ({
                        id: d.id || Math.random().toString(36).slice(2),
                        title: d.label || '',
                        url: d.fileUrl || '',
                        fileSize: d.fileSize || '',
                        fileType: d.fileType || '',
                        source: 'upload' as const,
                        orderIndex: d.orderIndex || 0
                    })),
                    faqs: ((service as any).faqs || []).map((f: any) => ({
                        id: f.id || Math.random().toString(36).slice(2),
                        question: f.question || '',
                        answer: f.answer || ''
                    })),
                    relatedProjects: ((service as any).relatedProjects || []).map((p: any) => ({
                        id: p.id || Math.random().toString(36).slice(2),
                        slug: p.slug || '',
                        title: p.name || p.title || '',
                        thumbnail: p.thumbnail || '',
                        type: 'project' as const
                    })),
                    toc: [],
                    // SEO Fields
                    seoTitle: (service as any).seoTitle || '',
                    seoDescription: (service as any).seoDescription || '',
                    seoKeywords: (service as any).seoKeywords || [],
                    seoImage: (service as any).seoImage || '',
                    canonicalUrl: (service as any).canonicalUrl || '',
                    // AI/LLM SEO
                    shortSummary: (service as any).shortSummary || '',
                    longSummary: (service as any).longSummary || '',
                    painPoints: (service as any).painPoints || [],
                    solutionsOffered: (service as any).solutionsOffered || [],
                    keyBenefits: (service as any).keyBenefits || [],
                    pricing: (service as any).pricing || '',
                    useCases: (service as any).useCases || [],
                    targetAudience: (service as any).targetAudience || '',
                    toolsUsed: (service as any).toolsUsed || [],
                    // Visual
                    clientLogos: (service as any).clientLogos || [],
                    // Technical SEO
                    ogTitle: (service as any).ogTitle || '',
                    ogDescription: (service as any).ogDescription || '',
                    ogImage: (service as any).ogImage || '',
                    twitterCard: (service as any).twitterCard || 'summary_large_image',
                    indexable: (service as any).indexable ?? true,
                    sitemapPriority: (service as any).sitemapPriority || 0.5,
                    lastUpdated: (service as any).lastUpdated || '',
                    // Contact
                    contactWhatsApp: (service as any).contactWhatsApp || '',
                    contactTelegram: (service as any).contactTelegram || '',
                    contactTwitter: (service as any).contactTwitter || '',
                    contactInstagram: (service as any).contactInstagram || '',
                    contactFacebook: (service as any).contactFacebook || '',
                    contactLinkedIn: (service as any).contactLinkedIn || '',
                    contactEmail: (service as any).contactEmail || ''
                };
                
                setInitialData(editorData);
            } catch (err) {
                console.error('Failed to fetch service:', err);
                setError('Failed to load service');
            } finally {
                setLoading(false);
            }
        };
        
        fetchService();
    }, [slug]);
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
                <div className="flex items-center gap-3 text-[#2C2416]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="font-bold">Loading service...</span>
                </div>
            </div>
        );
    }
    
    if (error || !initialData) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                    <h1 className="text-2xl font-black text-[#2C2416] mb-2">Service Not Found</h1>
                    <p className="text-[#2C2416]/60">The service with slug "{slug}" does not exist or failed to load.</p>
                </div>
            </div>
        );
    }
    
    return <ServiceEditorPage initialData={initialData} serviceId={initialData.id} />;
}
