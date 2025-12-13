'use client';

import Image from 'next/image';
import { Calendar, Clock, FileText } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import { TOC } from '../toc';
import { MediaGallery } from '../media-gallery';
import { FAQSection } from '../faq-section';
import { DownloadSection } from '../download-section';
import { RecommendedContent } from '../recommended-content';
import { useTOC } from '@/hooks/use-toc';
import { ContentRenderer } from '@/components/common/ContentRenderer';
import { MediaLightbox } from '@/components/common/MediaLightbox';

interface ResearchPaperLayoutProps {
    post: BlogPost;
    userIsPremium?: boolean;
}

export function ResearchPaperLayout({ post, userIsPremium = false }: ResearchPaperLayoutProps) {
    const tocItems = useTOC(post.content);

    return (
        <div className="min-h-screen bg-earth-cream">
            {/* Academic Header */}
            <div className="bg-earth-ink text-earth-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <span className="inline-block px-3 py-1 bg-earth-teal text-earth-white text-sm font-bold rounded-full mb-4">
                        {post.category} • Research Paper
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{post.title}</h1>

                    {/* Author Info */}
                    <div className="flex flex-wrap items-center gap-6 text-earth-white/90 text-sm border-t border-earth-white/20 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-earth-white overflow-hidden relative">
                                <Image
                                    src={post.authorAvatar}
                                    alt={post.author}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-earth-white">{post.author}</p>
                                <p className="text-xs text-earth-white/70">Researcher</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Published: {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-[250px_1fr_300px] gap-8">
                    {/* Left Sidebar: TOC (Desktop Only) */}
                    <aside className="hidden lg:block">
                        <TOC items={tocItems} />
                    </aside>

                    {/* Center: Research Content */}
                    <article className="min-w-0">
                        {/* Mobile TOC */}
                        <TOC items={tocItems} />

                        {/* Abstract */}
                        <div className="bg-earth-white border-2 border-earth-brown rounded-xl shadow-offset p-8 mb-8">
                            <h2 className="text-2xl font-bold text-earth-ink mb-4 flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Abstract
                            </h2>
                            <p className="text-text-secondary-alt leading-relaxed italic">
                                {post.excerpt}
                            </p>

                            {/* Keywords/Tags */}
                            <div className="mt-6 pt-6 border-t border-stone-warm">
                                <p className="text-sm font-semibold text-earth-ink mb-2">Keywords:</p>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-earth-cream border border-earth-teal text-earth-teal text-sm font-medium rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content - Auto-detects Markdown or HTML */}
                        <ContentRenderer 
                            content={post.content} 
                            format={(post as any).contentFormat || 'auto'}
                            className="
                                prose-headings:font-serif prose-headings:text-earth-ink
                                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b-2 prose-h2:border-earth-brown prose-h2:pb-3
                                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                                prose-p:text-text-secondary-alt prose-p:leading-relaxed prose-p:text-justify
                                prose-a:text-earth-teal prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-earth-ink prose-strong:font-bold
                                prose-code:text-earth-teal prose-code:bg-earth-cream prose-code:px-1 prose-code:rounded
                                prose-pre:bg-earth-ink prose-pre:text-earth-white
                                prose-img:rounded-xl prose-img:border-2 prose-img:border-earth-brown prose-img:shadow-offset
                                prose-blockquote:border-l-4 prose-blockquote:border-earth-teal prose-blockquote:bg-earth-white prose-blockquote:p-6 prose-blockquote:italic
                                prose-ol:list-decimal prose-ul:list-disc
                            "
                        />

                        {/* References Section */}
                        <div className="mt-12 bg-earth-white border-2 border-earth-brown rounded-xl shadow-offset p-8">
                            <h2 className="text-2xl font-bold text-earth-ink mb-4">References</h2>
                            <p className="text-text-secondary-alt text-sm italic">
                                References will be dynamically generated from citations in the content.
                            </p>
                        </div>

                        {/* FAQ Section */}
                        {post.faqs && post.faqs.length > 0 && (
                            <div className="mt-12">
                                <FAQSection faqs={post.faqs} userIsPremium={userIsPremium} />
                            </div>
                        )}
                    </article>

                    {/* Right Sidebar */}
                    <aside className="space-y-6">
                        {/* Recommended Content */}
                        {post.recommendedContent && post.recommendedContent.length > 0 && (
                            <RecommendedContent items={post.recommendedContent} itemsPerPage={3} />
                        )}

                        {/* Gallery */}
                        {post.gallery && post.gallery.length > 0 && (
                            <MediaGallery images={post.gallery} />
                        )}

                        {/* Downloads */}
                        {post.downloads && post.downloads.length > 0 && (
                            <DownloadSection downloads={post.downloads} />
                        )}
                    </aside>
                </div>
            </div>

            {/* Media Lightbox */}
            <MediaLightbox trigger=".lightbox-trigger" />
        </div>
    );
}
