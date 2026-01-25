import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface TourStep {
    id: string;
    titleKey: string;
    descriptionKey: string;
    targetSelector: string | null;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    icon: string;
}

// Mobile-optimized onboarding: 4 steps
const MOBILE_TOUR_STEPS: TourStep[] = [
    {
        id: 'welcome',
        titleKey: 'onboarding.welcome.title',
        descriptionKey: 'onboarding.welcome.description',
        targetSelector: null,
        position: 'center',
        icon: '👋',
    },
    {
        id: 'navigation',
        titleKey: 'onboarding.navigation.title',
        descriptionKey: 'onboarding.navigation.description',
        // Target the button inside the mobile bottom nav (md:hidden)
        targetSelector: 'nav.md\\:hidden button[data-id="dashboard"]',
        position: 'center',
        icon: '🧭',
    },
    {
        id: 'themes',
        titleKey: 'onboarding.themes.title',
        descriptionKey: 'onboarding.themes.description',
        // Target the button inside the mobile bottom nav (md:hidden)
        targetSelector: 'nav.md\\:hidden button[data-id="themes"]',
        position: 'center',
        icon: '🎨',
    },
    {
        id: 'complete',
        titleKey: 'onboarding.complete.title',
        descriptionKey: 'onboarding.complete.description',
        targetSelector: null,
        position: 'center',
        icon: '✨',
    },
];

// Full desktop onboarding: 7 steps
const DESKTOP_TOUR_STEPS: TourStep[] = [
    {
        id: 'welcome',
        titleKey: 'onboarding.welcome.title',
        descriptionKey: 'onboarding.welcome.description',
        targetSelector: null,
        position: 'center',
        icon: '👋',
    },
    {
        id: 'navigation',
        titleKey: 'onboarding.navigation.title',
        descriptionKey: 'onboarding.navigation.description',
        targetSelector: 'nav button[data-id="dashboard"]',
        position: 'bottom',
        icon: '🧭',
    },
    {
        id: 'stats',
        titleKey: 'onboarding.stats.title',
        descriptionKey: 'onboarding.stats.description',
        targetSelector: '.stats-card',
        position: 'bottom',
        icon: '📊',
    },
    {
        id: 'quick-actions',
        titleKey: 'onboarding.quickActions.title',
        descriptionKey: 'onboarding.quickActions.description',
        targetSelector: '.action-btn',
        position: 'left',
        icon: '⚡',
    },
    {
        id: 'insights',
        titleKey: 'onboarding.insights.title',
        descriptionKey: 'onboarding.insights.description',
        targetSelector: '.insight-card',
        position: 'top',
        icon: '🧠',
    },
    {
        id: 'themes',
        titleKey: 'onboarding.themes.title',
        descriptionKey: 'onboarding.themes.description',
        targetSelector: 'button[data-id="themes"]',
        position: 'bottom',
        icon: '🎨',
    },
    {
        id: 'complete',
        titleKey: 'onboarding.complete.title',
        descriptionKey: 'onboarding.complete.description',
        targetSelector: null,
        position: 'center',
        icon: '✨',
    },
];

interface OnboardingTourProps {
    isActive: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

export function OnboardingTour({ isActive, onComplete, onSkip }: OnboardingTourProps) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const prevActiveRef = useRef(isActive);
    const retryCountRef = useRef(0);
    const maxRetries = 3;

    // Use adaptive steps based on device type
    const tourSteps = isMobile ? MOBILE_TOUR_STEPS : DESKTOP_TOUR_STEPS;
    const step = tourSteps[currentStep] || tourSteps[0];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === tourSteps.length - 1;
    const progress = ((currentStep + 1) / tourSteps.length) * 100;

    // Check key: hide tooltip if we need a target but haven't found it yet
    const shouldHideTooltip = !isMobile && step.targetSelector && !targetRect;

