"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, FileText, Briefcase, Wrench } from "lucide-react";
import type { RecommendedItem } from "@/types";
import { getRecommendedUrl } from "@/types/common";

// Normalize helper - converts any recommendation format to standard RecommendedItem
function normalizeRecommendedItems(items: any[]): RecommendedItem[] {
  if (!items || items.length === 0) return [];
  
  return items.map((item, index) => {
    // Handle string (just slug)
    if (typeof item === 'string') {
      return {
        id: `rec-${index}`,
        type: 'blog' as const,
        title: item,
        slug: item,
        orderIndex: index,
      };
    }
    
    // Determine type
    let type: 'blog' | 'project' | 'service' = 'blog';
    if (item.type === 'project') type = 'project';
    else if (item.type === 'service') type = 'service';
    else if (item.type === 'post' || item.type === 'blog') type = 'blog';
    
    // Extract slug from url if not provided
    let slug = item.slug || '';
    if (!slug && item.url) {
      slug = item.url.split('/').filter(Boolean).pop() || '';
    }
    
    return {
      id: item.id || `rec-${index}`,
      type,
      title: item.title || item.name || 'Untitled',
      slug,
      url: item.url,
      thumbnail: item.thumbnail || item.image || item.coverImage,
      excerpt: item.excerpt || item.description,
      orderIndex: item.orderIndex ?? item.order ?? index,
    };
  });
}

interface RecommendedContentProps {
  items: any[];  // Accept any format for flexibility
  itemsPerPage?: number;
  title?: string;
}

// Get icon based on type
function getTypeIcon(type: string) {
  const t = type.toLowerCase();
  if (t === "project") return Briefcase;
  if (t === "service") return Wrench;
  return FileText; // Default for blog
}

// Get icon background color
function getTypeColor(type: string) {
  const t = type.toLowerCase();
  if (t === "project") return "bg-[#2196F3]"; // Blue
  if (t === "service") return "bg-[#9C27B0]"; // Purple
  return "bg-[#D35400]"; // Orange for blog
}

export function RecommendedContent({ items: rawItems, itemsPerPage = 3, title = "Recommended" }: RecommendedContentProps) {
  // Normalize items to standard format
  const items = useMemo(() => normalizeRecommendedItems(rawItems), [rawItems]);
  const [currentPage, setCurrentPage] = useState(0);

  if (!items || items.length === 0) {
    return (
      <div
        className="
          bg-[#F5F1E8] border-[4px] border-[#2C2416]
          shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
          p-4
        "
      >
        <h3 className="text-[14px] font-black text-[#2C2416] mb-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FF6B6B] border-[2px] border-[#2C2416] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          {title}
        </h3>
        <p className="text-[#7A7267] text-center py-4 font-medium text-[12px]">
          No recommendations available
        </p>
      </div>
    );
  }
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="
        bg-[#F5F1E8] border-[4px] border-[#2C2416]
        shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
        p-4
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-[2px] border-[#2C2416]">
        <h3 className="text-[14px] font-black text-[#2C2416] flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FF6B6B] border-[2px] border-[#2C2416] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          Recommended
        </h3>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevious}
              className="
                w-6 h-6 bg-[#E8E4DC] border-[2px] border-[#2C2416]
                flex items-center justify-center
                hover:bg-[#F5C542]
                transition-colors duration-150
              "
            >
              <ChevronLeft className="w-3 h-3 text-[#2C2416]" strokeWidth={3} />
            </button>
            <span className="text-[10px] font-bold text-[#7A7267] min-w-[28px] text-center">
              {currentPage + 1}/{totalPages}
            </span>
            <button
              onClick={handleNext}
              className="
                w-6 h-6 bg-[#E8E4DC] border-[2px] border-[#2C2416]
                flex items-center justify-center
                hover:bg-[#F5C542]
                transition-colors duration-150
              "
            >
              <ChevronRight className="w-3 h-3 text-[#2C2416]" strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {visibleItems.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          const iconBg = getTypeColor(item.type);
          const itemUrl = getRecommendedUrl(item);

          return (
            <Link
              key={item.id}
              href={itemUrl}
              className="
                flex gap-2 p-2
                bg-[#E8E4DC] border-[2px] border-[#2C2416]
                shadow-[2px_2px_0_0_#2C2416]
                hover:shadow-[1px_1px_0_0_#2C2416]
                hover:translate-x-[1px] hover:translate-y-[1px]
                transition-all duration-150
                group
              "
            >
              {/* Thumbnail with Type Icon */}
              <div
                className="
                  relative w-14 h-14 flex-shrink-0
                  border-[2px] border-[#2C2416]
                  overflow-hidden
                "
              >
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2C2416] flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-[#F5F1E8]" />
                  </div>
                )}
                {/* Type Icon on corner */}
                <div
                  className={`
                    absolute bottom-0 right-0
                    w-5 h-5 ${iconBg}
                    flex items-center justify-center
                    border-t-[2px] border-l-[2px] border-[#2C2416]
                  `}
                >
                  <TypeIcon className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Content - Just Title */}
              <div className="flex-1 min-w-0 flex items-center">
                <h4 className="font-bold text-[12px] text-[#2C2416] group-hover:text-[#D35400] transition-colors line-clamp-2 leading-tight">
                  {item.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
