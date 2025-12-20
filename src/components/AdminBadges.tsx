import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { BadgeDisplay } from "./BadgeDisplay";
import { Id } from "../../convex/_generated/dataModel";

export function AdminBadges() {
    const badges = useQuery(api.badges.listBadges);
    const users = useQuery(api.badges.listAllUsers);
    const createBadge = useMutation(api.badges.createBadge);
    const assignBadge = useMutation(api.badges.assignBadge);
    const revokeBadge = useMutation(api.badges.revokeBadge);

    const [isCreating, setIsCreating] = useState(false);
    const [newBadge, setNewBadge] = useState({
        name: "",
        displayName: "",
        description: "",
        icon: "⭐",
        color: "#3B82F6",
    });

    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedBadgeId, setSelectedBadgeId] = useState("");

    const handleCreateBadge = async () => {
        if (!newBadge.name || !newBadge.displayName) {
            toast.error("Badge name and display name are required");
            return;
        }

        try {
            await createBadge(newBadge);
            toast.success("Badge created successfully!");
            setNewBadge({
                name: "",
                displayName: "",
                description: "",
                icon: "⭐",
                color: "#3B82F6",
            });
            setIsCreating(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to create badge");
        }
    };

    const handleAssignBadge = async () => {
        if (!selectedUserId || !selectedBadgeId) {
            toast.error("Please select a user and a badge");
            return;
        }

        try {
            await assignBadge({
                targetUserId: selectedUserId as Id<"users">,
                badgeId: selectedBadgeId as Id<"badges">,
            });
            toast.success("Badge assigned successfully!");
            setSelectedUserId("");
            setSelectedBadgeId("");
        } catch (error: any) {
            toast.error(error.message || "Failed to assign badge");
        }
    };

    const handleRevokeBadge = async (userId: Id<"users">, badgeId: Id<"badges">) => {
        try {
            await revokeBadge({ targetUserId: userId, badgeId });
            toast.success("Badge revoked successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to revoke badge");
        }
    };

    const iconOptions = ["👑", "⭐", "🏆", "💎", "🎯", "🚀", "🔥", "✨", "💫", "🎖️", "🏅", "🎪"];

    return (
        <div className="space-y-6">
            {/* Admin Header */}
            <div className="rounded-xl shadow-sm border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-900/20 dark:to-orange-900/20 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">👑</span>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                        Founder Admin Panel
                    </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 oled:text-gray-400 emerald:text-emerald-400 space:text-zinc-400 nova:text-sky-400 navy:text-blue-200 coral:text-[#9f1239]">
                    Manage badges and assign them to users. Only you can access this panel.
                </p>
            </div>

            {/* Create Badge Section */}
            <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d]">
                        Badges
                    </h3>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        {isCreating ? "Cancel" : "+ Create Badge"}
                    </button>
                </div>

                {/* Existing Badges */}
                {badges && badges.length > 0 && (
                    <div className="mb-4">
                        <BadgeDisplay badges={badges as any} size="md" />
                    </div>
                )}

                {/* Create Badge Form */}
                {isCreating && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Badge Code (uppercase, no spaces)
                                </label>
                                <input
                                    type="text"
                                    value={newBadge.name}
                                    onChange={(e) =>
                                        setNewBadge({ ...newBadge, name: e.target.value.toUpperCase().replace(/\s/g, "_") })
                                    }
                                    placeholder="BETA_TESTER"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={newBadge.displayName}
                                    onChange={(e) => setNewBadge({ ...newBadge, displayName: e.target.value })}
                                    placeholder="Beta Tester"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Description
                            </label>
                            <input
                                type="text"
                                value={newBadge.description}
                                onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                                placeholder="Early adopter who helped test the app"
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Icon
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setNewBadge({ ...newBadge, icon })}
                                            className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${newBadge.icon === icon
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                                : "border-slate-200 dark:border-slate-600 hover:border-blue-300"
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={newBadge.color}
                                        onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={newBadge.color}
                                        onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Preview
                            </label>
                            <BadgeDisplay
                                badges={[
                                    {
                                        _id: "preview",
                                        name: newBadge.name || "BADGE",
                                        displayName: newBadge.displayName || "Badge Name",
                                        description: newBadge.description,
                                        icon: newBadge.icon,
                                        color: newBadge.color,
                                    },
                                ]}
                                size="lg"
                            />
                        </div>

                        <button
                            onClick={handleCreateBadge}
                            className="px-6 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                            Create Badge
                        </button>
                    </div>
                )}
            </div>

            {/* Assign Badge Section */}
            <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d] mb-4">
                    Assign Badge to User
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Select User
                        </label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        >
                            <option value="">Choose a user...</option>
                            {users?.map((user) => (
                                <option key={user._id} value={user.userId}>
                                    {user.username} ({user.userId.slice(0, 8)}...)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Select Badge
                        </label>
                        <select
                            value={selectedBadgeId}
                            onChange={(e) => setSelectedBadgeId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        >
                            <option value="">Choose a badge...</option>
                            {badges?.map((badge) => (
                                <option key={badge._id} value={badge._id}>
                                    {badge.icon} {badge.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleAssignBadge}
                            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Assign Badge
                        </button>
                    </div>
                </div>
            </div>

            {/* User List with Badges */}
            {users && users.length > 0 && (
                <div className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 oled:border-gray-800 emerald:border-emerald-700 space:border-zinc-600 nova:border-sky-700 navy:border-blue-900 coral:border-[#fda4af] bg-white dark:bg-slate-800 oled:bg-[#0b0b0b] emerald:bg-[#0f1f18] space:bg-[#2c2c2e] nova:bg-[#0f172a] navy:bg-[#16213d] coral:bg-[#fff1f2] p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 oled:text-white emerald:text-emerald-100 space:text-zinc-100 nova:text-sky-100 navy:text-blue-100 coral:text-[#7f1d1d] mb-4">
                        All Users
                    </h3>

                    <div className="space-y-3">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 oled:bg-gray-900/50 emerald:bg-emerald-800/50 space:bg-zinc-700/50 nova:bg-sky-900/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {user.username?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">
                                            {user.username}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                            {user.userId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {user.badges && user.badges.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            {user.badges.map((badge: any) => (
                                                <button
                                                    key={badge._id}
                                                    onClick={() => handleRevokeBadge(user.userId, badge._id)}
                                                    className="group relative"
                                                    title={`Click to revoke: ${badge.displayName}`}
                                                >
                                                    <span
                                                        className="text-sm px-2 py-0.5 rounded-full font-medium flex items-center gap-1 transition-all group-hover:opacity-50"
                                                        style={{
                                                            backgroundColor: `${badge.color}20`,
                                                            color: badge.color,
                                                            border: `1.5px solid ${badge.color}`,
                                                        }}
                                                    >
                                                        {badge.icon} {badge.displayName}
                                                    </span>
                                                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-500 text-lg">
                                                        ×
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
