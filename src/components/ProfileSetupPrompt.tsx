import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { ProfileEditForm } from "./ProfileEditForm";
import { toast } from "sonner";

export function ProfileSetupPrompt() {
  const profileCompletion = useQuery(api.profiles.checkProfileCompletion);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if user has dismissed the prompt recently
  useEffect(() => {
    const dismissedTime = localStorage.getItem('profilePromptDismissed');
    if (dismissedTime) {
      const timeDiff = Date.now() - parseInt(dismissedTime);
      // Don't show if dismissed within last 7 days (7 * 24 * 60 * 60 * 1000 = 604800000ms)
      if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
      } else {
        // Clear old dismissal
        localStorage.removeItem('profilePromptDismissed');
      }
    }
  }, []);

  // Show prompt if user needs profile and hasn't dismissed it recently
  useEffect(() => {
    if (profileCompletion && !profileCompletion.isComplete && !dismissed) {
      // Small delay to let page load first
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [profileCompletion, dismissed]);

  const handleCompleteProfile = () => {
    setShowPrompt(false);
    setShowEditForm(true);
  };

  const handleMaybeLater = () => {
    setShowPrompt(false);
    localStorage.setItem('profilePromptDismissed', Date.now().toString());
    setDismissed(true);
    toast.info("You can complete your profile anytime from the Profile section");
  };

  const handleProfileUpdated = () => {
    setShowEditForm(false);
    toast.success("Profile completed! Welcome to CashFlow Commander!");
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  // Don't render anything if no prompt needed or if profile is complete
  if (!profileCompletion?.isComplete || dismissed || (!showPrompt && !showEditForm)) {
    return null;
  }

  return (
    <>
      {/* Setup Prompt Card */}
      {showPrompt && (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 oled:from-gray-900 oled:to-gray-900 cyber:from-purple-900/20 cyber:to-pink-900/20 navy:from-blue-900/20 navy:to-cyan-900/20 coral:from-pink-50 coral:to-rose-50 mint:from-emerald-50 mint:to-teal-50 rounded-xl p-6 border border-blue-200 dark:border-blue-700 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-200 mint:border-emerald-300 transition-all-fast animate-pulse-glow">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 mb-2 transition-all-fast">
                Complete Your Profile
              </h3>
              <p className="text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-700 mb-4 transition-all-fast">
                Personalize your CashFlow Commander experience with a username, profile picture, and bio. Help us make your financial journey more personal!
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCompleteProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 oled:bg-blue-700 oled:hover:bg-blue-600 cyber:bg-pink-600 cyber:hover:bg-pink-700 navy:bg-blue-600 navy:hover:bg-blue-700 coral:bg-pink-600 coral:hover:bg-pink-700 mint:bg-emerald-600 mint:hover:bg-emerald-700 text-white rounded-lg font-medium transition-all-fast hover:scale-105 active:scale-95 shadow-sm"
                >
                  Complete Profile
                </button>
                <button
                  onClick={handleMaybeLater}
                  className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 cyber:bg-purple-900/60 navy:bg-[#0f172a]/70 coral:bg-white/80 mint:bg-emerald-900/20 text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-700 rounded-lg font-medium hover:bg-white/90 dark:hover:bg-slate-700/90 oled:hover:bg-gray-800/90 cyber:hover:bg-purple-800/90 navy:hover:bg-[#1e293b]/90 coral:hover:bg-white/90 mint:hover:bg-emerald-800/30 transition-all-fast hover:scale-105 active:scale-95 border border-slate-200 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            <button
              onClick={handleMaybeLater}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 oled:text-gray-500 oled:hover:text-gray-300 cyber:text-purple-400 cyber:hover:text-purple-300 navy:text-blue-400 navy:hover:text-blue-300 coral:text-pink-400 coral:hover:text-pink-300 mint:text-emerald-400 mint:hover:text-emerald-300 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <ProfileEditForm
          profile={profileCompletion?.profile || undefined}
          onClose={handleCloseEditForm}
          onSuccess={handleProfileUpdated}
        />
      )}
    </>
  );
}