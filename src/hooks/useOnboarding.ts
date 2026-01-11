import { useState, useEffect, useCallback, useRef } from 'react';

const ONBOARDING_STORAGE_KEY = 'cashflow_onboarding_completed_v2';

export function useOnboarding() {
    const [isOnboardingActive, setIsOnboardingActive] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true); // Default to true to prevent flash
    const [isReady, setIsReady] = useState(false);
    const attemptCount = useRef(0);
    const maxAttempts = 5;

    // Check localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        const hasCompleted = completed === 'true';
        setHasCompletedOnboarding(hasCompleted);

        // Mark as ready after initial check
        setIsReady(true);
    }, []);

    // Auto-start onboarding for first-time users with better element detection
    useEffect(() => {
        if (!isReady || hasCompletedOnboarding) return;

        const checkElementsAndStart = () => {
            // Check if key dashboard elements exist
            const dashboardElements = [
                document.querySelector('nav'),
                document.querySelector('.stats-card'),
            ];

            const elementsExist = dashboardElements.some(el => el !== null);

            if (elementsExist) {
                setIsOnboardingActive(true);
                return;
            }

            // Retry up to maxAttempts times
            attemptCount.current += 1;
            if (attemptCount.current < maxAttempts) {
                setTimeout(checkElementsAndStart, 500);
            } else {
                // Start anyway after max attempts - better to show than not
                setIsOnboardingActive(true);
            }
        };

        // Initial delay to let the page render
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
        // Trigger re-check after reset
        setIsReady(false);
        setTimeout(() => setIsReady(true), 100);
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
