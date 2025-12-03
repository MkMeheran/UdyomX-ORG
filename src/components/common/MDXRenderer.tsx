'use client';

import { useMemo } from 'react';

interface MDXRendererProps {
    content: string;
    className?: string;
}

// Simple MDX/Markdown renderer with neu-brutalism styling
export function MDXRenderer({ content, className = '' }: MDXRendererProps) {
    const processedContent = useMemo(() => {
        // Convert basic markdown to HTML
        let html = content
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-xl md:text-2xl font-black text-[#1A1A1A] mt-8 mb-4 border-l-4 border-[#2196F3] pl-4">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl md:text-3xl font-black text-[#1A1A1A] mt-10 mb-6 pb-3 border-b-4 border-black">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl md:text-4xl font-black text-[#1A1A1A] mt-12 mb-8">$1</h1>')
            // Bold & Italic
            .replace(/\*\*\*(.*)\*\*\*/gim, '<strong class="font-black"><em>$1</em></strong>')
            .replace(/\*\*(.*)\*\*/gim, '<strong class="font-black">$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre class="bg-[#1A1A1A] text-[#F5F5F0] p-4 my-6 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-x-auto font-mono text-sm"><code>$2</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/gim, '<code class="bg-[#F5C542] text-[#1A1A1A] px-2 py-1 border-2 border-black font-mono text-sm font-bold">$1</code>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[#2196F3] font-bold underline decoration-2 underline-offset-2 hover:bg-[#2196F3] hover:text-white px-1 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
            // Images
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<figure class="my-8"><img src="$2" alt="$1" class="w-full border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]" /><figcaption class="mt-2 text-sm text-[#5A5A5A] font-semibold text-center">$1</figcaption></figure>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#FF6B6B] bg-[#FFE5E5] p-4 my-6 text-[#1A1A1A] font-semibold italic">$1</blockquote>')
            // Horizontal rule
            .replace(/^---$/gim, '<hr class="my-8 border-0 h-1 bg-black" />')
            // Unordered lists
            .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2 list-disc font-semibold">$1</li>')
            .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc font-semibold">$1</li>')
            // Ordered lists
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal font-semibold">$1</li>')
            // Paragraphs
            .replace(/\n\n/gim, '</p><p class="mb-6 text-[#3D3D3D] leading-relaxed text-lg">')
            // Line breaks
            .replace(/\n/gim, '<br />');

        // Wrap in paragraph if not already
        if (!html.startsWith('<')) {
            html = `<p class="mb-6 text-[#3D3D3D] leading-relaxed text-lg">${html}</p>`;
        }

        return html;
    }, [content]);

    return (
        <div
            className={`prose prose-lg max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: processedContent }}
        />
    );
}
