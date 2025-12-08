'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Folder } from 'lucide-react';
import type { Project } from '@/types';

interface ServicePortfolioProps {
    projects: Project[];
}

export function ServicePortfolio({ projects }: ServicePortfolioProps) {
    if (!projects || projects.length === 0) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    // Determine grid columns based on project count
    const getGridClass = () => {
        if (projects.length === 1) return 'md:grid-cols-1 max-w-md mx-auto';
        if (projects.length === 2) return 'md:grid-cols-2';
        if (projects.length === 3) return 'md:grid-cols-3';
        return 'md:grid-cols-2 lg:grid-cols-4';
    };

    return (
        <section className="py-6 md:py-10 bg-[#F0F0F3]">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div
                        className="
                            w-12 h-12 flex items-center justify-center
                            bg-[#9C27B0] text-white
                            border-[3px] border-[#2C2416]
                            shadow-[3px_3px_0_0_#2C2416]
                        "
                    >
                        <Folder className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#2C2416]">
                        Related Projects
                    </h2>
                </div>

                {/* Projects Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className={`grid ${getGridClass()} gap-5`}
                >
                    {projects.slice(0, 4).map((project) => (
                        <motion.div
                            key={project.id}
                            variants={item}
                            className="group"
                        >
                            <Link href={`/projects/${project.slug}`} className="block h-full">
                                <div
                                    className="
                                        h-full bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                        shadow-[4px_4px_0_0_rgba(44,36,22,0.3)]
                                        hover:-translate-x-1 hover:-translate-y-1
                                        hover:shadow-[6px_6px_0_0_rgba(44,36,22,0.3)]
                                        transition-all duration-150
                                        overflow-hidden flex flex-col
                                    "
                                >
                                    {/* Project Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-[#2C2416]">
                                        {project.images && project.images[0] ? (
                                            <Image
                                                src={project.images[0]}
                                                alt={project.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#E0E0E0] to-[#D1D1D1] flex items-center justify-center">
                                                <Folder className="w-12 h-12 text-[#7A7568]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Info */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-[15px] font-black text-[#2C2416] mb-2 line-clamp-2 leading-tight group-hover:text-[#9C27B0] transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-[13px] text-[#5A5247] font-medium line-clamp-2 leading-relaxed flex-1">
                                            {project.description}
                                        </p>

                                        {/* Tech Stack */}
                                        {project.techStack && project.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {project.techStack.slice(0, 3).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="
                                                            px-2 py-0.5 text-[10px] font-bold
                                                            bg-[#E8E4DC] text-[#5A5247]
                                                            border-[2px] border-[#2C2416]
                                                        "
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.techStack.length > 3 && (
                                                    <span className="text-[10px] font-bold text-[#7A7568]">
                                                        +{project.techStack.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-4 pb-4 flex items-center justify-between">
                                        <span className="text-[11px] text-[#7A7568] font-semibold">
                                            View Project
                                        </span>
                                        <div
                                            className="
                                                w-8 h-8 flex items-center justify-center
                                                bg-[#F5C542] border-[2px] border-[#2C2416]
                                                shadow-[2px_2px_0_0_#2C2416]
                                                group-hover:bg-[#9C27B0] group-hover:text-white
                                                transition-all duration-150
                                            "
                                        >
                                            <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Link */}
                {projects.length > 4 && (
                    <div className="mt-8 text-center">
                        <Link
                            href="/projects"
                            className="
                                inline-flex items-center gap-2 px-6 py-3
                                bg-[#F5F1E8] text-[#2C2416]
                                border-[4px] border-[#2C2416]
                                shadow-[4px_4px_0_0_#2C2416]
                                font-black text-[14px] uppercase tracking-wider
                                hover:shadow-[2px_2px_0_0_#2C2416]
                                hover:translate-x-[2px] hover:translate-y-[2px]
                                transition-all duration-150
                            "
                        >
                            <span>View All Projects</span>
                            <ExternalLink className="w-4 h-4" strokeWidth={3} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
