'use client';

import { useEffect, useState } from 'react';
import type { TOCItem } from '@/types/blog';

// Generate slug from text
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export function useTOC(content: string): TOCItem[] {
    const [toc, setToc] = useState<TOCItem[]>([]);

    useEffect(() => {
        if (!content) {
            setToc([]);
            return;
        }

        const items: TOCItem[] = [];

        // Check if content is HTML or Markdown
        const isHTML = content.trim().startsWith('<') || content.includes('</');

        if (isHTML) {
            // Parse HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.substring(1));
                const text = heading.textContent || '';
                const id = heading.id || generateSlug(text) || `heading-${index}`;

                items.push({ id, text, level });
            });
        } else {
            // Parse Markdown content - extract headings
            const lines = content.split('\n');
            let index = 0;

            lines.forEach(line => {
                // Match ATX-style headings: # Heading, ## Heading, etc.
                const match = line.match(/^(#{1,6})\s+(.+)$/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2].trim();
                    const id = generateSlug(text) || `heading-${index}`;
                    
                    items.push({ id, text, level });
                    index++;
                }
            });
        }

        setToc(items);
    }, [content]);

    return toc;
}
