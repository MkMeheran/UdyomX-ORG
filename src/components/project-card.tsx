"use client";

import Link from "next/link";
import { Calendar, ExternalLink, Github, ArrowRight } from "lucide-react";
import { LazyImage } from "@/components/common/LazyImage";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  // Get status display
  const getStatusLabel = () => {
    if (project.status === "in-progress") return "In Progress";
    if (project.status === "paused") return "Paused";
    return "Completed";
  };
  
  // Get thumbnail - prefer thumbnail, then first image
  const thumbnail = project.thumbnail || project.images?.[0];

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full group">
      <article
        className="
          bg-[#F5F1E8] border-[4px] border-[#2C2416]
          shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
          hover:-translate-x-1 hover:-translate-y-1
          hover:shadow-[10px_10px_0_0_rgba(44,36,22,0.5)]
          active:translate-x-0 active:translate-y-0
          active:shadow-[4px_4px_0_0_rgba(44,36,22,0.5)]
          transition-all duration-150 ease-out
          overflow-hidden h-full flex flex-col
        "
      >
        {/* ═══════════════════════════════════════════════════════════
            THUMBNAIL - Lazy loaded with skeleton
        ═══════════════════════════════════════════════════════════ */}
        <div className="border-b-[4px] border-[#2C2416]">
          {thumbnail ? (
            <div className="aspect-[16/9] overflow-hidden">
              <LazyImage
                src={thumbnail}
                alt={project.name}
                aspectRatio="video"
                brutal={false}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] bg-[#2C2416] flex items-center justify-center">
              <span className="text-5xl font-black text-[#F5F1E8] opacity-30">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            CONTENT - Chunky padding
        ═══════════════════════════════════════════════════════════ */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3
            className="
              text-[20px] md:text-[22px] font-black text-[#2C2416]
              leading-[1.2] mb-3 line-clamp-2
              group-hover:text-[#D35400] transition-colors duration-150
            "
          >
            {project.name}
          </h3>

          {/* Description */}
          <p className="text-[14px] text-[#5A5247] font-medium line-clamp-2 mb-5 leading-[1.6] flex-1">
            {project.description}
          </p>

          {/* Tech Stack - Chunky Tags */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {project.techStack.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="
                    px-3 py-1 text-[11px] font-black uppercase tracking-wide
                    bg-[#E8E4DC] text-[#2C2416]
                    border-[2px] border-[#2C2416]
                    shadow-[2px_2px_0_0_#2C2416]
                  "
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span
                  className="
                    px-3 py-1 text-[11px] font-black
                    bg-[#2C2416] text-[#F5F1E8]
                    border-[2px] border-[#2C2416]
                  "
                >
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              META SECTION - Chunky separator
          ═══════════════════════════════════════════════════════════ */}
          <div className="pt-5 border-t-[4px] border-[#2C2416]">
            {/* Date */}
            {project.publishDate && (() => {
              const date = new Date(project.publishDate);
              const isValidDate = !isNaN(date.getTime());
              return isValidDate ? (
                <div className="flex items-center gap-2 text-[13px] text-[#7A7267] font-bold mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ) : null;
            })()}

            <div className="flex items-center justify-between">
              {/* Status Badge */}
              <span
                className="
                  px-3 py-1 text-[11px] font-black uppercase tracking-wide
                  border-[3px] border-[#2C2416]
                  bg-[#F5C542] text-[#2C2416]
                  shadow-[2px_2px_0_0_#2C2416]
                "
              >
                {getStatusLabel()}
              </span>

              {/* Arrow Button */}
              <div className="flex items-center gap-2">
                {project.liveLink && (
                  <div
                    className="
                      w-9 h-9 bg-[#5CB85C] border-[2px] border-[#2C2416]
                      flex items-center justify-center
                      shadow-[2px_2px_0_0_#2C2416]
                    "
                  >
                    <ExternalLink className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                )}
                {project.repoLink && (
                  <div
                    className="
                      w-9 h-9 bg-[#2C2416] border-[2px] border-[#2C2416]
                      flex items-center justify-center
                      shadow-[2px_2px_0_0_rgba(44,36,22,0.3)]
                    "
                  >
                    <Github className="w-4 h-4 text-[#F5F1E8]" strokeWidth={2.5} />
                  </div>
                )}
                {/* Arrow Button */}
                <div
                  className="
                    w-10 h-10 bg-[#2196F3] border-[3px] border-[#2C2416]
                    flex items-center justify-center
                    shadow-[4px_4px_0_0_#2C2416]
                    group-hover:shadow-[2px_2px_0_0_#2C2416]
                    group-hover:translate-x-[2px] group-hover:translate-y-[2px]
                    transition-all duration-150
                  "
                >
                  <ArrowRight className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
