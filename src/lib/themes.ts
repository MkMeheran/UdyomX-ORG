import { ThemeConfig, ResearchPaperTheme } from '@/types';

export const themeConfigs: Record<ResearchPaperTheme, ThemeConfig> = {
  'earth-ink': {
    name: 'Earth & Ink',
    colors: {
      background: '#F5F1E8',
      surface: '#FFFFFF',
      surfaceMuted: '#F9F7F4',
      primary: '#2C2416',
      accent: '#3CAEA3',
      textPrimary: '#2C2416',
      textSecondary: '#6B6456',
    },
    typography: {
      fontFamily: "'Georgia', serif",
      headingFamily: "'Playfair Display', serif",
    },
    borderStyle: '2px solid #2C2416',
    shadows: '4px 4px 0px 0px #ED553B',
  },
  'ocean-depths': {
    name: 'Ocean Depths',
    colors: {
      background: '#E8F4F8',
      surface: '#FFFFFF',
      surfaceMuted: '#F0F8FB',
      primary: '#0D1B2A',
      accent: '#1B98E0',
      textPrimary: '#0D1B2A',
      textSecondary: '#415A77',
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      headingFamily: "'Montserrat', sans-serif",
    },
    borderStyle: '2px solid #0D1B2A',
    shadows: '4px 4px 0px 0px #1B98E0',
  },
  'forest-twilight': {
    name: 'Forest Twilight',
    colors: {
      background: '#F1F8F4',
      surface: '#FFFFFF',
      surfaceMuted: '#F7FCF9',
      primary: '#1B4332',
      accent: '#95D5B2',
      textPrimary: '#1B4332',
      textSecondary: '#40916C',
    },
    typography: {
      fontFamily: "'Lora', serif",
      headingFamily: "'Merriweather', serif",
    },
    borderStyle: '2px solid #1B4332',
    shadows: '4px 4px 0px 0px #95D5B2',
  },
  'sunset-ember': {
    name: 'Sunset Ember',
    colors: {
      background: '#FFF5F0',
      surface: '#FFFFFF',
      surfaceMuted: '#FFF9F5',
      primary: '#3D2645',
      accent: '#FF6B35',
      textPrimary: '#3D2645',
      textSecondary: '#6B4C6E',
    },
    typography: {
      fontFamily: "'Crimson Text', serif",
      headingFamily: "'Spectral', serif",
    },
    borderStyle: '2px solid #3D2645',
    shadows: '4px 4px 0px 0px #FF6B35',
  },
  'academic': {
    name: 'Academic',
    colors: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceMuted: '#F1F5F9',
      primary: '#1E293B',
      accent: '#3B82F6',
      textPrimary: '#1E293B',
      textSecondary: '#64748B',
    },
    typography: {
      fontFamily: "'Times New Roman', serif",
      headingFamily: "'Times New Roman', serif",
    },
    borderStyle: '1px solid #CBD5E1',
    shadows: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },
};

export function getThemeStyles(theme: ResearchPaperTheme) {
  const config = themeConfigs[theme];
  return {
    '--bg-color': config.colors.background,
    '--surface-color': config.colors.surface,
    '--surface-muted-color': config.colors.surfaceMuted,
    '--primary-color': config.colors.primary,
    '--accent-color': config.colors.accent,
    '--text-primary': config.colors.textPrimary,
    '--text-secondary': config.colors.textSecondary,
    '--font-family': config.typography.fontFamily,
    '--heading-family': config.typography.headingFamily,
  };
}
