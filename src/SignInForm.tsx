"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function SignInForm() {
  const { t } = useTranslation();
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn("password", { email, password, flow: step });
    } catch (error: any) {
      if (error.message.includes("Invalid password")) {
        toast.error(t('auth.invalidPassword') || "Invalid password");
      } else {
        toast.error(step === "signIn" ? t('auth.signInError') : t('auth.signUpError'));
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-2 mb-4">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
            {step === "signIn" ? t('auth.signIn') : t('auth.signUp')}
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-300">{t('app.tagline')}</p>
        </div>
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder={t('auth.emailPlaceholder') || "Email"}
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder={t('auth.passwordPlaceholder') || "Password"}
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {step === "signIn" ? t('auth.signIn') : t('auth.signUp')}
        </button>
        <div className="text-center text-sm text-secondary dark:text-slate-300">
          <span>
            {step === "signIn"
              ? t('auth.noAccount')
              : t('auth.haveAccount')}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer ml-1"
            onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
          >
            {step === "signIn" ? t('auth.signUpInstead') : t('auth.signInInstead')}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-200 dark:border-slate-600" />
        <span className="mx-4 text-secondary dark:text-slate-300">{t('common.or') || "or"}</span>
        <hr className="my-4 grow border-gray-200 dark:border-slate-600" />
      </div>
      <button className="auth-button" onClick={() => void signIn("anonymous")}>
        {t('auth.anonymous') || "Sign in anonymously"}
      </button>
    </div>
  );
}
