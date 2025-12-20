import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';
import { THEME_OPTIONS, getThemeOption } from '../lib/themes';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const activeTheme = getThemeOption(theme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 oled:bg-black emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] border border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-800 shadow-sm hover:shadow-md transition-all-fast btn-animated"
        aria-label="Open theme selector"
      >
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${activeTheme.gradient} flex items-center justify-center text-white`}>
          {activeTheme.icon}
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-300 hidden sm:inline">
          {activeTheme.name}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
          <div className="absolute right-0 top-12 w-96 bg-white dark:bg-slate-800 oled:bg-black emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-800 overflow-hidden z-20 animate-scale-in">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100">
                Choose Theme
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 mt-1">
                Select your preferred color scheme
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {THEME_OPTIONS.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700 oled:hover:bg-gray-900 emerald:hover:bg-emerald-800/50 space:hover:bg-zinc-700 nova:hover:bg-sky-900/50 transition-all-fast theme-option ${theme === themeOption.id ? 'bg-blue-50 dark:bg-blue-900/20 oled:bg-blue-900/30 emerald:bg-emerald-700/30 space:bg-zinc-600/30 nova:bg-sky-800/30' : ''
                    }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${themeOption.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                    {themeOption.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100">
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
                    <p className="text-sm text-slate-600 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 mt-1">
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


            <div className="p-4 border-t border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400">
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