import { useTheme } from '../hooks/useTheme';

export function ThemeStats() {
  const { theme } = useTheme();

  const stats = {
    light: {
      battery: 'Standard',
      oled: 'Not Optimized',
      visibility: 'Excellent',
      style: 'Clean & Bright'
    },
    dark: {
      battery: 'Standard',
      oled: 'Not Optimized',
      visibility: 'Good',
      style: 'Professional'
    },
    oled: {
      battery: 'Excellent',
      oled: 'Fully Optimized',
      visibility: 'Perfect',
      style: 'True Black'
    },
    cyber: {
      battery: 'Good',
      oled: 'Partially Optimized',
      visibility: 'Good',
      style: 'Futuristic'
    },
    auto: {
      battery: 'System Dependent',
      oled: 'System Dependent',
      visibility: 'System Dependent',
      style: 'Adaptive'
    }
  };

  const currentStats = stats[theme];

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
            theme === 'oled' ? 'text-green-600 dark:text-green-500' :
            theme === 'light' ? 'text-yellow-600' :
            theme === 'cyber' ? 'text-purple-600' :
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
      </div>
    </div>
  );
}