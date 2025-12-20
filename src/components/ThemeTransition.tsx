import { useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export function ThemeTransition() {
  const { theme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match the transition duration

    return () => clearTimeout(timer);
  }, [theme]);

  if (!isTransitioning) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at center, ${
          theme === 'light' ? 'rgba(251, 191, 36, 0.1)' :
          theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' :
          theme === 'oled' ? 'rgba(0, 0, 0, 0.2)' :
          theme === 'cyber' ? 'rgba(147, 51, 234, 0.1)' :
          'rgba(99, 102, 241, 0.1)'
        }, transparent)`,
        animation: 'themeTransition 0.3s ease-out',
      }}
    >
      <div className="flex items-center space-x-2 text-white/80">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
      </div>
    </div>
  );
}

// Add the animation keyframes to the global styles
export function ThemeTransitionStyles() {
  return (
    <style jsx global>{`
      @keyframes themeTransition {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.1);
        }
        100% {
          opacity: 0;
          transform: scale(1.2);
        }
      }
    `}</style>
  );
}