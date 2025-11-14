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
        // Cyber theme colors - purple/pink aesthetic
        cyber: {
          bg: '#0f0a1f',
          card: '#1a0f2e',
          border: '#2d1b69',
          text: '#f8f0ff',
          accent: '#ff00ff',
          accent2: '#00ffff',
          muted: '#b794f6',
        },
        navy: {
          bg: '#0f172a',
          card: '#1e3a8a',
          border: '#1d4ed8',
          text: '#e0f2fe',
          muted: '#93c5fd',
        },
        coral: {
          bg: '#ffe4e6',
          card: '#fb7185',
          border: '#f97316',
          text: '#7f1d1d',
          muted: '#fb7185',
        },
        mint: {
          bg: '#d1fae5',
          card: '#34d399',
          border: '#0d9488',
          text: '#065f46',
          muted: '#5eead4',
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
      const themes = ['light', 'dark', 'oled', 'cyber', 'navy', 'coral', 'mint', 'auto'];
      themes.forEach((theme) => {
        addVariant(theme, `.${theme} &`);
      });
    },
  ],
}
