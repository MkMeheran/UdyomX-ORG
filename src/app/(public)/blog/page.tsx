import { blogAPI } from '@/lib/api';
import { ContentListClient } from '@/components/content-list-client';
import { Newspaper } from 'lucide-react';
import { Metadata } from 'next';

// ISR: Regenerate page every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Blog - Web Development Tips & Digital Solutions | UdyomX ORG',
    description: 'Read our latest articles on web development, digital solutions, UI/UX design, and technology tips for businesses in Bangladesh.',
};

// Fetch all blog posts (server-side)
async function getAllBlogPosts() {
    try {
        const posts = await blogAPI.getAllForCards();
        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export default async function BlogPage() {
    const allPosts = await getAllBlogPosts();
    
    // Extract unique categories from posts
    const categories = ['All Categories', ...Array.from(new Set(
        allPosts
            .map(post => post.category)
            .filter(Boolean)
    )).sort()];

    return (
        <div className="min-h-screen bg-[#F5F5F0] py-6 md:py-12 px-3 md:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-block">
                        <div className="flex items-center gap-3 px-5 py-3 bg-[#FFE5E5] border-[4px] border-[#FF6B6B] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Newspaper className="w-6 h-6 text-[#8B0000]" />
                            <span className="text-xs font-black text-[#8B0000] uppercase tracking-wider">Blog</span>
                        </div>
                    </div>
                </div>

                {/* Client-side content list with search, filter, and load-more */}
                <ContentListClient
                    contentType="post"
                    initialItems={allPosts}
                    categories={categories}
                />
            </div>
        </div>
    );
}
