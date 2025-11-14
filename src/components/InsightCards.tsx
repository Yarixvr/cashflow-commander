import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Insight {
  _id: string;
  type: string;
  title: string;
  description: string;
  data: any;
  createdAt: number;
  isRead: boolean;
}

interface InsightCardsProps {
  insights: Insight[];
  detailed?: boolean;
}

export function InsightCards({ insights, detailed = false }: InsightCardsProps) {
  const markAsRead = useMutation(api.insights.markAsRead);
  const generateInsights = useAction(api.insights.generateInsights);

  const handleMarkAsRead = async (insightId: string) => {
    await markAsRead({ id: insightId as any });
  };

  const handleGenerateInsights = async () => {
    await generateInsights();
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "spending_trend": return "📈";
      case "top_category": return "🏆";
      case "savings_opportunity": return "💡";
      default: return "ℹ️";
    }
  };

  return (
    <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-800 navy:border-blue-900 coral:border-[#fda4af] mint:border-emerald-400 bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] cyber:bg-[#241047]/90 navy:bg-[#16213d] coral:bg-[#fff1f2] mint:bg-[#ecfdf5]">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-700 navy:border-blue-800 coral:border-[#fb7185] mint:border-emerald-300 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-800">Smart Insights</h3>
        <button
          onClick={handleGenerateInsights}
          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 oled:bg-blue-900/40 cyber:bg-pink-500/20 navy:bg-blue-900/40 coral:bg-[#fecdd3] mint:bg-emerald-200/40 text-blue-600 dark:text-blue-400 oled:text-blue-300 cyber:text-pink-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-700 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 oled:hover:bg-blue-900/60 cyber:hover:bg-pink-500/30 navy:hover:bg-blue-900/60 coral:hover:bg-[#fbcfe8] mint:hover:bg-emerald-200/60 transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="p-6">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 oled:bg-gray-800 cyber:bg-purple-800/70 navy:bg-[#1d4ed8]/40 coral:bg-[#fecdd3] mint:bg-[#bbf7d0] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-700">No insights available</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-500 cyber:text-purple-300 navy:text-blue-300 coral:text-[#fb7185] mint:text-emerald-600 mb-4">Add some transactions to get personalized insights</p>
            <button
              onClick={handleGenerateInsights}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 oled:bg-blue-600 cyber:bg-pink-500 navy:bg-blue-600 coral:bg-[#fb7185] mint:bg-emerald-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 oled:hover:bg-blue-700 cyber:hover:bg-pink-600 navy:hover:bg-blue-700 coral:hover:bg-[#f97316] mint:hover:bg-emerald-600 transition-colors"
            >
              Generate Insights
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.slice(0, detailed ? undefined : 3).map((insight) => (
              <div
                key={insight._id}
                className={`p-4 rounded-lg border transition-all ${
                  insight.isRead
                    ? "bg-slate-50 dark:bg-slate-700/50 oled:bg-gray-900 cyber:bg-[#2f155b]/70 navy:bg-[#1c2f57] coral:bg-[#ffe4e6] mint:bg-[#d1fae5]/70 border-slate-200 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-800 coral:border-[#fda4af] mint:border-emerald-300"
                    : "bg-blue-50 dark:bg-blue-900/20 oled:bg-blue-900/30 cyber:bg-pink-500/20 navy:bg-blue-900/40 coral:bg-[#fecdd3] mint:bg-emerald-200/40 border-blue-200 dark:border-blue-700 oled:border-blue-800 cyber:border-pink-500 navy:border-blue-700 coral:border-[#fb7185] mint:border-emerald-400"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-800 mb-1">{insight.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-700 mb-2">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-500 cyber:text-purple-300 navy:text-blue-300 coral:text-[#fb7185] mint:text-emerald-600">
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </span>
                      {!insight.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(insight._id)}
                          className="text-xs text-blue-600 dark:text-blue-400 oled:text-blue-300 cyber:text-pink-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-700 hover:text-blue-800 dark:hover:text-blue-300 oled:hover:text-blue-200 cyber:hover:text-pink-100 navy:hover:text-blue-100 coral:hover:text-[#9f1239] mint:hover:text-emerald-600 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
