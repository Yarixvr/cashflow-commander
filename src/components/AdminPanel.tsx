"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function AdminPanel() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [badgeType, setBadgeType] = useState<"founder" | "admin" | "special">"founder");
  const [badgeName, setBadgeName] = useState("");
  const [badgeColor, setBadgeColor] = useState("#FFD700");

  const grantBadge = useMutation(api.badges.grantBadge);
  const revokeBadge = useMutation(api.badges.revokeBadge);
  const allUsers = useQuery(api.users.list);
  const allBadges = useQuery(api.badges.getAllBadges);

  const handleGrantBadge = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId || !badgeName.trim()) {
      toast.error("Please select a user and enter badge name");
      return;
    }

    try {
      await grantBadge({
        targetUserId: selectedUserId,
        badgeType,
        badgeName: badgeName.trim(),
        badgeColor,
        badgeIcon: badgeType === "founder" ? "👑" : badgeType === "admin" ? "⚡" : "⭐",
      });

      setBadgeName("");
      setSelectedUserId("");
      toast.success(`Successfully granted ${badgeType} badge to user!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to grant badge");
    }
  };

  const handleRevokeBadge = async (badgeId: string) => {
    try {
      await revokeBadge({ badgeId });
      toast.success("Badge successfully revoked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to revoke badge");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white/90 mint:bg-emerald-900/10 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 p-6 transition-all-fast">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 mb-6 transition-all-fast">
          Badge Management Panel
        </h2>

        {/* Grant New Badge */}
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/50 oled:bg-gray-900/50 cyber:bg-purple-900/30 navy:bg-blue-900/30 coral:bg-pink-50/50 mint:bg-emerald-800/30 rounded-lg">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-700 mb-4 transition-all-fast">
            Grant New Badge
          </h3>

          <form onSubmit={handleGrantBadge} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 mb-1 transition-all-fast">
                  User
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300 rounded-lg bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-colors"
                >
                  <option value="">Select user...</option>
                  {allUsers?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.email || user.name || "Unknown User"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 mb-1 transition-all-fast">
                  Badge Type
                </label>
                <select
                  value={badgeType}
                  onChange={(e) => setBadgeType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300 rounded-lg bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-colors"
                >
                  <option value="founder">Founder</option>
                  <option value="admin">Admin</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 mb-1 transition-all-fast">
                  Badge Name
                </label>
                <input
                  type="text"
                  value={badgeName}
                  onChange={(e) => setBadgeName(e.target.value)}
                  placeholder={`Enter ${badgeType} badge name...`}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300 rounded-lg bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 mb-1 transition-all-fast">
                  Badge Color
                </label>
                <input
                  type="color"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="w-full h-10 border border-slate-300 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300 rounded-lg bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 oled:bg-blue-700 oled:hover:bg-blue-600 cyber:bg-pink-600 cyber:hover:bg-pink-700 navy:bg-blue-600 navy:hover:bg-blue-700 coral:bg-pink-600 coral:hover:bg-pink-700 mint:bg-emerald-600 mint:hover:bg-emerald-700 text-white rounded-lg font-medium transition-all-fast hover:scale-105 active:scale-95 shadow-sm"
            >
              Grant Badge
            </button>
          </form>
        </div>

        {/* Existing Badges */}
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/50 oled:bg-gray-900/50 cyber:bg-purple-900/30 navy:bg-blue-900/30 coral:bg-pink-50/50 mint:bg-emerald-800/30 rounded-lg">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-300 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-700 mb-4 transition-all-fast">
            Existing Badges
          </h3>

          <div className="space-y-2">
            {allBadges?.filter(badge => badge.isActive).map((badge) => (
              <div
                key={badge._id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 rounded-lg border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 transition-all-fast"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className="text-lg"
                    style={{
                      backgroundColor: badge.badgeColor + "20",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.375rem",
                    }}
                  >
                    {badge.badgeIcon || "⭐"}
                  </span>
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-all-fast">
                      {badge.badgeName}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700 transition-all-fast">
                      {badge.badgeType.charAt(0).toUpperCase() + badge.badgeType.slice(1)} • {badge.user?.email || "Unknown"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeBadge(badge._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-sm rounded-md font-medium transition-colors"
                >
                  Revoke
                </button>
              </div>
            ))}

            {(!allBadges || allBadges.length === 0) && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 oled:text-gray-400 cyber:text-purple-300 navy:text-blue-200 coral:text-[#9f1239] mint:text-emerald-700 transition-all-fast">
                No badges granted yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}