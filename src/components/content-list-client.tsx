'use client';

import { useState, useEffect, useMemo } from 'react';
import { FilterBar } from './filter-bar';
import { PostCard } from './post/PostCard';
import { ProjectCard } from './project-card';
import { ServiceCard } from './service-card';
import { Loader2 } from 'lucide-react';
import type { PostCardData } from '@/types/post';

type ContentType = 'post' | 'project' | 'service';

interface ContentListClientProps {
    contentType: ContentType;
    initialItems: any[];
    categories?: string[];
}

const ITEMS_PER_PAGE = 10;

export function ContentListClient({
    contentType,
    initialItems,
    categories = ['All Categories'],
}: ContentListClientProps) {
    const [allItems, setAllItems] = useState(initialItems);
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortValue, setSortValue] = useState('latest');
    const [categoryValue, setCategoryValue] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    // Filter only published items (or all items if none are published for development)
    const publishedItems = useMemo(() => {
        const published = allItems.filter(item => item.status === 'published');
        // If no published items, show all in development (helps with testing)
        return published.length > 0 ? published : allItems;
    }, [allItems]);

    // Search and filter logic (applied to ALL published items, not just displayed ones)
    const filteredItems = useMemo(() => {
        let items = [...publishedItems];

        // Search filter (case-insensitive, searches title and excerpt/description)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => {
                const title = (item.title || '').toLowerCase();
                const excerpt = (item.excerpt || item.description || '').toLowerCase();
                const category = (item.category || '').toLowerCase();
                return title.includes(query) || excerpt.includes(query) || category.includes(query);
            });
        }

        // Category filter
        if (categoryValue !== 'all') {
            items = items.filter(item => {
                const itemCategory = (item.category || '').toLowerCase().replace(/\s+/g, '-');
                return itemCategory === categoryValue;
            });
        }

        // Sort
        if (sortValue === 'latest') {
            items.sort((a, b) => {
                const dateA = new Date(a.publishedAt || a.publishDate || a.createdAt || 0);
                const dateB = new Date(b.publishedAt || b.publishDate || b.createdAt || 0);
                return dateB.getTime() - dateA.getTime();
            });
        } else if (sortValue === 'oldest') {
            items.sort((a, b) => {
                const dateA = new Date(a.publishedAt || a.publishDate || a.createdAt || 0);
                const dateB = new Date(b.publishedAt || b.publishDate || b.createdAt || 0);
                return dateA.getTime() - dateB.getTime();
            });
        } else if (sortValue === 'popular') {
            items.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        return items;
    }, [publishedItems, searchQuery, categoryValue, sortValue]);

    // Items to display (with pagination)
    const displayedItems = filteredItems.slice(0, displayedCount);
    const hasMore = displayedCount < filteredItems.length;

    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
            setIsLoading(false);
        }, 300);
    };

    const handleClear = () => {
        setSearchQuery('');
        setSortValue('latest');
        setCategoryValue('all');
        setDisplayedCount(ITEMS_PER_PAGE);
    };

    // Adapt blog post to PostCard format
    const adaptBlogToPostCard = (blog: any): PostCardData => ({
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        coverPhoto: blog.thumbnail || blog.coverImage,
        category: blog.category || 'Blog',
        publishedDate: blog.publishDate || blog.publishedAt,
        readTime: blog.readTime,
        audienceType: blog.audienceType || 'public',
        authors: blog.authors || [
            {
                id: '1',
                name: blog.author || 'Anonymous',
                avatar: blog.authorAvatar,
            }
        ],
    });

    const renderCard = (item: any, index: number) => {
        const key = `${contentType}-${item.id}`;
        
        switch (contentType) {
            case 'post':
                return (
                    <div
                        key={key}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <PostCard post={adaptBlogToPostCard(item)} index={index} />
                    </div>
                );
            case 'project':
                return (
                    <div
                        key={key}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <ProjectCard project={item} />
                    </div>
                );
            case 'service':
                return (
                    <div
                        key={key}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <ServiceCard service={item} index={index} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {/* Filter Bar */}
            <div className="mb-8">
                <FilterBar
                    onSearch={setSearchQuery}
                    onSort={setSortValue}
                    onCategoryChange={setCategoryValue}
                    onClear={handleClear}
                    categories={categories}
                    showCategoryFilter={categories.length > 1}
                />
            </div>

            {/* Results Count */}
            {(searchQuery || categoryValue !== 'all') && (
                <div className="mb-6">
                    <p className="text-sm font-bold text-[#2C2416]">
                        Found <span className="text-[#2196F3]">{filteredItems.length}</span> result
                        {filteredItems.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>
                </div>
            )}

            {/* Content Grid */}
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {displayedItems.length > 0 ? (
                    displayedItems.map((item, index) => renderCard(item, index))
                ) : (
                    <div className="col-span-full">
                        <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416] shadow-[6px_6px_0_0_rgba(44,36,22,0.3)] p-16 text-center">
                            <p className="text-2xl font-black text-[#2C2416] mb-2">
                                No {contentType}s found
                            </p>
                            <p className="text-[#5A5247]">
                                {searchQuery || categoryValue !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Check back soon for new content!'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-12 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="
                            inline-flex items-center gap-3 px-8 py-4
                            bg-[#2196F3] text-white
                            border-[4px] border-[#2C2416]
                            shadow-[6px_6px_0_0_rgba(44,36,22,1)]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[4px_4px_0_0_rgba(44,36,22,1)]
                            active:translate-x-[4px] active:translate-y-[4px]
                            active:shadow-[2px_2px_0_0_rgba(44,36,22,1)]
                            font-black uppercase tracking-wider
                            transition-all duration-150
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Load More
                                <span className="text-sm opacity-75">
                                    ({displayedCount} of {filteredItems.length})
                                </span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
