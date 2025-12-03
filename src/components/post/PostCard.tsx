"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LazyImage } from "@/components/common/LazyImage";
import type { PostCardData } from "@/types/post";

interface PostCardProps {
  post: PostCardData;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full group">
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
            THUMBNAIL SECTION - 3px border, chunky brutal style
        ═══════════════════════════════════════════════════════════ */}
        <div className="border-b-[4px] border-[#2C2416]">
          {post.coverPhoto ? (
            <div className="aspect-[16/9] overflow-hidden">
              <LazyImage
                src={post.coverPhoto}
                alt={post.title}
                aspectRatio="video"
                brutal={false}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] bg-[#2C2416] flex items-center justify-center">
              <span className="text-6xl font-black text-[#F5F1E8] opacity-30">
                {post.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            CONTENT SECTION - Chunky padding (24px)
        ═══════════════════════════════════════════════════════════ */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title - Big chunky 20-22px bold */}
          <h3 
            className="
              text-[20px] md:text-[22px] font-black text-[#2C2416] 
              leading-[1.2] mb-3 line-clamp-2
              group-hover:text-[#D35400] transition-colors duration-150
            "
          >
            {post.title}
          </h3>

          {/* Excerpt - Clear readable text */}
          <p className="text-[14px] text-[#5A5247] font-medium line-clamp-2 mb-5 leading-[1.6] flex-1">
            {post.excerpt}
          </p>

          {/* ═══════════════════════════════════════════════════════════
              META SECTION - border-b-4 separator, chunky badges
          ═══════════════════════════════════════════════════════════ */}
          <div className="pt-5 border-t-[4px] border-[#2C2416]">
            {/* Date & Read Time */}
            <div className="flex items-center gap-2 text-[13px] text-[#7A7267] font-bold mb-4">
              <span>{formatDate(post.publishedDate)}</span>
              {post.readTime && (
                <>
                  <span className="text-[#2C2416]">•</span>
                  <span>{post.readTime}</span>
                </>
              )}
            </div>

            {/* Badges & Arrow Row */}
            <div className="flex items-center justify-between">
              {/* Category Badge */}
              <span
                className="
                  px-3 py-1 text-[11px] font-black uppercase tracking-wide
                  border-[3px] border-[#2C2416]
                  bg-[#F5C542] text-[#2C2416]
                  shadow-[2px_2px_0_0_#2C2416]
                "
              >
                {post.category || "Blog"}
              </span>

              {/* Chunky Arrow Button */}
              <div
                className="
                  w-11 h-11 bg-[#F5C542] border-[3px] border-[#2C2416]
                  flex items-center justify-center
                  shadow-[4px_4px_0_0_#2C2416]
                  group-hover:shadow-[2px_2px_0_0_#2C2416]
                  group-hover:translate-x-[2px] group-hover:translate-y-[2px]
                  transition-all duration-150
                "
              >
                <ArrowRight className="w-5 h-5 text-[#2C2416]" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
