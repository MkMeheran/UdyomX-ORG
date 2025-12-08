"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  // Determine category badge color based on category or service type
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

  const category = service.category || 'Service';

  return (
    <Link href={`/services/${service.slug}`} className="block h-full group">
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
            THUMBNAIL IMAGE - 1.91:1 ratio
        ═══════════════════════════════════════════════════════════ */}
        <div className="relative aspect-[1.91/1] overflow-hidden border-b-[4px] border-[#2C2416]">
          {(service.thumbnail || service.coverImage) ? (
            <Image
              src={service.thumbnail || service.coverImage || ''}
              alt={service.title || service.name || 'Service'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#E0E0E0] to-[#D1D1D1] flex items-center justify-center">
              <span className="text-6xl">🔧</span>
            </div>
          )}
          
          {/* Category Badge on Image */}
          <div className="absolute top-3 left-3">
            <span
              className={`
                inline-block px-3 py-1.5
                ${getCategoryColor(category)}
                border-[3px] border-[#2C2416]
                shadow-[3px_3px_0_0_#2C2416]
                text-[11px] font-black uppercase tracking-wider
              `}
            >
              {category}
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            CONTENT - Title & Description
        ═══════════════════════════════════════════════════════════ */}
        <div className="p-5 flex-1 flex flex-col">
          <h3
            className="
              text-[18px] md:text-[20px] font-black text-[#2C2416]
              leading-[1.25] line-clamp-2 mb-3
              group-hover:text-[#D35400] transition-colors duration-150
            "
          >
            {service.title || service.name}
          </h3>
          <p className="text-[14px] text-[#5A5247] font-medium line-clamp-3 leading-[1.6] flex-1 break-words" style={{overflowWrap: 'break-word', wordBreak: 'break-word'}}>
            {service.hookLine || service.description}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER - Delivery Time & Arrow Button
        ═══════════════════════════════════════════════════════════ */}
        <div className="px-5 pb-5 flex items-center justify-between gap-3">
          <span className="text-[12px] text-[#7A7568] font-semibold">
            ⏱ {service.packages?.[0]?.deliveryTime || 'Contact us'}
          </span>
          
          {/* Chunky Arrow Button */}
          <div
            className="
              w-11 h-11 flex items-center justify-center
              bg-[#F5C542] border-[3px] border-[#2C2416]
              shadow-[3px_3px_0_0_#2C2416]
              group-hover:bg-[#D35400] group-hover:text-white
              group-hover:shadow-[2px_2px_0_0_#2C2416]
              group-hover:translate-x-[1px] group-hover:translate-y-[1px]
              transition-all duration-150
            "
          >
            <ArrowRight className="w-5 h-5 text-[#2C2416] group-hover:text-white" strokeWidth={3} />
          </div>
        </div>
      </article>
    </Link>
  );
}
