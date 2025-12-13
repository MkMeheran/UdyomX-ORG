'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
    Search, Eye, Globe, Twitter, Facebook, Settings, 
    ChevronDown, ChevronUp, CheckCircle, AlertCircle, 
    Info, Plus, X, Link, FileText, List, Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label, Select, SelectOption, Switch } from '@/components/ui/dashboard-components';
import type { 
    SEOData, SearchIntent, SchemaType, RobotsMeta, SocialCard,
    EditorFAQItem, EditorMediaItem, EditorDownloadItem, EditorTOCItem 
} from '@/types/editor';

// ============================================
// TYPES
// ============================================

interface AutoImplementedData {
    title: string;
    slug: string;
    excerpt?: string;
    description?: string;
    coverImage?: string;
    thumbnail?: string;
    author?: string;
    authorAvatar?: string;
    publishDate?: string;
    category?: string;
    tags?: string[];
    faqs?: EditorFAQItem[];
    gallery?: EditorMediaItem[];
    downloads?: EditorDownloadItem[];
    toc?: EditorTOCItem[];
    content?: string;
}

interface SEOEditorProps {
    seo: SEOData;
    onChange: (seo: SEOData) => void;
    autoData: AutoImplementedData;
    type: 'post' | 'project';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const countWords = (text: string): number => {
    return text?.trim().split(/\s+/).filter(Boolean).length || 0;
};

const getCharacterStatus = (current: number, min: number, max: number): 'good' | 'warning' | 'error' => {
    if (current >= min && current <= max) return 'good';
    if (current > 0 && current < min) return 'warning';
    if (current > max) return 'error';
    return 'warning';
};

const calculateSEOScore = (seo: SEOData, autoData: AutoImplementedData): number => {
    let score = 0;
    const maxScore = 100;
    
    // Title check (15 points)
    const title = seo.seoTitle || autoData.title;
    if (title) {
        score += 5;
        if (title.length >= 50 && title.length <= 60) score += 10;
        else if (title.length > 30) score += 5;
    }
    
    // Description check (15 points)
    const desc = seo.metaDescription || autoData.excerpt || autoData.description;
    if (desc) {
        score += 5;
        if (desc.length >= 150 && desc.length <= 160) score += 10;
        else if (desc.length > 100) score += 5;
    }
    
    // Primary keyword (15 points)
    if (seo.primaryKeyword) {
        score += 10;
        if (title?.toLowerCase().includes(seo.primaryKeyword.toLowerCase())) score += 5;
    }
    
    // Secondary keywords (10 points)
    if (seo.secondaryKeywords && seo.secondaryKeywords.length > 0) {
        score += Math.min(10, seo.secondaryKeywords.length * 2);
    }
    
    // Search intent (5 points)
    if (seo.searchIntent) score += 5;
    
    // Schema type (5 points)
    if (seo.schemaType) score += 5;
    
    // Cover image / OG image (10 points)
    const image = seo.openGraph?.image || autoData.coverImage || autoData.thumbnail;
    if (image) score += 10;
    
    // FAQs for schema (10 points)
    if (autoData.faqs && autoData.faqs.length > 0) score += 10;
    
    // Categories/tags (5 points)
    if (autoData.category || (autoData.tags && autoData.tags.length > 0)) score += 5;
    
    // Social cards (10 points)
    if (seo.twitterCard?.title || seo.openGraph?.title) score += 5;
    if (seo.twitterCard?.description || seo.openGraph?.description) score += 5;
    
    return Math.min(score, maxScore);
};

// ============================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    defaultOpen?: boolean;
    children: React.ReactNode;
    badge?: React.ReactNode;
}

function CollapsibleSection({ title, icon, defaultOpen = false, children, badge }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className="border-4 border-[#2C2416] bg-white">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between bg-[#F5F1E8] hover:bg-[#F5C542]/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-[#2C2416]">{icon}</span>
                    <span className="font-bold text-[#2C2416]">{title}</span>
                    {badge}
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {isOpen && (
                <div className="p-4 border-t-4 border-[#2C2416]">
                    {children}
                </div>
            )}
        </div>
    );
}

// ============================================
// PREVIEW COMPONENTS
// ============================================

interface GooglePreviewProps {
    title: string;
    description: string;
    url: string;
}

