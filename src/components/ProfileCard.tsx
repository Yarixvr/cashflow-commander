import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ProfileEditForm } from "./ProfileEditForm";
import { toast } from "sonner";

interface ProfileCardProps {
  compact?: boolean;
  showEditButton?: boolean;
}

export function ProfileCard({ compact = false, showEditButton = true }: ProfileCardProps) {
  const user = useQuery(api.auth.loggedInUser);
  const [showEditForm, setShowEditForm] = useState(false);

  if (!user) {
    return null;
  }

  const profile = user.profile;
  const username = profile?.username || "Guest User";
  const bio = profile?.bio || "No bio yet";
  const avatarUrl = profile?.avatarImageUrl;

  const handleEditProfile = () => {
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
  };

  const handleProfileUpdated = () => {
    setShowEditForm(false);
    toast.success("Profile updated successfully!");
  };

  if (compact) {
    return (
      <>
        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white/90 mint:bg-emerald-900/10 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 transition-all-fast hover:scale-105 active:scale-95">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center ring-2 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400">
                <span className="text-white font-bold text-sm">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 truncate transition-all-fast">
              {username}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700 truncate transition-all-fast">
              {profile?.isProfileComplete ? "Profile complete" : "Complete your profile"}
            </p>
          </div>
        </div>

        {showEditForm && (
          <ProfileEditForm
            profile={profile}
            onClose={handleCloseForm}
            onSuccess={handleProfileUpdated}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white/90 mint:bg-emerald-900/10 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 p-6 transition-all-fast hover:shadow-md hover:scale-[1.02]">
        <div className="flex items-start space-x-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center ring-4 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400">
                <span className="text-white font-bold text-2xl">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 ${
              profile?.isProfileComplete
                ? 'bg-green-500 border-white dark:border-slate-800 oled:border-black cyber:border-purple-950 navy:border-[#0f172a] coral:border-white mint:border-emerald-900'
                : 'bg-yellow-500 border-white dark:border-slate-800 oled:border-black cyber:border-purple-950 navy:border-[#0f172a] coral:border-white mint:border-emerald-900'
            }`} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-all-fast">
              {username}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 oled:text-gray-300 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-700 mt-1 transition-all-fast">
              {bio}
            </p>
            <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700">
              {profile?.createdAt && (
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              )}
              {profile?.isProfileComplete && (
                <span className="text-green-600 dark:text-green-400 oled:text-green-500 cyber:text-green-400 navy:text-green-400 coral:text-green-600 mint:text-green-500">
                  ✓ Profile Complete
                </span>
              )}
            </div>

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700 mb-1 transition-all-fast">
                  Badges
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge) => (
                    <span
                      key={badge._id}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md"
                      style={{
                        backgroundColor: badge.badgeColor + "20",
                        color: badge.badgeColor,
                      }}
                    >
                      <span className="mr-1">{badge.badgeIcon || "⭐"}</span>
                      <span>{badge.badgeType.charAt(0).toUpperCase() + badge.badgeType.slice(1)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showEditButton && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 oled:bg-blue-700 oled:hover:bg-blue-600 cyber:bg-pink-600 cyber:hover:bg-pink-700 navy:bg-blue-600 navy:hover:bg-blue-700 coral:bg-pink-600 coral:hover:bg-pink-700 mint:bg-emerald-600 mint:hover:bg-emerald-700 text-white rounded-lg font-medium transition-all-fast hover:scale-105 active:scale-95 shadow-sm"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {showEditForm && (
        <ProfileEditForm
          profile={profile}
          onClose={handleCloseForm}
          onSuccess={handleProfileUpdated}
        />
      )}
    </>
  );
}