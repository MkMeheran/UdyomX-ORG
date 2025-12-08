'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Star, ChevronDown, ChevronUp, Upload, HardDrive, DollarSign, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { generateId, generateUniqueSlug, getSlugsByType, generateSlug } from '@/lib/slug-utils';
import { serviceAPI } from '@/lib/api';
import { uploadThumbnail } from '@/lib/supabase/storage';
import { Tabs, TabsList, TabsTrigger, TabsContent, Select, SelectOption, Switch, Label, Badge } from '@/components/ui/dashboard-components';
import { SlugInput } from '@/components/dashboard/slug-input';
import { ContentEditor } from '@/components/dashboard/content-editor';
import { GalleryEditor } from '@/components/dashboard/gallery-editor';
import { DownloadEditor } from '@/components/dashboard/download-editor';
import { FAQEditor } from '@/components/dashboard/faq-editor';
import { RecommendedEditor } from '@/components/dashboard/recommended-editor';
import { ContentPreview } from '@/components/dashboard/content-preview';
import type { ServiceEditorData, ServiceFeatureEditor, ServicePackageEditor, ServiceProblemEditor, ServiceSolutionEditor, TestimonialEditor, ContentFormat, EditorTOCItem } from '@/types/editor';

// Lucide icons list for features - expanded for better variety
const featureIcons = [
    'Smartphone', 'Search', 'Zap', 'Shield', 'Code', 'Headphones', 'Users', 'Layout', 
    'Paintbrush', 'MousePointer', 'Book', 'Building', 'Layers', 'FileCode', 'TrendingUp', 
    'Star', 'Heart', 'Globe', 'Settings', 'Check', 'Rocket', 'Target', 'Award', 'Clock',
    'Lock', 'Unlock', 'Database', 'Server', 'Cloud', 'Wifi', 'Mail', 'MessageSquare',
    'Phone', 'Video', 'Camera', 'Image', 'File', 'Folder', 'Download', 'Upload',
    'RefreshCw', 'RotateCw', 'Maximize', 'Minimize', 'Edit', 'Trash', 'Copy', 'Clipboard',
    'Link', 'ExternalLink', 'Share', 'Package', 'Box', 'Archive', 'ShoppingCart', 'CreditCard',
    'DollarSign', 'TrendingDown', 'BarChart', 'PieChart', 'Activity', 'Cpu', 'HardDrive', 'Monitor'
];

// Initial empty service data
const initialServiceData: ServiceEditorData = {
    slug: '',
    title: '',
    hookLine: '',
    description: '',
    contentFormat: 'html',
    category: '',
    thumbnail: '',
    coverImage: '',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    theme: 'earth-ink',
    showGallery: true,
    showDownloads: true,
    features: [],
    packages: [],
    problems: [],
    solutions: [],
    testimonials: [],
    gallery: [],
    downloads: [],
    faqs: [],
    relatedProjects: [],
    toc: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    seoImage: ''
};

const serviceCategories = ['Development', 'Design', 'Consulting', 'Marketing', 'Training', 'Support', 'Other'];

interface ServiceEditorPageProps {
    serviceId?: string;
    initialData?: ServiceEditorData;
}

