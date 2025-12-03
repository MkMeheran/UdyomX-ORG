import { Suspense } from 'react';
import { blogAPI } from '@/lib/api';
import { PostCard } from '@/components/post/PostCard';
import { FilterBar } from '@/components/filter-bar';
import { GridSkeleton } from '@/components/ui/skeleton';
import { Newspaper, TrendingUp } from 'lucide-react';
import type { PostCardData } from '@/types/post';

// Adapter function to convert BlogPost to PostCardData
function adaptBlogToPostCard(blog: any): PostCardData {
    return {
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
    };
}

// Fetch light data for cards (faster)
async function getBlogPostsForCards() {
    try {
        const posts = await blogAPI.getAllForCards();
        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

// Blog Grid Component (can be streamed)
async function BlogGrid() {
    const posts = await getBlogPostsForCards();
    const adaptedPosts = posts.map(adaptBlogToPostCard);
    
    if (adaptedPosts.length === 0) {
        return (
            <div className="col-span-full">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-teal rounded-2xl blur opacity-20" />
                    <div className="relative bg-white/80 backdrop-blur-sm border-2 border-[#E8E4DC] rounded-2xl p-20 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-earth-teal/20 to-earth-orange/20 flex items-center justify-center">
                            <Newspaper className="w-10 h-10 text-earth-teal" />
                        </div>
                        <p className="text-gray-700 text-xl font-bold mb-2">No blog posts yet</p>
                        <p className="text-gray-500">Check back soon for new content!</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            {adaptedPosts.map((post, index) => (
                <div 
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <PostCard post={post} index={index} />
                </div>
            ))}
        </>
    );
}

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F0] py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - Renders immediately */}
                <div className="mb-12">
                    <div className="inline-block mb-4">
                        <div className="flex items-center gap-3 px-5 py-3 bg-[#FFE5E5] border-4 border-[#FF6B6B] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Newspaper className="w-6 h-6 text-[#8B0000]" />
                            <span className="text-xs font-black text-[#8B0000] uppercase tracking-wider">Blog</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-[#1A1A1A] mb-3">All Posts</h1>
                    <p className="text-lg text-[#5A5A5A] font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Insights, tutorials, and updates from our team
                    </p>
                </div>

                {/* Filter Bar - Renders immediately */}
                <div className="mb-8">
                    <FilterBar
                        categories={[
                            'All Categories',
                            'Tutorial',
                            'Best Practices',
                            'Design',
                            'Development',
                        ]}
                    />
                </div>

                {/* Blog Grid - Streams with skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Suspense fallback={<GridSkeleton count={6} type="blog" columns={3} />}>
                        <BlogGrid />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
