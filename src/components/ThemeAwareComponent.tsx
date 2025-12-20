import { useTheme } from '../hooks/useTheme';

interface ThemeAwareComponentProps {
  children: React.ReactNode;
  className?: string;
  oledClassName?: string;
  emeraldClassName?: string;
  spaceClassName?: string;
  novaClassName?: string;
  lightClassName?: string;
  darkClassName?: string;
  navyClassName?: string;
  coralClassName?: string;
}

export function ThemeAwareComponent({
  children,
  className = '',
  oledClassName = '',
  emeraldClassName = '',
  spaceClassName = '',
  novaClassName = '',
  lightClassName = '',
  darkClassName = '',
  navyClassName = '',
  coralClassName = '',
}: ThemeAwareComponentProps) {
  const { theme } = useTheme();

  const getThemeClasses = () => {
    const baseClasses = className;

    const themeClasses = {
      light: lightClassName,
      dark: darkClassName,
      oled: oledClassName,
      emerald: emeraldClassName,
      space: spaceClassName,
      nova: novaClassName,
      navy: navyClassName,
      coral: coralClassName,
    } as const;

    const classes = [baseClasses];

    if (theme && themeClasses[theme]) {
      classes.push(themeClasses[theme]);
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
  const { theme } = useTheme();

  const getThemeValue = (values: {
    light?: string;
    dark?: string;
    oled?: string;
    emerald?: string;
    space?: string;
    nova?: string;
    navy?: string;
    coral?: string;
  }) => {
    return values[theme] || values.dark || '';
  };

  const getThemeColors = () => {
    switch (theme) {
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
      case 'emerald':
        return {
          bg: 'bg-[#0a1612]',
          card: 'bg-[#0f1f18]',
          text: 'text-emerald-100',
          muted: 'text-emerald-400',
          border: 'border-emerald-700',
          accent: 'bg-emerald-600',
        };
      case 'space':
        return {
          bg: 'bg-[#1c1c1e]',
          card: 'bg-[#2c2c2e]',
          text: 'text-zinc-100',
          muted: 'text-zinc-400',
          border: 'border-zinc-600',
          accent: 'bg-zinc-500',
        };
      case 'nova':
        return {
          bg: 'bg-[#020617]',
          card: 'bg-[#0f172a]',
          text: 'text-sky-100',
          muted: 'text-sky-400',
          border: 'border-sky-700',
          accent: 'bg-sky-600',
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