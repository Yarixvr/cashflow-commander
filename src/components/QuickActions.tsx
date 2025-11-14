import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AddTransactionModal } from "./AddTransactionModal";
import { AddAccountModal } from "./AddAccountModal";
import { AddBudgetModal } from "./AddBudgetModal";

interface QuickActionsProps {
  compact?: boolean;
}

export function QuickActions({ compact = false }: QuickActionsProps) {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const actions = [
    {
      label: "Add Transaction",
      icon: "💳",
      color: "from-blue-500 to-blue-600",
      onClick: () => setShowTransactionModal(true),
    },
    {
      label: "Add Account",
      icon: "🏦",
      color: "from-green-500 to-green-600",
      onClick: () => setShowAccountModal(true),
    },
    {
      label: "Set Budget",
      icon: "🎯",
      color: "from-purple-500 to-purple-600",
      onClick: () => setShowBudgetModal(true),
    },
  ];

  if (compact) {
    return (
      <div className="flex space-x-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`px-4 py-2 bg-gradient-to-r ${action.color} text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2`}
          >
            <span>{action.icon}</span>
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
        <AddTransactionModal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} />
        <AddAccountModal isOpen={showAccountModal} onClose={() => setShowAccountModal(false)} />
        <AddBudgetModal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} />
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-800 navy:border-blue-900 coral:border-[#fda4af] mint:border-emerald-400 bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] cyber:bg-[#241047]/90 navy:bg-[#16213d] coral:bg-[#fff1f2] mint:bg-[#ecfdf5]">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-700 navy:border-blue-800 coral:border-[#fb7185] mint:border-emerald-300">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-800">Quick Actions</h3>
      </div>
      <div className="p-6 space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`w-full p-4 bg-gradient-to-r ${action.color} text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-3`}
          >
            <span className="text-xl">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      <AddTransactionModal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} />
      <AddAccountModal isOpen={showAccountModal} onClose={() => setShowAccountModal(false)} />
      <AddBudgetModal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} />
    </div>
  );
}
