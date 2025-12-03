import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
    post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <article className="group bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.4)] hover:-translate-y-1 transition-all duration-200 overflow-hidden h-full flex flex-col">
                {/* Thumbnail */}
                {post.thumbnail && (
                    <div className="relative aspect-video overflow-hidden border-b-4 border-[#2C2416]">
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                            <span className="inline-block px-3 py-1 bg-[#F5C542] text-[#2C2416] text-xs font-black uppercase border-2 border-[#2C2416]">
                                {post.category}
                            </span>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col bg-[#F5F1E8]">
                    {/* Title */}
                    <h3 className="text-lg font-black text-[#2C2416] mb-3 line-clamp-2 leading-tight group-hover:text-[#F5C542] transition-colors">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[#2C2416]/70 mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-[#2C2416]/60 font-bold">
                        {post.author && (
                            <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                <span>{post.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(post.publishDate)}</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
