import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function CategoryChart() {
  const expenseBreakdown = useQuery(api.transactions.getCategoryBreakdown, { type: "expense", days: 30 });

  if (!expenseBreakdown) {
    return (
      <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/50 coral:bg-[#fecdd3] rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/50 coral:bg-[#fecdd3] rounded"></div>
                <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/50 coral:bg-[#fecdd3] rounded"></div>
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/50 coral:bg-[#fecdd3] rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const total = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6B7280"
  ];

  return (
    <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2]">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-800 coral:border-[#fb7185]">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">Spending by Category</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 navy:text-blue-200 coral:text-[#be123c]">Last 30 days</p>
      </div>
      <div className="p-6">
        {expenseBreakdown.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-200 navy:text-blue-200 coral:text-[#be123c]">No expenses to show</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185]">Add some transactions to see your spending breakdown</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenseBreakdown.slice(0, 6).map((item, index) => {
              const percentage = total > 0 ? (item.amount / total) * 100 : 0;
              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="font-medium text-slate-700 dark:text-slate-200 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">${item.amount.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185]">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index % colors.length]
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
