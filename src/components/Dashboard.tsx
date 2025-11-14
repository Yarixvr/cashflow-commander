import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StatsCards } from "./StatsCards";
import { TransactionList } from "./TransactionList";
import { BudgetOverview } from "./BudgetOverview";
import { CategoryChart } from "./CategoryChart";
import { QuickActions } from "./QuickActions";
import { InsightCards } from "./InsightCards";
import { useState } from "react";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const accounts = useQuery(api.accounts.list);
  const totalBalance = useQuery(api.accounts.getTotalBalance);
  const monthlyStats = useQuery(api.transactions.getMonthlyStats, {});
  const budgets = useQuery(api.budgets.list);
  const insights = useQuery(api.insights.list);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "transactions", label: "Transactions", icon: "💳" },
    { id: "budgets", label: "Budgets", icon: "🎯" },
    { id: "insights", label: "Insights", icon: "💡" },
  ];

  return (
    <div className="space-y-6 auto-animate">
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white/90 mint:bg-emerald-900/10 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 p-1 transition-all-fast auto-animate">
        <nav className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all-fast hover:scale-105 active:scale-95 ${
                activeTab === tab.id
                  ? "bg-blue-600 dark:bg-blue-500 oled:bg-blue-600 cyber:bg-pink-500 text-white shadow-sm animate-pulse-glow"
                  : "text-slate-600 dark:text-slate-300 oled:text-gray-400 cyber:text-purple-400 hover:text-slate-800 dark:hover:text-slate-100 oled:hover:text-white cyber:hover:text-purple-200 hover:bg-slate-50 dark:hover:bg-slate-700 oled:hover:bg-gray-900 cyber:hover:bg-purple-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6 auto-animate">
          <StatsCards
            totalBalance={totalBalance || 0}
            monthlyStats={monthlyStats}
            accounts={accounts || []}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-animate">
            <div className="lg:col-span-2 space-y-6 auto-animate">
              <CategoryChart />
              <TransactionList limit={5} showHeader={true} />
            </div>
            <div className="space-y-6 auto-animate">
              <QuickActions />
              <BudgetOverview budgets={budgets || []} />
              <InsightCards insights={insights || []} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-6 auto-animate">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 transition-all-fast">Transactions</h2>
            <QuickActions compact={true} />
          </div>
          <TransactionList />
        </div>
      )}

      {activeTab === "budgets" && (
        <div className="space-y-6 auto-animate">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 transition-all-fast">Budget Management</h2>
          </div>
          <BudgetOverview budgets={budgets || []} detailed={true} />
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6 auto-animate">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 transition-all-fast">Smart Insights</h2>
          </div>
          <InsightCards insights={insights || []} detailed={true} />
        </div>
      )}
    </div>
  );
}
