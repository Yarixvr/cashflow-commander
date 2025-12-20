interface Badge {
    _id: string;
    name: string;
    displayName: string;
    description: string;
    icon: string;
    color: string;
}

interface BadgeDisplayProps {
    badges: Badge[];
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
};

export function BadgeDisplay({ badges, size = "md" }: BadgeDisplayProps) {
    if (!badges || badges.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
                <div
                    key={badge._id}
                    className={`${sizeClasses[size]} rounded-full font-medium flex items-center gap-1.5 transition-all hover:scale-105 cursor-default`}
                    style={{
                        backgroundColor: `${badge.color}20`,
                        color: badge.color,
                        border: `1.5px solid ${badge.color}`,
                    }}
                    title={badge.description}
                >
                    <span>{badge.icon}</span>
                    <span>{badge.displayName}</span>
                </div>
            ))}
        </div>
    );
}

// Single badge pill for compact display
export function BadgePill({ badge, size = "sm" }: { badge: Badge; size?: "sm" | "md" | "lg" }) {
    return (
        <span
            className={`${sizeClasses[size]} rounded-full font-medium inline-flex items-center gap-1 transition-all hover:scale-105 cursor-default`}
            style={{
                backgroundColor: `${badge.color}20`,
                color: badge.color,
                border: `1.5px solid ${badge.color}`,
            }}
            title={badge.description}
        >
            <span>{badge.icon}</span>
            <span>{badge.displayName}</span>
        </span>
    );
}
