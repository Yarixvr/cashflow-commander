import { useState } from "react";
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

type InsightType =
  | "spending_pattern"
  | "biggest_expense"
  | "savings_opportunity"
  | "category_breakdown"
  | "trend_detection"
  | "recommendation";

const INSIGHT_TYPE_MAP: Record<string, InsightType> = {
  spending_trend: "spending_pattern",
  top_category: "biggest_expense",
  savings_opportunity: "savings_opportunity",
  category_breakdown: "category_breakdown",
  trend_detection: "trend_detection",
  recommendation: "recommendation",
};

interface InsightConfig {
  title: string;
  icon: string;
  badge: string;
  badgeClassName: string;
  accentClassName: string;
}

const INSIGHT_CONFIG: Record<InsightType, InsightConfig> = {
  spending_pattern: {
    title: "Spending Pattern Insight",
    icon: "📊",
    badge: "Stats",
    badgeClassName:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    accentClassName:
      "bg-blue-50 dark:bg-blue-900/30 oled:bg-blue-900/30 cyber:bg-pink-500/20 navy:bg-blue-900/40 coral:bg-[#fecdd3] mint:bg-emerald-200/40",
  },
  biggest_expense: {
    title: "Biggest Expense Insight",
    icon: "🔍",
    badge: "Analysis",
    badgeClassName:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-200",
    accentClassName:
      "bg-purple-50 dark:bg-purple-900/30 oled:bg-purple-900/30 cyber:bg-[#f472b6]/20 navy:bg-blue-900/40 coral:bg-[#fbcfe8] mint:bg-emerald-200/40",
  },
  savings_opportunity: {
    title: "Savings Opportunity Insight",
    icon: "💡",
    badge: "Advice",
    badgeClassName:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200",
    accentClassName:
      "bg-emerald-50 dark:bg-emerald-900/20 oled:bg-emerald-900/30 cyber:bg-[#34d399]/20 navy:bg-blue-900/40 coral:bg-[#bbf7d0] mint:bg-emerald-200/50",
  },
  category_breakdown: {
    title: "Category Breakdown Insight",
    icon: "📊",
    badge: "Stats",
    badgeClassName:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    accentClassName:
      "bg-blue-50 dark:bg-blue-900/30 oled:bg-blue-900/30 cyber:bg-[#38bdf8]/20 navy:bg-blue-900/40 coral:bg-[#bae6fd] mint:bg-emerald-200/40",
  },
  trend_detection: {
    title: "Trend Detection Insight",
    icon: "⚠️",
    badge: "Warning",
    badgeClassName:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200",
    accentClassName:
      "bg-amber-50 dark:bg-amber-900/20 oled:bg-amber-900/30 cyber:bg-[#fbbf24]/20 navy:bg-blue-900/40 coral:bg-[#fde68a] mint:bg-emerald-100/40",
  },
  recommendation: {
    title: "Recommendation Insight",
    icon: "🧠",
    badge: "Smart tip",
    badgeClassName:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200",
    accentClassName:
      "bg-indigo-50 dark:bg-indigo-900/30 oled:bg-indigo-900/30 cyber:bg-[#c084fc]/20 navy:bg-blue-900/40 coral:bg-[#ddd6fe] mint:bg-emerald-200/40",
  },
};

