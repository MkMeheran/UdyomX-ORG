'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Clock, X, Upload, HardDrive, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { calculateReadTime, generateUniqueSlug, getSlugsByType, extractHeadingsFromContent, generateSlug, suggestAlternativeSlugs } from '@/lib/slug-utils';
import { blogAPI } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent, Select, SelectOption, Label, Badge } from '@/components/ui/dashboard-components';
import { SlugInput } from '@/components/dashboard/slug-input';
import { ContentEditor } from '@/components/dashboard/content-editor';
import { GalleryEditor } from '@/components/dashboard/gallery-editor';
import { DownloadEditor } from '@/components/dashboard/download-editor';
import { FAQEditor } from '@/components/dashboard/faq-editor';
import { RecommendedEditor } from '@/components/dashboard/recommended-editor';
import { ContentPreview } from '@/components/dashboard/content-preview';
import { SEOEditor } from '@/components/dashboard/seo-editor';
import { uploadThumbnail } from '@/lib/supabase/storage';
import type { PostEditorData, EditorTOCItem, SEOData, EditorMediaItem, EditorDownloadItem, EditorFAQItem, EditorRecommendedItem } from '@/types/editor';
import type { GalleryItem, DownloadItem, FAQItem, RecommendedItem } from '@/types';

// Default categories - can be extended by user
const defaultCategories = ['Tutorial', 'Best Practices', 'Design', 'Development', 'Case Study', 'News', 'Opinion'];

// Initial SEO data
const initialSEOData: SEOData = {
    seoTitle: '',
    metaDescription: '',
    primaryKeyword: '',
    secondaryKeywords: [],
    searchIntent: undefined,
    schemaType: 'blogPosting',
    robotsMeta: {
        index: true,
        follow: true,
        maxImagePreview: 'large'
    },
    twitterCard: {},
    openGraph: {}
};

// Initial empty post data
const initialPostData: PostEditorData = {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    contentFormat: 'mdx',
    coverImage: '',
    coverImageAlt: '',
    category: '',
    tags: [],
    author: '',
    authorAvatar: '',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    layout: 'standard',
    visibility: 'public',
    gallery: [],
    downloads: [],
    faqs: [],
    recommended: [],
    toc: [],
    readTime: '1 min read',
    seo: initialSEOData,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    seoImage: ''
};

// Helper mappers to convert editor state into API-friendly structures
function mapGalleryForSave(items: EditorMediaItem[] = []): GalleryItem[] {
    return items.map((item, index) => ({
        id: item.id,
        url: item.url,
        type: item.type,
        alt: item.altText || undefined,
        caption: item.caption,
        thumbnail: item.thumbnailUrl,
        order: item.orderIndex ?? index,
    }));
}

function mapDownloadsForSave(items: EditorDownloadItem[] = []): DownloadItem[] {
    return items.map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        fileSize: item.fileSize,
        fileType: item.fileType,
        description: undefined,
        isPremium: false,
        downloadCount: undefined,
    }));
}

function mapFAQsForSave(items: EditorFAQItem[] = []): FAQItem[] {
    return items.map((item, index) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        order: item.orderIndex ?? index,
    }));
}

function mapRecommendedForSave(items: EditorRecommendedItem[] = []): RecommendedItem[] {
    return items.map((item, index) => ({
        id: item.id,
        type: item.type === 'post' ? 'blog' : item.type,
        title: item.slug || item.title || `Recommendation ${index + 1}`,
        slug: item.slug,
        url: undefined,
        thumbnail: item.thumbnail,
        excerpt: item.excerpt,
    }));
}

interface PostEditorPageProps {
    postId?: string;
    initialData?: Partial<PostEditorData>;
}

