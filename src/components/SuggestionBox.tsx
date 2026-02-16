import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function SuggestionBox() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const submitSuggestion = useMutation(api.suggestions.submitSuggestion);
    const panelRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Focus textarea on open
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!message.trim() || message.trim().length < 3) {
            toast.error(t("suggestions.tooShort"));
            return;
        }
        setSubmitting(true);
        try {
            await submitSuggestion({ message });
            toast.success(t("suggestions.success"));
            setMessage("");
            setIsOpen(false);
        } catch {
            toast.error(t("suggestions.error"));
        } finally {
            setSubmitting(false);
        }
    };

    const charCount = message.length;
    const maxChars = 1000;

    return (
        <div ref={panelRef} className="fixed bottom-28 md:bottom-6 right-4 z-[90] flex flex-col items-end gap-3">
            {/* Expanded suggestion form */}
            <div
                className={`transition-all duration-300 ease-out origin-bottom-right ${isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-90 translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="w-[calc(100vw-2rem)] max-w-sm rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden
                    bg-white/95 dark:bg-slate-800/95 oled:bg-black/95 emerald:bg-[#0f1f18]/95 space:bg-[#2c2c2e]/95 nova:bg-[#0f172a]/95 navy:bg-[#0f172a]/95 coral:bg-white/95
                    border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-pink-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b
                        border-slate-100 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-800 space:border-zinc-700 nova:border-sky-800 navy:border-blue-800 coral:border-pink-100">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">💡</span>
                            <h3 className="font-semibold text-sm
                                text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                                {t("suggestions.title")}
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors
                                hover:bg-slate-100 dark:hover:bg-slate-700 oled:hover:bg-gray-900 emerald:hover:bg-emerald-800 space:hover:bg-zinc-600 nova:hover:bg-sky-800 navy:hover:bg-blue-800 coral:hover:bg-pink-100
                                text-slate-400 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 navy:text-blue-300 coral:text-pink-400"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                        <p className="text-xs
                            text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-200 coral:text-[#9f1239]">
                            {t("suggestions.subtitle")}
                        </p>
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
                            placeholder={t("suggestions.placeholder")}
                            rows={4}
                            className="w-full rounded-xl px-3 py-2.5 text-sm resize-none transition-colors
                                bg-slate-50 dark:bg-slate-900/60 oled:bg-gray-950 emerald:bg-[#0a1612] space:bg-[#1c1c1e] nova:bg-[#020617] navy:bg-[#0a0f1a] coral:bg-pink-50/60
                                text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]
                                placeholder-slate-400 dark:placeholder-slate-500 oled:placeholder-gray-600 emerald:placeholder-emerald-600 space:placeholder-zinc-500 nova:placeholder-sky-600 navy:placeholder-blue-500 coral:placeholder-pink-300
                                border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-800 coral:border-pink-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
                        />
                        <div className="flex items-center justify-between">
                            <span className={`text-xs ${charCount > maxChars * 0.9
                                ? "text-amber-500"
                                : "text-slate-400 dark:text-slate-500 oled:text-gray-600 emerald:text-emerald-600 space:text-zinc-500 nova:text-sky-500 navy:text-blue-400 coral:text-pink-300"
                                }`}>
                                {charCount}/{maxChars}
                            </span>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !message.trim() || message.trim().length < 3}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all
                                    bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    shadow-md hover:shadow-lg active:scale-[0.97]"
                            >
                                {submitting ? t("suggestions.submitting") : t("suggestions.submit")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB (lightbulb button) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                    ${isOpen
                        ? "bg-slate-200 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800 space:bg-zinc-600 nova:bg-sky-800 navy:bg-blue-800 coral:bg-pink-200 rotate-45"
                        : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 hover:shadow-xl hover:scale-110"
                    }`}
                aria-label={t("suggestions.title")}
            >
                <span className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-[-45deg]" : "group-hover:scale-110"}`}>
                    {isOpen ? "✕" : "💡"}
                </span>
            </button>
        </div>
    );
}
