import type { ThemeConfig, ThemeName } from '@/types/service';

export const serviceThemes: Record<ThemeName, ThemeConfig> = {
    'earth-ink': {
        name: 'earth-ink',
        displayName: 'Earth & Ink',
        colors: {
            primary: '#0F2A42',
            secondary: '#3CAEA3',
            accent: '#ED553B',
            background: '#F5F1E8',
            surface: '#FFFCF8',
            text: '#0F2A42',
            textSecondary: '#4A5568',
        },
    },
    ocean: {
        name: 'ocean',
        displayName: 'Ocean Depths',
        colors: {
            primary: '#0C4A6E',
            secondary: '#06B6D4',
            accent: '#F59E0B',
            background: '#F0F9FF',
            surface: '#FFFFFF',
            text: '#0C4A6E',
            textSecondary: '#64748B',
        },
    },
    forest: {
        name: 'forest',
        displayName: 'Forest Twilight',
        colors: {
            primary: '#14532D',
            secondary: '#4ADE80',
            accent: '#F97316',
            background: '#F0FDF4',
            surface: '#FFFFFF',
            text: '#14532D',
            textSecondary: '#6B7280',
        },
    },
    sunset: {
        name: 'sunset',
        displayName: 'Sunset Ember',
        colors: {
            primary: '#7C2D12',
            secondary: '#FB923C',
            accent: '#FBBF24',
            background: '#FFF7ED',
            surface: '#FFFFFF',
            text: '#7C2D12',
            textSecondary: '#78350F',
        },
    },
    academic: {
        name: 'academic',
        displayName: 'Academic',
        colors: {
            primary: '#1E3A8A',
            secondary: '#3B82F6',
            accent: '#10B981',
            background: '#F8FAFC',
            surface: '#FFFFFF',
            text: '#1E293B',
            textSecondary: '#475569',
        },
    },
};

export function getServiceTheme(name: ThemeName): ThemeConfig {
    return serviceThemes[name] || serviceThemes['earth-ink'];
}

export function applyServiceTheme(theme: ThemeConfig) {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    root.style.setProperty('--service-primary', theme.colors.primary);
    root.style.setProperty('--service-secondary', theme.colors.secondary);
    root.style.setProperty('--service-accent', theme.colors.accent);
    root.style.setProperty('--service-background', theme.colors.background);
    root.style.setProperty('--service-surface', theme.colors.surface);
    root.style.setProperty('--service-text', theme.colors.text);
    root.style.setProperty('--service-text-secondary', theme.colors.textSecondary);

    root.setAttribute('data-service-theme', theme.name);
}
