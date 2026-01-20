import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

const ONBOARDING_STORAGE_KEY = 'cashflow_onboarding_completed_v2';

interface OnboardingContextType {
    isOnboardingActive: boolean;
    hasCompletedOnboarding: boolean;
    startOnboarding: () => void;
    completeOnboarding: () => void;
    skipOnboarding: () => void;
    resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [isOnboardingActive, setIsOnboardingActive] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const attemptCount = useRef(0);
    const maxAttempts = 5;

    // Check localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        const hasCompleted = completed === 'true';
        setHasCompletedOnboarding(hasCompleted);
        setIsReady(true);
    }, []);

    // Auto-start onboarding
    useEffect(() => {
        if (!isReady || hasCompletedOnboarding) return;

        const checkElementsAndStart = () => {
            const dashboardElements = [
                document.querySelector('nav'),
                document.querySelector('.stats-card'),
            ];

            const elementsExist = dashboardElements.some(el => el !== null);

            if (elementsExist) {
                setIsOnboardingActive(true);
                return;
            }

            attemptCount.current += 1;
            if (attemptCount.current < maxAttempts) {
                setTimeout(checkElementsAndStart, 500);
            } else {
                setIsOnboardingActive(true);
            }
        };

        const timer = setTimeout(checkElementsAndStart, 800);
        return () => clearTimeout(timer);
    }, [isReady, hasCompletedOnboarding]);

    const startOnboarding = useCallback(() => {
        setIsOnboardingActive(true);
    }, []);

    const completeOnboarding = useCallback(() => {
        setIsOnboardingActive(false);
        setHasCompletedOnboarding(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
        }
    }, []);

    const skipOnboarding = useCallback(() => {
        completeOnboarding();
    }, [completeOnboarding]);

    const resetOnboarding = useCallback(() => {
        setHasCompletedOnboarding(false);
        attemptCount.current = 0;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(ONBOARDING_STORAGE_KEY);
        }
        // Force state update to trigger auto-start effect
        setIsReady(false);
        setTimeout(() => setIsReady(true), 100);
    }, []);

    const value = {
        isOnboardingActive,
        hasCompletedOnboarding,
        startOnboarding,
        completeOnboarding,
        skipOnboarding,
        resetOnboarding,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboardingContext() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboardingContext must be used within an OnboardingProvider');
    }
    return context;
}
