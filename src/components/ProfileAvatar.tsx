interface ProfileAvatarProps {
    username: string;
    profilePictureUrl?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showBadgeIndicator?: boolean;
    badgeCount?: number;
}

const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
};

export function ProfileAvatar({
    username,
    profilePictureUrl,
    size = "md",
    showBadgeIndicator = false,
    badgeCount = 0,
}: ProfileAvatarProps) {
    const initials = username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const gradientColors = [
        "from-blue-500 to-purple-500",
        "from-green-500 to-teal-500",
        "from-orange-500 to-red-500",
        "from-pink-500 to-rose-500",
        "from-indigo-500 to-blue-500",
        "from-yellow-500 to-orange-500",
    ];

    // Generate consistent gradient based on username
    const gradientIndex =
        username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        gradientColors.length;
    const gradient = gradientColors[gradientIndex];

    return (
        <div className="relative inline-block">
            {profilePictureUrl ? (
                <img
                    src={profilePictureUrl}
                    alt={username}
                    className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-slate-800 oled:ring-black emerald:ring-[#0a1612] space:ring-[#1c1c1e] nova:ring-[#020617] navy:ring-[#0f172a] coral:ring-white shadow-lg`}
                    onError={(e) => {
                        // If image fails to load, hide it so fallback shows
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            ) : (
                <div
                    className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white ring-2 ring-white dark:ring-slate-800 oled:ring-black emerald:ring-[#0a1612] space:ring-[#1c1c1e] nova:ring-[#020617] navy:ring-[#0f172a] coral:ring-white shadow-lg`}
                >
                    {initials || "?"}
                </div>
            )}

            {/* Badge indicator */}
            {showBadgeIndicator && badgeCount > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white dark:ring-slate-800">
                    {badgeCount > 9 ? "9+" : badgeCount}
                </div>
            )}
        </div>
    );
}
