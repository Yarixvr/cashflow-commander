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
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <nav className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
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
        <div className="space-y-6">
          <StatsCards 
            totalBalance={totalBalance || 0}
            monthlyStats={monthlyStats}
            accounts={accounts || []}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CategoryChart />
              <TransactionList limit={5} showHeader={true} />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <BudgetOverview budgets={budgets || []} />
              <InsightCards insights={insights || []} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Transactions</h2>
            <QuickActions compact={true} />
          </div>
          <TransactionList />
        </div>
      )}

      {activeTab === "budgets" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Budget Management</h2>
          </div>
          <BudgetOverview budgets={budgets || []} detailed={true} />
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Smart Insights</h2>
          </div>
          <InsightCards insights={insights || []} detailed={true} />
        </div>
      )}
    </div>
  );
}
