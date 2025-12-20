interface Budget {
  _id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: string;
}

interface BudgetOverviewProps {
  budgets: Budget[];
  detailed?: boolean;
}

export function BudgetOverview({ budgets, detailed = false }: BudgetOverviewProps) {
  return (
    <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2]">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-800 coral:border-[#fb7185]">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">Budget Overview</h3>
      </div>
      <div className="p-6">
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-200 navy:text-blue-200 coral:text-[#be123c]">No budgets set</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185]">Create budgets to track your spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget._id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">{budget.category}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185] capitalize">{budget.period} budget</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                      ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                    </p>
                    <p className={`text-sm ${budget.remaining >= 0 ? "text-green-600 dark:text-green-400 oled:text-green-400 emerald:text-emerald-300 space:text-green-400 nova:text-emerald-300 navy:text-emerald-300 coral:text-[#be123c]" : "text-red-600 dark:text-red-400 oled:text-red-400 emerald:text-rose-400 space:text-red-400 nova:text-pink-300 navy:text-red-300 coral:text-[#be123c]"}`}>
                      ${Math.abs(budget.remaining).toFixed(2)} {budget.remaining >= 0 ? "remaining" : "over"}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${budget.percentage > 100 ? "bg-red-500" :
                        budget.percentage > 80 ? "bg-orange-500" : "bg-green-500"
                      }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>
                {detailed && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185]">
                    {budget.percentage.toFixed(1)}% of budget used
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
