import { useTheme } from '../hooks/useTheme';
import { getThemeOption, THEME_ORDER } from '../lib/themes';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const themeOption = getThemeOption(theme);
  const nextTheme = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
  const nextThemeOption = getThemeOption(nextTheme);

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-3 rounded-full px-3 py-2 bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-slate-900 coral:bg-white/80 mint:bg-emerald-900/20 border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 transition-all-fast shadow-sm hover:shadow-md group"
      aria-label={`Switch to next theme (currently ${themeOption.name})`}
      title="Cycle to the next theme"
    >
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeOption.gradient} flex items-center justify-center text-white transition-transform group-hover:scale-105`}>
        {themeOption.icon}
      </div>
      <div className="text-left">
        <p className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700">
          Next: {nextThemeOption.name}
        </p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900">
          {themeOption.name}
        </p>
      </div>
    </button>
  );
}
