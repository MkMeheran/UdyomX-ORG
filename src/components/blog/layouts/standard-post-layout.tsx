"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { normalizeGallery, normalizeFAQ } from "@/types/common";
import type { GalleryItem, FAQItem, DownloadItem, RecommendedItem } from "@/types";
import { TOC } from "../toc";
import { MediaGallery } from "../media-gallery";
import { FAQSection } from "../faq-section";
import { DownloadSection } from "../download-section";
import { RecommendedContent } from "../recommended-content";
import { useTOC } from "@/hooks/use-toc";
import { ContentRenderer } from "@/components/common/ContentRenderer";
import { MediaLightbox } from "@/components/common/MediaLightbox";
import { GallerySkeleton, DownloadSkeleton, RecommendedSidebarSkeleton } from "@/components/ui/skeleton";

interface StandardPostLayoutProps {
  post: BlogPost;
  userIsPremium?: boolean;
}

// Normalize blog data to universal format
function normalizeDownloads(downloads: any[] | undefined): DownloadItem[] {
  if (!downloads) return [];
  return downloads.map((item, index) => ({
    id: item.id || `download-${index}`,
    title: item.title || item.label || 'Download',
    url: item.url || item.fileUrl || '',
    fileSize: item.fileSize,
    fileType: item.fileType,
  }));
}

function normalizeRecommended(items: any[] | undefined): RecommendedItem[] {
  if (!items) return [];
  return items.map((item, index) => ({
    id: item.id || `rec-${index}`,
    type: item.type === 'project' ? 'project' : item.type === 'service' ? 'service' : 'blog',
    title: item.title || 'Recommended',
    slug: item.slug || item.url?.split('/').pop() || '',
    url: item.url,
    thumbnail: item.thumbnail || item.image,
    excerpt: item.excerpt,
  }));
}

export function StandardPostLayout({ post, userIsPremium = false }: StandardPostLayoutProps) {
  const tocItems = useTOC(post.content);
  
  // Normalize data to universal format
  const gallery: GalleryItem[] = normalizeGallery(post.gallery);
  const downloads: DownloadItem[] = normalizeDownloads(post.downloads);
  const faqs: FAQItem[] = (post.faqs || []).map((f, i) => normalizeFAQ(f, i));
  const recommended: RecommendedItem[] = normalizeRecommended(post.recommended || post.recommendedContent);

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - Contained Cover Image matching grid width
      ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 pt-6">
        <div className="relative w-full h-[320px] border-[4px] border-[#2C2416] shadow-[6px_6px_0_0_rgba(44,36,22,0.5)] overflow-hidden bg-gradient-to-br from-earth-teal/20 to-earth-orange/20">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#2C2416]/30 text-6xl font-black">{post.title?.charAt(0) || 'P'}</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/80 via-[#2C2416]/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* Category Badge Only */}
            <span
              className="
                inline-block px-3 py-1.5
                bg-[#F5C542] text-[#2C2416]
                border-[3px] border-[#2C2416]
                shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]
                text-[11px] font-black uppercase tracking-wider
              "
            >
              {post.category}
            </span>
          </div>
        </div>

        {/* Bottom Border with Gap */}
        <div className="mt-4 border-b-[4px] border-[#2C2416]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3-COLUMN LAYOUT
      ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[240px_1fr_260px] gap-8">
          
          {/* ═══════════════════════════════════════════════════════════
              LEFT SIDEBAR: TOC Only
          ═══════════════════════════════════════════════════════════ */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TOC items={tocItems} isSidebar />
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════════
              MIDDLE COLUMN: Title + Meta + Content
          ═══════════════════════════════════════════════════════════ */}
          <main className="min-w-0">
            {/* ─────────────────────────────────────────────────────────
                RED BOX: Title + Tags + Meta Section
            ───────────────────────────────────────────────────────── */}
            <div className="border-b-[4px] border-[#2C2416] pb-6 mb-8">
              {/* Mobile TOC */}
              <div className="lg:hidden mb-6">
                <TOC items={tocItems} />
              </div>

              {/* TITLE - Now in Middle Column */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#2C2416] leading-[1.2] mb-5">
                {post.title}
              </h1>

              {/* Hashtag Tags */}
              {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      text-[#2196F3] text-[14px] font-bold
                      hover:text-[#D35400]
                      transition-colors duration-150 cursor-pointer
                    "
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
              )}

              {/* Author, Date, Time - Inline */}
              <div className="flex flex-wrap items-center gap-4 text-[14px]">
                {/* Author Name Only */}
                <span className="font-bold text-[#2C2416]">
                  By <span className="text-[#D35400]">{post.author}</span>
                </span>
                
                <span className="text-[#7A7267]">•</span>
                
                {/* Date */}
                <span className="flex items-center gap-1.5 text-[#5A5247] font-semibold">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                
                <span className="text-[#7A7267]">•</span>
                
                {/* Read Time */}
                <span className="flex items-center gap-1.5 text-[#5A5247] font-semibold">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                ORANGE BOX: Main Content Area
            ───────────────────────────────────────────────────────── */}
            <article>
              {/* Post Content - Auto-detects Markdown or HTML */}
              <ContentRenderer 
                content={post.content} 
                format={(post as any).contentFormat || 'auto'}
              />

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <div className="mt-12">
                  <FAQSection faqs={faqs} userIsPremium={userIsPremium} />
                </div>
              )}
            </article>
          </main>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT SIDEBAR: Recommended, Gallery, Downloads
              (Loads progressively - sidebar content loads after main)
          ═══════════════════════════════════════════════════════════ */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Recommended Content - Load first (text-heavy) */}
              {recommended.length > 0 && (
                <RecommendedContent items={recommended} itemsPerPage={2} />
              )}

              {/* Gallery - Load with skeleton (image-heavy) */}
              {gallery.length > 0 && (
                <MediaGallery images={gallery} />
              )}

              {/* Downloads - Load last */}
              {downloads.length > 0 && (
                <DownloadSection downloads={downloads} userIsPremium={userIsPremium} />
              )}
            </div>
          </aside>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            MOBILE: Right Sidebar Content (Below Main Content)
            Progressive loading for mobile
        ═══════════════════════════════════════════════════════════ */}
        <div className="lg:hidden mt-8 space-y-6">
          {recommended.length > 0 && (
            <RecommendedContent items={recommended} itemsPerPage={3} />
          )}

          {gallery.length > 0 && (
            <MediaGallery images={gallery} />
          )}

          {downloads.length > 0 && (
            <DownloadSection downloads={downloads} userIsPremium={userIsPremium} />
          )}
        </div>
      </div>
      
      {/* Media Lightbox for images/videos with .lightbox-trigger class */}
      <MediaLightbox trigger=".lightbox-trigger" />
    </div>
  );
}
