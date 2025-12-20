/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          hover: '#1d4ed8',
        },
        secondary: '#64748b',
        // OLED theme colors - pure black for OLED displays
        oled: {
          bg: '#000000',
          card: '#0a0a0a',
          border: '#1a1a1a',
          text: '#ffffff',
          muted: '#a0a0a0',
        },
        // Navy theme colors
        navy: {
          bg: '#0f172a',
          card: '#1e3a8a',
          border: '#1d4ed8',
          text: '#e0f2fe',
          muted: '#93c5fd',
        },
        // Coral theme colors
        coral: {
          bg: '#ffe4e6',
          card: '#fb7185',
          border: '#f97316',
          text: '#7f1d1d',
          muted: '#fb7185',
        },
        // Emerald Noir theme - dark luxury green
        emerald: {
          bg: '#0a1612',
          card: '#0f1f18',
          border: '#065f46',
          text: '#d1fae5',
          muted: '#6ee7b7',
          accent: '#fbbf24',
        },
        // Space Grey theme - Apple inspired
        space: {
          bg: '#1c1c1e',
          card: '#2c2c2e',
          border: '#3a3a3c',
          text: '#f2f2f7',
          muted: '#aeaeb2',
        },
        // Ultra Blue Nova theme - cosmic blue
        nova: {
          bg: '#020617',
          card: '#0f172a',
          border: '#0369a1',
          text: '#e0f2fe',
          muted: '#38bdf8',
          accent: '#f472b6',
        },
      },
      spacing: {
        'section': '2rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(147, 51, 234, 0.5))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.8))' },
        },
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      const themes = ['light', 'dark', 'oled', 'navy', 'coral', 'emerald', 'space', 'nova', 'auto'];
      themes.forEach((theme) => {
        addVariant(theme, `.${theme} &`);
      });
    },
  ],
}
