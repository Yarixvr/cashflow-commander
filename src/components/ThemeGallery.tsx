import { useTheme } from '../hooks/useTheme';
import { THEME_OPTIONS } from '../lib/themes';
import { ThemeStats } from './ThemeStats';

export function ThemeGallery() {
  const { theme, setTheme } = useTheme();
  return (
    <section className="space-y-8 auto-animate">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700">
          Personalize
        </p>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900">
          Choose the perfect vibe for every device
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-200 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 max-w-3xl">
          Explore immersive palettes optimized for OLED screens, laptops, and phones. Pick a theme to instantly refresh your experience with buttery smooth transitions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {THEME_OPTIONS.map((themeOption) => {
          const isActive = themeOption.id === theme;
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`relative text-left rounded-2xl border p-6 transition-all-fast focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 card-mobile-hover auto-animate ${
                isActive
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/20 dark:border-blue-400'
                  : 'border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white/90 mint:bg-emerald-900/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300">
                    {isActive ? 'Active' : 'Preview'}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-50 coral:text-[#7f1d1d] mint:text-emerald-900">
                    {themeOption.name}
                  </h3>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${themeOption.gradient} flex items-center justify-center text-white shadow-lg`}> 
                  {themeOption.icon}
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 oled:text-gray-400 cyber:text-purple-200 navy:text-blue-100 coral:text-[#9f1239] mint:text-emerald-800">
                {themeOption.description}
              </p>

              <div className="mt-6 h-16 rounded-xl border-2 overflow-hidden flex items-center justify-center">
                <div className={`w-full h-full ${themeOption.preview.bg} ${themeOption.preview.border} flex items-center justify-center`}> 
                  <span className={`text-xs font-semibold ${themeOption.preview.text}`}>
                    {isActive ? 'In Use' : 'Tap to try'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-animate">
        <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 bg-white/60 dark:bg-slate-900/60 oled:bg-black/60 cyber:bg-purple-900/60 navy:bg-[#0f172a]/80 coral:bg-white/70 mint:bg-emerald-900/20 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-300 oled:text-gray-400 cyber:text-purple-200 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700">
            Theme settings sync instantly across pages. Keyboard shortcuts are available for power users.
          </p>
        </div>
        <ThemeStats />
      </div>
    </section>
  );
}
