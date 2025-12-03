'use client';

import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { blogAPI } from '@/lib/api';
import type { BlogPost } from '@/types';

export function LatestUpdates() {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        blogAPI.getAll().then((data) => setPosts(data.slice(0, 4)));
    }, []);

    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-[#F5F5F0] h-20 border-3 border-black" />
                        </div>
                    ))}
                </div>
            ) : (
                posts.map((post, index) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group block bg-white border-3 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 border-2 border-black bg-[#2196F3] flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-[#1A1A1A] line-clamp-2 mb-2 uppercase tracking-wide">
                                    {post.title}
                                </h3>
                                <p className="text-xs text-[#5A5A5A] font-bold mb-2">
                                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-sm text-[#3D3D3D] line-clamp-2 font-semibold">{post.excerpt}</p>
                            </div>
                        </div>
                    </Link>
                ))
            )}
            
            <Link
                href="/blog"
                className="mt-4 flex items-center justify-center gap-2 bg-[#FF6B6B] text-white px-6 py-3 border-3 border-black font-black uppercase tracking-wider shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all group"
            >
                View all posts 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
