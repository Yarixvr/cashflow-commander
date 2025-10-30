import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function CategoryChart() {
  const expenseBreakdown = useQuery(api.transactions.getCategoryBreakdown, { type: "expense", days: 30 });

  if (!expenseBreakdown) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Spending by Category</h3>
        <p className="text-sm text-slate-500">Last 30 days</p>
      </div>
      <div className="p-6">
        {expenseBreakdown.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-slate-600">No expenses to show</p>
            <p className="text-sm text-slate-500">Add some transactions to see your spending breakdown</p>
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
                      <span className="font-medium text-slate-700">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">${item.amount.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
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
