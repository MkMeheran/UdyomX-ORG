'use client';

import Image from 'next/image';
import { User, Building, ExternalLink } from 'lucide-react';
import type { Author } from '@/types/post';

interface PostAuthorsProps {
    authors: Author[];
    layout?: 'horizontal' | 'vertical';
}

export function PostAuthors({ authors, layout = 'horizontal' }: PostAuthorsProps) {
    if (!authors || authors.length === 0) return null;

    const isVertical = layout === 'vertical';

    return (
        <div
            className={`
                bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]
                ${isVertical ? 'space-y-4' : 'flex flex-wrap gap-4'}
            `}
        >
            <h4 className={`font-black text-[#1A1A1A] uppercase tracking-wider text-sm ${isVertical ? 'mb-4 pb-3 border-b-3 border-black' : 'w-full mb-2'}`}>
                {authors.length > 1 ? 'Authors' : 'Author'}
            </h4>

            {authors.map((author, index) => (
                <div
                    key={author.id || index}
                    className={`
                        flex items-start gap-4
                        ${isVertical ? 'p-3 bg-[#F5F5F0] border-3 border-black' : ''}
                    `}
                >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {author.avatar ? (
                            <div className="w-14 h-14 border-3 border-black overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                                <Image
                                    src={author.avatar}
                                    alt={author.name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-14 h-14 bg-[#2196F3] border-3 border-black flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h5 className="font-black text-[#1A1A1A] text-lg">{author.name}</h5>
                        
                        {author.affiliation && (
                            <p className="flex items-center gap-1.5 text-sm text-[#5A5A5A] font-semibold mt-1">
                                <Building className="w-3.5 h-3.5" />
                                {author.affiliation}
                            </p>
                        )}

                        {author.bio && (
                            <p className="text-sm text-[#5A5A5A] mt-2 line-clamp-2 font-medium">
                                {author.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        {author.socialLinks && (
                            <div className="flex gap-2 mt-3">
                                {author.socialLinks.twitter && (
                                    <a
                                        href={author.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 border-2 border-black bg-white hover:bg-[#1DA1F2] hover:text-white text-[#1A1A1A] flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                )}
                                {author.socialLinks.github && (
                                    <a
                                        href={author.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 border-2 border-black bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                        </svg>
                                    </a>
                                )}
                                {author.socialLinks.website && (
                                    <a
                                        href={author.socialLinks.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 border-2 border-black bg-white hover:bg-[#2196F3] hover:text-white text-[#1A1A1A] flex items-center justify-center transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
