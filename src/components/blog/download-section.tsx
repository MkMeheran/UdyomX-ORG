"use client";

import { useMemo } from "react";
import { Download, FileText, FileArchive, FileImage, File, Lock } from "lucide-react";
import type { DownloadItem } from "@/types";

// Normalize helper - converts any download format to standard DownloadItem
function normalizeDownloadItems(items: any[]): DownloadItem[] {
  if (!items || items.length === 0) return [];
  
  return items.map((item, index) => {
    if (typeof item === 'string') {
      // Handle string URLs
      return {
        id: `download-${index}`,
        title: `Download ${index + 1}`,
        url: item,
        orderIndex: index,
      };
    }
    
    // Handle object with various property names
    return {
      id: item.id || `download-${index}`,
      title: item.title || item.label || item.name || `Download ${index + 1}`,
      url: item.url || item.fileUrl || item.href || '',
      fileSize: item.fileSize || item.size,
      fileType: item.fileType || item.type,
      description: item.description,
      isPremium: item.isPremium || item.premium || false,
      orderIndex: item.orderIndex ?? item.order ?? index,
    };
  });
}

interface DownloadSectionProps {
  downloads: any[];  // Accept any format for flexibility
  title?: string;
  userIsPremium?: boolean;
}

// Get icon based on file type
function getFileIcon(fileType?: string) {
  const type = fileType?.toLowerCase();
  if (type === "zip" || type === "rar") return FileArchive;
  if (type === "png" || type === "jpg" || type === "jpeg" || type === "gif") return FileImage;
  if (type === "pdf" || type === "doc" || type === "docx") return FileText;
  return File;
}

export function DownloadSection({ downloads: rawDownloads, title = "Downloads", userIsPremium = false }: DownloadSectionProps) {
  // Normalize downloads to standard format
  const downloads = useMemo(() => normalizeDownloadItems(rawDownloads), [rawDownloads]);
  
  if (!downloads || downloads.length === 0) return null;

  return (
    <div
      className="
        bg-[#F5F1E8] border-[4px] border-[#2C2416]
        shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
        p-4
      "
    >
      <h3 className="text-[14px] font-black text-[#2C2416] mb-3 flex items-center gap-2 pb-2 border-b-[2px] border-[#2C2416]">
        <div className="w-6 h-6 bg-[#5CB85C] border-[2px] border-[#2C2416] flex items-center justify-center">
          <Download className="w-3 h-3 text-white" />
        </div>
        {title}
      </h3>

      <div className="space-y-2">
        {downloads.map((item, index) => {
          const FileIcon = getFileIcon(item.fileType);
          const isLocked = item.isPremium && !userIsPremium;
          
          return (
            <a
              key={item.id || index}
              href={isLocked ? '#' : item.url}
              download={!isLocked}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  alert('This download requires premium access');
                }
              }}
              className={`
                flex items-center gap-2 p-2
                bg-[#E8E4DC] border-[2px] border-[#2C2416]
                shadow-[2px_2px_0_0_#2C2416]
                hover:shadow-[1px_1px_0_0_#2C2416]
                hover:translate-x-[1px] hover:translate-y-[1px]
                transition-all duration-150
                group
                ${isLocked ? 'opacity-70' : ''}
              `}
            >
              <div
                className={`
                  w-7 h-7 flex-shrink-0
                  ${isLocked ? 'bg-[#7A7267]' : 'bg-[#2196F3]'} border-[2px] border-[#2C2416]
                  flex items-center justify-center
                `}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-white" />
                ) : (
                  <FileIcon className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#2C2416] text-[12px] group-hover:text-[#D35400] transition-colors truncate">
                  {item.title}
                </p>
                {(item.fileType || item.fileSize) && (
                  <p className="text-[10px] text-[#7A7267] font-medium">
                    {item.fileType && <span className="uppercase">{item.fileType}</span>}
                    {item.fileSize && item.fileType && <span> • </span>}
                    {item.fileSize}
                  </p>
                )}
              </div>

              <div
                className="
                  w-6 h-6 flex-shrink-0
                  bg-[#F5C542] border-[2px] border-[#2C2416]
                  flex items-center justify-center
                  group-hover:bg-[#D35400]
                  transition-colors duration-150
                "
              >
                <Download className="w-3 h-3 text-[#2C2416] group-hover:text-white" strokeWidth={2.5} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
