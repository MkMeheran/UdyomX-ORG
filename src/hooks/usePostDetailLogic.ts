'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Post, TOCItem } from '@/types/post';

interface UsePostDetailLogicProps {
    post: Post;
}

interface UsePostDetailLogicReturn {
    activeTocId: string;
    isMobile: boolean;
    tocItems: TOCItem[];
    handleTocClick: (id: string) => void;
    scrollProgress: number;
}

export function usePostDetailLogic({ post }: UsePostDetailLogicProps): UsePostDetailLogicReturn {
    const [activeTocId, setActiveTocId] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Extract TOC items from content or use provided
    const tocItems = post.tableOfContents || extractTocFromContent(post.content);

    // Handle responsive
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle active TOC tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTocId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-100px 0px -60% 0px',
                threshold: 0,
            }
        );

        tocItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [tocItems]);

    const handleTocClick = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, []);

    return {
        activeTocId,
        isMobile,
        tocItems,
        handleTocClick,
        scrollProgress,
    };
}

// Helper to extract TOC from markdown content
function extractTocFromContent(content: string): TOCItem[] {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        items.push({ id, text, level });
    }

    return items;
}
