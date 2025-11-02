import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeSelector } from "./components/ThemeSelector";
import { ThemeTransition } from "./components/ThemeTransition";
import { useThemeShortcuts } from "../hooks/useThemeShortcuts";

export default function App() {
  // Enable keyboard shortcuts
  useThemeShortcuts();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 oled:from-black oled:to-black cyber:from-purple-950 cyber:to-pink-950 transition-all-fast">
      <ThemeTransition />
      <Authenticated>
        <AppContent />
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
      <Toaster position="top-right" />
    </div>
  );
}

function AppContent() {
  const initializeCategories = useMutation(api.categories.initializeDefaults);

  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 dark:bg-slate-800/80 oled:bg-black/80 cyber:bg-purple-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 sticky top-0 z-50 transition-all-fast">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 transition-all-fast">CashFlow Commander</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 hidden sm:block transition-all-fast">Master your money. Rule your flow.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeSelector />
              <ThemeToggle />
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CF</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 mb-2 transition-all-fast">CashFlow Commander</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-300 mb-1 transition-all-fast">Master your money. Rule your flow.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400 transition-all-fast">Take control of your finances with intelligent insights and beautiful visualizations.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 transition-all-fast">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
