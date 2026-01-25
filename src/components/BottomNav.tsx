import { useTranslation } from 'react-i18next';

interface BottomNavProps {
    activeView: 'dashboard' | 'themes' | 'profile';
    setActiveView: (view: 'dashboard' | 'themes' | 'profile') => void;
}

export function BottomNav({ activeView, setActiveView }: BottomNavProps) {
    const { t } = useTranslation();

    const navItems = [
        {
            id: 'dashboard' as const,
            label: t('nav.dashboard'),
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            id: 'themes' as const,
            label: t('nav.themes'),
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ),
        },
        {
            id: 'profile' as const,
            label: t('nav.profile'),
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-800/95 oled:bg-black/95 emerald:bg-[#0a1612]/95 space:bg-[#1c1c1e]/95 nova:bg-[#020617]/95 navy:bg-[#0f172a]/95 coral:bg-white/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 oled:border-gray-900 emerald:border-emerald-800 space:border-zinc-700 nova:border-sky-800 navy:border-blue-900 coral:border-pink-200 transition-all-fast">
            {/* Safe area padding for notched phones */}
            <div className="pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            data-id={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[64px] px-3 py-2 rounded-lg transition-all-fast touch-feedback ${activeView === item.id
                                ? 'text-blue-600 dark:text-blue-400 oled:text-blue-400 emerald:text-emerald-400 space:text-zinc-100 nova:text-sky-400 navy:text-blue-300 coral:text-pink-600'
                                : 'text-slate-500 dark:text-slate-400 oled:text-gray-500 emerald:text-emerald-500 space:text-zinc-500 nova:text-sky-500 navy:text-blue-400 coral:text-slate-500'
                                }`}
                            aria-label={item.label}
                        >
                            <span className={`transition-transform duration-200 ${activeView === item.id ? 'scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-xs mt-1 font-medium ${activeView === item.id ? 'font-semibold' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
