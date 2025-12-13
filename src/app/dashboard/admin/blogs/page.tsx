'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, Filter, Clock, Tag, Loader2 } from 'lucide-react';
import { blogAPI } from '@/lib/api';
import type { BlogPost } from '@/types';

export default function DashboardBlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    // Fetch blogs on mount (all statuses for admin)
    useEffect(() => {
        async function fetchBlogs() {
            try {
                const data = await blogAPI.getAllAdmin();
                setBlogs(data);
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);
    
    const categories = useMemo(() => {
        const cats = new Set(blogs.map(b => b.category).filter(Boolean));
        return ['all', ...Array.from(cats).sort()];
    }, [blogs]);
    
    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [blogs, searchQuery, categoryFilter, statusFilter]);
    
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        try {
            await blogAPI.delete(id);
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete blog:', error);
            alert('Failed to delete post');
        }
    };
    
    if (loading) {
        return (
            <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }
    
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#2C2416]">Blog Posts</h1>
                    <p className="text-[#2C2416]/60">{blogs.length} total posts</p>
                </div>
                <Link
                    href="/dashboard/admin/blogs/new"
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-500 text-white font-bold border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.4)] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    New Post
                </Link>
            </div>
            
            {/* Filters */}
            <div className="bg-white border-4 border-[#2C2416] p-4 shadow-[4px_4px_0_rgba(44,36,22,0.2)] mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2416]/40" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-3 border-[#2C2416] bg-[#F5F1E8] font-medium text-[#2C2416] focus:outline-none focus:ring-2 focus:ring-[#F5C542]"
                        />
                    </div>
                    
                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2416]/40" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 border-3 border-[#2C2416] bg-[#F5F1E8] font-medium text-[#2C2416] focus:outline-none focus:ring-2 focus:ring-[#F5C542] appearance-none cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border-3 border-[#2C2416] bg-[#F5F1E8] font-medium text-[#2C2416] focus:outline-none focus:ring-2 focus:ring-[#F5C542] appearance-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>
            
            {/* Blog List */}
            <div className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                {/* Table Header */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 bg-[#F5F1E8] border-b-4 border-[#2C2416] font-bold text-[#2C2416]">
                    <div className="col-span-5">Title</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Actions</div>
                </div>
                
                {/* Blog Items */}
                <div className="divide-y-2 divide-[#2C2416]/10">
                    {filteredBlogs.length === 0 ? (
                        <div className="p-8 text-center text-[#2C2416]/50">
                            <p className="text-lg font-medium">No posts found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredBlogs.map(blog => (
                            <div key={blog.id} className="p-4 hover:bg-[#F5F1E8]/50 transition-colors">
                                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                                    {/* Title & Thumbnail */}
                                    <div className="lg:col-span-5 flex items-center gap-3 mb-3 lg:mb-0">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-[#F5F1E8] border-2 border-[#2C2416] flex-shrink-0 overflow-hidden">
                                            {blog.thumbnail && (
                                                <img src={blog.thumbnail} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#2C2416] truncate">{blog.title}</p>
                                            <p className="text-sm text-[#2C2416]/50 truncate">{blog.excerpt}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Category */}
                                    <div className="lg:col-span-2 mb-2 lg:mb-0">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F5C542] border-2 border-[#2C2416] text-xs font-bold">
                                            <Tag className="w-3 h-3" />
                                            {blog.category}
                                        </span>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="lg:col-span-2 mb-2 lg:mb-0">
                                        <span className={`inline-block px-2 py-1 text-xs font-bold border-2 ${
                                            blog.status === 'published' 
                                                ? 'bg-green-100 border-green-500 text-green-700' 
                                                : 'bg-gray-100 border-gray-400 text-gray-600'
                                        }`}>
                                            {blog.status}
                                        </span>
                                    </div>
                                    
                                    {/* Date */}
                                    <div className="lg:col-span-2 mb-3 lg:mb-0">
                                        <span className="flex items-center gap-1 text-sm text-[#2C2416]/60">
                                            <Clock className="w-4 h-4" />
                                            {blog.publishDate}
                                        </span>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="lg:col-span-1 flex items-center gap-2 flex-wrap">
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-[#F5C542] transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/dashboard/admin/blogs/${blog.slug}/edit`}
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-blue-200 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-red-200 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
