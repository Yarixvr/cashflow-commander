import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'oled':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
          </svg>
        );
      case 'cyber':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'auto':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'oled': return 'Pure Black (OLED)';
      case 'cyber': return 'Cyber Purple';
      case 'auto': return 'Auto';
      default: return 'Unknown';
    }
  };

  const getThemeGradient = () => {
    switch (theme) {
      case 'light': return 'from-amber-400 to-orange-500';
      case 'dark': return 'from-blue-500 to-blue-600';
      case 'oled': return 'from-gray-900 to-black';
      case 'cyber': return 'from-purple-600 to-pink-600';
      case 'auto': return 'from-indigo-500 to-purple-500';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 overflow-hidden group"
      aria-label={`Switch to next theme (currently ${getThemeLabel()})`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${getThemeGradient()} transition-all duration-300`}
      />

      {/* Icon container */}
      <div className="absolute inset-0 flex items-center justify-center p-1">
        <div className="relative w-6 h-6 text-white flex items-center justify-center transition-all duration-200">
          <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:scale-110 transition-transform duration-200">
            {getThemeIcon()}
          </div>
        </div>
      </div>

      {/* Slide effect indicator */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300"
        style={{
          left: theme === 'light' ? '2px' :
               theme === 'dark' ? '24px' :
               theme === 'oled' ? '46px' :
               theme === 'cyber' ? '68px' : '90px'
        }}
      />
    </button>
  );
}