import { useEffect, useState } from "react";
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
      "bg-blue-50 dark:bg-blue-900/30 oled:bg-blue-900/30 emerald:bg-emerald-800/30 space:bg-zinc-700/30 nova:bg-sky-900/30 navy:bg-blue-900/40 coral:bg-[#fecdd3]",
  },
  biggest_expense: {
    title: "Biggest Expense Insight",
    icon: "🔍",
    badge: "Analysis",
    badgeClassName:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-200",
    accentClassName:
      "bg-purple-50 dark:bg-purple-900/30 oled:bg-purple-900/30 emerald:bg-emerald-800/30 space:bg-zinc-700/30 nova:bg-pink-900/30 navy:bg-blue-900/40 coral:bg-[#fbcfe8]",
  },
  savings_opportunity: {
    title: "Savings Opportunity Insight",
    icon: "💡",
    badge: "Advice",
    badgeClassName:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200",
    accentClassName:
      "bg-emerald-50 dark:bg-emerald-900/20 oled:bg-emerald-900/30 emerald:bg-emerald-700/40 space:bg-zinc-700/30 nova:bg-teal-900/30 navy:bg-blue-900/40 coral:bg-[#bbf7d0]",
  },
  category_breakdown: {
    title: "Category Breakdown Insight",
    icon: "📊",
    badge: "Stats",
    badgeClassName:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    accentClassName:
      "bg-blue-50 dark:bg-blue-900/30 oled:bg-blue-900/30 emerald:bg-emerald-800/30 space:bg-zinc-700/30 nova:bg-sky-900/30 navy:bg-blue-900/40 coral:bg-[#bae6fd]",
  },
  trend_detection: {
    title: "Trend Detection Insight",
    icon: "⚠️",
    badge: "Warning",
    badgeClassName:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200",
    accentClassName:
      "bg-amber-50 dark:bg-amber-900/20 oled:bg-amber-900/30 emerald:bg-amber-900/30 space:bg-zinc-700/30 nova:bg-amber-900/30 navy:bg-blue-900/40 coral:bg-[#fde68a]",
  },
  recommendation: {
    title: "Recommendation Insight",
    icon: "🧠",
    badge: "Smart tip",
    badgeClassName:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200",
    accentClassName:
      "bg-indigo-50 dark:bg-indigo-900/30 oled:bg-indigo-900/30 emerald:bg-emerald-800/30 space:bg-zinc-700/30 nova:bg-indigo-900/30 navy:bg-blue-900/40 coral:bg-[#ddd6fe]",
  },
};

export function InsightCards({ insights, detailed = false }: InsightCardsProps) {
  const markAsRead = useMutation(api.insights.markAsRead);
  const generateInsights = useAction(api.insights.generateInsights);
  const pruneStaleInsights = useMutation(api.insights.pruneStale);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    pruneStaleInsights().catch((error) => {
      console.error("Failed to prune stale insights", error);
    });
  }, [pruneStaleInsights]);

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
    <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2]">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-800 coral:border-[#fb7185] flex justify-between items-center gap-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">Smart Insights</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateInsights}
            disabled={isGenerating}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 oled:bg-blue-900/40 emerald:bg-emerald-700/40 space:bg-zinc-600 nova:bg-sky-800/50 navy:bg-blue-900/40 coral:bg-[#fecdd3] text-blue-600 dark:text-blue-400 oled:text-blue-300 emerald:text-emerald-200 space:text-zinc-200 nova:text-sky-200 navy:text-blue-200 coral:text-[#be123c] rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 oled:hover:bg-blue-900/60 emerald:hover:bg-emerald-700/60 space:hover:bg-zinc-500 nova:hover:bg-sky-800/70 navy:hover:bg-blue-900/60 coral:hover:bg-[#fbcfe8] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Generate insights"}
          </button>
        </div>
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
                "bg-slate-50 dark:bg-slate-700/50 oled:bg-gray-900 emerald:bg-emerald-800/50 space:bg-zinc-700/50 nova:bg-sky-900/50 navy:bg-[#1c2f57] coral:bg-[#ffe4e6]";

              const unreadHighlight = insight.isRead
                ? ""
                : "ring-2 ring-blue-400/60 dark:ring-blue-400/40";

              return (
                <div
                  key={insight._id}
                  className={`group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 oled:border-gray-700 emerald:border-emerald-600 space:border-zinc-500 nova:border-sky-600 navy:border-blue-800 coral:border-[#fda4af] transition-all hover:-translate-y-1 hover:shadow-lg ${accentClassName} ${unreadHighlight}`}
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
                      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 oled:text-gray-100 emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-200 navy:text-blue-200 coral:text-[#be123c]">
                        {insight.description}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-300 coral:text-[#fb7185]">
                      <span>
                        {insight.createdAt
                          ? new Date(insight.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                      {!insight.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(insight._id)}
                          className="font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 oled:text-blue-300 oled:hover:text-blue-200 emerald:text-emerald-300 emerald:hover:text-emerald-200 space:text-zinc-300 space:hover:text-zinc-200 nova:text-sky-300 nova:hover:text-sky-200 navy:text-blue-200 navy:hover:text-blue-100 coral:text-[#be123c] coral:hover:text-[#9f1239]"
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
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center dark:border-slate-600 dark:bg-slate-900/40 oled:border-gray-700 oled:bg-gray-900/40 emerald:border-emerald-600 emerald:bg-emerald-800/40 space:border-zinc-500 space:bg-zinc-700/40 nova:border-sky-600 nova:bg-sky-900/40 navy:border-blue-800 navy:bg-[#1c2f57]/40 coral:border-[#fda4af] coral:bg-[#ffe4e6]">
            <span className="text-3xl">🧠</span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 emerald:text-emerald-200 space:text-zinc-200 nova:text-sky-200 navy:text-blue-100 coral:text-[#7f1d1d]">
                No insights yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-200 coral:text-[#be123c]">
                Click "Generate insights" to analyze your latest transactions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
