import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const accounts = useQuery(api.accounts.list);
  const categories = useQuery(api.categories.list, { type });
  const createTransaction = useMutation(api.transactions.create);
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountId || !amount || !description || !category) {
      toast.error(t('transactions.fillAll'));
      return;
    }

    try {
      const transactionId = await createTransaction({
        accountId: accountId as any,
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date).getTime(),
      });

      toast.success(t('transactions.success'), {
        action: {
          label: t('common.undo'),
          onClick: async () => {
            // Optimistically delete (Undo Add)
            await deleteTransaction({ transactionId });
            toast.success(t('transactions.undone'));
          }
        }
      });
      onClose();

      // Reset form
      setAmount("");
      setDescription("");
      setCategory("");
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      toast.error(t('transactions.error'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t('transactions.add')}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('transactions.type')}</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${type === "expense"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-700"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-transparent"
                  }`}
              >
                📉 {t('transactions.expense')}
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${type === "income"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-700"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-transparent"
                  }`}
              >
                📈 {t('transactions.income')}
              </button>
            </div>
          </div>

          {/* Account Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('transactions.account')}</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">{t('transactions.selectAccount')}</option>
              {accounts?.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.name} (${account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('transactions.amount')}</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('transactions.category')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">{t('transactions.selectCategory')}</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('transactions.description')}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('transactions.enterDescription')}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('transactions.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {t('transactions.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              {t('transactions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
