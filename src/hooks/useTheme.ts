import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'oled' | 'cyber' | 'auto';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      return stored;
    }

    // Default to dark theme for new users
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'oled', 'cyber', 'auto');

    // Add the appropriate theme class
    if (theme === 'auto') {
      // Check system preference for auto mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    // Cycle through themes: dark -> light -> oled -> cyber -> auto -> dark
    const themeOrder: Theme[] = ['dark', 'light', 'oled', 'cyber', 'auto'];
    const currentIndex = themeOrder.indexOf(theme);
    const newTheme = themeOrder[(currentIndex + 1) % themeOrder.length];

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setThemeDirect = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme, setTheme: setThemeDirect };
}
