'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Bold, Italic, Code, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Heading1, Heading2, Heading3, Quote, Minus, Eye, EyeOff, Table, BarChart2, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractHeadingsFromContent } from '@/lib/slug-utils';
import type { ContentFormat, EditorTOCItem } from '@/types/editor';

interface ContentEditorProps {
    content: string;
    onChange: (content: string) => void;
    format: ContentFormat;
    onFormatChange: (format: ContentFormat) => void;
    onTOCChange?: (toc: EditorTOCItem[]) => void;
    placeholder?: string;
    minHeight?: string;
}

// Toolbar buttons configuration
const toolbarButtons = [
    { icon: Bold, label: 'Bold', markdown: '**', html: '<strong>', wrapper: true },
    { icon: Italic, label: 'Italic', markdown: '*', html: '<em>', wrapper: true },
    { icon: Code, label: 'Code', markdown: '`', html: '<code>', wrapper: true },
    { type: 'divider' },
    { icon: Heading1, label: 'Heading 1', markdown: '# ', html: '<h1>', block: true },
    { icon: Heading2, label: 'Heading 2', markdown: '## ', html: '<h2>', block: true },
    { icon: Heading3, label: 'Heading 3', markdown: '### ', html: '<h3>', block: true },
    { type: 'divider' },
    { icon: List, label: 'Bullet List', markdown: '- ', html: '<ul><li>', block: true },
    { icon: ListOrdered, label: 'Numbered List', markdown: '1. ', html: '<ol><li>', block: true },
    { icon: Quote, label: 'Quote', markdown: '> ', html: '<blockquote>', block: true },
    { type: 'divider' },
    { icon: LinkIcon, label: 'Link', markdown: '[text](url)', html: '<a href="">', special: 'link' },
    { icon: ImageIcon, label: 'Image', markdown: '![alt](url)', html: '<img src="" alt="" />', special: 'image' },
    { icon: Minus, label: 'Horizontal Rule', markdown: '\n---\n', html: '<hr />', insert: true },
    { type: 'divider' },
    { icon: Table, label: 'Table', special: 'table' },
    { icon: BarChart2, label: 'Chart (Mermaid)', special: 'chart' },
    { icon: Calculator, label: 'Math (KaTeX)', special: 'math' },
] as const;

