"use client";

import Link from "next/link";
import { Calendar, ExternalLink, Github, CheckCircle, Clock, Users } from "lucide-react";
import type { Project } from "@/types";
import { MediaGallery } from "@/components/blog/media-gallery";
import { RecommendedContent } from "@/components/blog/recommended-content";
import { DownloadSection } from "@/components/blog/download-section";
import { FAQSection } from "@/components/blog/faq-section";
import { ContentRenderer } from "@/components/common/ContentRenderer";
import { MediaLightbox } from "@/components/common/MediaLightbox";

interface ProjectDetailLayoutProps {
  project: Project;
}

export function ProjectDetailLayout({ project }: ProjectDetailLayoutProps) {
  // Status badge colors with fallback
  const statusColors: Record<string, { bg: string; text: string }> = {
    completed: { bg: "bg-[#5CB85C]", text: "text-white" },
    "in-progress": { bg: "bg-[#F5C542]", text: "text-[#2C2416]" },
    paused: { bg: "bg-[#7A7267]", text: "text-white" },
    published: { bg: "bg-[#2196F3]", text: "text-white" },
    draft: { bg: "bg-[#E8E4DC]", text: "text-[#2C2416]" },
  };

  // Get status with fallback
  const status = project.projectStatus || project.status || "completed";
  const statusStyle = statusColors[status] || statusColors.completed;

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* ═══════════════════════════════════════════════════════════
          2-COLUMN LAYOUT (No TOC for projects)
      ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          
          {/* ═══════════════════════════════════════════════════════════
              MAIN COLUMN: Title + Meta + Content
          ═══════════════════════════════════════════════════════════ */}
          <main className="min-w-0">
            {/* Title + Meta Section */}
            <div className="border-b-[4px] border-[#2C2416] pb-6 mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#2C2416] leading-[1.2] mb-5">
                {project.name}
              </h1>

              {/* Simple Blue Tags from SEO Keywords */}
              {(project as any).seo?.secondaryKeywords && (project as any).seo.secondaryKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {(project as any).seo.secondaryKeywords.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Info - Inline */}
              <div className="flex flex-wrap items-center gap-4 text-[14px]">
                {/* Date */}
                <span className="flex items-center gap-1.5 text-[#5A5247] font-semibold">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.publishDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {project.clientInfo && (
                  <>
                    <span className="text-[#7A7267]">•</span>
                    <span className="flex items-center gap-1.5 text-[#5A5247] font-semibold">
                      <Users className="w-4 h-4" />
                      {project.clientInfo}
                    </span>
                  </>
                )}

                {project.progress !== undefined && status === "in-progress" && (
                  <>
                    <span className="text-[#7A7267]">•</span>
                    <span className="flex items-center gap-1.5 text-[#5A5247] font-semibold">
                      <Clock className="w-4 h-4" />
                      {project.progress}% Complete
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description Content */}
            <article>
              {/* Use ContentRenderer for proper markdown/html support */}
              {project.content ? (
                <ContentRenderer 
                  content={project.content} 
                  format={(project as any).contentFormat || 'auto'}
                />
              ) : (
                <div
                  className="
                    prose prose-lg max-w-none
                    prose-headings:font-black prose-headings:text-[#2C2416]
                    prose-h2:text-[26px] prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b-[3px] prose-h2:border-[#2C2416]
                    prose-h3:text-[20px] prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-[#5A5247] prose-p:leading-[1.8] prose-p:font-medium
                    prose-a:text-[#2196F3] prose-a:font-bold prose-a:no-underline hover:prose-a:text-[#D35400]
                    prose-strong:text-[#2C2416] prose-strong:font-black
                    prose-ul:marker:text-[#2C2416]
                    prose-li:text-[#5A5247] prose-li:font-medium
                  "
                >
                  <p>{project.description}</p>
                </div>
              )}

              {/* Project Links */}
              {(project.liveLink || project.repoLink) && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center gap-2 px-5 py-3
                        bg-[#5CB85C] text-white
                        border-[4px] border-[#2C2416]
                        shadow-[4px_4px_0_0_#2C2416]
                        hover:shadow-[2px_2px_0_0_#2C2416]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        transition-all duration-150
                        font-black text-[14px] uppercase tracking-wide
                      "
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                  {project.repoLink && (
                    <a
                      href={project.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center gap-2 px-5 py-3
                        bg-[#2C2416] text-[#F5F1E8]
                        border-[4px] border-[#2C2416]
                        shadow-[4px_4px_0_0_rgba(44,36,22,0.3)]
                        hover:shadow-[2px_2px_0_0_rgba(44,36,22,0.3)]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        transition-all duration-150
                        font-black text-[14px] uppercase tracking-wide
                      "
                    >
                      <Github className="w-5 h-5" />
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </article>

            {/* FAQ Section - Full Width in Main Content */}
            {project.faqs && project.faqs.length > 0 && (
              <div className="mt-12">
                <FAQSection faqs={project.faqs} />
              </div>
            )}

            {/* Gallery Section - Full Width in Main Content */}
            {project.images && project.images.length > 1 && (
              <div className="mt-12">
                <h2 className="text-[22px] font-black text-[#2C2416] mb-5 pb-3 border-b-[3px] border-[#2C2416]">
                  Project Gallery
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.images.slice(1).map((image, idx) => (
                    <div
                      key={idx}
                      className="
                        relative aspect-video
                        border-[4px] border-[#2C2416]
                        shadow-[4px_4px_0_0_rgba(44,36,22,0.5)]
                        overflow-hidden
                      "
                    >
                      <Image
                        src={image}
                        alt={`${project.name} screenshot ${idx + 2}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT SIDEBAR: Tech Stack, Links, Recommended
          ═══════════════════════════════════════════════════════════ */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Tech Stack Box */}
              <div
                className="
                  bg-[#F5F1E8] border-[4px] border-[#2C2416]
                  shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
                  p-4
                "
              >
                <h3 className="text-[14px] font-black text-[#2C2416] mb-3 pb-2 border-b-[2px] border-[#2C2416]">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="
                        px-2 py-1 text-[11px] font-bold
                        bg-[#E8E4DC] text-[#2C2416]
                        border-[2px] border-[#2C2416]
                        shadow-[2px_2px_0_0_#2C2416]
                      "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              {(project.liveLink || project.repoLink) && (
                <div
                  className="
                    bg-[#F5F1E8] border-[4px] border-[#2C2416]
                    shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
                    p-4
                  "
                >
                  <h3 className="text-[14px] font-black text-[#2C2416] mb-3 pb-2 border-b-[2px] border-[#2C2416]">
                    Links
                  </h3>
                  <div className="space-y-2">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex items-center gap-2 p-2
                          bg-[#E8E4DC] border-[2px] border-[#2C2416]
                          shadow-[2px_2px_0_0_#2C2416]
                          hover:shadow-[1px_1px_0_0_#2C2416]
                          hover:translate-x-[1px] hover:translate-y-[1px]
                          transition-all duration-150
                          text-[12px] font-bold text-[#2C2416]
                        "
                      >
                        <div className="w-6 h-6 bg-[#5CB85C] border-[2px] border-[#2C2416] flex items-center justify-center">
                          <ExternalLink className="w-3 h-3 text-white" />
                        </div>
                        Live Demo
                      </a>
                    )}
                    {project.repoLink && (
                      <a
                        href={project.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex items-center gap-2 p-2
                          bg-[#E8E4DC] border-[2px] border-[#2C2416]
                          shadow-[2px_2px_0_0_#2C2416]
                          hover:shadow-[1px_1px_0_0_#2C2416]
                          hover:translate-x-[1px] hover:translate-y-[1px]
                          transition-all duration-150
                          text-[12px] font-bold text-[#2C2416]
                        "
                      >
                        <div className="w-6 h-6 bg-[#2C2416] border-[2px] border-[#2C2416] flex items-center justify-center">
                          <Github className="w-3 h-3 text-[#F5F1E8]" />
                        </div>
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <MediaGallery images={project.gallery} />
              )}

              {/* Downloads */}
              {project.downloads && project.downloads.length > 0 && (
                <DownloadSection downloads={project.downloads} />
              )}

              {/* Recommended Content */}
              {project.recommended && project.recommended.length > 0 && (
                <RecommendedContent items={project.recommended} itemsPerPage={2} />
              )}

              {/* Project Status - Bottom of Sidebar */}
              <div
                className="
                  bg-[#F5F1E8] border-[4px] border-[#2C2416]
                  shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
                  p-4
                "
              >
                <h3 className="text-[14px] font-black text-[#2C2416] mb-3 pb-2 border-b-[2px] border-[#2C2416]">
                  Status
                </h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-5 h-5 ${status === "completed" ? "text-[#5CB85C]" : "text-[#F5C542]"}`} />
                  <span className="font-bold text-[#2C2416] text-[13px] capitalize">
                    {status.replace("-", " ")}
                  </span>
                </div>
                {project.progress !== undefined && status === "in-progress" && (
                  <div className="mt-3">
                    <div className="h-3 bg-[#E8E4DC] border-[2px] border-[#2C2416]">
                      <div
                        className="h-full bg-[#F5C542]"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#7A7267] mt-1 block">
                      {project.progress}% Complete
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            MOBILE: Right Sidebar Content
        ═══════════════════════════════════════════════════════════ */}
        <div className="lg:hidden mt-8 space-y-6">
          {/* Tech Stack */}
          <div
            className="
              bg-[#F5F1E8] border-[4px] border-[#2C2416]
              shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
              p-4
            "
          >
            <h3 className="text-[14px] font-black text-[#2C2416] mb-3 pb-2 border-b-[2px] border-[#2C2416]">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="
                    px-2 py-1 text-[11px] font-bold
                    bg-[#E8E4DC] text-[#2C2416]
                    border-[2px] border-[#2C2416]
                    shadow-[2px_2px_0_0_#2C2416]
                  "
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Gallery - Mobile */}
          {project.gallery && project.gallery.length > 0 && (
            <MediaGallery images={project.gallery} />
          )}

          {/* Downloads - Mobile */}
          {project.downloads && project.downloads.length > 0 && (
            <DownloadSection downloads={project.downloads} />
          )}

          {/* Recommended - Mobile */}
          {project.recommended && project.recommended.length > 0 && (
            <RecommendedContent items={project.recommended} itemsPerPage={3} />
          )}
        </div>
      </div>

      {/* Media Lightbox */}
      <MediaLightbox trigger=".lightbox-trigger" />
    </div>
  );
}
