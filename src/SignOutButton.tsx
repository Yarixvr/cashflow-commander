"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useTranslation } from "react-i18next";

export function SignOutButton() {
  const { t } = useTranslation();
  const { signOut } = useAuthActions();

  return (
    <button
      className="px-4 py-2 rounded bg-white dark:bg-slate-700 text-secondary dark:text-slate-200 border border-gray-200 dark:border-slate-600 font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors shadow-sm hover:shadow"
      onClick={() => void signOut()}
    >
      {t('auth.signOut')}
    </button>
  );
}