export function PostEditorPage({ postId, initialData }: PostEditorPageProps) {
    // Merge initial data with defaults to ensure all fields exist
    const [data, setData] = useState<PostEditorData>(() => ({
        ...initialPostData,
        ...initialData,
        // Only use defaults if initialData doesn't have these values
        category: initialData?.category || initialPostData.category,
        author: initialData?.author || initialPostData.author,
        authorAvatar: initialData?.authorAvatar || initialPostData.authorAvatar,
        publishDate: initialData?.publishDate || initialPostData.publishDate,
        status: initialData?.status || 'draft',
        visibility: initialData?.visibility || 'public',
        tags: initialData?.tags || [],
        gallery: initialData?.gallery || [],
        downloads: initialData?.downloads || [],
        faqs: initialData?.faqs || [],
        recommended: initialData?.recommended || [],
        toc: initialData?.toc || [],
        seo: initialData?.seo || initialSEOData,
    }));
    
    // Update data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && postId) {
            setData(prev => ({
                ...initialPostData,
                ...initialData,
                category: initialData?.category || prev.category,
                author: initialData?.author || prev.author,
                authorAvatar: initialData?.authorAvatar || prev.authorAvatar,
                publishDate: initialData?.publishDate || prev.publishDate,
                status: initialData?.status || prev.status,
                visibility: initialData?.visibility || prev.visibility,
                tags: initialData?.tags || prev.tags,
                gallery: initialData?.gallery || prev.gallery,
                downloads: initialData?.downloads || prev.downloads,
                faqs: initialData?.faqs || prev.faqs,
                recommended: initialData?.recommended || prev.recommended,
                toc: initialData?.toc || prev.toc,
                seo: initialData?.seo || prev.seo,
            }));
        }
    }, [initialData, postId]);
    
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    
    // Category management
    const [categories, setCategories] = useState<string[]>(defaultCategories);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    
    // Cover image upload refs
    const coverImageInputRef = useRef<HTMLInputElement>(null);
    const [coverUploadStatus, setCoverUploadStatus] = useState<{ uploading: boolean; message?: string; error?: string }>(
        { uploading: false }
    );
    
    const isEditing = !!postId;
    
    // Track changes
    useEffect(() => {
        setHasChanges(true);
    }, [data]);
    
    // Update read time when content changes
    useEffect(() => {
        const readTime = calculateReadTime(data.content);
        if (readTime !== data.readTime) {
            setData(prev => ({ ...prev, readTime }));
        }
    }, [data.content, data.readTime]);
    
    // Auto-generate slug from title if empty
    useEffect(() => {
        if (!data.title || data.slug) return;

        let isCancelled = false;
        (async () => {
            try {
                const existingSlugs = await getSlugsByType('post');
                const newSlug = await generateUniqueSlug(data.title, existingSlugs);
                if (!isCancelled) {
                    setData(prev => (prev.slug ? prev : { ...prev, slug: newSlug }));
                }
            } catch (error) {
                console.error('Failed to auto-generate slug', error);
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [data.title, data.slug]);
    
    // Initialize TOC from content on mount (for existing posts)
    useEffect(() => {
        if (initialData?.content && (!data.toc || data.toc.length === 0)) {
            const headings = extractHeadingsFromContent(initialData.content);
            if (headings.length > 0) {
                const tocItems: EditorTOCItem[] = headings.map(h => ({
                    id: h.id,
                    text: h.text,
                    level: h.level
                }));
                setData(prev => ({ ...prev, toc: tocItems }));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount
    
    // Update field
    const updateField = useCallback(<K extends keyof PostEditorData>(field: K, value: PostEditorData[K]) => {
        setData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    // Handle TOC update (auto-generated from content)
    const handleTOCChange = useCallback((toc: EditorTOCItem[]) => {
        setData(prev => ({ ...prev, toc }));
    }, []);
    
    // Handle tag add
    const addTag = useCallback(() => {
        if (tagInput && !data.tags.includes(tagInput)) {
            setData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
            setTagInput('');
        }
    }, [tagInput, data.tags]);
    
    // Handle tag remove
    const removeTag = useCallback((tag: string) => {
        setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    }, []);
    
    // Handle new category add
    const addCategory = useCallback(() => {
        if (newCategoryName && !categories.includes(newCategoryName)) {
            setCategories(prev => [...prev, newCategoryName]);
            setData(prev => ({ ...prev, category: newCategoryName }));
            setNewCategoryName('');
            setShowNewCategoryInput(false);
        }
    }, [newCategoryName, categories]);
    
    // Handle category delete
    const deleteCategory = useCallback((cat: string) => {
        if (categories.length > 1) {
            setCategories(prev => prev.filter(c => c !== cat));
            if (data.category === cat) {
                setData(prev => ({ ...prev, category: '' }));
            }
        }
    }, [categories, data.category]);
    
    // Handle cover image upload from device (Supabase storage)
    const handleCoverImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCoverUploadStatus({ uploading: true, message: `Uploading ${file.name}...` });

        try {
            const folderSlug = data.slug || (data.title ? generateSlug(data.title) : 'covers');
            const result = await uploadThumbnail(file, `cover-images/${folderSlug}`);

            if (!result.success || !result.url) {
                throw new Error(result.error || 'Upload failed. Please try again.');
            }

            setData(prev => ({
                ...prev,
                coverImage: result.url,
                coverImageAlt: prev.coverImageAlt || file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
            }));

            setCoverUploadStatus({ uploading: false, message: '✅ Uploaded to Supabase storage.' });
        } catch (error: any) {
            console.error('Cover upload failed:', error);
            setCoverUploadStatus({
                uploading: false,
                error: error.message || 'Failed to upload cover image.',
            });
        } finally {
            if (coverImageInputRef.current) {
                coverImageInputRef.current.value = '';
            }
        }
    }, [data.slug, data.title]);
    
    // Handle cover image upload from Google Drive
    const handleCoverImageFromDrive = useCallback(() => {
        // For now, open Google Drive in a new window
        // In production, you'd use Google Picker API
        const driveUrl = 'https://drive.google.com/drive/my-drive';
        window.open(driveUrl, '_blank', 'width=800,height=600');
        
        // Show instruction modal
        const url = prompt('Paste the shareable link from Google Drive:');
        if (url) {
            // Convert Google Drive link to direct image link
            let directUrl = url;
            const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (fileIdMatch) {
                directUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
            }
            setData(prev => ({ ...prev, coverImage: directUrl }));
        }
    }, []);
    
    // Save handler - saves to localStorage (development) or database (production)
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            // Validate required fields
            if (!data.title) {
                alert('❌ Please enter a title');
                setIsSaving(false);
                return;
            }
            
            if (!data.slug) {
                alert('❌ Please enter a slug');
                setIsSaving(false);
                return;
            }
            
            const postSlug = data.slug;
            
            // Prepare data for saving
            const postData = {
                ...data,
                id: data.id || postSlug,
                slug: postSlug,
                status: data.status || 'published',
                publishDate: data.publishDate || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Ensure content is saved
                content: data.content || '',
                // Ensure TOC is saved
                toc: data.toc || [],
                gallery: mapGalleryForSave(data.gallery),
                downloads: mapDownloadsForSave(data.downloads),
                faqs: mapFAQsForSave(data.faqs),
                recommended: mapRecommendedForSave(data.recommended),
            };
            
            // Save using blogAPI (will use localStorage in development)
            if (isEditing && data.id) {
                await blogAPI.update(data.id, postData);
            } else {
                await blogAPI.create(postData);
            }
            
            console.log('Post saved:', postData);
            
            // Revalidate cache for this post and listing pages
            try {
                await fetch('/api/revalidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        path: `/blog/${postSlug}`,
                        type: 'post' 
                    })
                });
            } catch (revalidateError) {
                console.warn('Cache revalidation failed:', revalidateError);
                // Don't fail the save if revalidation fails
            }
            
            setHasChanges(false);
            alert('✅ Post saved successfully!');
        } catch (error: any) {
            console.error('Error saving post:', error);
            
            // Handle specific error cases
            if (error?.code === '23505') {
                // Duplicate slug error
                const suggestions = await suggestAlternativeSlugs(data.slug, 'post');
                const suggestionText = suggestions.length > 0 
                    ? `\n\nSuggested alternatives:\n${suggestions.join('\n')}` 
                    : '';
                alert(`❌ Slug "${data.slug}" already exists.${suggestionText}\n\nPlease change the slug and try again.`);
            } else if (error?.message) {
                alert(`❌ Failed to save: ${error.message}`);
            } else {
                alert('❌ Failed to save post. Please try again.');
            }
        } finally {
            setIsSaving(false);
        }
    }, [data, isEditing]);
    
    // Safe status display
    const displayStatus = data.status || 'draft';
    const displayVisibility = data.visibility || 'public';
    
    return (
        <div className="min-h-screen bg-[#F5F1E8]">
            {/* Hidden file input for cover image */}
            <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
            />
            
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#F5F1E8] border-b-4 border-[#2C2416] shadow-[0_4px_0_rgba(44,36,22,0.2)]">
                <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/dashboard/admin/blogs"
                                className="p-2 hover:bg-[#2C2416]/10 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black text-[#2C2416]">
                                    {isEditing ? 'Edit Post' : 'Create New Post'}
                                </h1>
                                <p className="text-sm text-[#2C2416]/60">
                                    {data.title || 'Untitled'} 
                                    {hasChanges && <span className="text-orange-500"> • Unsaved changes</span>}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <Badge variant={displayStatus === 'published' ? 'success' : displayStatus === 'draft' ? 'warning' : 'default'}>
                                {displayStatus.toUpperCase()}
                            </Badge>
                            
                            {/* Visibility Badge */}
                            <Badge variant={displayVisibility === 'public' ? 'info' : 'default'}>
                                {displayVisibility === 'public' ? '🌐 Public' : '🔒 Private'}
                            </Badge>
                            
                            {/* Save Button */}
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
                    <TabsList className="mb-6">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="media">Gallery & Downloads</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                        <TabsTrigger value="recommended">Recommended</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    {/* Basic Info Tab */}
                    <TabsContent value="basic">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label required>Title</Label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        placeholder="Enter post title..."
                                        className="w-full px-4 py-3 mt-2 text-xl font-bold border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none focus:shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                                    />
                                </div>
                                
                                {/* Slug */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <SlugInput
                                        value={data.slug}
                                        onChange={(slug) => updateField('slug', slug)}
                                        type="post"
                                        title={data.title}
                                    />
                                </div>
                                
                                {/* Excerpt */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label required>Excerpt</Label>
                                    <textarea
                                        value={data.excerpt}
                                        onChange={(e) => updateField('excerpt', e.target.value)}
                                        placeholder="Brief description of the post..."
                                        rows={3}
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none focus:shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                                    />
                                    <p className="text-xs text-[#2C2416]/50 mt-1">
                                        {data.excerpt.length}/300 characters
                                    </p>
                                </div>
                                
                                {/* Cover Image with Upload Options */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Cover Image</Label>
                                    
                                    {/* Upload Options */}
                                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => coverImageInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2 font-bold text-sm border-3 border-[#2C2416] bg-[#F5F1E8] hover:bg-[#F5C542] transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload from Device
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCoverImageFromDrive}
                                            className="flex items-center gap-2 px-4 py-2 font-bold text-sm border-3 border-[#2C2416] bg-[#F5F1E8] hover:bg-[#2196F3] hover:text-white transition-colors"
                                        >
                                            <HardDrive className="w-4 h-4" />
                                            Upload from Drive
                                        </button>
                                    </div>
                                    {coverUploadStatus.uploading && (
                                        <p className="text-sm text-[#2C2416] font-medium mb-2">
                                            {coverUploadStatus.message || 'Uploading...'}
                                        </p>
                                    )}
                                    {!coverUploadStatus.uploading && coverUploadStatus.message && !coverUploadStatus.error && (
                                        <p className="text-sm text-green-600 font-medium mb-2">{coverUploadStatus.message}</p>
                                    )}
                                    {coverUploadStatus.error && (
                                        <p className="text-sm text-red-600 font-medium mb-2">{coverUploadStatus.error}</p>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="url"
                                                value={data.coverImage || ''}
                                                onChange={(e) => updateField('coverImage', e.target.value)}
                                                placeholder="Or paste image URL..."
                                                className="w-full px-4 py-3 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={data.coverImageAlt || ''}
                                                onChange={(e) => updateField('coverImageAlt', e.target.value)}
                                                placeholder="Alt text for accessibility..."
                                                className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                        <div className="aspect-video bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30 flex items-center justify-center overflow-hidden relative">
                                            {data.coverImage ? (
                                                <>
                                                    <img 
                                                        src={data.coverImage} 
                                                        alt={data.coverImageAlt || 'Cover'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateField('coverImage', '')}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white border-2 border-[#2C2416] hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-[#2C2416]/30 font-medium">Preview</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Tags */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Tags</Label>
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            placeholder="Add tag..."
                                            className="flex-1 px-4 py-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-4 py-2 font-bold border-4 border-[#2C2416] bg-[#F5C542] hover:shadow-[2px_2px_0_rgba(44,36,22,0.3)]"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {data.tags.map(tag => (
                                                <span 
                                                    key={tag}
                                                    className="flex items-center gap-1 px-2 py-1 bg-[#F5F1E8] border-2 border-[#2C2416] text-sm font-medium"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Category with Add/Delete */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <div className="flex items-center justify-between mb-2">
                                        <Label required>Category</Label>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                                            className="text-xs font-bold text-[#2196F3] hover:underline"
                                        >
                                            + Add New
                                        </button>
                                    </div>
                                    
                                    {showNewCategoryInput && (
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                                placeholder="New category name..."
                                                className="flex-1 px-3 py-2 text-sm border-3 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={addCategory}
                                                className="px-3 py-2 text-sm font-bold border-3 border-[#2C2416] bg-[#F5C542]"
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {setShowNewCategoryInput(false); setNewCategoryName('');}}
                                                className="px-2 py-2 text-sm border-3 border-[#2C2416] bg-[#F5F1E8] hover:bg-red-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    
                                    <Select 
                                        value={data.category}
                                        onValueChange={(value) => updateField('category', value)}
                                        placeholder="Select category..."
                                    >
                                        {categories.map(cat => (
                                            <SelectOption key={cat} value={cat}>
                                                {cat}
                                            </SelectOption>
                                        ))}
                                    </Select>
                                    
                                    {/* Category Management */}
                                    {data.category && categories.length > 1 && (
                                        <div className="mt-2 flex items-center gap-2 text-sm">
                                            <span className="text-[#2C2416]/60">Selected: <strong>{data.category}</strong></span>
                                            <button
                                                type="button"
                                                onClick={() => deleteCategory(data.category)}
                                                className="p-1 text-red-500 hover:bg-red-100 border border-red-300 rounded"
                                                title="Delete this category"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Author */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label required>Author</Label>
                                    <input
                                        type="text"
                                        value={data.author}
                                        onChange={(e) => updateField('author', e.target.value)}
                                        placeholder="Author name..."
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                    <input
                                        type="url"
                                        value={data.authorAvatar || ''}
                                        onChange={(e) => updateField('authorAvatar', e.target.value)}
                                        placeholder="Avatar URL (optional)..."
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                </div>
                                
                                {/* Publish Date */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label required>Publish Date</Label>
                                    <input
                                        type="date"
                                        value={data.publishDate}
                                        onChange={(e) => updateField('publishDate', e.target.value)}
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                </div>
                                
                                {/* Layout */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Layout</Label>
                                    <Select 
                                        value={data.layout || 'standard'}
                                        onValueChange={(value) => updateField('layout', value as 'standard' | 'research')}
                                        className="mt-2"
                                    >
                                        <SelectOption value="standard">Standard Post</SelectOption>
                                        <SelectOption value="research">Research Paper</SelectOption>
                                    </Select>
                                </div>
                                
                                {/* Visibility - Only Public/Private */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Visibility</Label>
                                    <Select 
                                        value={displayVisibility}
                                        onValueChange={(value) => updateField('visibility', value as 'public' | 'private')}
                                        className="mt-2"
                                    >
                                        <SelectOption value="public">
                                            🌐 Public - Visible on website
                                        </SelectOption>
                                        <SelectOption value="private">
                                            🔒 Private - Admin dashboard only
                                        </SelectOption>
                                    </Select>
                                    <p className="text-xs text-[#2C2416]/50 mt-2">
                                        {displayVisibility === 'public' 
                                            ? 'This post will be visible to everyone on the website.'
                                            : 'This post will only be visible in the admin dashboard.'}
                                    </p>
                                </div>
                                
                                {/* Read Time (Auto-generated) */}
                                <div className="bg-[#F5F1E8] border-4 border-[#2C2416]/30 p-4">
                                    <div className="flex items-center gap-2 text-[#2C2416]/60">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-bold">{data.readTime}</span>
                                        <span className="text-xs">(auto-calculated)</span>
                                    </div>
                                </div>
                                
                                {/* Status */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Status</Label>
                                    <Select 
                                        value={displayStatus}
                                        onValueChange={(value) => updateField('status', value as PostEditorData['status'])}
                                        className="mt-2"
                                    >
                                        <SelectOption value="draft">Draft</SelectOption>
                                        <SelectOption value="published">Published</SelectOption>
                                        <SelectOption value="scheduled">Scheduled</SelectOption>
                                        <SelectOption value="archived">Archived</SelectOption>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Content Tab */}
                    <TabsContent value="content">
                        <div className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <ContentEditor
                                content={data.content}
                                onChange={(content) => updateField('content', content)}
                                format={data.contentFormat}
                                onFormatChange={(format) => updateField('contentFormat', format)}
                                onTOCChange={handleTOCChange}
                            />
                        </div>
                        
                        {/* Auto-generated TOC display */}
                        {data.toc.length > 0 && (
                            <div className="mt-6 bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="font-black text-[#2C2416] mb-4">📋 Table of Contents (Auto-generated)</h3>
                                <ul className="space-y-2">
                                    {data.toc.map((item) => (
                                        <li 
                                            key={item.id}
                                            className="text-sm text-[#2C2416]/80"
                                            style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                                        >
                                            {item.level === 1 ? '●' : item.level === 2 ? '○' : '▪'} {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </TabsContent>
                    
                    {/* Media Tab */}
                    <TabsContent value="media">
                        <div className="space-y-6">
                            {/* Gallery */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="text-xl font-black text-[#2C2416] mb-4">📷 Gallery</h3>
                                <GalleryEditor
                                    items={data.gallery}
                                    onChange={(gallery) => updateField('gallery', gallery)}
                                />
                            </div>
                            
                            {/* Downloads */}
                            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                <h3 className="text-xl font-black text-[#2C2416] mb-4">📥 Downloads</h3>
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
                            <h3 className="text-xl font-black text-[#2C2416] mb-4">❓ Frequently Asked Questions</h3>
                            <FAQEditor
                                items={data.faqs}
                                onChange={(faqs) => updateField('faqs', faqs)}
                            />
                        </div>
                    </TabsContent>
                    
                    {/* Recommended Tab */}
                    <TabsContent value="recommended">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <h3 className="text-xl font-black text-[#2C2416] mb-4">🔗 Recommended Content</h3>
                            <RecommendedEditor
                                items={data.recommended}
                                onChange={(recommended) => updateField('recommended', recommended)}
                            />
                        </div>
                    </TabsContent>
                    
                    {/* SEO Tab */}
                    <TabsContent value="seo">
                        <SEOEditor
                            seo={data.seo || initialSEOData}
                            onChange={(seo) => updateField('seo', seo)}
                            autoData={{
                                title: data.title,
                                slug: data.slug,
                                excerpt: data.excerpt,
                                coverImage: data.coverImage,
                                author: data.author,
                                authorAvatar: data.authorAvatar,
                                publishDate: data.publishDate,
                                category: data.category,
                                tags: data.tags,
                                faqs: data.faqs,
                                gallery: data.gallery,
                                downloads: data.downloads,
                                toc: data.toc,
                                content: data.content,
                            }}
                            type="post"
                        />
                    </TabsContent>
                    
                    {/* Preview Tab */}
                    <TabsContent value="preview">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <h3 className="text-xl font-black text-[#2C2416] mb-4">👁️ Card Preview</h3>
                            <p className="text-[#2C2416]/60 mb-6">This is how your post will appear in listings.</p>
                            <div className="max-w-md">
                                <ContentPreview
                                    type="post"
                                    data={{
                                        title: data.title,
                                        excerpt: data.excerpt,
                                        coverImage: data.coverImage,
                                        category: data.category,
                                        author: data.author,
                                        publishDate: data.publishDate,
                                        slug: data.slug,
                                        tags: data.tags,
                                    }}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
