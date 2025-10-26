interface StatsCardsProps {
  totalBalance: number;
  monthlyStats?: {
    income: number;
    expenses: number;
    transactions: any[];
  };
  accounts: any[];
}

export function StatsCards({ totalBalance, monthlyStats, accounts }: StatsCardsProps) {
  const income = monthlyStats?.income || 0;
  const expenses = monthlyStats?.expenses || 0;
  const netFlow = income - expenses;

  const stats = [
    {
      title: "Total Balance",
      value: totalBalance,
      change: null,
      icon: "💰",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Monthly Income",
      value: income,
      change: null,
      icon: "📈",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Monthly Expenses",
      value: expenses,
      change: null,
      icon: "📉",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Net Flow",
      value: netFlow,
      change: null,
      icon: netFlow >= 0 ? "✅" : "⚠️",
      color: netFlow >= 0 ? "from-teal-500 to-teal-600" : "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-slate-800">
              ${Math.abs(stat.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              {stat.value < 0 && <span className="text-red-500 ml-1">-</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
