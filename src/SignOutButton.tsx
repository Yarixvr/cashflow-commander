"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useTranslation } from "react-i18next";

export function SignOutButton() {
  const { t } = useTranslation();
  const { signOut } = useAuthActions();

  return (
    <button
      className="px-4 py-2 rounded bg-white dark:bg-slate-700 oled:bg-[#1a1a1a] emerald:bg-[#064e3b] space:bg-[#2c2c2e] nova:bg-[#0c4a6e] navy:bg-[#1e3a8a] coral:bg-[#fff1f2] text-slate-800 dark:text-slate-200 oled:text-white emerald:text-emerald-100 space:text-zinc-200 nova:text-sky-100 navy:text-blue-100 coral:text-[#9f1239] border border-gray-200 dark:border-slate-600 oled:border-[#333] emerald:border-[#059669] space:border-[#3a3a3c] nova:border-[#0284c7] navy:border-[#2563eb] coral:border-[#fda4af] font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 oled:hover:bg-[#2a2a2a] emerald:hover:bg-[#065f46] space:hover:bg-[#3a3a3c] nova:hover:bg-[#075985] navy:hover:bg-[#1d4ed8] coral:hover:bg-[#ffe4e6] transition-colors shadow-sm hover:shadow"
      onClick={() => void signOut()}
    >
      {t('auth.signOut')}
    </button>
  );
}
