import { useEffect, useState } from 'react';
import { THEME_ORDER, type ThemeId } from '../lib/themes';

export type Theme = ThemeId;

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const stored = window.localStorage.getItem('theme') as string | null;

    if (!stored || stored === 'auto') {
      return 'dark';
    }

    // Handle legacy themes - convert old themes to new defaults
    if (stored === 'mint' || stored === 'cyber') {
      return 'dark';
    }

    return stored as Theme;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    // Remove all theme classes including legacy ones
    root.classList.remove('light', 'dark', 'oled', 'navy', 'coral', 'emerald', 'space', 'nova', 'mint', 'cyber');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(theme);
    const newTheme = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];

    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', newTheme);
    }
  };

  const setThemeDirect = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', newTheme);
    }
  };

  return { theme, toggleTheme, setTheme: setThemeDirect };
}
