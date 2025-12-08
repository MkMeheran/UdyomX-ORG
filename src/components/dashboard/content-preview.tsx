'use client';

import React from 'react';
import { Calendar, Clock, User, Tag, Folder, Eye, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostEditorData, ProjectEditorData, ServiceEditorData } from '@/types/editor';

// ============================================
// POST CARD PREVIEW
// ============================================

interface PostCardPreviewProps {
    data: Partial<PostEditorData>;
}

export function PostCardPreview({ data }: PostCardPreviewProps) {
    return (
        <div className="bg-white border-4 border-[#2C2416] shadow-[6px_6px_0_rgba(44,36,22,0.3)] overflow-hidden max-w-sm">
            {/* Cover Image */}
            <div className="aspect-video bg-[#F5F1E8] relative overflow-hidden">
                {data.coverImage ? (
                    <img 
                        src={data.coverImage} 
                        alt={data.title || 'Cover'}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#2C2416]/30">
                        <Eye className="w-12 h-12" />
                    </div>
                )}
                
                {/* Category Badge */}
                {data.category && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-[#F5C542] border-2 border-[#2C2416] text-xs font-bold">
                            {data.category}
                        </span>
                    </div>
                )}
                
                {/* Audience Badge */}
                {data.audienceType && data.audienceType !== 'public' && (
                    <div className="absolute top-3 right-3">
                        <span className={cn(
                            'px-2 py-1 border-2 border-[#2C2416] text-xs font-bold',
                            data.audienceType === 'premium' ? 'bg-purple-400' : 'bg-blue-400'
                        )}>
                            {data.audienceType.toUpperCase()}
                        </span>
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-black text-lg text-[#2C2416] line-clamp-2">
                    {data.title || 'Untitled Post'}
                </h3>
                
                {/* Excerpt */}
                <p className="text-sm text-[#2C2416]/70 line-clamp-2">
                    {data.excerpt || 'No excerpt provided...'}
                </p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[#2C2416]/60">
                    {data.author && (
                        <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {data.author}
                        </span>
                    )}
                    {data.publishDate && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(data.publishDate).toLocaleDateString()}
                        </span>
                    )}
                    {data.readTime && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {data.readTime}
                        </span>
                    )}
                </div>
                
                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.tags.slice(0, 3).map((tag) => (
                            <span 
                                key={tag}
                                className="px-2 py-0.5 bg-[#F5F1E8] border border-[#2C2416]/30 text-xs font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                        {data.tags.length > 3 && (
                            <span className="px-2 py-0.5 text-xs font-medium text-[#2C2416]/50">
                                +{data.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// PROJECT CARD PREVIEW
// ============================================

interface ProjectCardPreviewProps {
    data: Partial<ProjectEditorData>;
}

export function ProjectCardPreview({ data }: ProjectCardPreviewProps) {
    const thumbnail = data.thumbnail || data.images?.[0]?.url;
    
    return (
        <div className="bg-white border-4 border-[#2C2416] shadow-[6px_6px_0_rgba(44,36,22,0.3)] overflow-hidden max-w-sm">
            {/* Thumbnail */}
            <div className="aspect-video bg-[#F5F1E8] relative overflow-hidden">
                {thumbnail ? (
                    <img 
                        src={thumbnail} 
                        alt={data.name || 'Project'}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#2C2416]/30">
                        <Folder className="w-12 h-12" />
                    </div>
                )}
                
                {/* Status Badge */}
                {data.projectStatus && (
                    <div className="absolute top-3 left-3">
                        <span className={cn(
                            'px-2 py-1 border-2 border-[#2C2416] text-xs font-bold',
                            data.projectStatus === 'completed' ? 'bg-green-400' :
                            data.projectStatus === 'in-progress' ? 'bg-[#F5C542]' : 'bg-gray-300'
                        )}>
                            {data.projectStatus.replace('-', ' ').toUpperCase()}
                        </span>
                    </div>
                )}
                
                {/* Featured Badge */}
                {data.featured && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-purple-400 border-2 border-[#2C2416] text-xs font-bold">
                            FEATURED
                        </span>
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Name */}
                <h3 className="font-black text-lg text-[#2C2416] line-clamp-2">
                    {data.name || 'Untitled Project'}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-[#2C2416]/70 line-clamp-2">
                    {data.description || 'No description provided...'}
                </p>
                
                {/* Tech Stack */}
                {data.techStack && data.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.techStack.slice(0, 4).map((tech) => (
                            <span 
                                key={tech}
                                className="px-2 py-0.5 bg-blue-100 border border-blue-300 text-xs font-medium text-blue-700"
                            >
                                {tech}
                            </span>
                        ))}
                        {data.techStack.length > 4 && (
                            <span className="px-2 py-0.5 text-xs font-medium text-[#2C2416]/50">
                                +{data.techStack.length - 4}
                            </span>
                        )}
                    </div>
                )}
                
                {/* Progress Bar */}
                {data.projectStatus === 'in-progress' && data.progress !== undefined && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-[#2C2416]">
                            <span>Progress</span>
                            <span>{data.progress}%</span>
                        </div>
                        <div className="h-2 bg-[#F5F1E8] border-2 border-[#2C2416]">
                            <div 
                                className="h-full bg-[#F5C542]"
                                style={{ width: `${data.progress}%` }}
                            />
                        </div>
                    </div>
                )}
                
                {/* Links */}
                <div className="flex gap-2">
                    {data.liveLink && (
                        <span className="px-3 py-1 bg-[#F5C542] border-2 border-[#2C2416] text-xs font-bold">
                            Live Demo
                        </span>
                    )}
                    {data.repoLink && (
                        <span className="px-3 py-1 bg-[#F5F1E8] border-2 border-[#2C2416] text-xs font-bold">
                            GitHub
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================
// SERVICE CARD PREVIEW
// ============================================

interface ServiceCardPreviewProps {
    data: Partial<ServiceEditorData>;
}

export function ServiceCardPreview({ data }: ServiceCardPreviewProps) {
    const thumbnail = data.thumbnail || data.coverImage;
    
    // Determine category badge color based on category
    const getCategoryColor = (category?: string) => {
        switch (category?.toLowerCase()) {
            case 'development':
                return 'bg-[#2196F3] text-white';
            case 'design':
                return 'bg-[#9C27B0] text-white';
            case 'consulting':
                return 'bg-[#FF9800] text-white';
            case 'marketing':
                return 'bg-[#4CAF50] text-white';
            default:
                return 'bg-[#F5C542] text-[#2C2416]';
        }
    };
    
    return (
        <div className="
            bg-[#F5F1E8] border-[4px] border-[#2C2416]
            shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
            hover:-translate-x-1 hover:-translate-y-1
            hover:shadow-[10px_10px_0_0_rgba(44,36,22,0.5)]
            transition-all duration-150 ease-out
            overflow-hidden max-w-sm flex flex-col
        ">
            {/* Thumbnail - 1.91:1 ratio */}
            <div className="relative aspect-[1.91/1] overflow-hidden border-b-[4px] border-[#2C2416]">
                {thumbnail ? (
                    <img 
                        src={thumbnail} 
                        alt={data.title || 'Service'}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#E0E0E0] to-[#D1D1D1] flex items-center justify-center">
                        <span className="text-6xl">🔧</span>
                    </div>
                )}
                
                {/* Category Badge on Image */}
                {data.category && (
                    <div className="absolute top-3 left-3">
                        <span className={cn(
                            'inline-block px-3 py-1.5',
                            getCategoryColor(data.category),
                            'border-[3px] border-[#2C2416]',
                            'shadow-[3px_3px_0_0_#2C2416]',
                            'text-[11px] font-black uppercase tracking-wider'
                        )}>
                            {data.category}
                        </span>
                    </div>
                )}
            </div>
            
            {/* Content - Title & Description */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[18px] md:text-[20px] font-black text-[#2C2416] leading-[1.25] line-clamp-2 mb-3">
                    {data.title || 'Untitled Service'}
                </h3>
                <p className="text-[14px] text-[#5A5247] font-medium line-clamp-3 leading-[1.6] flex-1">
                    {data.hookLine || data.description || 'No description provided...'}
                </p>
            </div>
            
            {/* Footer - Delivery Time & Arrow Button */}
            <div className="px-5 pb-5 flex items-center justify-between gap-3">
                <span className="text-[12px] text-[#7A7568] font-semibold">
                    ⏱ {data.packages?.[0]?.deliveryTime || 'Contact us'}
                </span>
                
                {/* Chunky Arrow Button */}
                <div className="
                    w-11 h-11 flex items-center justify-center
                    bg-[#F5C542] border-[3px] border-[#2C2416]
                    shadow-[3px_3px_0_0_#2C2416]
                ">
                    <ArrowRight className="w-5 h-5 text-[#2C2416]" strokeWidth={3} />
                </div>
            </div>
        </div>
    );
}

// ============================================
// UNIVERSAL PREVIEW WRAPPER
// ============================================

interface ContentPreviewProps {
    type: 'post' | 'project' | 'service';
    data: Partial<PostEditorData> | Partial<ProjectEditorData> | Partial<ServiceEditorData>;
}

export function ContentPreview({ type, data }: ContentPreviewProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#2C2416]">Card Preview</h3>
                <span className="text-xs text-[#2C2416]/50">
                    How it appears in listing pages
                </span>
            </div>
            
            <div className="flex justify-center p-6 bg-[#F5F1E8] border-4 border-dashed border-[#2C2416]/30">
                {type === 'post' && <PostCardPreview data={data as Partial<PostEditorData>} />}
                {type === 'project' && <ProjectCardPreview data={data as Partial<ProjectEditorData>} />}
                {type === 'service' && <ServiceCardPreview data={data as Partial<ServiceEditorData>} />}
            </div>
        </div>
    );
}