export function ServiceEditorPage({ serviceId, initialData }: ServiceEditorPageProps) {
    const [data, setData] = useState<ServiceEditorData>(() => ({
        ...initialServiceData,
        ...initialData,
        status: initialData?.status || 'draft'
    }));
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const thumbnailInputRef = React.useRef<HTMLInputElement>(null);
    
    const isEditing = !!serviceId;
    
    // Safe display values
    const displayStatus = data.status || 'draft';
    
    // Upload status state
    const [coverUploadStatus, setCoverUploadStatus] = useState<{
        uploading: boolean;
        message?: string;
        error?: string;
    }>({ uploading: false });
    
    // Handle image upload from device (Supabase storage - syncs both thumbnail and coverImage)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCoverUploadStatus({ uploading: true, message: `Uploading ${file.name}...` });

        try {
            const folderSlug = data.slug || (data.title ? generateSlug(data.title) : 'service-covers');
            const result = await uploadThumbnail(file, `service-covers/${folderSlug}`);

            if (!result.success || !result.url) {
                throw new Error(result.error || 'Upload failed. Please try again.');
            }

            // Set both thumbnail and coverImage to same value
            setData(prev => ({
                ...prev,
                thumbnail: result.url,
                coverImage: result.url,
            }));

            setCoverUploadStatus({ uploading: false, message: '✅ Uploaded to Supabase storage.' });
        } catch (error: any) {
            console.error('Cover upload failed:', error);
            setCoverUploadStatus({
                uploading: false,
                error: error.message || 'Failed to upload cover image.',
            });
        } finally {
            e.target.value = '';
        }
    };
    
    // Handle image from Google Drive (syncs both thumbnail and coverImage)
    const handleImageFromDrive = () => {
        window.open('https://drive.google.com/drive/my-drive', '_blank', 'width=900,height=700');
        setTimeout(() => {
            const driveUrl = window.prompt('Copy the shareable link from Google Drive and paste it here:');
            if (driveUrl) {
                let directUrl = driveUrl;
                const fileIdMatch = driveUrl.match(/\/d\/([^\/]+)/);
                if (fileIdMatch) {
                    directUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                }
                // Set both thumbnail and coverImage to same value
                setData(prev => ({ ...prev, thumbnail: directUrl, coverImage: directUrl }));
            }
        }, 1000);
    };
    
    // Handle image URL change (syncs both thumbnail and coverImage)
    const handleImageUrlChange = (url: string) => {
        setData(prev => ({ ...prev, thumbnail: url, coverImage: url }));
    };
    
    // Track changes
    useEffect(() => {
        setHasChanges(true);
    }, [data]);
    
    // Auto-populate SEO fields when key fields change
    useEffect(() => {
        setData(prev => {
            const updates: Partial<ServiceEditorData> = {};
            
            // Auto-populate ogImage from thumbnail if empty
            if (prev.thumbnail && !prev.ogImage && !prev.seoImage) {
                updates.ogImage = prev.thumbnail;
                updates.seoImage = prev.thumbnail;
            }
            
            // Auto-populate ogTitle from seoTitle or title if empty
            if (!prev.ogTitle && (prev.seoTitle || prev.title)) {
                updates.ogTitle = prev.seoTitle || prev.title;
            }
            
            // Auto-populate ogDescription from seoDescription or hookLine if empty
            if (!prev.ogDescription && (prev.seoDescription || prev.hookLine)) {
                updates.ogDescription = prev.seoDescription || prev.hookLine;
            }
            
            // Auto-set twitterCard default if empty
            if (!prev.twitterCard) {
                updates.twitterCard = 'summary_large_image';
            }
            
            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
                return { ...prev, ...updates };
            }
            return prev;
        });
    }, [data.thumbnail, data.title, data.seoTitle, data.hookLine, data.seoDescription]);
    
    // Auto-generate slug from title if empty
    useEffect(() => {
        if (!data.title || data.slug) return;

        let isCancelled = false;
        (async () => {
            try {
                const existingSlugs = await getSlugsByType('service');
                const newSlug = await generateUniqueSlug(data.title, existingSlugs);
                if (!isCancelled) {
                    setData(prev => (prev.slug ? prev : { ...prev, slug: newSlug }));
                }
            } catch (error) {
                console.error('Failed to auto-generate service slug', error);
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [data.title, data.slug]);
    
    // Update field
    const updateField = useCallback(<K extends keyof ServiceEditorData>(field: K, value: ServiceEditorData[K]) => {
        setData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    // Handle TOC update
    const handleTOCChange = useCallback((toc: EditorTOCItem[]) => {
        setData(prev => ({ ...prev, toc }));
    }, []);
    
    // Feature handlers
    const addFeature = useCallback(() => {
        const newFeature: ServiceFeatureEditor = {
            id: generateId(),
            icon: 'Star',
            title: '',
            description: '',
            orderIndex: data.features.length
        };
        updateField('features', [...data.features, newFeature]);
    }, [data.features, updateField]);
    
    const updateFeature = useCallback((id: string, updates: Partial<ServiceFeatureEditor>) => {
        updateField('features', data.features.map(f => 
            f.id === id ? { ...f, ...updates } : f
        ));
    }, [data.features, updateField]);
    
    const removeFeature = useCallback((id: string) => {
        updateField('features', data.features.filter(f => f.id !== id).map((f, idx) => ({ ...f, orderIndex: idx })));
    }, [data.features, updateField]);
    
    // Package handlers
    const addPackage = useCallback(() => {
        const newPackage: ServicePackageEditor = {
            id: generateId(),
            title: '',
            price: 0,
            features: [],
            deliveryTime: '',
            revisions: 1,
            isPopular: false,
            orderIndex: data.packages.length
        };
        updateField('packages', [...data.packages, newPackage]);
    }, [data.packages, updateField]);
    
    const updatePackage = useCallback((id: string, updates: Partial<ServicePackageEditor>) => {
        console.log('📦 updatePackage:', id, updates);
        updateField('packages', data.packages.map(p => 
            p.id === id ? { ...p, ...updates } : p
        ));
    }, [data.packages, updateField]);
    
    const removePackage = useCallback((id: string) => {
        updateField('packages', data.packages.filter(p => p.id !== id).map((p, idx) => ({ ...p, orderIndex: idx })));
    }, [data.packages, updateField]);
    
    // Problem/Solution handlers
    const addProblem = useCallback(() => {
        const newProblem: ServiceProblemEditor = {
            id: generateId(),
            text: '',
            orderIndex: data.problems.length
        };
        updateField('problems', [...data.problems, newProblem]);
    }, [data.problems, updateField]);
    
    const addSolution = useCallback(() => {
        const newSolution: ServiceSolutionEditor = {
            id: generateId(),
            text: '',
            orderIndex: data.solutions.length
        };
        updateField('solutions', [...data.solutions, newSolution]);
    }, [data.solutions, updateField]);
    
    // Testimonial handlers
    const addTestimonial = useCallback(() => {
        const newTestimonial: TestimonialEditor = {
            id: generateId(),
            name: '',
            avatar: '',
            rating: 5,
            quote: '',
            createdAt: new Date().toISOString().split('T')[0],
            orderIndex: data.testimonials.length
        };
        updateField('testimonials', [...data.testimonials, newTestimonial]);
    }, [data.testimonials, updateField]);
    
    const updateTestimonial = useCallback((id: string, updates: Partial<TestimonialEditor>) => {
        updateField('testimonials', data.testimonials.map(t => 
            t.id === id ? { ...t, ...updates } : t
        ));
    }, [data.testimonials, updateField]);
    
    const removeTestimonial = useCallback((id: string) => {
        updateField('testimonials', data.testimonials.filter(t => t.id !== id));
    }, [data.testimonials, updateField]);
    
    const router = useRouter();
    
    // Save handler
    const handleSave = useCallback(async () => {
        if (!data.slug || !data.title) {
            alert('Please fill in title and slug');
            return;
        }
        
        setIsSaving(true);
        try {
            // Transform editor data to API format
            const servicePayload = {
                slug: data.slug,
                title: data.title,
                hookLine: data.hookLine,
                description: data.description,
                contentFormat: data.contentFormat,
                category: data.category,
                thumbnail: data.thumbnail,
                coverImage: data.coverImage || data.thumbnail,
                status: data.status,
                showGallery: data.showGallery,
                showDownloads: data.showDownloads,
                publishDate: data.publishDate,
                // SEO Fields
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                seoKeywords: data.seoKeywords,
                seoImage: data.seoImage,
                canonicalUrl: data.canonicalUrl,
                // AI/LLM SEO
                shortSummary: data.shortSummary,
                longSummary: data.longSummary,
                painPoints: data.painPoints,
                solutionsOffered: data.solutionsOffered,
                keyBenefits: data.keyBenefits,
                pricing: data.pricing,
                useCases: data.useCases,
                targetAudience: data.targetAudience,
                toolsUsed: data.toolsUsed,
                // Visual
                clientLogos: data.clientLogos,
                // Technical SEO
                ogTitle: data.ogTitle,
                ogDescription: data.ogDescription,
                ogImage: data.ogImage,
                twitterCard: data.twitterCard,
                indexable: data.indexable,
                sitemapPriority: data.sitemapPriority,
                lastUpdated: new Date().toISOString(),
                // Contact
                contactWhatsApp: data.contactWhatsApp,
                contactTelegram: data.contactTelegram,
                contactTwitter: data.contactTwitter,
                contactInstagram: data.contactInstagram,
                contactFacebook: data.contactFacebook,
                contactLinkedIn: data.contactLinkedIn,
                contactEmail: data.contactEmail,
                // Relations
                features: data.features.map((f, idx) => ({
                    icon: f.icon,
                    title: f.title,
                    description: f.description,
                    orderIndex: idx
                })),
                packages: data.packages.map((p, idx) => ({
                    title: p.title,
                    price: p.price,
                    discountPrice: p.discountPrice,
                    features: p.features.filter(Boolean),
                    deliveryTime: p.deliveryTime,
                    revisions: p.revisions,
                    isPopular: p.isPopular,
                    orderIndex: idx
                })),
                problems: data.problems.map((p, idx) => ({
                    text: p.text,
                    orderIndex: idx
                })),
                solutions: data.solutions.map((s, idx) => ({
                    text: s.text,
                    orderIndex: idx
                })),
                testimonials: data.testimonials.map((t, idx) => ({
                    name: t.name,
                    avatar: t.avatar,
                    rating: t.rating,
                    quote: t.quote,
                    orderIndex: idx
                })),
                gallery: data.gallery.map((g, idx) => ({
                    type: g.type,
                    url: g.url,
                    thumbnailUrl: g.thumbnailUrl,
                    caption: g.caption,
                    orderIndex: idx
                })),
                downloads: data.downloads.map((d, idx) => ({
                    fileUrl: d.url,
                    label: d.title,
                    fileSize: d.fileSize,
                    fileType: d.fileType,
                    orderIndex: idx
                })),
                faqs: data.faqs.map((f, idx) => ({
                    question: f.question,
                    answer: f.answer,
                    orderIndex: idx
                })),
                relatedProjects: data.relatedProjects.map(p => p.slug)
            };
            
            if (isEditing && initialData?.slug) {
                await serviceAPI.update(initialData.slug, servicePayload);
            } else {
                await serviceAPI.create(servicePayload);
            }
            
            // Revalidate cache for this service and listing pages
            try {
                await fetch('/api/revalidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        path: `/services/${data.slug}`,
                        type: 'service' 
                    })
                });
            } catch (revalidateError) {
                console.warn('Cache revalidation failed:', revalidateError);
            }
            
            setHasChanges(false);
            alert('Service saved successfully!');
            router.push('/dashboard/admin/services');
        } catch (error: any) {
            console.error('Error saving service:', error);
            const errorMessage = error?.details || error?.message || 'Unknown error';
            const errorCode = error?.code ? ` (Code: ${error.code})` : '';
            alert(`Failed to save service: ${errorMessage}${errorCode}\n\nCheck console for more details.`);
        } finally {
            setIsSaving(false);
        }
    }, [data, isEditing, initialData?.slug, router]);
    
    return (
        <div className="min-h-screen bg-[#F5F1E8]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#F5F1E8] border-b-4 border-[#2C2416] shadow-[0_4px_0_rgba(44,36,22,0.2)]">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/dashboard/services"
                                className="p-2 hover:bg-[#2C2416]/10 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black text-[#2C2416]">
                                    {isEditing ? 'Edit Service' : 'Create New Service'}
                                </h1>
                                <p className="text-sm text-[#2C2416]/60">
                                    {data.title || 'Untitled'} 
                                    {hasChanges && <span className="text-orange-500"> • Unsaved changes</span>}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Badge variant={displayStatus === 'published' ? 'success' : displayStatus === 'draft' ? 'warning' : 'default'}>
                                {displayStatus.toUpperCase()}
                            </Badge>
                            
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    'flex items-center gap-2 px-6 py-2 font-bold border-4 border-[#2C2416] transition-all',
                                    'bg-[#F5C542] hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)]',
                                    isSaving && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6 flex-wrap">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="problems">Problems & Solutions</TabsTrigger>
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="packages">Packages</TabsTrigger>
                        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                        <TabsTrigger value="media">Gallery & Downloads</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                        <TabsTrigger value="related">Related Projects</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    {/* Basic Info Tab */}
                    <TabsContent value="basic">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label required>Service Title</Label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        placeholder="Enter service title..."
                                        className="w-full px-4 py-3 mt-2 text-xl font-bold border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                </div>
                                
                                {/* Slug */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <SlugInput
                                        value={data.slug}
                                        onChange={(slug) => updateField('slug', slug)}
                                        type="service"
                                        title={data.title}
                                    />
                                </div>
                                
                                {/* Hook Line */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Hook Line</Label>
                                    <input
                                        type="text"
                                        value={data.hookLine || ''}
                                        onChange={(e) => updateField('hookLine', e.target.value)}
                                        placeholder="A catchy one-liner about this service..."
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                </div>
                                
                                {/* Service Image (1.91:1 ratio - used for both card and cover) */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Service Image (Card & Cover)</Label>
                                    <p className="text-xs text-[#2C2416]/60 mt-1 mb-3">
                                        Recommended ratio: 1.91:1 (e.g., 1200×628px). Used for both service card and cover image.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => thumbnailInputRef.current?.click()}
                                            disabled={coverUploadStatus.uploading}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-[#2C2416] font-bold text-xs hover:bg-[#F5C542] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Upload className="w-3 h-3" />
                                            Upload from Device
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleImageFromDrive}
                                            disabled={coverUploadStatus.uploading}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-[#2C2416] font-bold text-xs hover:bg-[#F5C542] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <HardDrive className="w-3 h-3" />
                                            Google Drive
                                        </button>
                                    </div>
                                    
                                    {/* Upload Status Messages */}
                                    {coverUploadStatus.uploading && (
                                        <p className="text-xs text-blue-600 mb-2 font-medium">
                                            {coverUploadStatus.message}
                                        </p>
                                    )}
                                    {!coverUploadStatus.uploading && coverUploadStatus.message && (
                                        <p className="text-xs text-green-600 mb-2 font-medium">
                                            {coverUploadStatus.message}
                                        </p>
                                    )}
                                    {coverUploadStatus.error && (
                                        <p className="text-xs text-red-600 mb-2 font-medium">
                                            {coverUploadStatus.error}
                                        </p>
                                    )}
                                    
                                    <input
                                        ref={thumbnailInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <input
                                        type="url"
                                        value={data.thumbnail || ''}
                                        onChange={(e) => handleImageUrlChange(e.target.value)}
                                        placeholder="Or paste image URL..."
                                        className="w-full px-4 py-3 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                    {data.thumbnail && (
                                        <div className="mt-3 bg-[#F5F1E8] border-2 border-[#2C2416]/30 overflow-hidden" style={{ aspectRatio: '1.91/1' }}>
                                            <img src={data.thumbnail} alt="Service" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Category */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Category</Label>
                                    <Select 
                                        value={data.category || ''}
                                        onValueChange={(value) => updateField('category', value)}
                                        placeholder="Select category..."
                                        className="mt-2"
                                    >
                                        {serviceCategories.map(cat => (
                                            <SelectOption key={cat} value={cat}>{cat}</SelectOption>
                                        ))}
                                    </Select>
                                </div>
                                
                                {/* Display Options */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)] space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Show Gallery</Label>
                                        <Switch
                                            checked={data.showGallery}
                                            onCheckedChange={(checked) => updateField('showGallery', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Show Downloads</Label>
                                        <Switch
                                            checked={data.showDownloads}
                                            onCheckedChange={(checked) => updateField('showDownloads', checked)}
                                        />
                                    </div>
                                </div>
                                
                                {/* Publish Date */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Publish Date</Label>
                                    <input
                                        type="date"
                                        value={data.publishDate}
                                        onChange={(e) => updateField('publishDate', e.target.value)}
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                </div>
                                
                                {/* Status */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Status</Label>
                                    <Select 
                                        value={data.status}
                                        onValueChange={(value) => updateField('status', value as ServiceEditorData['status'])}
                                        className="mt-2"
                                    >
                                        <SelectOption value="draft">Draft</SelectOption>
                                        <SelectOption value="published">Published</SelectOption>
                                        <SelectOption value="archived">Archived</SelectOption>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Description Tab */}
                    <TabsContent value="description">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <ContentEditor
                                content={data.description}
                                onChange={(content) => updateField('description', content)}
                                format={data.contentFormat}
                                onFormatChange={(format) => updateField('contentFormat', format)}
                                onTOCChange={handleTOCChange}
                                placeholder="Write detailed service description..."
                                minHeight="400px"
                            />
                        </div>
                    </TabsContent>
                    
                    {/* Problems & Solutions Tab */}
                    <TabsContent value="problems">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Problems */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-[#2C2416]">Problems</h3>
                                    <button
                                        type="button"
                                        onClick={addProblem}
                                        className="flex items-center gap-2 px-3 py-1 bg-red-100 border-2 border-red-500 font-bold text-sm text-red-700 hover:bg-red-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.problems.map((problem, idx) => (
                                        <div key={problem.id} className="flex items-center gap-2">
                                            <span className="w-6 h-6 flex items-center justify-center bg-red-100 border-2 border-red-500 text-red-700 font-bold text-xs">
                                                {idx + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={problem.text}
                                                onChange={(e) => {
                                                    updateField('problems', data.problems.map(p => 
                                                        p.id === problem.id ? { ...p, text: e.target.value } : p
                                                    ));
                                                }}
                                                placeholder="Customer problem..."
                                                className="flex-1 px-3 py-2 border-2 border-[#2C2416] bg-[#F5F1E8] text-sm focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateField('problems', data.problems.filter(p => p.id !== problem.id))}
                                                className="p-1 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Solutions */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-[#2C2416]">Solutions</h3>
                                    <button
                                        type="button"
                                        onClick={addSolution}
                                        className="flex items-center gap-2 px-3 py-1 bg-green-100 border-2 border-green-500 font-bold text-sm text-green-700 hover:bg-green-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.solutions.map((solution, idx) => (
                                        <div key={solution.id} className="flex items-center gap-2">
                                            <span className="w-6 h-6 flex items-center justify-center bg-green-100 border-2 border-green-500 text-green-700 font-bold text-xs">
                                                {idx + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={solution.text}
                                                onChange={(e) => {
                                                    updateField('solutions', data.solutions.map(s => 
                                                        s.id === solution.id ? { ...s, text: e.target.value } : s
                                                    ));
                                                }}
                                                placeholder="Your solution..."
                                                className="flex-1 px-3 py-2 border-2 border-[#2C2416] bg-[#F5F1E8] text-sm focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateField('solutions', data.solutions.filter(s => s.id !== solution.id))}
                                                className="p-1 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Features Tab */}
                    <TabsContent value="features">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-[#2C2416]">Features ({data.features.length})</h3>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] border-4 border-[#2C2416] font-bold text-sm hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)]"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Feature
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {data.features.map((feature, idx) => {
                                    const IconComponent = require('lucide-react')[feature.icon];
                                    return (
                                        <div key={feature.id} className="p-4 bg-[#F5F1E8] border-4 border-[#2C2416]/30 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(feature.id)}
                                                className="absolute top-3 right-3 p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                title="Remove feature"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                                                <div className="md:col-span-1">
                                                    <label className="text-xs font-bold text-[#2C2416]/60 mb-2 block">Icon Preview</label>
                                                    <div className="w-16 h-16 bg-white border-2 border-[#2C2416] flex items-center justify-center">
                                                        {IconComponent && <IconComponent className="w-8 h-8 text-[#2C2416]" strokeWidth={2.5} />}
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-xs font-bold text-[#2C2416]/60 mb-2 block">Select Icon</label>
                                                    <Select
                                                        value={feature.icon}
                                                        onValueChange={(value) => updateFeature(feature.id, { icon: value })}
                                                    >
                                                        {featureIcons.map(icon => {
                                                            const Icon = require('lucide-react')[icon];
                                                            return (
                                                                <SelectOption key={icon} value={icon}>
                                                                    <div className="flex items-center gap-2">
                                                                        {Icon && <Icon className="w-4 h-4" />}
                                                                        <span>{icon}</span>
                                                                    </div>
                                                                </SelectOption>
                                                            );
                                                        })}
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-xs font-bold text-[#2C2416]/60 mb-2 block">Title</label>
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                                                        placeholder="Feature title..."
                                                        className="w-full px-3 py-2 border-2 border-[#2C2416] bg-white text-sm focus:outline-none focus:border-[#F5C542]"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-[#2C2416]/60 mb-2 block">
                                                    Description <span className="text-[10px] font-normal text-[#2C2416]/40">(Press Shift+Enter for new line)</span>
                                                </label>
                                                <textarea
                                                    value={feature.description}
                                                    onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        // Allow Shift+Enter for new lines
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    placeholder="Feature description... (Press Shift+Enter for multiple lines)"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border-2 border-[#2C2416] bg-white text-sm resize-y focus:outline-none focus:border-[#F5C542]"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Packages Tab */}
                    <TabsContent value="packages">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-[#2C2416]">Service Packages ({data.packages.length})</h3>
                                    <p className="text-xs text-[#2C2416]/60 mt-1">Create different pricing tiers for your service</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addPackage}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] border-4 border-[#2C2416] font-bold text-sm hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Package
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {data.packages.map((pkg, idx) => (
                                    <div key={pkg.id} className={cn(
                                        'p-6 border-4 rounded-lg relative transition-all',
                                        pkg.isPopular 
                                            ? 'border-[#F5C542] bg-gradient-to-br from-[#F5C542]/10 to-[#F5C542]/5 shadow-lg' 
                                            : 'border-[#2C2416]/30 bg-[#F5F1E8]'
                                    )}>
                                        {/* Popular Badge */}
                                        {pkg.isPopular && (
                                            <div className="absolute -top-3 left-6">
                                                <span className="px-3 py-1 bg-[#F5C542] border-2 border-[#2C2416] text-[#2C2416] text-xs font-black uppercase shadow-md">
                                                    ⭐ Popular
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4 gap-4">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-[#2C2416]/60 mb-1 block">Package Name</label>
                                                <input
                                                    type="text"
                                                    value={pkg.title}
                                                    onChange={(e) => updatePackage(pkg.id, { title: e.target.value })}
                                                    placeholder="e.g., Basic, Standard, Premium"
                                                    className="w-full font-bold text-xl bg-transparent border-b-3 border-[#2C2416] focus:outline-none focus:border-[#F5C542] transition-colors px-2 py-1"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updatePackage(pkg.id, { isPopular: !pkg.isPopular })}
                                                    className={cn(
                                                        "p-2 border-2 transition-colors rounded",
                                                        pkg.isPopular 
                                                            ? "bg-[#F5C542] border-[#2C2416] text-[#2C2416]" 
                                                            : "bg-white border-[#2C2416]/30 text-[#2C2416]/50 hover:border-[#F5C542]"
                                                    )}
                                                    title="Mark as popular"
                                                >
                                                    <Star className="w-5 h-5" fill={pkg.isPopular ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removePackage(pkg.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 border-2 border-red-300 hover:border-red-500 rounded transition-colors"
                                                    title="Remove package"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Pricing Section */}
                                        <div className="bg-white/50 p-4 rounded border-2 border-[#2C2416]/20 mb-4">
                                            <h4 className="text-sm font-black text-[#2C2416] mb-3 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Pricing & Delivery
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-[#2C2416]/60 mb-1 block">Price ($)</label>
                                                    <input
                                                        type="number"
                                                        value={pkg.price}
                                                        onChange={(e) => updatePackage(pkg.id, { price: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-3 py-2 border-2 border-[#2C2416] bg-white text-sm font-bold focus:outline-none focus:border-[#F5C542]"
                                                        placeholder="499"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#2C2416]/60 mb-1 block">Discount ($)</label>
                                                    <input
                                                        type="number"
                                                        value={pkg.discountPrice ?? ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            updatePackage(pkg.id, { 
                                                                discountPrice: val === '' ? undefined : parseInt(val) || 0 
                                                            });
                                                        }}
                                                        placeholder="Optional"
                                                        className="w-full px-3 py-2 border-2 border-[#2C2416] bg-white text-sm focus:outline-none focus:border-[#F5C542]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#2C2416]/60 mb-1 block">Delivery Time</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.deliveryTime}
                                                        onChange={(e) => updatePackage(pkg.id, { deliveryTime: e.target.value })}
                                                        placeholder="2-3 weeks"
                                                        className="w-full px-3 py-2 border-2 border-[#2C2416] bg-white text-sm focus:outline-none focus:border-[#F5C542]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#2C2416]/60 mb-1 block">Revisions</label>
                                                    <input
                                                        type="number"
                                                        value={pkg.revisions}
                                                        onChange={(e) => updatePackage(pkg.id, { revisions: parseInt(e.target.value) || 1 })}
                                                        min={1}
                                                        className="w-full px-3 py-2 border-2 border-[#2C2416] bg-white text-sm focus:outline-none focus:border-[#F5C542]"
                                                        placeholder="3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Features Section */}
                                        <div>
                                            <label className="text-sm font-black text-[#2C2416] mb-2 flex items-center gap-2">
                                                <Check className="w-4 h-4" />
                                                Package Features <span className="text-xs font-normal text-[#2C2416]/40">(one per line, Shift+Enter for new line)</span>
                                            </label>
                                            <textarea
                                                value={pkg.features.join('\n')}
                                                onChange={(e) => updatePackage(pkg.id, { features: e.target.value.split('\n') })}
                                                placeholder="✓ Responsive design&#10;✓ 5 pages included&#10;✓ SEO optimization&#10;✓ 3 revisions"
                                                rows={6}
                                                className="w-full px-4 py-3 border-2 border-[#2C2416] bg-white text-sm resize-y focus:outline-none focus:border-[#F5C542] font-mono leading-relaxed"
                                            />
                                            <p className="text-xs text-[#2C2416]/50 mt-1">💡 Tip: Start each feature with ✓ or • for better presentation</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Testimonials Tab */}
                    <TabsContent value="testimonials">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-[#2C2416]">Testimonials ({data.testimonials.length})</h3>
                                <button
                                    type="button"
                                    onClick={addTestimonial}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] border-4 border-[#2C2416] font-bold text-sm hover:shadow-[4px_4px_0_rgba(44,36,22,0.3)]"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Testimonial
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {data.testimonials.map((testimonial) => (
                                    <div key={testimonial.id} className="p-4 bg-[#F5F1E8] border-4 border-[#2C2416]/30">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                            <div>
                                                <label className="text-xs font-bold text-[#2C2416]/60">Name</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.name}
                                                    onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                                                    placeholder="Client name..."
                                                    className="w-full px-3 py-2 mt-1 border-2 border-[#2C2416] bg-white text-sm focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-[#2C2416]/60">Avatar URL</label>
                                                <input
                                                    type="url"
                                                    value={testimonial.avatar || ''}
                                                    onChange={(e) => updateTestimonial(testimonial.id, { avatar: e.target.value })}
                                                    placeholder="https://..."
                                                    className="w-full px-3 py-2 mt-1 border-2 border-[#2C2416] bg-white text-sm focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-[#2C2416]/60">Rating</label>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => updateTestimonial(testimonial.id, { rating: star })}
                                                            className="p-1"
                                                        >
                                                            <Star className={cn(
                                                                'w-5 h-5',
                                                                star <= testimonial.rating ? 'fill-[#F5C542] text-[#F5C542]' : 'text-[#2C2416]/30'
                                                            )} />
                                                        </button>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTestimonial(testimonial.id)}
                                                        className="ml-auto p-1 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-[#2C2416]/60">Quote</label>
                                            <textarea
                                                value={testimonial.quote}
                                                onChange={(e) => updateTestimonial(testimonial.id, { quote: e.target.value })}
                                                placeholder="What did they say..."
                                                rows={3}
                                                className="w-full px-3 py-2 mt-1 border-2 border-[#2C2416] bg-white text-sm resize-none focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Media Tab */}
                    <TabsContent value="media">
                        <div className="space-y-6">
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <GalleryEditor
                                    items={data.gallery}
                                    onChange={(gallery) => updateField('gallery', gallery)}
                                />
                            </div>
                            
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <DownloadEditor
                                    items={data.downloads}
                                    onChange={(downloads) => updateField('downloads', downloads)}
                                />
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* FAQ Tab */}
                    <TabsContent value="faq">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <FAQEditor
                                items={data.faqs}
                                onChange={(faqs) => updateField('faqs', faqs)}
                            />
                        </div>
                    </TabsContent>
                    
                    {/* Related Projects Tab */}
                    <TabsContent value="related">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <RecommendedEditor
                                items={data.relatedProjects}
                                onChange={(related) => updateField('relatedProjects', related)}
                                allowedTypes={['project']}
                                title="Related Projects"
                            />
                        </div>
                    </TabsContent>
                    
                    {/* SEO Tab */}
                    <TabsContent value="seo">
                        <div className="space-y-6">
                            {/* Basic SEO */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="text-lg font-black text-[#2C2416] mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                                    Basic SEO Fields
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Page Title (for Google ranking)</Label>
                                        <input
                                            type="text"
                                            value={data.seoTitle || ''}
                                            onChange={(e) => updateField('seoTitle', e.target.value)}
                                            placeholder={data.title || 'Enter SEO title...'}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                        <p className="text-xs text-[#2C2416]/60 mt-1">{(data.seoTitle || '').length}/60 chars recommended</p>
                                    </div>
                                    
                                    <div>
                                        <Label>Meta Description (for CTR boost)</Label>
                                        <textarea
                                            value={data.seoDescription || ''}
                                            onChange={(e) => updateField('seoDescription', e.target.value)}
                                            placeholder={data.hookLine || 'Enter SEO description...'}
                                            rows={3}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none"
                                        />
                                        <p className="text-xs text-[#2C2416]/60 mt-1">{(data.seoDescription || '').length}/160 chars recommended</p>
                                    </div>
                                    
                                    <div>
                                        <Label>Canonical URL (for duplicate avoidance)</Label>
                                        <input
                                            type="url"
                                            value={data.canonicalUrl || ''}
                                            onChange={(e) => updateField('canonicalUrl', e.target.value)}
                                            placeholder="https://udyomx.com/services/your-service"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Keywords (comma separated)</Label>
                                        <input
                                            type="text"
                                            value={(data.seoKeywords || []).join(', ')}
                                            onChange={(e) => updateField('seoKeywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                                            placeholder="web development, react, nextjs"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Service Info for AI/LLM */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="text-lg font-black text-[#2C2416] mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-purple-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                                    Service Info (AI Overview & LLM SEO)
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Short Summary (60-80 chars for AI Overview snippet)</Label>
                                        <input
                                            type="text"
                                            value={data.shortSummary || ''}
                                            onChange={(e) => updateField('shortSummary', e.target.value)}
                                            placeholder="Brief one-liner about this service"
                                            maxLength={80}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                        <p className="text-xs text-[#2C2416]/60 mt-1">{(data.shortSummary || '').length}/80 chars</p>
                                    </div>
                                    
                                    <div>
                                        <Label>Long Summary (Detailed service description)</Label>
                                        <textarea
                                            value={data.longSummary || ''}
                                            onChange={(e) => updateField('longSummary', e.target.value)}
                                            placeholder="Detailed description of what this service provides..."
                                            rows={4}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Pain Points (What problems does this solve? - helps AEO)</Label>
                                        <textarea
                                            value={(data.painPoints || []).join('\n')}
                                            onChange={(e) => updateField('painPoints', e.target.value.split('\n').filter(Boolean))}
                                            placeholder="Enter each pain point on a new line..."
                                            rows={4}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none font-mono text-sm"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Solutions Offered (LLM SEO)</Label>
                                        <textarea
                                            value={(data.solutionsOffered || []).join('\n')}
                                            onChange={(e) => updateField('solutionsOffered', e.target.value.split('\n').filter(Boolean))}
                                            placeholder="Enter each solution on a new line..."
                                            rows={4}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none font-mono text-sm"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Key Benefits (for AI Overview)</Label>
                                        <textarea
                                            value={(data.keyBenefits || []).join('\n')}
                                            onChange={(e) => updateField('keyBenefits', e.target.value.split('\n').filter(Boolean))}
                                            placeholder="Enter each benefit on a new line..."
                                            rows={4}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none font-mono text-sm"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Pricing Info (optional)</Label>
                                            <input
                                                type="text"
                                                value={data.pricing || ''}
                                                onChange={(e) => updateField('pricing', e.target.value)}
                                                placeholder="Starting from $500"
                                                className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label>Target Audience (Who is it for?)</Label>
                                            <input
                                                type="text"
                                                value={data.targetAudience || ''}
                                                onChange={(e) => updateField('targetAudience', e.target.value)}
                                                placeholder="Small businesses, startups"
                                                className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label>Use Cases (helps AI comprehension)</Label>
                                        <textarea
                                            value={(data.useCases || []).join('\n')}
                                            onChange={(e) => updateField('useCases', e.target.value.split('\n').filter(Boolean))}
                                            placeholder="Enter each use case on a new line..."
                                            rows={3}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none font-mono text-sm"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Tools & Technologies Used</Label>
                                        <input
                                            type="text"
                                            value={(data.toolsUsed || []).join(', ')}
                                            onChange={(e) => updateField('toolsUsed', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                            placeholder="n8n, OpenAI, Supabase, React"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Visual Fields */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="text-lg font-black text-[#2C2416] mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-green-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                                    Visual Fields
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label>OG Image URL (for social sharing)</Label>
                                        <input
                                            type="url"
                                            value={data.ogImage || data.seoImage || ''}
                                            onChange={(e) => updateField('ogImage', e.target.value)}
                                            placeholder={data.coverImage || 'Enter OG image URL...'}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Client Logos (comma separated URLs for social proof)</Label>
                                        <textarea
                                            value={(data.clientLogos || []).join('\n')}
                                            onChange={(e) => updateField('clientLogos', e.target.value.split('\n').filter(Boolean))}
                                            placeholder="Enter each logo URL on a new line..."
                                            rows={3}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Technical SEO */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="text-lg font-black text-[#2C2416] mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                                    Technical SEO
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>OG Title</Label>
                                            <input
                                                type="text"
                                                value={data.ogTitle || ''}
                                                onChange={(e) => updateField('ogTitle', e.target.value)}
                                                placeholder={data.seoTitle || data.title || 'OG Title...'}
                                                className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label>Twitter Card</Label>
                                            <select
                                                value={data.twitterCard || 'summary_large_image'}
                                                onChange={(e) => updateField('twitterCard', e.target.value as any)}
                                                className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            >
                                                <option value="summary">Summary</option>
                                                <option value="summary_large_image">Summary Large Image</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label>OG Description</Label>
                                        <textarea
                                            value={data.ogDescription || ''}
                                            onChange={(e) => updateField('ogDescription', e.target.value)}
                                            placeholder={data.seoDescription || 'OG Description for social preview...'}
                                            rows={2}
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="indexable"
                                                checked={data.indexable !== false}
                                                onChange={(e) => updateField('indexable', e.target.checked)}
                                                className="w-5 h-5 border-2 border-[#2C2416]"
                                            />
                                            <label htmlFor="indexable" className="font-bold text-[#2C2416]">
                                                Allow Indexing
                                            </label>
                                        </div>
                                        
                                        <div>
                                            <Label>Sitemap Priority</Label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={data.sitemapPriority || 0.8}
                                                onChange={(e) => updateField('sitemapPriority', parseFloat(e.target.value))}
                                                className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label>Last Updated</Label>
                                            <input
                                                type="date"
                                                value={data.lastUpdated || new Date().toISOString().split('T')[0]}
                                                onChange={(e) => updateField('lastUpdated', e.target.value)}
                                                className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contact Links */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="text-lg font-black text-[#2C2416] mb-2 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-pink-500 text-white flex items-center justify-center text-sm font-bold">5</span>
                                    Contact Links (for Buy Button)
                                </h3>
                                <p className="text-sm text-[#5A5247] mb-4">
                                    Leave fields empty to use default contact info from <code className="bg-[#F5F1E8] px-1">src/lib/contact-config.ts</code>. 
                                    Fill in only if you want custom contact for this specific service.
                                </p>
                                
                                <div className="p-3 bg-blue-50 border-2 border-blue-300 mb-4">
                                    <p className="text-xs font-semibold text-blue-700">
                                        💡 Default contact info is set in <strong>src/lib/contact-config.ts</strong>. Edit that file to change global contact info.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>WhatsApp (Custom)</Label>
                                        <input
                                            type="text"
                                            value={data.contactWhatsApp || ''}
                                            onChange={(e) => updateField('contactWhatsApp', e.target.value)}
                                            placeholder="Leave empty for default"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Telegram (Custom)</Label>
                                        <input
                                            type="text"
                                            value={data.contactTelegram || ''}
                                            onChange={(e) => updateField('contactTelegram', e.target.value)}
                                            placeholder="Leave empty for default"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Twitter/X (Custom)</Label>
                                        <input
                                            type="text"
                                            value={data.contactTwitter || ''}
                                            onChange={(e) => updateField('contactTwitter', e.target.value)}
                                            placeholder="Leave empty for default"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Instagram (Custom)</Label>
                                        <input
                                            type="text"
                                            value={data.contactInstagram || ''}
                                            onChange={(e) => updateField('contactInstagram', e.target.value)}
                                            placeholder="Leave empty for default"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Facebook (Custom)</Label>
                                        <input
                                            type="text"
                                            value={data.contactFacebook || ''}
                                            onChange={(e) => updateField('contactFacebook', e.target.value)}
                                            placeholder="Leave empty for default"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>LinkedIn (Custom)</Label>
                                        <input
                                            type="text"
                                            value={data.contactLinkedIn || ''}
                                            onChange={(e) => updateField('contactLinkedIn', e.target.value)}
                                            placeholder="Leave empty for default"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <Label>Email (Custom)</Label>
                                        <input
                                            type="email"
                                            value={data.contactEmail || ''}
                                            onChange={(e) => updateField('contactEmail', e.target.value)}
                                            placeholder="Leave empty for default"
                                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Preview Tab */}
                    <TabsContent value="preview">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <ContentPreview type="service" data={data} />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
