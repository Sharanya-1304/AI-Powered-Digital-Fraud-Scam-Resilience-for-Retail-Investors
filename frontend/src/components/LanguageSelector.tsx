import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు' },
  ];

  return (
    <div className={`relative inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/80 ${className}`}>
      <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 shrink-0" />
      <div className="flex items-center gap-0.5">
        {languages.map((item) => {
          const isActive = language === item.code || i18n.language === item.code;
          return (
            <button
              key={item.code}
              onClick={() => handleLanguageChange(item.code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                isActive
                  ? 'bg-white text-cyan-700 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title={`Switch language to ${item.label}`}
              aria-label={`Switch language to ${item.label}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
