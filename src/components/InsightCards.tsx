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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Smart Insights</h3>
        <button
          onClick={handleGenerateInsights}
          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="p-6">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">No insights available</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add some transactions to get personalized insights</p>
            <button
              onClick={handleGenerateInsights}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
                    ? "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{insight.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </span>
                      {!insight.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(insight._id)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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
