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
import { ProfileCard } from "./components/ProfileCard";
import { ProfileSetupPrompt } from "./components/ProfileSetupPrompt";

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
  const [activeView, setActiveView] = useState<"dashboard" | "themes" | "profile">("dashboard");

  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 dark:bg-slate-800/80 oled:bg-black/80 cyber:bg-purple-950/80 navy:bg-[#0f172a]/80 coral:bg-white/90 mint:bg-emerald-900/30 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 sticky top-0 z-50 transition-all-fast auto-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-all-fast">CashFlow Commander</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700 hidden sm:block transition-all-fast">Master your money. Rule your flow.</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1 mr-6">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "profile", label: "Profile" },
                { id: "themes", label: "Themes" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as "dashboard" | "themes" | "profile")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all-fast auto-animate ${
                    activeView === item.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-200 navy:text-blue-100 coral:text-[#a21d4d] mint:text-emerald-800 hover:bg-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-3">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 auto-animate">
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all-fast ${
              activeView === "dashboard"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 cyber:bg-purple-900/60 navy:bg-[#0f172a]/70 coral:bg-white/80 mint:bg-emerald-900/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("profile")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all-fast ${
              activeView === "profile"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 cyber:bg-purple-900/60 navy:bg-[#0f172a]/70 coral:bg-white/80 mint:bg-emerald-900/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveView("themes")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all-fast ${
              activeView === "themes"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 cyber:bg-purple-900/60 navy:bg-[#0f172a]/70 coral:bg-white/80 mint:bg-emerald-900/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            Themes
          </button>
        </div>
        <ProfileSetupPrompt />
        {activeView === "dashboard" && <Dashboard />}
        {activeView === "profile" && <ProfileView />}
        {activeView === "themes" && <ThemeGallery />}
      </main>
    </div>
  );
}

function ProfileDropdown() {
  const user = useQuery(api.auth.loggedInUser);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const username = user?.profile?.username || "Guest User";
  const avatarUrl = user?.profile?.avatarImageUrl;

  const handleEditProfile = () => {
    setShowDropdown(false);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const handleProfileUpdated = () => {
    setShowEditForm(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/20 oled:hover:bg-gray-800/20 cyber:hover:bg-purple-800/20 navy:hover:bg-blue-800/20 coral:hover:bg-pink-100/20 mint:hover:bg-emerald-800/20 transition-all-fast hover:scale-105 active:scale-95"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center ring-2 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400">
              <span className="text-white font-bold text-xs">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-200 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 truncate max-w-20">
            {username}
          </span>
          <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400 navy:text-blue-300 coral:text-pink-400 mint:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 z-50 transition-all-fast">
            <div className="p-1">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Navigate to profile (you might need to handle this with state or routing)
                  window.location.hash = '#profile';
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-200 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 hover:bg-slate-100 dark:hover:bg-slate-700 oled:hover:bg-gray-900 cyber:hover:bg-purple-900 navy:hover:bg-blue-900 coral:hover:bg-pink-50 mint:hover:bg-emerald-800 rounded-md transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={handleEditProfile}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-200 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 hover:bg-slate-100 dark:hover:bg-slate-700 oled:hover:bg-gray-900 cyber:hover:bg-purple-900 navy:hover:bg-blue-900 coral:hover:bg-pink-50 mint:hover:bg-emerald-800 rounded-md transition-colors"
              >
                Edit Profile
              </button>
              <div className="border-t border-slate-200 dark:border-slate-700 oled:border-gray-800 cyber:border-purple-800 navy:border-blue-800 coral:border-pink-200 mint:border-emerald-700 my-1"></div>
              <div className="px-3 py-2">
                <SignOutButton />
              </div>
            </div>
          </div>
        )}
      </div>

      {showEditForm && (
        <ProfileEditForm
          profile={user?.profile || undefined}
          onClose={handleCloseEditForm}
          onSuccess={handleProfileUpdated}
        />
      )}
    </>
  );
}

function ProfileView() {
  return (
    <div className="space-y-6 auto-animate">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 mb-2 transition-all-fast">
          Profile
        </h2>
        <p className="text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-700 transition-all-fast">
          Manage your personal information and preferences.
        </p>
      </div>
      <ProfileCard />
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
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 mb-2 transition-all-fast">CashFlow Commander</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700 mb-1 transition-all-fast">Master your money. Rule your flow.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-400 navy:text-blue-100 coral:text-[#a21d4d] mint:text-emerald-800 transition-all-fast">Take control of your finances with intelligent insights and beautiful visualizations.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white/90 mint:bg-emerald-900/20 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 transition-all-fast auto-animate">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
