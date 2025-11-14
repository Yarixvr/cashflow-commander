import { ReactNode } from "react";

export type ThemeId =
  | "light"
  | "dark"
  | "oled"
  | "cyber"
  | "navy"
  | "coral"
  | "mint";

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
    id: "cyber",
    name: "Cyber Purple",
    description: "Futuristic purple/pink aesthetic",
    gradient: "from-purple-600 to-pink-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    preview: {
      bg: "bg-purple-950",
      text: "text-purple-100",
      border: "border-purple-800",
    },
    stats: {
      battery: "Good",
      oled: "Partially Optimized",
      visibility: "Good",
      style: "Futuristic",
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
    id: "mint",
    name: "Mint Fresh",
    description: "Cool mint with gentle neutrals",
    gradient: "from-emerald-400 to-teal-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 00-7.07 17.07L12 22l7.07-2.93A10 10 0 0012 2z" />
      </svg>
    ),
    preview: {
      bg: "bg-gradient-to-r from-[#d1fae5] to-[#5eead4]",
      text: "text-[#065f46]",
      border: "border-[#34d399]",
    },
    stats: {
      battery: "Standard",
      oled: "Not Optimized",
      visibility: "Gentle",
      style: "Fresh",
    },
  },
];

export const THEME_ORDER: ThemeId[] = [
  "dark",
  "light",
  "oled",
  "cyber",
  "navy",
  "coral",
  "mint",
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
