import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_STORAGE_KEY = 'cashflow_onboarding_completed';

export function useOnboarding() {
    const [isOnboardingActive, setIsOnboardingActive] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true); // Default to true to prevent flash

    // Check localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        const hasCompleted = completed === 'true';
        setHasCompletedOnboarding(hasCompleted);

        // Auto-start onboarding for first-time users after a short delay
        if (!hasCompleted) {
            const timer = setTimeout(() => {
                setIsOnboardingActive(true);
            }, 1000); // Wait 1 second for UI to stabilize
            return () => clearTimeout(timer);
        }
    }, []);

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
        if (typeof window !== 'undefined') {
            localStorage.removeItem(ONBOARDING_STORAGE_KEY);
        }
    }, []);

    return {
        isOnboardingActive,
        hasCompletedOnboarding,
        startOnboarding,
        completeOnboarding,
        skipOnboarding,
        resetOnboarding,
    };
}
