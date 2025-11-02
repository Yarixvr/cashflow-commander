import { useTheme } from '../hooks/useTheme';

interface ThemeAwareComponentProps {
  children: React.ReactNode;
  className?: string;
  oledClassName?: string;
  cyberClassName?: string;
  lightClassName?: string;
  darkClassName?: string;
  autoClassName?: string;
}

export function ThemeAwareComponent({
  children,
  className = '',
  oledClassName = '',
  cyberClassName = '',
  lightClassName = '',
  darkClassName = '',
  autoClassName = '',
}: ThemeAwareComponentProps) {
  const { theme } = useTheme();

  const getThemeClasses = () => {
    const baseClasses = className;
    const themeClasses = {
      light: lightClassName,
      dark: darkClassName,
      oled: oledClassName,
      cyber: cyberClassName,
      auto: autoClassName,
    };

    return `${baseClasses} ${themeClasses[theme] || ''}`;
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
    cyber?: string;
    auto?: string;
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
      case 'cyber':
        return {
          bg: 'bg-purple-950',
          card: 'bg-purple-900',
          text: 'text-purple-100',
          muted: 'text-purple-400',
          border: 'border-purple-800',
          accent: 'bg-pink-500',
        };
      case 'auto':
        return {
          bg: 'bg-auto',
          card: 'bg-auto',
          text: 'text-auto',
          muted: 'text-auto',
          border: 'border-auto',
          accent: 'bg-auto',
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