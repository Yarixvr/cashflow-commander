import { ReactNode } from "react";

export type ThemeId =
  | "light"
  | "dark"
  | "oled"
  | "navy"
  | "coral"
  | "emerald"
  | "space"
  | "nova";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  gradient: string;
  icon: ReactNode;
  preview: {
    bg: string;
    text: string;
    border: string;
  };
  stats: {
    battery: string;
    oled: string;
    visibility: string;
    style: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark Mode",
    description: "Default dark theme with blue accents",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    preview: {
      bg: "bg-slate-800",
      text: "text-slate-100",
      border: "border-slate-700",
    },
    stats: {
      battery: "Standard",
      oled: "Not Optimized",
      visibility: "Good",
      style: "Professional",
    },
  },
  {
    id: "light",
    name: "Light Mode",
    description: "Clean and bright interface",
    gradient: "from-amber-400 to-orange-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    preview: {
      bg: "bg-white",
      text: "text-slate-900",
      border: "border-slate-200",
    },
    stats: {
      battery: "Standard",
      oled: "Not Optimized",
      visibility: "Excellent",
      style: "Clean & Bright",
    },
  },
  {
    id: "oled",
    name: "Pure Black (OLED)",
    description: "Perfect for OLED displays - saves battery",
    gradient: "from-gray-900 to-black",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ),
    preview: {
      bg: "bg-black",
      text: "text-white",
      border: "border-gray-800",
    },
    stats: {
      battery: "Excellent",
      oled: "Fully Optimized",
      visibility: "Perfect",
      style: "True Black",
    },
  },
  {
    id: "navy",
    name: "Deep Navy",
    description: "Moody blues with high contrast details",
    gradient: "from-slate-900 to-blue-900",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 4 9-4M4 10v5l8 4 8-4v-5" />
      </svg>
    ),
    preview: {
      bg: "bg-[#0f172a]",
      text: "text-blue-100",
      border: "border-blue-900",
    },
    stats: {
      battery: "Good",
      oled: "Not Optimized",
      visibility: "High Contrast",
      style: "Navy Luxe",
    },
  },
  {
    id: "coral",
    name: "Coral Reef",
    description: "Vibrant corals and warm highlights",
    gradient: "from-pink-500 to-orange-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    preview: {
      bg: "bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4]",
      text: "text-[#7f1d1d]",
      border: "border-[#fb7185]",
    },
    stats: {
      battery: "Standard",
      oled: "Not Optimized",
      visibility: "Warm Glow",
      style: "Playful",
    },
  },
  {
    id: "emerald",
    name: "Emerald Noir",
    description: "Dark luxury with rich emerald greens",
    gradient: "from-emerald-950 to-emerald-800",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    preview: {
      bg: "bg-[#0a1612]",
      text: "text-emerald-200",
      border: "border-emerald-700",
    },
    stats: {
      battery: "Good",
      oled: "Partially Optimized",
      visibility: "Elegant",
      style: "Luxury",
    },
  },
  {
    id: "space",
    name: "Space Grey",
    description: "Sophisticated neutral grey tones",
    gradient: "from-zinc-800 to-zinc-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    preview: {
      bg: "bg-[#1c1c1e]",
      text: "text-zinc-100",
      border: "border-zinc-600",
    },
    stats: {
      battery: "Good",
      oled: "Partially Optimized",
      visibility: "Sharp",
      style: "Minimal",
    },
  },
  {
    id: "nova",
    name: "Ultra Blue Nova",
    description: "Vibrant cosmic blue with electric accents",
    gradient: "from-sky-600 to-blue-800",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    preview: {
      bg: "bg-[#020617]",
      text: "text-sky-200",
      border: "border-sky-600",
    },
    stats: {
      battery: "Good",
      oled: "Partially Optimized",
      visibility: "Vibrant",
      style: "Cosmic",
    },
  },
];

export const THEME_ORDER: ThemeId[] = [
  "dark",
  "light",
  "oled",
  "navy",
  "coral",
  "emerald",
  "space",
  "nova",
];

export const THEME_OPTION_MAP = THEME_OPTIONS.reduce<Record<ThemeId, ThemeOption>>(
  (acc, option) => {
    acc[option.id] = option;
    return acc;
  },
  {} as Record<ThemeId, ThemeOption>
);

export function getThemeOption(theme: ThemeId) {
  return THEME_OPTION_MAP[theme];
}
