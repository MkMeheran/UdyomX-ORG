'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Upload, HardDrive } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { generateUniqueSlug, getSlugsByType, extractHeadingsFromContent } from '@/lib/slug-utils';
import { projectAPI } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent, Select, SelectOption, Switch, Label, Badge } from '@/components/ui/dashboard-components';
import { SlugInput } from '@/components/dashboard/slug-input';
import { ContentEditor } from '@/components/dashboard/content-editor';
import { GalleryEditor } from '@/components/dashboard/gallery-editor';
import { DownloadEditor } from '@/components/dashboard/download-editor';
import { FAQEditor } from '@/components/dashboard/faq-editor';
import { RecommendedEditor } from '@/components/dashboard/recommended-editor';
import { ContentPreview } from '@/components/dashboard/content-preview';
import { SEOEditor } from '@/components/dashboard/seo-editor';
import type { ProjectEditorData, ContentFormat, EditorTOCItem, SEOData } from '@/types/editor';

// Initial SEO data for projects
const initialSEOData: SEOData = {
    seoTitle: '',
    metaDescription: '',
    primaryKeyword: '',
    secondaryKeywords: [],
    searchIntent: undefined,
    schemaType: 'article',
    robotsMeta: {
        index: true,
        follow: true,
        maxImagePreview: 'large'
    },
    twitterCard: {},
    openGraph: {}
};

// Initial empty project data
const initialProjectData: ProjectEditorData = {
    slug: '',
    name: '',
    description: '',
    content: '',
    contentFormat: 'mdx',
    thumbnail: '',
    images: [],
    techStack: [],
    category: '',
    liveLink: '',
    repoLink: '',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    projectStatus: 'in-progress',
    progress: 0,
    featured: false,
    clientInfo: '',
    gallery: [],
    downloads: [],
    faqs: [],
    recommended: [],
    toc: [],
    seo: initialSEOData,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    seoImage: ''
};

const projectCategories = ['Web Development', 'Mobile App', 'E-commerce', 'SaaS', 'AI/ML', 'Blockchain', 'Open Source', 'Other'];

interface ProjectEditorPageProps {
    projectId?: string;
    initialData?: ProjectEditorData;
}

