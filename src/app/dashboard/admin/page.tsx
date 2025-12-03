'use client';

import Link from 'next/link';
import { FileText, Briefcase, Wrench, Plus, TrendingUp, Clock, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { blogAPI, projectAPI, serviceAPI } from '@/lib/api';

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState({ posts: 0, projects: 0, services: 0 });
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    
    useEffect(() => {
        // Fetch counts
        Promise.all([
            blogAPI.getAllAdmin(),
            projectAPI.getAllAdmin(),
            serviceAPI.getAll()
        ]).then(([posts, projects, services]) => {
            setCounts({
                posts: posts.length,
                projects: projects.length,
                services: services.length
            });
            setRecentPosts(posts.slice(0, 3));
            setRecentProjects(projects.slice(0, 3));
        });
    }, []);
    
    const stats = [
        { 
            label: 'Total Posts', 
            value: counts.posts, 
            icon: FileText, 
            color: 'bg-blue-100 text-blue-700 border-blue-300',
            href: '/dashboard/admin/blogs'
        },
        { 
            label: 'Total Projects', 
            value: counts.projects, 
            icon: Briefcase, 
            color: 'bg-purple-100 text-purple-700 border-purple-300',
            href: '/dashboard/admin/projects'
        },
        { 
            label: 'Total Services', 
            value: counts.services, 
            icon: Wrench, 
            color: 'bg-green-100 text-green-700 border-green-300',
            href: '/dashboard/admin/services'
        },
    ];
    
    const quickActions = [
        { label: 'New Post', href: '/dashboard/admin/blogs/new', icon: FileText, color: 'bg-blue-500' },
        { label: 'New Project', href: '/dashboard/admin/projects/new', icon: Briefcase, color: 'bg-purple-500' },
        { label: 'New Service', href: '/dashboard/admin/services/new', icon: Wrench, color: 'bg-green-500' },
    ];
    
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-[#2C2416] mb-2">Admin Panel</h1>
                <p className="text-[#2C2416]/60">Manage your content, services, and orders.</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color, href }) => (
                    <Link 
                        key={label}
                        href={href}
                        className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.3)] transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 border-2 ${color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-[#2C2416]/30 group-hover:text-green-500 transition-colors" />
                        </div>
                        <p className="text-4xl font-black text-[#2C2416]">{value}</p>
                        <p className="text-sm font-medium text-[#2C2416]/60">{label}</p>
                    </Link>
                ))}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white border-4 border-[#2C2416] p-6 shadow-[4px_4px_0_rgba(44,36,22,0.2)] mb-8">
                <h2 className="text-2xl font-black text-[#2C2416] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickActions.map(({ label, href, icon: Icon, color }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center justify-center gap-3 px-6 py-4 ${color} text-white font-bold border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.4)] hover:-translate-y-0.5 transition-all`}
                        >
                            <Plus className="w-5 h-5" />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
            
            {/* Recent Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Posts */}
                <div className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                    <div className="p-4 border-b-4 border-[#2C2416] flex items-center justify-between">
                        <h3 className="font-black text-[#2C2416]">Recent Posts</h3>
                        <Link href="/dashboard/admin/blogs" className="text-sm font-bold text-blue-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y-2 divide-[#2C2416]/10">
                        {recentPosts.map((post) => (
                            <Link 
                                key={post.id}
                                href={`/dashboard/admin/blogs/${post.slug}/edit`}
                                className="flex items-center justify-between p-4 hover:bg-[#F5F1E8] transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#2C2416] truncate">{post.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-[#2C2416]/60 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {post.publishDate || post.publishedAt}
                                        </span>
                                    </div>
                                </div>
                                <span className={`ml-4 px-2 py-1 text-xs font-bold border-2 ${
                                    post.status === 'published' 
                                        ? 'bg-green-100 text-green-700 border-green-300'
                                        : 'bg-orange-100 text-orange-700 border-orange-300'
                                }`}>
                                    {post.status || 'draft'}
                                </span>
                            </Link>
                        ))}
                        {recentPosts.length === 0 && (
                            <div className="p-4 text-center text-[#2C2416]/60">No posts yet</div>
                        )}
                    </div>
                </div>
                
                {/* Recent Projects */}
                <div className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                    <div className="p-4 border-b-4 border-[#2C2416] flex items-center justify-between">
                        <h3 className="font-black text-[#2C2416]">Recent Projects</h3>
                        <Link href="/dashboard/admin/projects" className="text-sm font-bold text-purple-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y-2 divide-[#2C2416]/10">
                        {recentProjects.map((project) => (
                            <Link 
                                key={project.id}
                                href={`/dashboard/admin/projects/${project.slug}/edit`}
                                className="flex items-center justify-between p-4 hover:bg-[#F5F1E8] transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#2C2416] truncate">{project.name || project.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-[#2C2416]/60 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {project.publishDate}
                                        </span>
                                    </div>
                                </div>
                                <span className={`ml-4 px-2 py-1 text-xs font-bold border-2 ${
                                    project.status === 'published' 
                                        ? 'bg-green-100 text-green-700 border-green-300'
                                        : 'bg-orange-100 text-orange-700 border-orange-300'
                                }`}>
                                    {project.status || 'draft'}
                                </span>
                            </Link>
                        ))}
                        {recentProjects.length === 0 && (
                            <div className="p-4 text-center text-[#2C2416]/60">No projects yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
