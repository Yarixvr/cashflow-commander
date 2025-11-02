import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'dark' as const,
      name: 'Dark Mode',
      description: 'Default dark theme with blue accents',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      preview: {
        bg: 'bg-slate-800',
        text: 'text-slate-100',
        border: 'border-slate-700'
      }
    },
    {
      id: 'light' as const,
      name: 'Light Mode',
      description: 'Clean and bright interface',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: 'from-amber-400 to-orange-500',
      preview: {
        bg: 'bg-white',
        text: 'text-slate-900',
        border: 'border-slate-200'
      }
    },
    {
      id: 'oled' as const,
      name: 'Pure Black (OLED)',
      description: 'Perfect for OLED displays - saves battery',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
        </svg>
      ),
      gradient: 'from-gray-900 to-black',
      preview: {
        bg: 'bg-black',
        text: 'text-white',
        border: 'border-gray-800'
      }
    },
    {
      id: 'cyber' as const,
      name: 'Cyber Purple',
      description: 'Futuristic purple/pink aesthetic',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      gradient: 'from-purple-600 to-pink-600',
      preview: {
        bg: 'bg-purple-950',
        text: 'text-purple-100',
        border: 'border-purple-800'
      }
    },
    {
      id: 'auto' as const,
      name: 'Auto',
      description: 'Automatically matches your system preference',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-500',
      preview: {
        bg: 'bg-gradient-to-r from-white to-slate-800',
        text: 'text-black',
        border: 'border-slate-300'
      }
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 shadow-sm hover:shadow-md transition-all-fast btn-animated"
        aria-label="Open theme selector"
      >
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${themes.find(t => t.id === theme)?.gradient || 'from-blue-500 to-blue-600'} flex items-center justify-center text-white`}>
          {themes.find(t => t.id === theme)?.icon}
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-300 hidden sm:inline">
          {themes.find(t => t.id === theme)?.name}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-96 bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 overflow-hidden z-20 animate-scale-in">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100">
                Choose Theme
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400 mt-1">
                Select your preferred color scheme
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700 oled:hover:bg-gray-900 cyber:hover:bg-purple-900 transition-all-fast theme-option ${
                    theme === themeOption.id ? 'bg-blue-50 dark:bg-blue-900/20 oled:bg-blue-900/30 cyber:bg-pink-900/30' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${themeOption.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                    {themeOption.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100">
                        {themeOption.name}
                      </h4>
                      {theme === themeOption.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400 mt-1">
                      {themeOption.description}
                    </p>
                    <div className={`mt-3 h-12 rounded-lg ${themeOption.preview.bg} ${themeOption.preview.border} border-2 flex items-center justify-center`}>
                      <div className={`text-xs font-medium ${themeOption.preview.text}`}>
                        Preview
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Theme stats section */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800">
              <ThemeStats />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400">
                <span>Theme changes are saved automatically</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}