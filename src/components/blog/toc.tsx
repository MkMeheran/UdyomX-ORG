"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";
import type { TOCItem } from "@/types/blog";

interface TOCProps {
  items: TOCItem[];
  activeId?: string | null;
  isSidebar?: boolean;
}

export function TOC({ items, activeId, isSidebar = false }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* MOBILE: Accordion - Chunky Brutalist */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full flex items-center justify-between p-4
            bg-[#F5F1E8] border-[4px] border-[#2C2416]
            shadow-[4px_4px_0_0_rgba(44,36,22,0.5)]
            hover:shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
            hover:-translate-x-[1px] hover:-translate-y-[1px]
            transition-all duration-150
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2C2416] border-[2px] border-[#2C2416] flex items-center justify-center">
              <List className="w-4 h-4 text-[#F5F1E8]" />
            </div>
            <span className="font-black text-[#2C2416] text-[16px]">Table of Contents</span>
          </div>
          <ChevronDown
            className={`w-6 h-6 text-[#2C2416] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            className="
              mt-[-4px] p-5 pt-6
              bg-[#F5F1E8] border-[4px] border-t-0 border-[#2C2416]
              shadow-[4px_4px_0_0_rgba(44,36,22,0.5)]
            "
          >
            <nav>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 16}px` }}>
                    <button
                      onClick={() => handleClick(item.id)}
                      className={`
                        text-left text-[14px] font-semibold transition-colors duration-150
                        hover:text-[#D35400]
                        ${activeId === item.id
                          ? "text-[#D35400] font-black"
                          : "text-[#5A5247]"
                        }
                      `}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* DESKTOP: Sidebar or Inline - Chunky Brutalist */}
      {isSidebar ? (
        <div
          className="
            bg-[#F5F1E8] border-[4px] border-[#2C2416]
            shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
            p-5
          "
        >
          <h3 className="text-[16px] font-black text-[#2C2416] mb-4 flex items-center gap-2 pb-3 border-b-[3px] border-[#2C2416]">
            <div className="w-7 h-7 bg-[#2C2416] flex items-center justify-center">
              <List className="w-3.5 h-3.5 text-[#F5F1E8]" />
            </div>
            Table of Contents
          </h3>
          <nav>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`
                      text-left text-[13px] font-semibold transition-colors duration-150
                      hover:text-[#D35400] block leading-snug
                      ${activeId === item.id
                        ? "text-[#D35400] font-black"
                        : "text-[#5A5247]"
                      }
                    `}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        <div className="hidden lg:block">
          <div
            className="
              bg-[#F5F1E8] border-[4px] border-[#2C2416]
              shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
              p-5
            "
          >
            <h3 className="text-[16px] font-black text-[#2C2416] mb-4 flex items-center gap-2 pb-3 border-b-[3px] border-[#2C2416]">
              <div className="w-7 h-7 bg-[#2C2416] flex items-center justify-center">
                <List className="w-3.5 h-3.5 text-[#F5F1E8]" />
              </div>
              Table of Contents
            </h3>
            <nav>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                    <button
                      onClick={() => handleClick(item.id)}
                      className={`
                        text-left text-[13px] font-semibold transition-colors duration-150
                        hover:text-[#D35400] block leading-snug
                        ${activeId === item.id
                          ? "text-[#D35400] font-black"
                          : "text-[#5A5247]"
                        }
                      `}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
