import { useTheme } from '../hooks/useTheme';

interface ThemeAwareComponentProps {
  children: React.ReactNode;
  className?: string;
  oledClassName?: string;
  cyberClassName?: string;
  lightClassName?: string;
  darkClassName?: string;
  autoClassName?: string;
  navyClassName?: string;
  coralClassName?: string;
  mintClassName?: string;
}

export function ThemeAwareComponent({
  children,
  className = '',
  oledClassName = '',
  cyberClassName = '',
  lightClassName = '',
  darkClassName = '',
  autoClassName = '',
  navyClassName = '',
  coralClassName = '',
  mintClassName = '',
}: ThemeAwareComponentProps) {
  const { theme, resolvedTheme } = useTheme();

  const getThemeClasses = () => {
    const baseClasses = className;
    const activeTheme = theme === 'auto' ? resolvedTheme : theme;

    const themeClasses = {
      light: lightClassName,
      dark: darkClassName,
      oled: oledClassName,
      cyber: cyberClassName,
      navy: navyClassName,
      coral: coralClassName,
      mint: mintClassName,
    } as const;

    const classes = [baseClasses];

    if (theme === 'auto' && autoClassName) {
      classes.push(autoClassName);
    }

    if (activeTheme && themeClasses[activeTheme]) {
      classes.push(themeClasses[activeTheme]);
    }

    return classes.join(' ').trim();
  };

  return (
    <div className={getThemeClasses()}>
      {children}
    </div>
  );
}

// Hook for getting theme-specific values
export function useThemeValues() {
  const { theme, resolvedTheme } = useTheme();

  const getThemeValue = (values: {
    light?: string;
    dark?: string;
    oled?: string;
    cyber?: string;
    auto?: string;
    navy?: string;
    coral?: string;
    mint?: string;
  }) => {
    if (theme === 'auto') {
      return values.auto || values[resolvedTheme] || values.dark || '';
    }

    return values[theme] || values.dark || '';
  };

  const getThemeColors = () => {
    const activeTheme = theme === 'auto' ? resolvedTheme : theme;

    switch (activeTheme) {
      case 'light':
        return {
          bg: 'bg-white',
          card: 'bg-slate-50',
          text: 'text-slate-900',
          muted: 'text-slate-600',
          border: 'border-slate-200',
          accent: 'bg-blue-500',
        };
      case 'dark':
        return {
          bg: 'bg-slate-800',
          card: 'bg-slate-900',
          text: 'text-slate-100',
          muted: 'text-slate-400',
          border: 'border-slate-700',
          accent: 'bg-blue-500',
        };
      case 'oled':
        return {
          bg: 'bg-black',
          card: 'bg-gray-900',
          text: 'text-white',
          muted: 'text-gray-400',
          border: 'border-gray-800',
          accent: 'bg-blue-600',
        };
      case 'cyber':
        return {
          bg: 'bg-purple-950',
          card: 'bg-purple-900',
          text: 'text-purple-100',
          muted: 'text-purple-400',
          border: 'border-purple-800',
          accent: 'bg-pink-500',
        };
      case 'navy':
        return {
          bg: 'bg-[#0f172a]',
          card: 'bg-[#1e3a8a]',
          text: 'text-blue-100',
          muted: 'text-blue-200',
          border: 'border-blue-900',
          accent: 'bg-blue-500',
        };
      case 'coral':
        return {
          bg: 'bg-[#ffe4e6]',
          card: 'bg-[#fb7185]',
          text: 'text-[#7f1d1d]',
          muted: 'text-[#9f1239]',
          border: 'border-[#fb7185]',
          accent: 'bg-[#f97316]',
        };
      case 'mint':
        return {
          bg: 'bg-[#d1fae5]',
          card: 'bg-[#34d399]',
          text: 'text-[#065f46]',
          muted: 'text-[#047857]',
          border: 'border-[#0d9488]',
          accent: 'bg-[#059669]',
        };
      default:
        return {
          bg: 'bg-slate-800',
          card: 'bg-slate-900',
          text: 'text-slate-100',
          muted: 'text-slate-400',
          border: 'border-slate-700',
          accent: 'bg-blue-500',
        };
    }
  };

  return { theme, getThemeValue, getThemeColors };
}