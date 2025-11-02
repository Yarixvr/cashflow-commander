import { useEffect } from 'react';
import { useTheme, Theme } from './useTheme';

export function useThemeShortcuts() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T for quick theme cycling
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        const themeOrder: Theme[] = ['dark', 'light', 'oled', 'cyber', 'auto'];
        const currentIndex = themeOrder.indexOf(theme);
        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
        setTheme(nextTheme);
      }

      // Ctrl/Cmd + Shift + D for toggle between dark and light
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setTheme(theme === 'dark' || theme === 'oled' || theme === 'cyber' ? 'light' : 'dark');
      }

      // Ctrl/Cmd + Shift + O for OLED theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'O') {
        event.preventDefault();
        setTheme('oled');
      }

      // Ctrl/Cmd + Shift + C for Cyber theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        setTheme('cyber');
      }

      // Ctrl/Cmd + Shift + A for Auto theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setTheme('auto');
      }

      // Ctrl/Cmd + Shift + L for Light theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setTheme('light');
      }

      // Ctrl/Cmd + Shift + N for Dark theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        setTheme('dark');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [theme, setTheme]);

  // Return keyboard shortcuts info for help modal
  const shortcuts = [
    { keys: 'Ctrl+Shift+T', description: 'Cycle through all themes' },
    { keys: 'Ctrl+Shift+D', description: 'Toggle Dark/Light mode' },
    { keys: 'Ctrl+Shift+O', description: 'Pure Black OLED theme' },
    { keys: 'Ctrl+Shift+C', description: 'Cyber Purple theme' },
    { keys: 'Ctrl+Shift+A', description: 'Auto (system preference)' },
    { keys: 'Ctrl+Shift+L', description: 'Light mode' },
    { keys: 'Ctrl+Shift+N', description: 'Dark mode' },
  ];

  return { shortcuts };
}