function GooglePreview({ title, description, url }: GooglePreviewProps) {
    return (
        <div className="bg-white p-4 rounded border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{url}</div>
            <div className="text-blue-600 text-lg hover:underline cursor-pointer mb-1 line-clamp-1">
                {title || 'Page Title'}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2">
                {description || 'Add a meta description to see how your page will appear in search results.'}
            </div>
        </div>
    );
}

interface TwitterPreviewProps {
    card: SocialCard;
    defaultImage?: string;
    defaultTitle?: string;
    defaultDescription?: string;
}

function TwitterPreview({ card, defaultImage, defaultTitle, defaultDescription }: TwitterPreviewProps) {
    const image = card.image || defaultImage;
    const title = card.title || defaultTitle;
    const description = card.description || defaultDescription;
    
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md">
            {image && (
                <div className="aspect-[2/1] bg-gray-100">
                    <img src={image} alt="Twitter Card" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-3">
                <div className="text-sm font-bold line-clamp-1">{title || 'Page Title'}</div>
                <div className="text-sm text-gray-500 line-clamp-2">{description || 'Page description'}</div>
                <div className="text-xs text-gray-400 mt-1">udyomx.org</div>
            </div>
        </div>
    );
}

interface FacebookPreviewProps {
    card: SocialCard;
    defaultImage?: string;
    defaultTitle?: string;
    defaultDescription?: string;
}

function FacebookPreview({ card, defaultImage, defaultTitle, defaultDescription }: FacebookPreviewProps) {
    const image = card.image || defaultImage;
    const title = card.title || defaultTitle;
    const description = card.description || defaultDescription;
    
    return (
        <div className="bg-white border border-gray-300 overflow-hidden max-w-lg">
            {image && (
                <div className="aspect-[1.91/1] bg-gray-100">
                    <img src={image} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-3 bg-[#f0f2f5]">
                <div className="text-xs text-gray-500 uppercase">udyomx.org</div>
                <div className="font-bold text-[#1c1e21] line-clamp-1">{title || 'Page Title'}</div>
                <div className="text-sm text-gray-500 line-clamp-1">{description || 'Page description'}</div>
            </div>
        </div>
    );
}

// ============================================
// MAIN SEO EDITOR COMPONENT
// ============================================

export function SEOEditor({ seo, onChange, autoData, type }: SEOEditorProps) {
    const [keywordInput, setKeywordInput] = useState('');
    const [activePreview, setActivePreview] = useState<'google' | 'twitter' | 'facebook' | 'all'>('google');
    
    // Calculate effective values (auto-implemented or manual)
    const effectiveTitle = seo.seoTitle || autoData.title || '';
    const effectiveDescription = seo.metaDescription || autoData.excerpt || autoData.description || '';
    const effectiveSlug = seo.slug || autoData.slug || '';
    const effectiveImage = seo.openGraph?.image || autoData.coverImage || autoData.thumbnail || '';
    const effectiveUrl = `https://udyomx.org/${type === 'post' ? 'blog' : 'projects'}/${effectiveSlug}`;
    
    // Calculate SEO score
    const seoScore = useMemo(() => calculateSEOScore(seo, autoData), [seo, autoData]);
    
    // Word count from content
    const wordCount = useMemo(() => countWords(autoData.content || ''), [autoData.content]);
    
    // Heading structure from TOC
    const headingStructure = useMemo(() => {
        const toc = autoData.toc || [];
        return {
            h1Count: toc.filter(t => t.level === 1).length,
            h2Count: toc.filter(t => t.level === 2).length,
            h3Count: toc.filter(t => t.level === 3).length,
        };
    }, [autoData.toc]);
    
    // Update SEO field
    const updateSEO = useCallback(<K extends keyof SEOData>(field: K, value: SEOData[K]) => {
        onChange({ ...seo, [field]: value });
    }, [seo, onChange]);
    
    // Update nested fields
    const updateTwitterCard = useCallback((field: keyof SocialCard, value: string) => {
        onChange({
            ...seo,
            twitterCard: { ...seo.twitterCard, [field]: value }
        });
    }, [seo, onChange]);
    
    const updateOpenGraph = useCallback((field: keyof SocialCard, value: string) => {
        onChange({
            ...seo,
            openGraph: { ...seo.openGraph, [field]: value }
        });
    }, [seo, onChange]);
    
    const updateRobotsMeta = useCallback((field: keyof RobotsMeta, value: boolean | number | string) => {
        onChange({
            ...seo,
            robotsMeta: { 
                ...seo.robotsMeta, 
                index: seo.robotsMeta?.index ?? true,
                follow: seo.robotsMeta?.follow ?? true,
                [field]: value 
            }
        });
    }, [seo, onChange]);
    
    // Add secondary keyword
    const addSecondaryKeyword = useCallback(() => {
        if (!keywordInput.trim()) return;
        
        // Split by comma for multiple keywords
        const keywords = keywordInput
            .split(',')
            .map(k => k.trim())
            .filter(k => k && !seo.secondaryKeywords?.includes(k));
        
        if (keywords.length > 0) {
            updateSEO('secondaryKeywords', [...(seo.secondaryKeywords || []), ...keywords]);
            setKeywordInput('');
        }
    }, [keywordInput, seo.secondaryKeywords, updateSEO]);
    
    // Remove secondary keyword
    const removeSecondaryKeyword = useCallback((keyword: string) => {
        updateSEO('secondaryKeywords', (seo.secondaryKeywords || []).filter(k => k !== keyword));
    }, [seo.secondaryKeywords, updateSEO]);
    
    // Character count indicators
    const titleStatus = getCharacterStatus(effectiveTitle.length, 50, 60);
    const descStatus = getCharacterStatus(effectiveDescription.length, 150, 160);
    
    return (
        <div className="space-y-4">
            {/* SEO Score Header */}
            <div className="bg-gradient-to-r from-[#2C2416] to-[#4a3d2a] p-6 border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#F5C542] mb-1">🔍 SEO Analysis</h3>
                        <p className="text-sm text-white/70">
                            Optimize your {type === 'post' ? 'blog post' : 'project'} for search engines
                        </p>
                    </div>
                    <div className="text-center">
                        <div className={cn(
                            'text-4xl font-black',
                            seoScore >= 80 ? 'text-green-400' :
                            seoScore >= 60 ? 'text-yellow-400' :
                            seoScore >= 40 ? 'text-orange-400' : 'text-red-400'
                        )}>
                            {seoScore}
                        </div>
                        <div className="text-xs text-white/70">SEO Score</div>
                    </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="bg-white/10 rounded p-2 text-center">
                        <div className="text-lg font-bold text-white">{wordCount}</div>
                        <div className="text-xs text-white/60">Words</div>
                    </div>
                    <div className="bg-white/10 rounded p-2 text-center">
                        <div className="text-lg font-bold text-white">{headingStructure.h2Count}</div>
                        <div className="text-xs text-white/60">H2 Tags</div>
                    </div>
                    <div className="bg-white/10 rounded p-2 text-center">
                        <div className="text-lg font-bold text-white">{autoData.faqs?.length || 0}</div>
                        <div className="text-xs text-white/60">FAQs</div>
                    </div>
                    <div className="bg-white/10 rounded p-2 text-center">
                        <div className="text-lg font-bold text-white">{(autoData.gallery?.length || 0) + (autoData.downloads?.length || 0)}</div>
                        <div className="text-xs text-white/60">Media</div>
                    </div>
                </div>
            </div>
            
            {/* A. Basic SEO Metadata */}
            <CollapsibleSection 
                title="Basic SEO Metadata" 
                icon={<Search className="w-5 h-5" />}
                defaultOpen={true}
            >
                <div className="space-y-4">
                    {/* SEO Title */}
                    <div>
                        <Label className="flex items-center gap-2">
                            SEO Title / Meta Title
                            <span className="text-xs text-gray-500 font-normal">(Auto from Title)</span>
                        </Label>
                        <input
                            type="text"
                            value={seo.seoTitle || ''}
                            onChange={(e) => updateSEO('seoTitle', e.target.value)}
                            placeholder={autoData.title || 'Enter SEO title...'}
                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none focus:shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                        />
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">
                                {seo.seoTitle ? 'Custom title' : 'Using title from Basic Info'}
                            </p>
                            <p className={cn(
                                'text-xs font-bold',
                                titleStatus === 'good' ? 'text-green-600' :
                                titleStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                            )}>
                                {effectiveTitle.length}/60 characters
                                {titleStatus === 'good' && ' ✓'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Meta Description */}
                    <div>
                        <Label className="flex items-center gap-2">
                            Meta Description
                            <span className="text-xs text-gray-500 font-normal">(Auto from Excerpt)</span>
                        </Label>
                        <textarea
                            value={seo.metaDescription || ''}
                            onChange={(e) => updateSEO('metaDescription', e.target.value)}
                            placeholder={autoData.excerpt || autoData.description || 'Enter meta description...'}
                            rows={3}
                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] resize-none focus:outline-none focus:shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                        />
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">
                                {seo.metaDescription ? 'Custom description' : 'Using excerpt from Basic Info'}
                            </p>
                            <p className={cn(
                                'text-xs font-bold',
                                descStatus === 'good' ? 'text-green-600' :
                                descStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                            )}>
                                {effectiveDescription.length}/160 characters
                                {descStatus === 'good' && ' ✓'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Slug Display */}
                    <div>
                        <Label className="flex items-center gap-2">
                            URL / Slug
                            <span className="text-xs text-gray-500 font-normal">(Auto from Slug Input)</span>
                        </Label>
                        <div className="mt-2 px-4 py-3 bg-gray-100 border-4 border-[#2C2416]/30 font-mono text-sm">
                            <span className="text-gray-500">https://udyomx.org/{type === 'post' ? 'blog' : 'projects'}/</span>
                            <span className="text-[#2C2416] font-bold">{effectiveSlug || 'your-slug-here'}</span>
                        </div>
                    </div>
                    
                    {/* Canonical URL */}
                    <div>
                        <Label>Canonical URL (Optional)</Label>
                        <input
                            type="url"
                            value={seo.canonicalUrl || ''}
                            onChange={(e) => updateSEO('canonicalUrl', e.target.value)}
                            placeholder={effectiveUrl}
                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty to use default URL. Set only if content exists elsewhere.
                        </p>
                    </div>
                </div>
            </CollapsibleSection>
            
            {/* B. Keywords & Targeting */}
            <CollapsibleSection 
                title="Keywords & Targeting" 
                icon={<Hash className="w-5 h-5" />}
                badge={seo.primaryKeyword ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Set</span> : null}
            >
                <div className="space-y-4">
                    {/* Primary Keyword */}
                    <div>
                        <Label required>Primary Keyword</Label>
                        <input
                            type="text"
                            value={seo.primaryKeyword || ''}
                            onChange={(e) => updateSEO('primaryKeyword', e.target.value)}
                            placeholder="Main focus keyword..."
                            className="w-full px-4 py-3 mt-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                        />
                        {seo.primaryKeyword && effectiveTitle && (
                            <p className={cn(
                                'text-xs mt-1',
                                effectiveTitle.toLowerCase().includes(seo.primaryKeyword.toLowerCase())
                                    ? 'text-green-600'
                                    : 'text-yellow-600'
                            )}>
                                {effectiveTitle.toLowerCase().includes(seo.primaryKeyword.toLowerCase())
                                    ? '✓ Keyword found in title (Good for SEO)'
                                    : '⚠ Consider adding keyword to the beginning of your title'
                                }
                            </p>
                        )}
                    </div>
                    
                    {/* Secondary Keywords */}
                    <div>
                        <Label>Secondary Keywords / LSI Keywords</Label>
                        <p className="text-xs text-[#2C2416]/60 mt-1 mb-2">
                            💡 Tip: Use commas to add multiple keywords at once (e.g., "react, nextjs, typescript")
                        </p>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSecondaryKeyword())}
                                placeholder="Add keywords (comma-separated)..."
                                className="flex-1 px-4 py-2 border-4 border-[#2C2416] bg-[#F5F1E8] focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={addSecondaryKeyword}
                                className="px-4 py-2 font-bold border-4 border-[#2C2416] bg-[#F5C542] hover:shadow-[2px_2px_0_rgba(44,36,22,0.3)]"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        {seo.secondaryKeywords && seo.secondaryKeywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {seo.secondaryKeywords.map(keyword => (
                                    <span 
                                        key={keyword}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 border-2 border-blue-300 text-sm font-medium text-blue-700"
                                    >
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => removeSecondaryKeyword(keyword)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Search Intent */}
                    <div>
                        <Label>Search Intent / Content Type</Label>
                        <Select
                            value={seo.searchIntent || ''}
                            onValueChange={(value) => updateSEO('searchIntent', value as SearchIntent)}
                            placeholder="Select search intent..."
                            className="mt-2"
                        >
                            <SelectOption value="informational">📚 Informational - Educational content</SelectOption>
                            <SelectOption value="commercial">🔍 Commercial - Product/service research</SelectOption>
                            <SelectOption value="transactional">💰 Transactional - Ready to buy/sign up</SelectOption>
                            <SelectOption value="navigational">🧭 Navigational - Specific page search</SelectOption>
                        </Select>
                    </div>
                </div>
            </CollapsibleSection>
            
            {/* C. Structured Data / Schema */}
            <CollapsibleSection 
                title="Structured Data / Schema" 
                icon={<FileText className="w-5 h-5" />}
            >
                <div className="space-y-4">
                    {/* Schema Type */}
                    <div>
                        <Label>Schema Type</Label>
                        <Select
                            value={seo.schemaType || ''}
                            onValueChange={(value) => updateSEO('schemaType', value as SchemaType)}
                            placeholder="Select schema type..."
                            className="mt-2"
                        >
                            <SelectOption value="article">📄 Article</SelectOption>
                            <SelectOption value="blogPosting">📝 Blog Posting</SelectOption>
                            <SelectOption value="newsArticle">📰 News Article</SelectOption>
                            <SelectOption value="techArticle">💻 Tech Article</SelectOption>
                            <SelectOption value="howTo">📋 How-To Guide</SelectOption>
                            <SelectOption value="faqPage">❓ FAQ Page</SelectOption>
                            {type === 'project' && <SelectOption value="product">📦 Product</SelectOption>}
                        </Select>
                    </div>
                    
                    {/* Auto-generated Schema Info */}
                    <div className="bg-[#F5F1E8] border-4 border-[#2C2416]/30 p-4">
                        <h4 className="font-bold text-[#2C2416] mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Auto-Generated Schema Data
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Author:</span>
                                <span className="font-medium">{autoData.author || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Publish Date:</span>
                                <span className="font-medium">{autoData.publishDate || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium">{autoData.category || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tags:</span>
                                <span className="font-medium">{autoData.tags?.join(', ') || 'None'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* FAQ Schema Preview */}
                    {autoData.faqs && autoData.faqs.length > 0 && (
                        <div className="bg-green-50 border-4 border-green-200 p-4">
                            <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                FAQ Schema (Auto-Generated)
                            </h4>
                            <p className="text-sm text-green-600 mb-2">
                                {autoData.faqs.length} FAQ items will be included in structured data
                            </p>
                            <div className="space-y-1">
                                {autoData.faqs.slice(0, 3).map((faq, idx) => (
                                    <div key={idx} className="text-xs text-green-700 truncate">
                                        • {faq.question}
                                    </div>
                                ))}
                                {autoData.faqs.length > 3 && (
                                    <div className="text-xs text-green-500">
                                        + {autoData.faqs.length - 3} more...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* TOC/Heading Structure */}
                    {autoData.toc && autoData.toc.length > 0 && (
                        <div className="bg-blue-50 border-4 border-blue-200 p-4">
                            <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                                <List className="w-4 h-4" />
                                Table of Contents (Auto-Generated)
                            </h4>
                            <p className="text-sm text-blue-600 mb-2">
                                {autoData.toc.length} headings detected
                            </p>
                            <div className="flex gap-4 text-xs">
                                <span className="text-blue-700">H1: {headingStructure.h1Count}</span>
                                <span className="text-blue-700">H2: {headingStructure.h2Count}</span>
                                <span className="text-blue-700">H3: {headingStructure.h3Count}</span>
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>
            
            {/* F. Social / Sharing */}
            <CollapsibleSection 
                title="Social Cards & Sharing" 
                icon={<Globe className="w-5 h-5" />}
            >
                <div className="space-y-6">
                    {/* Twitter Card */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#2C2416] flex items-center gap-2">
                            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                            Twitter Card
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm">Title (auto from SEO title)</Label>
                                    <input
                                        type="text"
                                        value={seo.twitterCard?.title || ''}
                                        onChange={(e) => updateTwitterCard('title', e.target.value)}
                                        placeholder={effectiveTitle}
                                        className="w-full px-3 py-2 mt-1 border-3 border-[#2C2416] bg-[#F5F1E8] text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm">Description (auto from meta)</Label>
                                    <textarea
                                        value={seo.twitterCard?.description || ''}
                                        onChange={(e) => updateTwitterCard('description', e.target.value)}
                                        placeholder={effectiveDescription}
                                        rows={2}
                                        className="w-full px-3 py-2 mt-1 border-3 border-[#2C2416] bg-[#F5F1E8] text-sm resize-none"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm">Image (auto from cover)</Label>
                                    <input
                                        type="url"
                                        value={seo.twitterCard?.image || ''}
                                        onChange={(e) => updateTwitterCard('image', e.target.value)}
                                        placeholder={effectiveImage}
                                        className="w-full px-3 py-2 mt-1 border-3 border-[#2C2416] bg-[#F5F1E8] text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm mb-2">Preview</Label>
                                <TwitterPreview 
                                    card={seo.twitterCard || {}}
                                    defaultTitle={effectiveTitle}
                                    defaultDescription={effectiveDescription}
                                    defaultImage={effectiveImage}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Open Graph */}
                    <div className="space-y-4 pt-4 border-t-4 border-[#2C2416]/20">
                        <h4 className="font-bold text-[#2C2416] flex items-center gap-2">
                            <Facebook className="w-5 h-5 text-[#1877F2]" />
                            Open Graph (Facebook/LinkedIn)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm">Title (auto from SEO title)</Label>
                                    <input
                                        type="text"
                                        value={seo.openGraph?.title || ''}
                                        onChange={(e) => updateOpenGraph('title', e.target.value)}
                                        placeholder={effectiveTitle}
                                        className="w-full px-3 py-2 mt-1 border-3 border-[#2C2416] bg-[#F5F1E8] text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm">Description (auto from meta)</Label>
                                    <textarea
                                        value={seo.openGraph?.description || ''}
                                        onChange={(e) => updateOpenGraph('description', e.target.value)}
                                        placeholder={effectiveDescription}
                                        rows={2}
                                        className="w-full px-3 py-2 mt-1 border-3 border-[#2C2416] bg-[#F5F1E8] text-sm resize-none"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm">Image (auto from cover)</Label>
                                    <input
                                        type="url"
                                        value={seo.openGraph?.image || ''}
                                        onChange={(e) => updateOpenGraph('image', e.target.value)}
                                        placeholder={effectiveImage}
                                        className="w-full px-3 py-2 mt-1 border-3 border-[#2C2416] bg-[#F5F1E8] text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm mb-2">Preview</Label>
                                <FacebookPreview 
                                    card={seo.openGraph || {}}
                                    defaultTitle={effectiveTitle}
                                    defaultDescription={effectiveDescription}
                                    defaultImage={effectiveImage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>
            
            {/* G. Technical SEO */}
            <CollapsibleSection 
                title="Technical SEO / Advanced" 
                icon={<Settings className="w-5 h-5" />}
            >
                <div className="space-y-4">
                    {/* Robots Meta */}
                    <div>
                        <h4 className="font-bold text-[#2C2416] mb-3">Robots Meta Tags</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={seo.robotsMeta?.index ?? true}
                                    onChange={(e) => updateRobotsMeta('index', e.target.checked)}
                                    className="w-5 h-5 border-2 border-[#2C2416]"
                                />
                                <span className="text-sm font-medium">Index</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={seo.robotsMeta?.follow ?? true}
                                    onChange={(e) => updateRobotsMeta('follow', e.target.checked)}
                                    className="w-5 h-5 border-2 border-[#2C2416]"
                                />
                                <span className="text-sm font-medium">Follow</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={seo.robotsMeta?.noarchive ?? false}
                                    onChange={(e) => updateRobotsMeta('noarchive', e.target.checked)}
                                    className="w-5 h-5 border-2 border-[#2C2416]"
                                />
                                <span className="text-sm font-medium">No Archive</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={seo.robotsMeta?.noimageindex ?? false}
                                    onChange={(e) => updateRobotsMeta('noimageindex', e.target.checked)}
                                    className="w-5 h-5 border-2 border-[#2C2416]"
                                />
                                <span className="text-sm font-medium">No Image Index</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Image Preview Size */}
                    <div>
                        <Label>Max Image Preview</Label>
                        <Select
                            value={seo.robotsMeta?.maxImagePreview || 'large'}
                            onValueChange={(value) => updateRobotsMeta('maxImagePreview', value as 'none' | 'standard' | 'large')}
                            className="mt-2"
                        >
                            <SelectOption value="large">Large (Recommended)</SelectOption>
                            <SelectOption value="standard">Standard</SelectOption>
                            <SelectOption value="none">None</SelectOption>
                        </Select>
                    </div>
                    
                    {/* Gallery/Media Alt Text Info */}
                    {(autoData.gallery && autoData.gallery.length > 0) || (autoData.downloads && autoData.downloads.length > 0) ? (
                        <div className="bg-[#F5F1E8] border-4 border-[#2C2416]/30 p-4">
                            <h4 className="font-bold text-[#2C2416] mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Media & Downloads (Auto-Indexed)
                            </h4>
                            <div className="space-y-2 text-sm">
                                {autoData.gallery && autoData.gallery.length > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Gallery Images:</span>
                                        <span className="font-medium">{autoData.gallery.length} items with alt text</span>
                                    </div>
                                )}
                                {autoData.downloads && autoData.downloads.length > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Downloadables:</span>
                                        <span className="font-medium">{autoData.downloads.length} files</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Alt text from Gallery and Download editors will be used for SEO.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-4 border-yellow-200 p-4">
                            <p className="text-sm text-yellow-700 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Add images to Gallery tab to improve SEO with alt text
                            </p>
                        </div>
                    )}
                    
                    {/* Breadcrumb Path */}
                    <div>
                        <Label>Breadcrumb Path Preview</Label>
                        <div className="mt-2 px-4 py-3 bg-gray-100 border-4 border-[#2C2416]/30 text-sm">
                            <a href="/" className="text-blue-600 hover:underline">Home</a>
                            <span className="text-gray-400 mx-2">›</span>
                            <a 
                                href={type === 'post' ? '/blog' : '/projects'} 
                                className="text-blue-600 hover:underline"
                            >
                                {type === 'post' ? 'Blog' : 'Projects'}
                            </a>
                            {autoData.category && (
                                <>
                                    <span className="text-gray-400 mx-2">›</span>
                                    <a 
                                        href={`/${type === 'post' ? 'blog' : 'projects'}?category=${encodeURIComponent(autoData.category)}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {autoData.category}
                                    </a>
                                </>
                            )}
                            <span className="text-gray-400 mx-2">›</span>
                            <span className="text-[#2C2416] font-medium">{autoData.title || 'Current Page'}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            This breadcrumb will be used for JSON-LD structured data on the frontend page.
                            Actual path: <code className="bg-gray-200 px-1">/{type === 'post' ? 'blog' : 'projects'}/{autoData.slug || 'slug'}</code>
                        </p>
                    </div>
                </div>
            </CollapsibleSection>
            
            {/* Search Engine Previews */}
            <CollapsibleSection 
                title="Search Engine Previews" 
                icon={<Eye className="w-5 h-5" />}
                defaultOpen={true}
            >
                <div className="space-y-4">
                    {/* Preview Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => setActivePreview('google')}
                            className={cn(
                                'px-4 py-2 font-bold text-sm border-3 border-[#2C2416] transition-all',
                                activePreview === 'google' ? 'bg-[#2C2416] text-white' : 'bg-white hover:bg-[#F5C542]'
                            )}
                        >
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePreview('twitter')}
                            className={cn(
                                'px-4 py-2 font-bold text-sm border-3 border-[#2C2416] transition-all',
                                activePreview === 'twitter' ? 'bg-[#1DA1F2] text-white' : 'bg-white hover:bg-[#F5C542]'
                            )}
                        >
                            Twitter
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePreview('facebook')}
                            className={cn(
                                'px-4 py-2 font-bold text-sm border-3 border-[#2C2416] transition-all',
                                activePreview === 'facebook' ? 'bg-[#1877F2] text-white' : 'bg-white hover:bg-[#F5C542]'
                            )}
                        >
                            Facebook
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePreview('all')}
                            className={cn(
                                'px-4 py-2 font-bold text-sm border-3 border-[#2C2416] transition-all',
                                activePreview === 'all' ? 'bg-[#F5C542]' : 'bg-white hover:bg-[#F5C542]'
                            )}
                        >
                            All
                        </button>
                    </div>
                    
                    {/* Previews */}
                    <div className={cn(
                        'grid gap-6',
                        activePreview === 'all' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
                    )}>
                        {(activePreview === 'google' || activePreview === 'all') && (
                            <div>
                                <h4 className="font-bold text-sm mb-2 text-[#2C2416]">Google Search Result</h4>
                                <GooglePreview
                                    title={effectiveTitle}
                                    description={effectiveDescription}
                                    url={effectiveUrl}
                                />
                            </div>
                        )}
                        
                        {(activePreview === 'twitter' || activePreview === 'all') && (
                            <div>
                                <h4 className="font-bold text-sm mb-2 text-[#1DA1F2]">Twitter Card</h4>
                                <TwitterPreview 
                                    card={seo.twitterCard || {}}
                                    defaultTitle={effectiveTitle}
                                    defaultDescription={effectiveDescription}
                                    defaultImage={effectiveImage}
                                />
                            </div>
                        )}
                        
                        {(activePreview === 'facebook' || activePreview === 'all') && (
                            <div>
                                <h4 className="font-bold text-sm mb-2 text-[#1877F2]">Facebook / LinkedIn</h4>
                                <FacebookPreview 
                                    card={seo.openGraph || {}}
                                    defaultTitle={effectiveTitle}
                                    defaultDescription={effectiveDescription}
                                    defaultImage={effectiveImage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </CollapsibleSection>
            
            {/* SEO Checklist */}
            <div className="bg-white border-4 border-[#2C2416] p-4 shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                <h4 className="font-bold text-[#2C2416] mb-3">📋 SEO Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <ChecklistItem 
                        label="Title length (50-60 chars)" 
                        checked={effectiveTitle.length >= 50 && effectiveTitle.length <= 60}
                        warning={effectiveTitle.length > 0 && effectiveTitle.length < 50}
                    />
                    <ChecklistItem 
                        label="Meta description (150-160 chars)" 
                        checked={effectiveDescription.length >= 150 && effectiveDescription.length <= 160}
                        warning={effectiveDescription.length > 0 && effectiveDescription.length < 150}
                    />
                    <ChecklistItem 
                        label="Primary keyword set" 
                        checked={!!seo.primaryKeyword}
                    />
                    <ChecklistItem 
                        label="Keyword in title" 
                        checked={!!seo.primaryKeyword && effectiveTitle.toLowerCase().includes(seo.primaryKeyword.toLowerCase())}
                        warning={!!seo.primaryKeyword && !effectiveTitle.toLowerCase().includes(seo.primaryKeyword.toLowerCase())}
                    />
                    <ChecklistItem 
                        label="Featured image set" 
                        checked={!!effectiveImage}
                    />
                    <ChecklistItem 
                        label="Schema type selected" 
                        checked={!!seo.schemaType}
                    />
                    <ChecklistItem 
                        label="Search intent defined" 
                        checked={!!seo.searchIntent}
                    />
                    <ChecklistItem 
                        label="FAQs added (for rich snippets)" 
                        checked={!!autoData.faqs && autoData.faqs.length > 0}
                    />
                    <ChecklistItem 
                        label="Canonical URL set" 
                        checked={!!seo.canonicalUrl && seo.canonicalUrl.length > 0}
                        warning={!seo.canonicalUrl}
                    />
                    <ChecklistItem 
                        label="Schema markup configured" 
                        checked={!!seo.schemaType && (seo.schemaType !== 'Article' || !!autoData.faqs?.length)}
                        warning={!!seo.schemaType && seo.schemaType === 'Article' && !autoData.faqs?.length}
                    />
                    <ChecklistItem 
                        label="Heading structure (H1-H3)" 
                        checked={!!autoData.toc && autoData.toc.length > 0}
                        warning={!autoData.toc || autoData.toc.length === 0}
                    />
                    <ChecklistItem 
                        label="OpenGraph image set" 
                        checked={!!(seo.openGraph?.image || effectiveImage)}
                    />
                    <ChecklistItem 
                        label="Twitter card configured" 
                        checked={!!(seo.twitterCard?.title || seo.twitterCard?.image)}
                    />
                    <ChecklistItem 
                        label="Robots meta (index enabled)" 
                        checked={seo.robotsMeta?.index !== false}
                        warning={seo.robotsMeta?.index === false}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================
// CHECKLIST ITEM COMPONENT
// ============================================

interface ChecklistItemProps {
    label: string;
    checked: boolean;
    warning?: boolean;
}

function ChecklistItem({ label, checked, warning }: ChecklistItemProps) {
    return (
        <div className="flex items-center gap-2 text-sm">
            {checked ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            ) : warning ? (
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
            )}
            <span className={cn(
                checked ? 'text-green-700' : warning ? 'text-yellow-700' : 'text-gray-500'
            )}>
                {label}
            </span>
        </div>
    );
}

export default SEOEditor;
