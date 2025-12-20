import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { ThemeGallery } from "./components/ThemeGallery";
import { useDeviceType } from "./hooks/useDeviceType";
import { ProfilePage } from "./components/ProfilePage";
import { ProfileAvatar } from "./components/ProfileAvatar";

export default function App() {
  useDeviceType();

  return (
    <div className="min-h-screen theme-gradient transition-all-fast">
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
  const profile = useQuery(api.profiles.getMyProfile);
  const [activeView, setActiveView] = useState<"dashboard" | "themes" | "profile">("dashboard");

  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 dark:bg-slate-800/80 oled:bg-black/80 emerald:bg-[#0a1612]/80 space:bg-[#1c1c1e]/80 nova:bg-[#020617]/80 navy:bg-[#0f172a]/80 coral:bg-white/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-800 space:border-zinc-700 nova:border-sky-800 navy:border-blue-900 coral:border-pink-200 sticky top-0 z-50 transition-all-fast auto-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d] transition-all-fast">CashFlow Commander</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-200 coral:text-[#9f1239] hidden sm:block transition-all-fast">Master your money. Rule your flow.</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1 mr-6">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "themes", label: "Themes" },
                { id: "profile", label: "Profile" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as "dashboard" | "themes" | "profile")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all-fast auto-animate ${activeView === item.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-200 space:text-zinc-300 nova:text-sky-200 navy:text-blue-100 coral:text-[#a21d4d] hover:bg-white/20"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-3">
              {/* Profile Avatar Button */}
              <button
                onClick={() => setActiveView("profile")}
                className="hover:opacity-80 transition-opacity"
                title="Go to Profile"
              >
                <ProfileAvatar
                  username={profile?.username || "User"}
                  profilePictureUrl={profile?.profilePictureUrl}
                  size="sm"
                />
              </button>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 auto-animate">
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all-fast ${activeView === "dashboard"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 emerald:bg-emerald-900/60 space:bg-zinc-800/70 nova:bg-sky-900/60 navy:bg-[#0f172a]/70 coral:bg-white/80 text-slate-600 dark:text-slate-300"
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("themes")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all-fast ${activeView === "themes"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 emerald:bg-emerald-900/60 space:bg-zinc-800/70 nova:bg-sky-900/60 navy:bg-[#0f172a]/70 coral:bg-white/80 text-slate-600 dark:text-slate-300"
              }`}
          >
            Themes
          </button>
          <button
            onClick={() => setActiveView("profile")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all-fast ${activeView === "profile"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 emerald:bg-emerald-900/60 space:bg-zinc-800/70 nova:bg-sky-900/60 navy:bg-[#0f172a]/70 coral:bg-white/80 text-slate-600 dark:text-slate-300"
              }`}
          >
            Profile
          </button>
        </div>
        {activeView === "dashboard" && <Dashboard />}
        {activeView === "themes" && <ThemeGallery />}
        {activeView === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 auto-animate">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CF</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d] mb-2 transition-all-fast">CashFlow Commander</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-300 space:text-zinc-300 nova:text-sky-200 navy:text-blue-200 coral:text-[#9f1239] mb-1 transition-all-fast">Master your money. Rule your flow.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-300 navy:text-blue-100 coral:text-[#a21d4d] transition-all-fast">Take control of your finances with intelligent insights and beautiful visualizations.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 oled:bg-black emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#0f172a] coral:bg-white/90 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-pink-200 transition-all-fast auto-animate">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
