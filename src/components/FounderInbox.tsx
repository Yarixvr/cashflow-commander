import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";

export function FounderInbox() {
    const { t } = useTranslation();
    const suggestions = useQuery(api.suggestions.getFounderSuggestions);
    const markAsRead = useMutation(api.suggestions.markAsRead);
    const archiveSuggestion = useMutation(api.suggestions.archiveSuggestion);
    const [suggestionFilter, setSuggestionFilter] = useState<"all" | "new" | "read">("all");

    const filteredSuggestions = useMemo(() => {
        if (!suggestions) return [];
        if (suggestionFilter === "all") return suggestions.filter((s: any) => s.status !== "archived");
        return suggestions.filter((s: any) => s.status === suggestionFilter);
    }, [suggestions, suggestionFilter]);

    const unreadCount = useMemo(() => {
        if (!suggestions) return 0;
        return suggestions.filter((s: any) => s.status === "new").length;
    }, [suggestions]);

    return (
        <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6 transition-all-fast">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                        {t('suggestions.inboxTitle')}
                    </h3>
                    {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex gap-1">
                    {(["all", "new", "read"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setSuggestionFilter(f)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${suggestionFilter === f
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-200 navy:text-blue-200 coral:text-pink-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                        >
                            {f === "all" ? t('suggestions.filterAll') : f === "new" ? t('suggestions.filterNew') : t('suggestions.filterRead')}
                        </button>
                    ))}
                </div>
            </div>

            {filteredSuggestions.length === 0 ? (
                <div className="text-center py-8">
                    <span className="text-3xl mb-2 block">📭</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 navy:text-blue-300 coral:text-pink-400">
                        {t('suggestions.empty')}
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredSuggestions.map((s: any) => (
                        <div
                            key={s._id}
                            className={`rounded-lg p-4 border transition-colors ${s.status === "new"
                                ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 oled:bg-blue-950/30 emerald:bg-emerald-900/20 space:bg-zinc-800/50 nova:bg-sky-900/20 navy:bg-blue-900/30 coral:bg-pink-50"
                                : "border-slate-100 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-800 space:border-zinc-700 nova:border-sky-800 navy:border-blue-800 coral:border-pink-100 bg-transparent"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                                            {s.senderName}
                                        </span>
                                        {s.status === "new" && (
                                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-200 navy:text-blue-200 coral:text-[#9f1239] whitespace-pre-wrap break-words">
                                        {s.message}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 oled:text-gray-600 emerald:text-emerald-600 space:text-zinc-500 nova:text-sky-500 navy:text-blue-400 coral:text-pink-300 mt-1">
                                        {new Date(s.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    {s.status === "new" && (
                                        <button
                                            onClick={() => markAsRead({ suggestionId: s._id })}
                                            title={t('suggestions.markRead')}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => archiveSuggestion({ suggestionId: s._id })}
                                        title={t('suggestions.archive')}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
