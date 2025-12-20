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
      className="relative flex items-center gap-3 rounded-full px-3 py-2 bg-white dark:bg-slate-800 oled:bg-black emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-slate-900 coral:bg-white/80 border border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-800 navy:border-blue-900 coral:border-pink-200 transition-all-fast shadow-sm hover:shadow-md group"
      aria-label={`Switch to next theme (currently ${themeOption.name})`}
      title="Cycle to the next theme"
    >
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeOption.gradient} flex items-center justify-center text-white transition-transform group-hover:scale-105`}>
        {themeOption.icon}
      </div>
      <div className="text-left">
        <p className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 navy:text-blue-200 coral:text-[#9f1239]">
          Next: {nextThemeOption.name}
        </p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
          {themeOption.name}
        </p>
      </div>
    </button>
  );
}
