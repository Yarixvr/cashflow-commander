import { useOnboardingContext } from '../context/OnboardingContext';

// Re-export the hook to maintain backward compatibility with imports
export function useOnboarding() {
    return useOnboardingContext();
}
