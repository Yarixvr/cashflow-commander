import { useState, useEffect, useCallback, useRef } from 'react';

interface TourStep {
    id: string;
    title: string;
    description: string;
    targetSelector: string | null; // null for welcome/complete screens
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    icon: string;
}

const TOUR_STEPS: TourStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to CashFlow Commander! 🎉',
        description: 'Let us show you around. This quick tour will help you master your finances in no time.',
        targetSelector: null,
        position: 'center',
        icon: '👋',
    },
    {
        id: 'navigation',
        title: 'Navigation Tabs',
        description: 'Switch between different views: Overview for a quick glance, Transactions for details, Budgets to set limits, and Insights for smart tips.',
        targetSelector: 'nav',
        position: 'bottom',
        icon: '🧭',
    },
    {
        id: 'stats',
        title: 'Your Financial Stats',
        description: 'See your total balance, monthly income, expenses, and net flow at a glance. These update automatically as you add transactions.',
        targetSelector: '.stats-card',
        position: 'bottom',
        icon: '📊',
    },
    {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Add transactions, accounts, or budgets with one click. These shortcuts make managing your finances super fast!',
        targetSelector: '.action-btn',
        position: 'left',
        icon: '⚡',
    },
    {
        id: 'insights',
        title: 'Smart Insights',
        description: 'AI-powered insights analyze your spending patterns and give you personalized tips to save more money.',
        targetSelector: '.insight-card',
        position: 'top',
        icon: '🧠',
    },
    {
        id: 'themes',
        title: 'Beautiful Themes',
        description: 'Personalize your experience! Click on "Themes" to choose from 8 stunning color themes including dark mode.',
        targetSelector: 'button:has-text("Themes"), [class*="Themes"]',
        position: 'bottom',
        icon: '🎨',
    },
    {
        id: 'complete',
        title: "You're All Set! 🚀",
        description: "You're ready to take control of your finances. Start by adding your first transaction or account!",
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
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = TOUR_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === TOUR_STEPS.length - 1;
    const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

    // Find and measure target element
    useEffect(() => {
        if (!isActive || !step.targetSelector) {
            setTargetRect(null);
            return;
        }

        const findTarget = () => {
            // Try multiple selector strategies
            let target: Element | null = null;

            // Direct selector
            target = document.querySelector(step.targetSelector!);

            // Fallback: find by class contains
            if (!target && step.targetSelector!.includes('.')) {
                const className = step.targetSelector!.replace('.', '');
                target = document.querySelector(`[class*="${className}"]`);
            }

            if (target) {
                const rect = target.getBoundingClientRect();
                setTargetRect(rect);
            } else {
                setTargetRect(null);
            }
        };

        // Initial find
        findTarget();

        // Re-find on resize/scroll
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
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 200);
        }
    }, [isLastStep, onComplete]);

    const goToPrev = useCallback(() => {
        if (!isFirstStep) {
            setIsAnimating(true);
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

    // Calculate tooltip position
    const getTooltipPosition = () => {
        if (!targetRect || step.position === 'center') {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        const padding = 20;
        const tooltipWidth = 360;
        const tooltipHeight = 200;

        switch (step.position) {
            case 'bottom':
                return {
                    top: `${targetRect.bottom + padding}px`,
                    left: `${Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding))}px`,
                };
            case 'top':
                return {
                    top: `${targetRect.top - tooltipHeight - padding}px`,
                    left: `${Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding))}px`,
                };
            case 'left':
                return {
                    top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
                    left: `${targetRect.left - tooltipWidth - padding}px`,
                };
            case 'right':
                return {
                    top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
                    left: `${targetRect.right + padding}px`,
                };
            default:
                return {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                };
        }
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

        // Create a path that covers the whole screen except the spotlight area
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
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
            {/* Dark overlay with spotlight cutout */}
            <div
                className="absolute inset-0 bg-black/80 transition-all duration-500"
                style={{
                    clipPath: targetRect ? getSpotlightClipPath() : 'none',
                }}
                onClick={onSkip}
            />

            {/* Spotlight ring effect */}
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

            {/* Tooltip */}
            <div
                ref={tooltipRef}
                className={`absolute w-[360px] bg-white dark:bg-slate-800 oled:bg-gray-900 emerald:bg-emerald-900 space:bg-zinc-800 nova:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-600 oled:border-gray-700 emerald:border-emerald-600 space:border-zinc-600 nova:border-sky-700 overflow-hidden tour-tooltip ${isAnimating ? 'tour-tooltip-exit' : 'tour-tooltip-enter'}`}
                style={getTooltipPosition()}
            >
                {/* Progress bar */}
                <div className="h-1 bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div className="text-4xl mb-4 tour-icon">{step.icon}</div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                        {step.description}
                    </p>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        {/* Step indicator */}
                        <div className="flex items-center gap-1.5">
                            {TOUR_STEPS.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                                        ? 'bg-blue-500 w-6'
                                        : index < currentStep
                                            ? 'bg-blue-300 dark:bg-blue-700'
                                            : 'bg-slate-300 dark:bg-slate-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                            {!isFirstStep && (
                                <button
                                    onClick={goToPrev}
                                    className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                onClick={onSkip}
                                className="px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            >
                                Skip
                            </button>

                            <button
                                onClick={goToNext}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg tour-next-btn"
                            >
                                {isLastStep ? 'Get Started' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Arrow pointer */}
                {targetRect && step.position !== 'center' && (
                    <div
                        className={`absolute tour-arrow tour-arrow-${step.position}`}
                    />
                )}
            </div>
        </div>
    );
}
