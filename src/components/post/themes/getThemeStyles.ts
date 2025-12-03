import type { ResearchPaperTheme, ThemeConfig } from '@/types/post';
import { researchPaperThemes } from './researchPaperThemes';

export function getThemeStyles(theme: ResearchPaperTheme = 'default'): ThemeConfig {
    return researchPaperThemes[theme] || researchPaperThemes.default;
}

export function getThemeClassName(theme: ResearchPaperTheme = 'default'): string {
    const config = getThemeStyles(theme);
    
    return `
        [--bg-primary:${config.colors.background}]
        [--bg-surface:${config.colors.surface}]
        [--border-color:${config.colors.border}]
        [--text-primary:${config.colors.text}]
        [--text-secondary:${config.colors.textSecondary}]
        [--accent:${config.colors.accent}]
        [--shadow:${config.colors.shadow}]
    `.replace(/\s+/g, ' ').trim();
}

export function getThemeCSSVariables(theme: ResearchPaperTheme = 'default'): React.CSSProperties {
    const config = getThemeStyles(theme);
    
    return {
        '--bg-primary': config.colors.background,
        '--bg-surface': config.colors.surface,
        '--border-color': config.colors.border,
        '--text-primary': config.colors.text,
        '--text-secondary': config.colors.textSecondary,
        '--accent': config.colors.accent,
        '--shadow': config.colors.shadow,
        fontFamily: config.typography.bodyFont,
    } as React.CSSProperties;
}
