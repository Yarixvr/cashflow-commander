interface StatsCardsProps {
  totalBalance: number;
  monthlyStats?: {
    income: number;
    expenses: number;
    transactions: any[];
  };
  accounts: any[];
}

import { useTranslation } from "react-i18next";

export function StatsCards({ totalBalance, monthlyStats, accounts }: StatsCardsProps) {
  const { t } = useTranslation();
  const income = monthlyStats?.income || 0;
  const expenses = monthlyStats?.expenses || 0;
  const netFlow = income - expenses;

  const stats = [
    {
      title: t('stats.totalBalance'),
      value: totalBalance,
      change: null,
      icon: "💰",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: t('stats.monthlyIncome'),
      value: income,
      change: null,
      icon: "📈",
      color: "from-green-500 to-green-600",
    },
    {
      title: t('stats.monthlyExpenses'),
      value: expenses,
      change: null,
      icon: "📉",
      color: "from-red-500 to-red-600",
    },
    {
      title: t('stats.netFlow'),
      value: netFlow,
      change: null,
      icon: netFlow >= 0 ? "✅" : "⚠️",
      color: netFlow >= 0 ? "from-teal-500 to-teal-600" : "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stats-card desktop-hover-lift rounded-xl shadow-md bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-4 md:p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-lg md:text-xl`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-300 navy:text-blue-200 coral:text-[#be123c] mb-1 truncate">
              {stat.title}
            </p>
            <p className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d] truncate">
              ${Math.abs(stat.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              {stat.value < 0 && <span className="text-red-500 ml-1">-</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
