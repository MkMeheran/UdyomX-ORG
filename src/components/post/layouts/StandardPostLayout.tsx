'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MDXRenderer } from '@/components/common/MDXRenderer';
import { PostMeta } from '../PostMeta';
import { PostAuthors } from '../PostAuthors';
import { PostRecommended } from '../PostRecommended';
import { MediaLightbox } from '@/components/common/MediaLightbox';
import type { Post, BusinessInfo } from '@/types/post';

interface StandardPostLayoutProps {
    post: Post;
    businessInfo?: BusinessInfo;
}

export function StandardPostLayout({ post, businessInfo }: StandardPostLayoutProps) {
    return (
        <article className="min-h-screen bg-[#F5F5F0]">
            {/* Header */}
            <header className="bg-white border-b-4 border-black">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#F5F5F0] border-3 border-black font-black text-sm uppercase tracking-wider shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>

                    {/* Category */}
                    <div className="mb-4">
                        <span className="px-3 py-1.5 bg-[#2196F3] text-white text-sm font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                            {post.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-xl text-[#5A5A5A] font-semibold mb-6 leading-relaxed">
                        {post.excerpt}
                    </p>

                    {/* Meta (Compact) */}
                    <PostMeta post={post} layout="compact" />
                </div>
            </header>

            {/* Main Content */
            <div className="max-w-4xl mx-auto px-4 pb-16">
                {/* Authors */}
                {post.authors && post.authors.length > 0 && (
                    <div className="mb-8">
                        <PostAuthors authors={post.authors} layout="horizontal" />
                    </div>
                )}

                {/* Content */}
                <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[6px_6px_0_0_rgba(0,0,0,1)] mb-8">
                    <MDXRenderer content={post.content} />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-8 p-4 bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                        <h4 className="font-black text-[#1A1A1A] uppercase tracking-wider text-sm mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/blog?tag=${tag}`}
                                    className="px-3 py-1.5 bg-[#F5F5F0] border-2 border-black font-bold text-sm text-[#1A1A1A] hover:bg-[#2196F3] hover:text-white transition-colors"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommended Content */}
                {post.recommended && (
                    <PostRecommended content={post.recommended} />
                )}
            </div>

            {/* Media Lightbox */}
            <MediaLightbox trigger=".lightbox-trigger" />
        </article>
    );
}