    // Reset step when tour becomes active
    useEffect(() => {
        if (isActive && !prevActiveRef.current) {
            setCurrentStep(0);
            retryCountRef.current = 0;
        }
        prevActiveRef.current = isActive;
    }, [isActive]);

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Find and measure target element with retry logic
    useEffect(() => {
        if (!isActive || !step.targetSelector) {
            setTargetRect(null);
            retryCountRef.current = 0;
            return;
        }

        const findTarget = () => {
            let target: Element | null = null;

            try {
                // Direct selector
                target = document.querySelector(step.targetSelector!);

                // Fallback: find by class contains
                if (!target && step.targetSelector!.includes('.')) {
                    const className = step.targetSelector!.replace('.', '');
                    target = document.querySelector(`[class*="${className}"]`);
                }
            } catch (e) {
                console.warn('Invalid selector in onboarding tour:', step.targetSelector);
                return false;
            }

            if (target) {
                const rect = target.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    setTargetRect(rect);
                    retryCountRef.current = 0;
                    return true;
                }
            }

            return false;
        };

        if (!findTarget()) {
            const retryInterval = setInterval(() => {
                if (findTarget() || retryCountRef.current >= maxRetries) {
                    clearInterval(retryInterval);
                    if (retryCountRef.current >= maxRetries) {
                        setTargetRect(null);
                    }
                }
                retryCountRef.current++;
            }, 500);

            return () => clearInterval(retryInterval);
        }

        const handleUpdate = () => findTarget();
        window.addEventListener('resize', handleUpdate);
        window.addEventListener('scroll', handleUpdate);

        return () => {
            window.removeEventListener('resize', handleUpdate);
            window.removeEventListener('scroll', handleUpdate);
        };
    }, [isActive, step.targetSelector, currentStep]);

    const goToNext = useCallback(() => {
        if (isLastStep) {
            onComplete();
        } else {
            setIsAnimating(true);
            retryCountRef.current = 0;
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 200);
        }
    }, [isLastStep, onComplete]);

    const goToPrev = useCallback(() => {
        if (!isFirstStep) {
            setIsAnimating(true);
            retryCountRef.current = 0;
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 200);
        }
    }, [isFirstStep]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onSkip();
            if (e.key === 'ArrowRight' || e.key === 'Enter') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, goToNext, goToPrev, onSkip]);

    if (!isActive) return null;

    // Calculate tooltip position with mobile-aware clamping
    const getTooltipPosition = () => {
        // Use visualViewport if available for more accurate mobile sizing
        const viewportWidth = window.visualViewport?.width || window.innerWidth;
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const viewportTop = window.visualViewport?.offsetTop || 0;
        const viewportLeft = window.visualViewport?.offsetLeft || 0;

        if (!targetRect || step.position === 'center' || isMobile) {
            // Center in the visual viewport
            return {
                top: `${viewportTop + (viewportHeight / 2)}px`,
                left: `${viewportLeft + (viewportWidth / 2)}px`,
                transform: 'translate(-50%, -50%)',
                width: isMobile ? 'calc(100vw - 32px)' : undefined,
                maxWidth: '400px',
                position: 'fixed' as const, // Ensure it floats above everything
            };
        }

        const padding = 20;
        const tooltipWidth = Math.min(360, viewportWidth - 40);
        const tooltipHeight = 200;

        let top: number;
        let left: number;

        switch (step.position) {
            case 'bottom':
                top = Math.min(targetRect.bottom + padding, viewportHeight - tooltipHeight - padding);
                left = Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, viewportWidth - tooltipWidth - padding));
                break;
            case 'top':
                top = Math.max(padding, targetRect.top - tooltipHeight - padding);
                left = Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, viewportWidth - tooltipWidth - padding));
                break;
            case 'left':
                top = Math.max(padding, Math.min(targetRect.top + targetRect.height / 2 - tooltipHeight / 2, viewportHeight - tooltipHeight - padding));
                left = Math.max(padding, targetRect.left - tooltipWidth - padding);
                break;
            case 'right':
                top = Math.max(padding, Math.min(targetRect.top + targetRect.height / 2 - tooltipHeight / 2, viewportHeight - tooltipHeight - padding));
                left = Math.min(targetRect.right + padding, viewportWidth - tooltipWidth - padding);
                break;
            default:
                return {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                };
        }

        return {
            top: `${top}px`,
            left: `${left}px`,
        };
    };

    // Calculate spotlight clip path
    const getSpotlightClipPath = () => {
        if (!targetRect) return 'none';

        const padding = 8;
        const x = targetRect.left - padding;
        const y = targetRect.top - padding;
        const width = targetRect.width + padding * 2;
        const height = targetRect.height + padding * 2;
        const radius = 12;

        return `polygon(
      0% 0%, 
      0% 100%, 
      ${x}px 100%, 
      ${x}px ${y + radius}px,
      ${x + radius}px ${y}px,
      ${x + width - radius}px ${y}px,
      ${x + width}px ${y + radius}px,
      ${x + width}px ${y + height - radius}px,
      ${x + width - radius}px ${y + height}px,
      ${x + radius}px ${y + height}px,
      ${x}px ${y + height - radius}px,
      ${x}px 100%,
      100% 100%, 
      100% 0%
    )`;
    };

    return (
        <div className={`fixed inset-0 z-[9999] pointer-events-auto ${isMobile ? 'flex items-center justify-center p-4' : ''}`}>
            {/* Dark overlay with spotlight cutout */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-500 touch-none"
                style={{
                    clipPath: targetRect ? getSpotlightClipPath() : 'none',
                    // On mobile, just fill the screen without fixed positioning hacks
                    ...(isMobile ? { position: 'absolute' } : {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    })
                }}
                onClick={onSkip}
            />

            {/* Spotlight ring effect - enable on mobile too */}
            {targetRect && (
                <div
                    className="absolute pointer-events-none tour-spotlight-ring"
                    style={{
                        left: targetRect.left - 12,
                        top: targetRect.top - 12,
                        width: targetRect.width + 24,
                        height: targetRect.height + 24,
                        borderRadius: '16px',
                    }}
                />
            )}

            {/* Tooltip - responsive width */}
            <div
                ref={tooltipRef}
                className={`
                    bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden tour-tooltip 
                    ${isAnimating ? 'tour-tooltip-exit' : 'tour-tooltip-enter'}
                    ${isMobile ? 'relative w-full max-w-sm z-50' : 'absolute w-[90vw] max-w-[360px]'}
                `}
                style={isMobile ? {
                    // Reset styles for flexbox centering
                    top: 'auto',
                    left: 'auto',
                    transform: 'none',
                    opacity: 1 // Always visible on mobile once mounted
                } : {
                    ...getTooltipPosition(),
                    opacity: shouldHideTooltip ? 0 : 1, // Prevent flash of misplaced content
                    transition: 'opacity 0.2s ease, top 0.3s cubic-bezier(0.22, 1, 0.36, 1), left 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
            >
                {/* Progress bar */}
                <div className="h-1 bg-slate-700">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {/* Icon */}
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 tour-icon">{step.icon}</div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {t(step.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-4 sm:mb-6">
                        {t(step.descriptionKey)}
                    </p>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        {/* Step indicator */}
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            {tourSteps.map((_: TourStep, index: number) => (
                                <div
                                    key={index}
                                    className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentStep
                                        ? 'bg-blue-500 w-4 sm:w-6'
                                        : index < currentStep
                                            ? 'bg-blue-600'
                                            : 'bg-slate-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Buttons - larger touch targets on mobile */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {!isFirstStep && (
                                <button
                                    onClick={goToPrev}
                                    className="px-3 py-2 sm:px-3 sm:py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                >
                                    {t('onboarding.back')}
                                </button>
                            )}

                            <button
                                onClick={onSkip}
                                className="px-3 py-2 sm:px-3 sm:py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                {t('onboarding.skip')}
                            </button>

                            <button
                                onClick={goToNext}
                                className="px-4 py-2.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg tour-next-btn"
                            >
                                {isLastStep ? t('onboarding.getStarted') : t('onboarding.next')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Arrow pointer - only show on desktop with valid target */}
                {targetRect && !isMobile && step.position !== 'center' && (
                    <div
                        className={`absolute tour-arrow tour-arrow-${step.position}`}
                    />
                )}
            </div>
        </div>
    );
}
