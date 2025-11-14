import { useTheme } from '../hooks/useTheme';
import { getThemeOption } from '../lib/themes';

export function ThemeStats() {
  const { theme, resolvedTheme } = useTheme();
  const themeOption = getThemeOption(theme);

  const currentStats = themeOption.stats;

  return (
    <div className="bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 p-4 transition-all-fast">
      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 mb-3">
        Theme Characteristics
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400">
            Battery Usage
          </span>
          <span className={`text-xs font-medium ${
            currentStats.battery === 'Excellent' ? 'text-green-600 dark:text-green-500' :
            currentStats.battery === 'Good' ? 'text-blue-600' :
            currentStats.battery === 'Standard' ? 'text-yellow-600' :
            currentStats.battery === 'System Dependent' ? 'text-slate-500 dark:text-slate-400' :
            'text-blue-600'
          }`}>
            {currentStats.battery}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400">
            OLED Support
          </span>
          <span className={`text-xs font-medium ${
            currentStats.oled === 'Fully Optimized' ? 'text-green-600 dark:text-green-500' :
            currentStats.oled === 'Partially Optimized' ? 'text-yellow-600' :
            currentStats.oled === 'System Dependent' ? 'text-slate-500 dark:text-slate-400' :
            'text-gray-600'
          }`}>
            {currentStats.oled}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400">
            Visibility
          </span>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-500">
            {currentStats.visibility}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400">
            Style
          </span>
          <span className="text-xs font-medium text-purple-600 dark:text-purple-500">
            {currentStats.style}
          </span>
        </div>
        {theme === 'auto' && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-600 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400">
              System preference
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-100">
              {resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}