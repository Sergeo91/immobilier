'use client';

/**
 * Theme Context - DaisyUI dark/luxury/business/corporate/coffee/cyberpunk
 * Switch instantané, localStorage, mode système
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

const THEMES = ['dark', 'light', 'luxury', 'business', 'corporate', 'coffee', 'cyberpunk', 'highcontrast'] as const;
type Theme = (typeof THEMES)[number];

interface ThemeContextType {
  theme: Theme | 'system';
  setTheme: (t: Theme | 'system') => void;
  resolvedTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme | 'system'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as Theme | 'system') || 'dark';
  });
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    let resolved: Theme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    setResolvedTheme(resolved);
    root.setAttribute('data-theme', resolved);
  }, [theme]);

  const setTheme = (t: Theme | 'system') => {
    setThemeState(t);
    if (typeof window !== 'undefined') localStorage.setItem('theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
