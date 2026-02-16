import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProfileAvatar } from "./ProfileAvatar";
import { BadgeDisplay } from "./BadgeDisplay";
import { AdminBadges } from "./AdminBadges";
import { FounderInbox } from "./FounderInbox";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "../hooks/useOnboarding";

interface ProfilePageProps {
    onNavigateToDashboard?: () => void;
}

export function ProfilePage({ onNavigateToDashboard }: ProfilePageProps) {
    const { t } = useTranslation();
    const profile = useQuery(api.profiles.getMyProfileWithBadges);
    const isFounder = useQuery(api.badges.isFounder);
    const upsertProfile = useMutation(api.profiles.upsertProfile);
    const initializeFounderBadge = useMutation(api.badges.initializeFounderBadge);
    const { resetOnboarding } = useOnboarding();

    // Suggestions inbox moved to FounderInbox component

    const [username, setUsername] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize founder badge on first load
    useEffect(() => {
        initializeFounderBadge().catch(() => {
            // Silently ignore - badge may already exist or user isn't founder
        });
    }, [initializeFounderBadge]);

    // Populate form when profile loads
    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "");
            setProfilePictureUrl(profile.profilePictureUrl || "");
        }
    }, [profile]);

    const handleSave = async () => {
        if (!username.trim()) {
            toast.error("Username is required");
            return;
        }

        setIsSaving(true);
        try {
            await upsertProfile({
                username: username.trim(),
                profilePictureUrl: profilePictureUrl.trim() || undefined,
            });
            toast.success(t('profile.success'));
            setIsEditing(false);
        } catch (error) {
            toast.error(t('profile.error'));
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setUsername(profile.username || "");
            setProfilePictureUrl(profile.profilePictureUrl || "");
        }
        setIsEditing(false);
    };

    if (profile === undefined) {
        return (
            <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-8">
                <div className="animate-pulse flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="space-y-3 flex-1">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6 transition-all-fast">
                <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                        {t('profile.title')}
                    </h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            {t('profile.edit')}
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-3">
                        <ProfileAvatar
                            username={username || "User"}
                            profilePictureUrl={profilePictureUrl}
                            size="xl"
                        />
                        {isEditing && (
                            <div className="w-full max-w-xs">
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    {t('profile.avatarUrl')}
                                </label>
                                <input
                                    type="url"
                                    value={profilePictureUrl}
                                    onChange={(e) => setProfilePictureUrl(e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 navy:text-blue-200 coral:text-[#9f1239] mb-1">
                                {t('profile.username')}
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full max-w-md px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            ) : (
                                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                                    {profile?.username || t('profile.noUsername')}
                                </p>
                            )}
                        </div>

                        {/* Badges */}
                        {profile?.badges && profile.badges.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 navy:text-blue-200 coral:text-[#9f1239] mb-2">
                                    {t('profile.badges')}
                                </label>
                                <BadgeDisplay badges={profile.badges} />
                            </div>
                        )}

                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSaving ? t('profile.saving') : t('profile.save')}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="px-6 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {t('profile.cancel')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Settings Section */}
            <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6 transition-all-fast">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d] mb-4">
                    Settings
                </h3>
                <button
                    onClick={() => {
                        resetOnboarding();
                        onNavigateToDashboard?.();
                    }}
                    className="min-h-[48px] px-6 py-3 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 oled:bg-gray-800 emerald:bg-emerald-800 space:bg-zinc-700 nova:bg-sky-800 navy:bg-blue-800 coral:bg-pink-100 text-slate-700 dark:text-slate-200 oled:text-gray-200 emerald:text-emerald-200 space:text-zinc-200 nova:text-sky-200 navy:text-blue-200 coral:text-pink-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors touch-feedback"
                >
                    {t('profile.restartTutorial')}
                </button>
            </div>

            {/* Suggestions Inbox - Only visible to founder */}
            {isFounder && <FounderInbox />}

            {/* Admin Badge Management - Only visible to founder */}
            {isFounder && <AdminBadges />}
        </div>
    );
}
