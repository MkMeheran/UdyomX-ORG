'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, ExternalLink, Github, Loader2 } from 'lucide-react';
import { projectAPI } from '@/lib/api';
import type { Project } from '@/types';

export default function DashboardProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    // Fetch projects on mount (all statuses for admin)
    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await projectAPI.getAllAdmin();
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);
    
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  project.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchQuery, statusFilter]);
    
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        
        try {
            await projectAPI.delete(id);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project');
        }
    };
    
    if (loading) {
        return (
            <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }
    
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#2C2416]">Projects</h1>
                    <p className="text-[#2C2416]/60">{projects.length} total projects</p>
                </div>
                <Link
                    href="/dashboard/admin/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.4)] hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Project
                </Link>
            </div>
            
            {/* Filters */}
            <div className="bg-white border-4 border-[#2C2416] p-4 shadow-[4px_4px_0_rgba(44,36,22,0.2)] mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2416]/40" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-3 border-[#2C2416] bg-[#F5F1E8] font-medium text-[#2C2416] focus:outline-none focus:ring-2 focus:ring-[#F5C542]"
                        />
                    </div>
                    
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border-3 border-[#2C2416] bg-[#F5F1E8] font-medium text-[#2C2416] focus:outline-none focus:ring-2 focus:ring-[#F5C542] appearance-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="planned">Planned</option>
                    </select>
                </div>
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full bg-white border-4 border-[#2C2416] p-8 shadow-[4px_4px_0_rgba(44,36,22,0.2)] text-center text-[#2C2416]/50">
                        <p className="text-lg font-medium">No projects found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredProjects.map(project => (
                        <div 
                            key={project.id} 
                            className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)] overflow-hidden group hover:shadow-[6px_6px_0_rgba(44,36,22,0.3)] transition-all"
                        >
                            {/* Image */}
                            <div className="h-40 bg-[#F5F1E8] border-b-4 border-[#2C2416] overflow-hidden">
                                {(project.thumbnail || project.images?.[0]) ? (
                                    <img 
                                        src={project.thumbnail || project.images?.[0]} 
                                        alt={project.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#2C2416]/30">
                                        No Image
                                    </div>
                                )}
                            </div>
                            
                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-black text-[#2C2416] truncate">{project.name}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-bold border-2 flex-shrink-0 ${
                                        project.status === 'completed' 
                                            ? 'bg-green-100 border-green-500 text-green-700' 
                                            : project.status === 'in-progress'
                                            ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                            : 'bg-gray-100 border-gray-400 text-gray-600'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-[#2C2416]/60 line-clamp-2 mb-3">{project.description}</p>
                                
                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {(project.techStack || []).slice(0, 3).map(tech => (
                                        <span 
                                            key={tech} 
                                            className="px-1.5 py-0.5 bg-[#F5F1E8] border border-[#2C2416] text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {(project.techStack || []).length > 3 && (
                                        <span className="px-1.5 py-0.5 bg-[#F5F1E8] border border-[#2C2416] text-xs font-medium">
                                            +{(project.techStack || []).length - 3}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t-2 border-[#2C2416]/10">
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-[#F5C542] transition-colors"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/admin/projects/${project.slug}/edit`}
                                        className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-purple-200 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-blue-200 transition-colors"
                                            title="Live Demo"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-gray-200 transition-colors"
                                            title="Repository"
                                        >
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-red-200 transition-colors ml-auto"
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
    );
}