export function InsightCards({ insights, detailed = false }: InsightCardsProps) {
  const markAsRead = useMutation(api.insights.markAsRead);
  const generateInsights = useAction(api.insights.generateInsights);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMarkAsRead = async (insightId: string) => {
    if (!insightId) return;
    await markAsRead({ id: insightId as any });
  };

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      await generateInsights();
    } finally {
      setIsGenerating(false);
    }
  };

  type EnrichedInsight = Insight & {
    normalizedType?: InsightType;
    config?: InsightConfig;
  };

  const normalizeType = (type: string): InsightType | undefined => {
    if (type in INSIGHT_CONFIG) {
      return type as InsightType;
    }

    return INSIGHT_TYPE_MAP[type];
  };

  const normalizedInsights: EnrichedInsight[] = insights
    .map((insight) => {
      const normalized = normalizeType(insight.type);
      const config = normalized ? INSIGHT_CONFIG[normalized] : undefined;

      return {
        ...insight,
        normalizedType: normalized,
        config,
        title: insight.title || config?.title || "Insight",
      };
    })
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const insightsToDisplay = detailed
    ? normalizedInsights
    : normalizedInsights.slice(0, 6);

  return (
    <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-800 navy:border-blue-900 coral:border-[#fda4af] mint:border-emerald-400 bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] cyber:bg-[#241047]/90 navy:bg-[#16213d] coral:bg-[#fff1f2] mint:bg-[#ecfdf5]">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-700 navy:border-blue-800 coral:border-[#fb7185] mint:border-emerald-300 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-800">Smart Insights</h3>
        <button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 oled:bg-blue-900/40 cyber:bg-pink-500/20 navy:bg-blue-900/40 coral:bg-[#fecdd3] mint:bg-emerald-200/40 text-blue-600 dark:text-blue-400 oled:text-blue-300 cyber:text-pink-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-700 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 oled:hover:bg-blue-900/60 cyber:hover:bg-pink-500/30 navy:hover:bg-blue-900/60 coral:hover:bg-[#fbcfe8] mint:hover:bg-emerald-200/60 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? "Generating..." : "Generate insights"}
        </button>
      </div>
      <div className="p-6">
        {insightsToDisplay.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {insightsToDisplay.map((insight) => {
              const resolvedConfig =
                insight.config ||
                (insight.normalizedType
                  ? INSIGHT_CONFIG[insight.normalizedType]
                  : undefined);

              const accentClassName = resolvedConfig?.accentClassName ??
                "bg-slate-50 dark:bg-slate-700/50 oled:bg-gray-900 cyber:bg-[#2f155b]/70 navy:bg-[#1c2f57] coral:bg-[#ffe4e6] mint:bg-[#d1fae5]/70";

              const unreadHighlight = insight.isRead
                ? ""
                : "ring-2 ring-blue-400/60 dark:ring-blue-400/40";

              return (
                <div
                  key={insight._id}
                  className={`group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-800 coral:border-[#fda4af] mint:border-emerald-300 transition-all hover:-translate-y-1 hover:shadow-lg ${accentClassName} ${unreadHighlight}`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 dark:bg-black/10" />
                  <div className="relative flex h-full flex-col space-y-3 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-2xl shadow-inner dark:bg-black/30">
                        {resolvedConfig?.icon ?? "ℹ️"}
                      </div>
                      {resolvedConfig && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${resolvedConfig.badgeClassName}`}
                        >
                          {resolvedConfig.badge}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-800">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-700">
                        {insight.description}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 oled:text-gray-500 cyber:text-purple-300 navy:text-blue-300 coral:text-[#fb7185] mint:text-emerald-600">
                      <span>
                        {insight.createdAt
                          ? new Date(insight.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                      {!insight.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(insight._id)}
                          className="font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 oled:text-blue-300 oled:hover:text-blue-200 cyber:text-pink-200 cyber:hover:text-pink-100 navy:text-blue-200 navy:hover:text-blue-100 coral:text-[#be123c] coral:hover:text-[#9f1239] mint:text-emerald-700 mint:hover:text-emerald-600"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center dark:border-slate-600 dark:bg-slate-900/40 oled:border-gray-700 oled:bg-gray-900/40 cyber:border-purple-700/60 cyber:bg-[#2f155b]/40 navy:border-blue-800 navy:bg-[#1c2f57]/40 coral:border-[#fda4af] coral:bg-[#ffe4e6] mint:border-emerald-300 mint:bg-[#d1fae5]/70">
            <span className="text-3xl">🧠</span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-700">
                No insights yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-200 navy:text-blue-200 coral:text-[#be123c] mint:text-emerald-600">
                Click "Generate insights" to analyze your latest transactions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
