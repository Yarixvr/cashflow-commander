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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Budget Overview</h3>
      </div>
      <div className="p-6">
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">No budgets set</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create budgets to track your spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget._id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{budget.category}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{budget.period} budget</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                    </p>
                    <p className={`text-sm ${budget.remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      ${Math.abs(budget.remaining).toFixed(2)} {budget.remaining >= 0 ? "remaining" : "over"}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      budget.percentage > 100 ? "bg-red-500" :
                      budget.percentage > 80 ? "bg-orange-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>
                {detailed && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
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