export function ContentEditor({
    content,
    onChange,
    format,
    onFormatChange,
    onTOCChange,
    placeholder = 'Start writing your content here...',
    minHeight = '400px'
}: ContentEditorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    // Generate TOC from content
    useEffect(() => {
        if (onTOCChange) {
            const headings = extractHeadingsFromContent(content);
            const tocItems: EditorTOCItem[] = headings.map(h => ({
                id: h.id,
                text: h.text,
                level: h.level
            }));
            onTOCChange(tocItems);
        }
    }, [content, onTOCChange]);
    
    // Insert text at cursor position
    const insertAtCursor = useCallback((before: string, after: string = '', selectInner: boolean = false) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        // Ensure content is always a string
        const currentContent = content || '';
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = currentContent.substring(start, end);
        
        let newText: string;
        let newCursorPos: number;
        
        if (selectedText) {
            newText = currentContent.substring(0, start) + before + selectedText + after + currentContent.substring(end);
            newCursorPos = start + before.length + selectedText.length + after.length;
        } else {
            newText = currentContent.substring(0, start) + before + after + currentContent.substring(end);
            newCursorPos = selectInner ? start + before.length : start + before.length + after.length;
        }
        
        onChange(newText);
        
        // Set cursor position after React re-render
        setTimeout(() => {
            textarea.focus();
            if (selectedText) {
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            } else if (selectInner) {
                textarea.setSelectionRange(start + before.length, start + before.length);
            } else {
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    }, [content, onChange]);
    
    // Handle toolbar button click
    const handleToolbarClick = useCallback((button: typeof toolbarButtons[number]) => {
        if ('type' in button && button.type === 'divider') return;
        if (!('icon' in button)) return;
        
        const isMarkdown = format === 'markdown' || format === 'mdx';
        
        if (button.special) {
            switch (button.special) {
                case 'link':
                    if (isMarkdown) {
                        insertAtCursor('[', '](https://)', true);
                    } else {
                        insertAtCursor('<a href="https://">', '</a>', true);
                    }
                    break;
                case 'image':
                    if (isMarkdown) {
                        insertAtCursor('![', '](https://)', true);
                    } else {
                        insertAtCursor('<img src="https://" alt="', '" />', true);
                    }
                    break;
                case 'table':
                    if (isMarkdown) {
                        insertAtCursor('\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n');
                    } else {
                        insertAtCursor('\n<table>\n  <thead>\n    <tr>\n      <th>Header</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Cell</td>\n    </tr>\n  </tbody>\n</table>\n');
                    }
                    break;
                case 'chart':
                    insertAtCursor('\n```mermaid\ngraph TD\n    A[Start] --> B[Process]\n    B --> C[End]\n```\n');
                    break;
                case 'math':
                    if (isMarkdown) {
                        insertAtCursor('\n$$\n', '\n$$\n', true);
                    } else {
                        insertAtCursor('<math>', '</math>', true);
                    }
                    break;
            }
            return;
        }
        
        if (button.insert) {
            insertAtCursor(isMarkdown ? button.markdown : button.html);
            return;
        }
        
        if (button.wrapper) {
            const marker = isMarkdown ? button.markdown : '';
            const closeTag = button.html.replace('<', '</');
            insertAtCursor(
                isMarkdown ? marker : button.html,
                isMarkdown ? marker : closeTag
            );
            return;
        }
        
        if (button.block) {
            insertAtCursor(isMarkdown ? button.markdown : button.html);
        }
    }, [format, insertAtCursor]);
    
    // Render preview
    const previewHtml = useMemo(() => {
        if (!showPreview) return '';
        
        // Ensure content is always a string
        let html = content || '';
        
        if (!html) return '<p class="text-gray-400">Start typing to see preview...</p>';
        
        // Basic markdown to HTML conversion for preview
        if (format === 'markdown' || format === 'mdx') {
            // Headings
            html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
            html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
            html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
            
            // Bold and Italic
            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
            html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
            html = html.replace(/_(.+?)_/g, '<em>$1</em>');
            
            // Code
            html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            // Links and Images
            html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
            
            // Lists
            html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
            html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
            
            // Blockquotes
            html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
            
            // Horizontal rule
            html = html.replace(/^---$/gm, '<hr />');
            
            // Paragraphs
            html = html.split('\n\n').map(p => {
                if (!p.startsWith('<')) return `<p>${p}</p>`;
                return p;
            }).join('\n');
        }
        
        return html;
    }, [content, format, showPreview]);
    
    return (
        <div className="space-y-3">
            {/* Format Selector */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {(['mdx', 'markdown', 'html'] as ContentFormat[]).map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => onFormatChange(f)}
                            className={cn(
                                'px-3 py-1.5 font-bold text-sm border-2 border-[#2C2416] transition-all',
                                format === f
                                    ? 'bg-[#2C2416] text-white'
                                    : 'bg-white hover:bg-[#F5C542]'
                            )}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
                
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={cn(
                        'flex items-center gap-2 px-3 py-1.5 font-bold text-sm border-2 border-[#2C2416] transition-all',
                        showPreview
                            ? 'bg-[#F5C542]'
                            : 'bg-white hover:bg-[#F5F1E8]'
                    )}
                >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPreview ? 'Hide Preview' : 'Preview'}
                </button>
            </div>
            
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-[#F5F1E8] border-4 border-[#2C2416]">
                {toolbarButtons.map((button, index) => {
                    if ('type' in button && button.type === 'divider') {
                        return (
                            <div key={index} className="w-px h-8 bg-[#2C2416]/20 mx-1" />
                        );
                    }
                    
                    if (!('icon' in button)) return null;
                    
                    const Icon = button.icon;
                    
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleToolbarClick(button)}
                            title={button.label}
                            className="p-2 hover:bg-[#F5C542] transition-colors border-2 border-transparent hover:border-[#2C2416]"
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    );
                })}
            </div>
            
            {/* Editor / Preview */}
            <div className={cn(
                'grid gap-4',
                showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            )}>
                {/* Editor */}
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={content || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        style={{ minHeight }}
                        className={cn(
                            'w-full p-4 font-mono text-sm bg-white border-4 border-[#2C2416]',
                            'shadow-[4px_4px_0_rgba(44,36,22,0.2)] resize-y',
                            'focus:outline-none focus:shadow-[6px_6px_0_rgba(44,36,22,0.3)]',
                            'placeholder:text-[#2C2416]/30'
                        )}
                    />
                    
                    {/* Format hint */}
                    <div className="absolute bottom-4 right-4 text-xs text-[#2C2416]/40 font-medium">
                        {(format || 'mdx').toUpperCase()} • {(content || '').split(/\s+/).filter(Boolean).length} words
                    </div>
                </div>
                
                {/* Preview */}
                {showPreview && (
                    <div 
                        className={cn(
                            'p-4 bg-white border-4 border-[#2C2416] overflow-auto prose prose-sm max-w-none',
                            'prose-headings:font-black prose-headings:text-[#2C2416]',
                            'prose-p:text-[#2C2416]/80 prose-a:text-blue-600',
                            'prose-code:bg-[#F5F1E8] prose-code:px-1 prose-code:rounded',
                            'prose-blockquote:border-l-4 prose-blockquote:border-[#F5C542]'
                        )}
                        style={{ minHeight }}
                        dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-400">Preview will appear here...</p>' }}
                    />
                )}
            </div>
            
            {/* Supported Features Note */}
            <div className="text-xs text-[#2C2416]/50">
                <strong>Supports:</strong> MDX components, Markdown, HTML, CSS (in HTML), KaTeX math ($..$ or $$..$$), 
                Mermaid diagrams (```mermaid), Code blocks with syntax highlighting
            </div>
        </div>
    );
}
