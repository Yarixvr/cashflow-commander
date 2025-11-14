import { useEffect, useState } from 'react';
import { THEME_ORDER, type ThemeId } from '../lib/themes';

export type Theme = ThemeId;
type ResolvedTheme = Exclude<Theme, 'auto'>;

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const stored = window.localStorage.getItem('theme') as Theme | null;
    return stored ?? 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const stored = window.localStorage.getItem('theme') as Theme | null;
    if (stored === 'auto' || stored === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return stored as ResolvedTheme;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (activeTheme: ResolvedTheme) => {
      root.classList.remove('light', 'dark', 'oled', 'cyber', 'navy', 'coral', 'mint', 'auto');

      if (theme === 'auto') {
        root.classList.add('auto');
      }

      root.classList.add(activeTheme);
      setResolvedTheme(activeTheme);
    };

    if (theme === 'auto') {
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (event: MediaQueryListEvent) => {
        applyTheme(event.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    // Cycle through themes: dark -> light -> oled -> cyber -> auto -> dark
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

  return { theme, resolvedTheme, toggleTheme, setTheme: setThemeDirect };
}