export function ProjectEditorPage({ projectId, initialData }: ProjectEditorPageProps) {
    const [data, setData] = useState<ProjectEditorData>(() => ({
        ...initialProjectData,
        ...initialData,
        status: initialData?.status || 'draft',
        techStack: initialData?.techStack || [],
        gallery: initialData?.gallery || [],
        downloads: initialData?.downloads || [],
        faqs: initialData?.faqs || [],
        recommended: initialData?.recommended || [],
        toc: initialData?.toc || [],
        seo: initialData?.seo || initialSEOData,
    }));
    const [techInput, setTechInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const thumbnailInputRef = React.useRef<HTMLInputElement>(null);
    
    const isEditing = !!projectId;
    
    // Safe display values
    const displayStatus = data.status || 'draft';
    
    // Handle thumbnail upload from device
    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                updateField('thumbnail', url);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };
    
    // Handle thumbnail from Google Drive
    const handleThumbnailFromDrive = () => {
        window.open('https://drive.google.com/drive/my-drive', '_blank', 'width=900,height=700');
        setTimeout(() => {
            const driveUrl = window.prompt('Copy the shareable link from Google Drive and paste it here:');
            if (driveUrl) {
                let directUrl = driveUrl;
                const fileIdMatch = driveUrl.match(/\/d\/([^\/]+)/);
                if (fileIdMatch) {
                    directUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                }
                updateField('thumbnail', directUrl);
            }
        }, 1000);
    };
    
    // Track changes
    useEffect(() => {
        setHasChanges(true);
    }, [data]);
    
    // Auto-generate slug from name if empty
    useEffect(() => {
        if (!data.name || data.slug) return;

        let isCancelled = false;
        (async () => {
            try {
                const existingSlugs = await getSlugsByType('project');
                const newSlug = await generateUniqueSlug(data.name, existingSlugs);
                if (!isCancelled) {
                    setData(prev => (prev.slug ? prev : { ...prev, slug: newSlug }));
                }
            } catch (error) {
                console.error('Failed to auto-generate project slug', error);
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [data.name, data.slug]);
    
    // Initialize TOC from content on mount (for existing projects)
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
    const updateField = useCallback(<K extends keyof ProjectEditorData>(field: K, value: ProjectEditorData[K]) => {
        setData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    // Handle TOC update
    const handleTOCChange = useCallback((toc: EditorTOCItem[]) => {
        setData(prev => ({ ...prev, toc }));
    }, []);
    
    // Handle tech stack add
    const addTech = useCallback(() => {
        if (techInput && !data.techStack.includes(techInput)) {
            setData(prev => ({ ...prev, techStack: [...prev.techStack, techInput] }));
            setTechInput('');
        }
    }, [techInput, data.techStack]);
    
    // Handle tech remove
    const removeTech = useCallback((tech: string) => {
        setData(prev => ({ ...prev, techStack: prev.techStack.filter(t => t !== tech) }));
    }, []);
    
    // Save handler - saves to localStorage (development) or database (production)
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const projectSlug = data.slug || `draft-${Date.now()}`;
            
            // Prepare data for saving
            const projectData = {
                ...data,
                id: data.id || projectSlug,
                slug: projectSlug,
                title: data.name, // Ensure title is set for consistency
                updatedAt: new Date().toISOString(),
                content: data.content || '',
                toc: data.toc || [],
            };
            
            // Save using projectAPI (will use localStorage in development)
            if (isEditing && data.id) {
                await projectAPI.update(data.id, projectData);
            } else {
                await projectAPI.create(projectData);
            }
            
            console.log('Project saved:', projectData);
            
            // Revalidate cache for this project and listing pages
            try {
                await fetch('/api/revalidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        path: `/projects/${projectSlug}`,
                        type: 'project' 
                    })
                });
            } catch (revalidateError) {
                console.warn('Cache revalidation failed:', revalidateError);
            }
            
            setHasChanges(false);
            alert('✅ Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }, [data, isEditing]);
    
    return (
        <div className="min-h-screen bg-[#F5F1E8]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#F5F1E8] border-b-4 border-[#2C2416] shadow-[0_4px_0_rgba(44,36,22,0.2)]">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/dashboard/projects"
                                className="p-2 hover:bg-[#2C2416]/10 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black text-[#2C2416]">
                                    {isEditing ? 'Edit Project' : 'Create New Project'}
                                </h1>
                                <p className="text-sm text-[#2C2416]/60">
                                    {data.name || 'Untitled'} 
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
                    <TabsList className="mb-6">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="content">Description</TabsTrigger>
                        <TabsTrigger value="media">Gallery & Downloads</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                        <TabsTrigger value="recommended">Related</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    {/* Basic Info Tab */}
                    <TabsContent value="basic">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Name */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label required>Project Name</Label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="Enter project name..."
                                        className="w-full px-4 py-3 mt-2 text-xl font-bold border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none focus:shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                                    />
                                </div>
                                
                                {/* Slug */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <SlugInput
                                        value={data.slug}
                                        onChange={(slug) => updateField('slug', slug)}
                                        type="project"
                                        title={data.name}
                                    />
                                </div>
                                
                                {/* Short Description */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label required>Short Description</Label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Brief description of the project..."
                                        rows={3}
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none focus:shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                                    />
                                </div>
                                
                                {/* Thumbnail */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Thumbnail Image</Label>
                                    <div className="mt-2 space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => thumbnailInputRef.current?.click()}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border-4 border-[#2C2416] font-bold text-sm hover:bg-[#F5C542] hover:shadow-[2px_2px_0_rgba(44,36,22,0.3)] transition-all"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Upload from Device
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleThumbnailFromDrive}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border-4 border-[#2C2416] font-bold text-sm hover:bg-[#F5C542] hover:shadow-[2px_2px_0_rgba(44,36,22,0.3)] transition-all"
                                            >
                                                <HardDrive className="w-4 h-4" />
                                                Upload from Drive
                                            </button>
                                        </div>
                                        <input
                                            ref={thumbnailInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                        <input
                                            type="url"
                                            value={data.thumbnail || ''}
                                            onChange={(e) => updateField('thumbnail', e.target.value)}
                                            placeholder="Or paste image URL..."
                                            className="w-full px-4 py-3 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                        <div className="aspect-video bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30 flex items-center justify-center overflow-hidden">
                                            {data.thumbnail ? (
                                                <img 
                                                    src={data.thumbnail} 
                                                    alt="Thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[#2C2416]/30 font-medium">Preview</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Tech Stack */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Tech Stack</Label>
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={techInput}
                                            onChange={(e) => setTechInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                                            placeholder="Add technology..."
                                            className="flex-1 px-4 py-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTech}
                                            className="px-4 py-2 font-bold border-4 border-[#2C2416] bg-[#F5C542] hover:shadow-[2px_2px_0_rgba(44,36,22,0.3)]"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {data.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {data.techStack.map(tech => (
                                                <span 
                                                    key={tech}
                                                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 border-2 border-blue-300 text-sm font-medium text-blue-700"
                                                >
                                                    {tech}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTech(tech)}
                                                        className="ml-1 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Links */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Project Links</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="text-sm font-medium text-[#2C2416]/70">Live Demo URL</label>
                                            <input
                                                type="url"
                                                value={data.liveLink || ''}
                                                onChange={(e) => updateField('liveLink', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-4 py-3 mt-1 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-[#2C2416]/70">GitHub Repository</label>
                                            <input
                                                type="url"
                                                value={data.repoLink || ''}
                                                onChange={(e) => updateField('repoLink', e.target.value)}
                                                placeholder="https://github.com/..."
                                                className="w-full px-4 py-3 mt-1 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                            />
                                        </div>
                                    </div>
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
                                        {projectCategories.map(cat => (
                                            <SelectOption key={cat} value={cat}>{cat}</SelectOption>
                                        ))}
                                    </Select>
                                </div>
                                
                                {/* Featured */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <div className="flex items-center justify-between">
                                        <Label>Featured Project</Label>
                                        <Switch
                                            checked={data.featured}
                                            onCheckedChange={(checked) => updateField('featured', checked)}
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
                                
                                {/* Client Info */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Client Info</Label>
                                    <input
                                        type="text"
                                        value={data.clientInfo || ''}
                                        onChange={(e) => updateField('clientInfo', e.target.value)}
                                        placeholder="Client name (optional)..."
                                        className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                                    />
                                </div>
                                
                                {/* Status */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Publication Status</Label>
                                    <Select 
                                        value={data.status}
                                        onValueChange={(value) => updateField('status', value as ProjectEditorData['status'])}
                                        className="mt-2"
                                    >
                                        <SelectOption value="draft">Draft</SelectOption>
                                        <SelectOption value="published">Published</SelectOption>
                                        <SelectOption value="archived">Archived</SelectOption>
                                    </Select>
                                </div>
                                
                                {/* Project Status */}
                                <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                    <Label>Project Status</Label>
                                    <Select 
                                        value={data.projectStatus}
                                        onValueChange={(value) => updateField('projectStatus', value as ProjectEditorData['projectStatus'])}
                                        className="mt-2"
                                    >
                                        <SelectOption value="in-progress">In Progress</SelectOption>
                                        <SelectOption value="completed">Completed</SelectOption>
                                        <SelectOption value="paused">Paused</SelectOption>
                                    </Select>
                                </div>
                                
                                {/* Progress */}
                                {data.projectStatus === 'in-progress' && (
                                    <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                                        <Label>Progress ({data.progress}%)</Label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={data.progress}
                                            onChange={(e) => updateField('progress', parseInt(e.target.value))}
                                            className="w-full mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Content Tab */}
                    <TabsContent value="content">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <ContentEditor
                                content={data.content}
                                onChange={(content) => updateField('content', content)}
                                format={data.contentFormat}
                                onFormatChange={(format) => updateField('contentFormat', format)}
                                onTOCChange={handleTOCChange}
                                placeholder="Write detailed project description, case study, or documentation..."
                                minHeight="400px"
                            />
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
                    
                    {/* Recommended Tab */}
                    <TabsContent value="recommended">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <RecommendedEditor
                                items={data.recommended}
                                onChange={(recommended) => updateField('recommended', recommended)}
                                allowedTypes={['project', 'post']}
                                title="Related Projects"
                            />
                        </div>
                    </TabsContent>
                    
                    {/* SEO Tab */}
                    <TabsContent value="seo">
                        <SEOEditor
                            seo={data.seo || initialSEOData}
                            onChange={(seo) => updateField('seo', seo)}
                            autoData={{
                                title: data.name,
                                slug: data.slug,
                                description: data.description,
                                thumbnail: data.thumbnail,
                                publishDate: data.publishDate,
                                category: data.category,
                                tags: data.seo?.secondaryKeywords || [],
                                faqs: data.faqs,
                                gallery: data.gallery,
                                downloads: data.downloads,
                                toc: data.toc,
                                content: data.content,
                            }}
                            type="project"
                        />
                    </TabsContent>
                    
                    {/* Preview Tab */}
                    <TabsContent value="preview">
                        <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                            <ContentPreview type="project" data={data} />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
