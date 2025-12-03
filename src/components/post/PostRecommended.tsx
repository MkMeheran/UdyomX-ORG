'use client';

import Link from 'next/link';
import { Sparkles, BookOpen, FolderOpen, PlayCircle, ArrowRight } from 'lucide-react';
import { LazyImage } from '@/components/common/LazyImage';
import type { RecommendedContent, RecommendedPost } from '@/types/post';

interface PostRecommendedProps {
    content: RecommendedContent;
    title?: string;
}

const typeConfig = {
    post: { icon: BookOpen, color: 'bg-[#2196F3]', label: 'Post', href: '/blog' },
    playlist: { icon: PlayCircle, color: 'bg-[#9C27B0]', label: 'Playlist', href: '/playlists' },
    project: { icon: FolderOpen, color: 'bg-[#FF6B6B]', label: 'Project', href: '/projects' },
};

export function PostRecommended({ content, title = 'Recommended' }: PostRecommendedProps) {
    const allItems: RecommendedPost[] = [
        ...(content.posts || []),
        ...(content.playlists || []),
        ...(content.projects || []),
    ];

    if (allItems.length === 0) return null;

    return (
        <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-3 border-b-3 border-black">
                <div className="w-10 h-10 bg-[#F5C542] border-2 border-black flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <h3 className="font-black text-[#1A1A1A] uppercase tracking-wider">
                    {title}
                </h3>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allItems.slice(0, 6).map((item) => {
                    const config = typeConfig[item.type];
                    const Icon = config.icon;
                    const href = item.type === 'post' 
                        ? `/blog/${item.slug}` 
                        : item.type === 'project'
                        ? `/projects/${item.slug}`
                        : `/playlists/${item.slug}`;

                    return (
                        <Link
                            key={item.id}
                            href={href}
                            className="group block border-3 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative aspect-video border-b-3 border-black overflow-hidden">
                                {item.coverPhoto ? (
                                    <LazyImage
                                        src={item.coverPhoto}
                                        alt={item.title}
                                        aspectRatio="video"
                                        brutal={false}
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className={`w-full h-full ${config.color} flex items-center justify-center`}>
                                        <Icon className="w-12 h-12 text-white opacity-50" />
                                    </div>
                                )}

                                {/* Type Badge */}
                                <span className={`absolute top-2 left-2 px-2 py-1 ${config.color} text-white text-xs font-black uppercase border-2 border-black`}>
                                    {config.label}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-3 bg-[#F5F5F0]">
                                <h4 className="font-black text-[#1A1A1A] line-clamp-2 text-sm group-hover:text-[#2196F3] transition-colors">
                                    {item.title}
                                </h4>
                                {item.excerpt && (
                                    <p className="text-xs text-[#5A5A5A] mt-1 line-clamp-2 font-semibold">
                                        {item.excerpt}
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* View More Links */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t-3 border-black">
                {content.posts && content.posts.length > 0 && (
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 px-4 py-2 bg-[#2196F3] text-white font-black text-sm uppercase border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
                    >
                        More Posts
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
                {content.projects && content.projects.length > 0 && (
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white font-black text-sm uppercase border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
                    >
                        More Projects
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </div>
    );
}
