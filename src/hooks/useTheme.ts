import { useEffect, useState } from 'react';
import { THEME_ORDER, type ThemeId } from '../lib/themes';

export type Theme = ThemeId;

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const stored = window.localStorage.getItem('theme') as Theme | 'auto' | null;

    if (!stored || stored === 'auto') {
      return 'dark';
    }

    return stored;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'oled', 'cyber', 'navy', 'coral', 'mint');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    // Cycle through themes: dark -> light -> oled -> cyber -> navy -> coral -> mint -> dark
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
