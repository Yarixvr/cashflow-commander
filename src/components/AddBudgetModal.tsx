import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBudgetModal({ isOpen, onClose }: AddBudgetModalProps) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"monthly" | "weekly" | "yearly">("monthly");

  const categories = useQuery(api.categories.list, { type: "expense" });
  const createBudget = useMutation(api.budgets.create);

  const periods = [
    { value: "weekly", label: "Weekly", icon: "📅" },
    { value: "monthly", label: "Monthly", icon: "🗓️" },
    { value: "yearly", label: "Yearly", icon: "📆" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createBudget({
        category,
        amount: parseFloat(amount),
        period,
      });
      
      toast.success("Budget created successfully");
      onClose();
      
      // Reset form
      setCategory("");
      setAmount("");
      setPeriod("monthly");
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Set Budget</h2>
            <button
              onClick={onClose}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              required
            >
              <option value="">Select a category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Budget Period</label>
            <div className="grid grid-cols-3 gap-2">
              {periods.map((periodOption) => (
                <button
                  key={periodOption.value}
                  type="button"
                  onClick={() => setPeriod(periodOption.value as any)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    period === periodOption.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 dark:text-slate-300"
                  }`}
                >
                  <div className="text-lg mb-1">{periodOption.icon}</div>
                  <div className="text-sm font-medium">{periodOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Budget Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="0.00"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Create Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
