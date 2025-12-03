'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface ContentRendererProps {
    content: string;
    format?: 'markdown' | 'html' | 'auto';
    className?: string;
}

// Detect if content is HTML or Markdown
function detectFormat(content: string): 'html' | 'markdown' {
    // Check for common HTML tags
    const htmlPatterns = [
        /<div[\s>]/i,
        /<p[\s>]/i,
        /<span[\s>]/i,
        /<h[1-6][\s>]/i,
        /<article[\s>]/i,
        /<section[\s>]/i,
        /<ul[\s>]/i,
        /<ol[\s>]/i,
        /<br\s*\/?>/i,
        /<img[\s>]/i,
    ];
    
    const hasHtml = htmlPatterns.some(pattern => pattern.test(content));
    
    // Check for Markdown patterns
    const markdownPatterns = [
        /^#{1,6}\s+/m,           // Headers: # ## ###
        /^\*\*[^*]+\*\*/m,       // Bold: **text**
        /^```[\s\S]*?```/m,      // Code blocks: ```code```
        /^\s*[-*+]\s+/m,         // Unordered lists
        /^\s*\d+\.\s+/m,         // Ordered lists
        /^\[.+?\]\(.+?\)/m,      // Links: [text](url)
        /^>\s+/m,                // Blockquotes
    ];
    
    const hasMarkdown = markdownPatterns.some(pattern => pattern.test(content));
    
    // If has HTML tags and no strong markdown patterns, it's HTML
    if (hasHtml && !hasMarkdown) {
        return 'html';
    }
    
    // If has markdown patterns, treat as markdown
    if (hasMarkdown) {
        return 'markdown';
    }
    
    // Default to markdown for plain text
    return 'markdown';
}

export function ContentRenderer({ content, format = 'auto', className = '' }: ContentRendererProps) {
    const effectiveFormat = format === 'auto' ? detectFormat(content) : format;
    
    const proseClasses = `
        prose prose-lg max-w-none
        prose-headings:font-black prose-headings:text-[#2C2416]
        prose-h2:text-[26px] prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b-[3px] prose-h2:border-[#2C2416]
        prose-h3:text-[20px] prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[#5A5247] prose-p:leading-[1.8] prose-p:font-medium
        prose-a:text-[#2196F3] prose-a:font-bold prose-a:no-underline hover:prose-a:text-[#D35400]
        prose-strong:text-[#2C2416] prose-strong:font-black
        prose-code:text-[#D35400] prose-code:bg-[#E8E4DC] prose-code:px-2 prose-code:py-0.5 prose-code:border-[2px] prose-code:border-[#2C2416] prose-code:font-bold
        prose-pre:bg-[#2C2416] prose-pre:text-[#F5F1E8] prose-pre:border-[4px] prose-pre:border-[#2C2416] prose-pre:shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
        prose-img:border-[4px] prose-img:border-[#2C2416] prose-img:shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
        prose-blockquote:border-l-[6px] prose-blockquote:border-[#F5C542] prose-blockquote:bg-[#E8E4DC] prose-blockquote:p-6 prose-blockquote:not-italic prose-blockquote:font-bold
        prose-ul:marker:text-[#2C2416]
        prose-li:text-[#5A5247] prose-li:font-medium
        ${className}
    `.trim();
    
    if (effectiveFormat === 'html') {
        return (
            <div 
                className={proseClasses}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }
    
    // Markdown rendering
    return (
        <div className={proseClasses}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    // Custom code block rendering
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !className;
                        
                        if (isInline) {
                            return (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }
                        
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Custom pre block
                    pre({ children, ...props }) {
                        return (
                            <pre 
                                className="overflow-x-auto p-4 rounded-none"
                                {...props}
                            >
                                {children}
                            </pre>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
