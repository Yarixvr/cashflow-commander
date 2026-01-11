import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languageOptions, isRTL } from '../i18n';

export function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languageOptions.find(l => l.code === i18n.language) || languageOptions[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);

        // Update document direction for RTL languages
        document.documentElement.dir = isRTL(langCode) ? 'rtl' : 'ltr';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 oled:text-gray-300 emerald:text-emerald-200 space:text-zinc-300 nova:text-sky-200 navy:text-blue-100 coral:text-[#a21d4d] hover:bg-white/20 transition-all-fast"
                aria-label="Select language"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.nativeName}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 oled:bg-gray-900 emerald:bg-emerald-900 space:bg-zinc-800 nova:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 oled:border-gray-700 emerald:border-emerald-600 space:border-zinc-600 nova:border-sky-700 overflow-hidden z-50 animate-fade-in">
                    {languageOptions.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${i18n.language === lang.code
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <div className="flex flex-col">
                                <span className="font-medium">{lang.nativeName}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{lang.name}</span>
                            </div>
                            {i18n.language === lang.code && (
                                <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
