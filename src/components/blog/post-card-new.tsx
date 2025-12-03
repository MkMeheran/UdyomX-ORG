'use client';

import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '@/types';

interface PostCardProps {
    post: BlogPost;
}

const cardColors = [
    { bg: 'bg-[#FFE5E5]', border: 'border-[#FF6B6B]', text: 'text-[#8B0000]', header: 'bg-[#FF6B6B]' },
    { bg: 'bg-[#E5F3FF]', border: 'border-[#4A90E2]', text: 'text-[#1A4D7C]', header: 'bg-[#4A90E2]' },
    { bg: 'bg-[#FFF9E5]', border: 'border-[#F5C542]', text: 'text-[#8B6F00]', header: 'bg-[#F5C542]' },
    { bg: 'bg-[#E5FFE5]', border: 'border-[#5CB85C]', text: 'text-[#2D5F2D]', header: 'bg-[#5CB85C]' },
];

export function PostCard({ post }: PostCardProps) {
    const colorIndex = parseInt(post.id, 36) % cardColors.length;
    const colors = cardColors[colorIndex];

    return (
        <Link href={`/blog/${post.slug}`} className="block h-full">
            <article className={`group ${colors.bg} border-4 ${colors.border} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 overflow-hidden h-full flex flex-col`}>
                <div className={`${colors.header} p-6 border-b-4 ${colors.border}`}>
                    <h3 className="text-xl font-black text-white line-clamp-2 leading-tight">
                        {post.title}
                    </h3>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <p className={`text-sm font-semibold ${colors.text} line-clamp-3 mb-4 flex-1`}>
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t-3 border-black">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className={`text-xs font-bold ${colors.text}`}>
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className={`text-xs font-bold ${colors.text}`}>
                                {post.readTime}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`px-6 py-3 ${colors.header} border-t-4 ${colors.border}`}>
                    <span className="text-sm font-black text-white uppercase tracking-wider">
                        {post.category}
                    </span>
                </div>
            </article>
        </Link>
    );
}
