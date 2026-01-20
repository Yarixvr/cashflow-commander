
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface TransactionListProps {
  limit?: number;
  showHeader?: boolean;
}

export function TransactionList({ limit, showHeader = false }: TransactionListProps) {
  const { t, i18n } = useTranslation();
  const transactions = useQuery(api.transactions.list, { limit });
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);
  const createTransaction = useMutation(api.transactions.create);

  const handleDelete = async (transaction: any) => {
    try {
      // Optimistically delete
      await deleteTransaction({ transactionId: transaction._id });

      toast.success(t('transactions.deleted'), {
        action: {
          label: t('common.undo'),
          onClick: async () => {
            // Restore transaction
            await createTransaction({
              accountId: transaction.accountId,
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              category: transaction.category,
              date: transaction.date,
            });
            toast.success(t('transactions.restored'));
          }
        }
      });
    } catch (error) {
      toast.error(t('common.error'));
      console.error(error);
    }
  };

  if (!transactions) {
    return (
      <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded w-1/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2]">
      {showHeader && (
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-800 coral:border-[#fb7185]">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">{t('transactions.recent')}</h3>
        </div>
      )}
      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800/70 space:bg-zinc-700 nova:bg-sky-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-200 navy:text-blue-200 coral:text-[#be123c]">{t('transactions.empty')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185]">{t('transactions.emptySubtitle')}</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="group flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 hover:bg-slate-50 dark:hover:bg-slate-700 oled:hover:bg-gray-900 emerald:hover:bg-emerald-800/50 space:hover:bg-zinc-700 nova:hover:bg-sky-900/50 navy:hover:bg-[#1c2f57] coral:hover:bg-[#ffe4e6] rounded-lg transition-colors gap-2"
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${transaction.type === "income" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}>
                    {transaction.type === "income" ? "📈" : "📉"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d] truncate">{transaction.description}</p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185]">
                      <span className="truncate">{transaction.category}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="truncate hidden md:inline">{transaction.account?.name}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{new Date(transaction.date).toLocaleDateString(i18n.language)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 ml-auto md:ml-0 w-full md:w-auto mt-2 md:mt-0">
                  <p className={`font-semibold text-base md:text-lg ${transaction.type === "income"
                    ? "text-green-600 dark:text-green-400 oled:text-green-400 emerald:text-emerald-300 space:text-green-400 nova:text-emerald-300 navy:text-emerald-300 coral:text-[#be123c]"
                    : "text-red-600 dark:text-red-400 oled:text-red-400 emerald:text-rose-400 space:text-red-400 nova:text-pink-300 navy:text-red-300 coral:text-[#be123c]"
                    }`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(transaction)}
                    className="opacity-100 md:opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all rounded-full hover:bg-slate-100 dark:hover:bg-slate-600"
                    title={t('common.delete')}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

