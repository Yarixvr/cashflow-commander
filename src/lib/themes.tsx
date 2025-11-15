import { ReactNode } from "react";

export type ThemeId =
  | "light"
  | "dark"
  | "oled"
  | "coral"
  | "emeraldNoir"
  | "spaceGrey"
  | "ultraBlue";

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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 4 9-4M4 10h16M4 10h16M4 14h16M4 18h16M0 4 0-4-4V6M14 6h12V4h6" />
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
    id: "emeraldNoir",
    name: "Emerald Noir",
    description: "Rich emerald with noir elegance",
    gradient: "from-#0C1110 to-#151A19",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l2 2a2 2 0 010.85-8.85A2 2 0 0112 17.07L12 22l7.07-2.93A2 2 0 0012 2z" />
      </svg>
    ),
    preview: {
      bg: "bg-#151A19",
      text: "text-#E9F8F5",
      border: "border-#1B4E33",
    },
    stats: {
      battery: "Excellent",
      oled: "Not Optimized",
      visibility: "Professional",
      style: "Elegant",
    },
  },
  {
    id: "spaceGrey",
    name: "Space Grey",
    description: "Inspired by space exploration and minimalism",
    gradient: "from-#1C1C1E to-#2C2C2E",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5c0-.552.848-1.687-1.893-1.893-1.893s-1.893 1.687-1.687H3c0-.552 2.448v7.099c0 2.448-1.343 4.465-4.465 4.465 4.465c0 4.465 2.448 0v-7.099L3 13.901C1.343 16.548 2.448 2.448 2.448 16.548 2.448 9.652 7.337 16.548 7.337c0 0 0-5.803-1.658-2.281-2.281-2.281-2.281-2.281l-2.281-2.281 2.281 2.281 2.281-2.281 5.803 1.658 2.281 16 16s0 0c5.652 7.337-5.652 7.337 7.337 5.652 7.337L16 22.658 2.281 2.281 2.281 2.281 16.548 2.281z" />
      </svg>
    ),
    preview: {
      bg: "bg-#2C2C2E",
      text: "text-#F2F2F7",
      border: "border-#151A19",
    },
    stats: {
      battery: "Standard",
      oled: "Not Optimized",
      visibility: "High",
      style: "Minimal",
    },
  },
  {
    id: "ultraBlue",
    name: "Ultra Blue Nova",
    description: "Stunning ultra blue for cosmic experience",
    gradient: "from-#0D1117 to-#161B22",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 7l2 2a6 6 0 110.85-4.066 6.617-6.617 6.617 6.617 0-4.066-6.617 4.466 9.55 6.343c0 4.466-6.343 6.343 9.55 6.343-6.343 6.343-6.343-6.343 9.55 6.343 6.343z" />
      </svg>
    ),
    preview: {
      bg: "bg-#161B22",
      text: "text-#E6EEFF",
      border: "border-#0B4A7E",
    },
    stats: {
      battery: "Good",
      oled: "Not Optimized",
      visibility: "Excellent",
      style: "Cosmic",
    },
  },
];

export const THEME_ORDER: ThemeId[] = [
  "dark",
  "light",
  "oled",
  "coral",
  "emeraldNoir",
  "spaceGrey",
  "ultraBlue",
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