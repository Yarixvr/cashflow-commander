import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface TransactionListProps {
  limit?: number;
  showHeader?: boolean;
}

export function TransactionList({ limit, showHeader = false }: TransactionListProps) {
  const transactions = useQuery(api.transactions.list, { limit });

  if (!transactions) {
    return (
      <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-800 navy:border-blue-900 coral:border-[#fda4af] mint:border-emerald-400 bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] cyber:bg-[#241047]/90 navy:bg-[#16213d] coral:bg-[#fff1f2] mint:bg-[#ecfdf5] p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 cyber:bg-purple-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] mint:bg-[#bbf7d0] rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 cyber:bg-purple-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] mint:bg-[#bbf7d0] rounded w-1/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 cyber:bg-purple-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] mint:bg-[#bbf7d0] rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 cyber:bg-purple-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] mint:bg-[#bbf7d0] rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-800 navy:border-blue-900 coral:border-[#fda4af] mint:border-emerald-400 bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] cyber:bg-[#241047]/90 navy:bg-[#16213d] coral:bg-[#fff1f2] mint:bg-[#ecfdf5]">
      {showHeader && (
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-700 navy:border-blue-800 coral:border-[#fb7185] mint:border-emerald-300">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-800">Recent Transactions</h3>
        </div>
      )}
      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 oled:bg-gray-800 cyber:bg-purple-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] mint:bg-[#bbf7d0] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-700">No transactions yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 cyber:text-purple-300 navy:text-blue-300 coral:text-[#fb7185] mint:text-emerald-600">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 oled:hover:bg-gray-900 cyber:hover:bg-[#2f155b] navy:hover:bg-[#1c2f57] coral:hover:bg-[#ffe4e6] mint:hover:bg-[#d1fae5]/70 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === "income" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}>
                    {transaction.type === "income" ? "📈" : "📉"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100 oled:text-gray-100 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-800">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 cyber:text-purple-300 navy:text-blue-300 coral:text-[#fb7185] mint:text-emerald-600">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{transaction.account?.name}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400 oled:text-green-400 cyber:text-emerald-300 navy:text-emerald-300 coral:text-[#be123c] mint:text-emerald-700"
                      : "text-red-600 dark:text-red-400 oled:text-red-400 cyber:text-pink-300 navy:text-red-300 coral:text-[#be123c] mint:text-rose-500"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
