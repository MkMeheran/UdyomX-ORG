'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { ThemeName, BlogTheme } from '@/types/blog';
import { getTheme, applyBlogTheme } from '@/lib/blog-themes';

interface ThemeContextType {
    currentTheme: ThemeName;
    theme: BlogTheme;
    setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'blog-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>('earth-ink');
    const [theme, setThemeObject] = useState<BlogTheme>(getTheme('earth-ink'));

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
        if (savedTheme && ['earth-ink', 'ocean-depths', 'forest-twilight', 'sunset-ember', 'academic'].includes(savedTheme)) {
            setCurrentTheme(savedTheme);
            const themeObj = getTheme(savedTheme);
            setThemeObject(themeObj);
            applyBlogTheme(themeObj);
        }
    }, []);

    const setTheme = (themeName: ThemeName) => {
        setCurrentTheme(themeName);
        const themeObj = getTheme(themeName);
        setThemeObject(themeObj);
        applyBlogTheme(themeObj);
        localStorage.setItem(THEME_STORAGE_KEY, themeName);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
