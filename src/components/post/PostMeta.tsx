'use client';

import { Calendar, Clock, Tag, FolderOpen, Eye } from 'lucide-react';
import { AudienceBadge } from './AudienceBadge';
import type { Post } from '@/types/post';

interface PostMetaProps {
    post: Post;
    layout?: 'horizontal' | 'vertical' | 'compact';
}

export function PostMeta({ post, layout = 'vertical' }: PostMetaProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (layout === 'compact') {
        return (
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#5A5A5A]">
                <span className="flex items-center gap-1.5 font-bold">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedDate)}
                </span>
                {post.readTime && (
                    <span className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                    </span>
                )}
                <span className="flex items-center gap-1.5 font-bold">
                    <FolderOpen className="w-4 h-4" />
                    {post.category}
                </span>
            </div>
        );
    }

    if (layout === 'horizontal') {
        return (
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#2196F3] border-2 border-black flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-[#5A5A5A] font-bold uppercase">Published</p>
                            <p className="font-black text-[#1A1A1A]">{formatDate(post.publishedDate)}</p>
                        </div>
                    </div>

                    {post.readTime && (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#FF6B6B] border-2 border-black flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-[#5A5A5A] font-bold uppercase">Read Time</p>
                                <p className="font-black text-[#1A1A1A]">{post.readTime}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#F5C542] border-2 border-black flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-[#1A1A1A]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#5A5A5A] font-bold uppercase">Category</p>
                            <p className="font-black text-[#1A1A1A]">{post.category}</p>
                        </div>
                    </div>

                    <div className="ml-auto">
                        <AudienceBadge audienceType={post.audienceType} size="md" />
                    </div>
                </div>
            </div>
        );
    }

    // Vertical layout (default)
    return (
        <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <h4 className="font-black text-[#1A1A1A] uppercase tracking-wider text-sm mb-4 pb-3 border-b-3 border-black">
                Post Details
            </h4>

            <div className="space-y-4">
                {/* Published Date */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2196F3] border-2 border-black flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-[#5A5A5A] font-bold uppercase">Published</p>
                        <p className="font-black text-[#1A1A1A]">{formatDate(post.publishedDate)}</p>
                    </div>
                </div>

                {/* Updated Date */}
                {post.updatedDate && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5CB85C] border-2 border-black flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-[#5A5A5A] font-bold uppercase">Updated</p>
                            <p className="font-black text-[#1A1A1A]">{formatDate(post.updatedDate)}</p>
                        </div>
                    </div>
                )}

                {/* Read Time */}
                {post.readTime && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF6B6B] border-2 border-black flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-[#5A5A5A] font-bold uppercase">Read Time</p>
                            <p className="font-black text-[#1A1A1A]">{post.readTime}</p>
                        </div>
                    </div>
                )}

                {/* Category */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5C542] border-2 border-black flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-5 h-5 text-[#1A1A1A]" />
                    </div>
                    <div>
                        <p className="text-xs text-[#5A5A5A] font-bold uppercase">Category</p>
                        <p className="font-black text-[#1A1A1A]">{post.category}</p>
                    </div>
                </div>

                {/* Audience */}
                <div className="pt-3 border-t-3 border-black">
                    <p className="text-xs text-[#5A5A5A] font-bold uppercase mb-2">Audience</p>
                    <AudienceBadge audienceType={post.audienceType} size="md" />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="pt-3 border-t-3 border-black">
                        <p className="text-xs text-[#5A5A5A] font-bold uppercase mb-2 flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            Tags
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 text-xs font-bold bg-[#F5F5F0] border-2 border-black text-[#1A1A1A]"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
