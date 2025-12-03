import type { BlogTheme, ThemeName } from '@/types/blog';

export const blogThemes: Record<ThemeName, BlogTheme> = {
    'earth-ink': {
        name: 'Earth & Ink',
        colors: {
            primary: '#0F2A42',
            secondary: '#3CAEA3',
            accent: '#ED553B',
            background: '#F5F1E8',
            surface: '#FFFCF8',
            text: '#0F2A42',
            textSecondary: '#4A5568',
            border: '#2C2416',
            shadow: 'rgba(44, 36, 22, 0.3)',
        },
        typography: {
            heading: 'Merriweather, Georgia, serif',
            body: 'Inter, system-ui, sans-serif',
            code: 'JetBrains Mono, Consolas, monospace',
        },
    },
    'ocean-depths': {
        name: 'Ocean Depths',
        colors: {
            primary: '#0C4A6E',
            secondary: '#06B6D4',
            accent: '#F59E0B',
            background: '#F0F9FF',
            surface: '#FFFFFF',
            text: '#0C4A6E',
            textSecondary: '#64748B',
            border: '#0369A1',
            shadow: 'rgba(12, 74, 110, 0.2)',
        },
        typography: {
            heading: 'Merriweather, Georgia, serif',
            body: 'Inter, system-ui, sans-serif',
            code: 'JetBrains Mono, Consolas, monospace',
        },
    },
    'forest-twilight': {
        name: 'Forest Twilight',
        colors: {
            primary: '#14532D',
            secondary: '#4ADE80',
            accent: '#F97316',
            background: '#F0FDF4',
            surface: '#FFFFFF',
            text: '#14532D',
            textSecondary: '#6B7280',
            border: '#166534',
            shadow: 'rgba(20, 83, 45, 0.2)',
        },
        typography: {
            heading: 'Merriweather, Georgia, serif',
            body: 'Inter, system-ui, sans-serif',
            code: 'JetBrains Mono, Consolas, monospace',
        },
    },
    'sunset-ember': {
        name: 'Sunset Ember',
        colors: {
            primary: '#7C2D12',
            secondary: '#FB923C',
            accent: '#FBBF24',
            background: '#FFF7ED',
            surface: '#FFFFFF',
            text: '#7C2D12',
            textSecondary: '#78350F',
            border: '#9A3412',
            shadow: 'rgba(124, 45, 18, 0.2)',
        },
        typography: {
            heading: 'Merriweather, Georgia, serif',
            body: 'Inter, system-ui, sans-serif',
            code: 'JetBrains Mono, Consolas, monospace',
        },
    },
    'academic': {
        name: 'Academic',
        colors: {
            primary: '#1E3A8A',
            secondary: '#3B82F6',
            accent: '#10B981',
            background: '#F8FAFC',
            surface: '#FFFFFF',
            text: '#1E293B',
            textSecondary: '#475569',
            border: '#1E40AF',
            shadow: 'rgba(30, 58, 138, 0.15)',
        },
        typography: {
            heading: 'Merriweather, Georgia, serif',
            body: 'Inter, system-ui, sans-serif',
            code: 'JetBrains Mono, Consolas, monospace',
        },
    },
};

export function getTheme(name: ThemeName): BlogTheme {
    return blogThemes[name] || blogThemes['earth-ink'];
}

export function applyBlogTheme(theme: BlogTheme) {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // Apply colors as CSS variables
    root.style.setProperty('--blog-primary', theme.colors.primary);
    root.style.setProperty('--blog-secondary', theme.colors.secondary);
    root.style.setProperty('--blog-accent', theme.colors.accent);
    root.style.setProperty('--blog-background', theme.colors.background);
    root.style.setProperty('--blog-surface', theme.colors.surface);
    root.style.setProperty('--blog-text', theme.colors.text);
    root.style.setProperty('--blog-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--blog-border', theme.colors.border);
    root.style.setProperty('--blog-shadow', theme.colors.shadow);

    // Apply typography
    root.style.setProperty('--blog-font-heading', theme.typography.heading);
    root.style.setProperty('--blog-font-body', theme.typography.body);
    root.style.setProperty('--blog-font-code', theme.typography.code);

    root.setAttribute('data-blog-theme', theme.name);
}
