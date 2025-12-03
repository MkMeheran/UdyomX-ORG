'use client';

import { useState } from 'react';
import { List, ChevronDown, ChevronRight } from 'lucide-react';
import type { TOCItem } from '@/types/post';

interface PostTOCProps {
    items: TOCItem[];
    activeId?: string;
    onItemClick?: (id: string) => void;
    isMobile?: boolean;
}

export function PostTOC({ items, activeId, onItemClick, isMobile = false }: PostTOCProps) {
    const [isExpanded, setIsExpanded] = useState(!isMobile);

    if (!items || items.length === 0) return null;

    const handleClick = (id: string) => {
        if (onItemClick) {
            onItemClick(id);
        }
        if (isMobile) {
            setIsExpanded(false);
        }
    };

    const getLevelStyles = (level: number) => {
        const baseStyles = 'block py-2 px-3 font-semibold transition-all border-l-4';
        const activeStyles = activeId === items.find(i => i.id === activeId)?.id
            ? 'bg-[#2196F3] text-white border-black'
            : 'border-transparent hover:border-[#2196F3] hover:bg-[#F5F5F0]';

        switch (level) {
            case 1:
                return `${baseStyles} text-[#1A1A1A] font-black`;
            case 2:
                return `${baseStyles} text-[#3D3D3D] pl-6 font-bold`;
            case 3:
                return `${baseStyles} text-[#5A5A5A] pl-9 text-sm`;
            default:
                return baseStyles;
        }
    };

    return (
        <div className="bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {/* Header */}
            <button
                onClick={() => isMobile && setIsExpanded(!isExpanded)}
                className={`
                    w-full flex items-center justify-between p-4 border-b-4 border-black
                    ${isMobile ? 'cursor-pointer hover:bg-[#F5F5F0]' : 'cursor-default'}
                `}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2196F3] border-2 border-black flex items-center justify-center">
                        <List className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-[#1A1A1A] uppercase tracking-wider">
                        Table of Contents
                    </h3>
                </div>
                {isMobile && (
                    <ChevronDown
                        className={`w-5 h-5 text-[#1A1A1A] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            {/* Content */}
            <div
                className={`
                    overflow-hidden transition-all duration-300
                    ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}
                    ${!isMobile ? 'max-h-none' : ''}
                `}
            >
                <nav className="p-4 space-y-1 max-h-[400px] overflow-y-auto">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleClick(item.id)}
                            className={`
                                w-full text-left py-2 px-3 font-semibold transition-all border-l-4
                                ${activeId === item.id
                                    ? 'bg-[#2196F3] text-white border-black'
                                    : 'border-transparent hover:border-[#2196F3] hover:bg-[#F5F5F0] text-[#3D3D3D]'
                                }
                                ${item.level === 1 ? 'font-black text-[#1A1A1A]' : ''}
                                ${item.level === 2 ? 'pl-6 font-bold' : ''}
                                ${item.level === 3 ? 'pl-9 text-sm' : ''}
                            `}
                        >
                            <span className="flex items-center gap-2">
                                {item.level > 1 && (
                                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                )}
                                <span className="line-clamp-1">{item.text}</span>
                            </span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
