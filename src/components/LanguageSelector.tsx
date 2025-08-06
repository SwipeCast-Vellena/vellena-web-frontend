import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'default' | 'overlay';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'default' }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'it', label: t('language.italian'), flag: '🇮🇹' },
    { code: 'en', label: t('language.english'), flag: '🇺🇸' }
  ];

  const selectedLanguage = languages.find(lang => lang.code === language);

  const baseClasses = variant === 'overlay' 
    ? "absolute top-8 right-6 z-10 bg-white/20 backdrop-blur-sm border border-white/20 text-white"
    : "bg-white border border-slate-200 text-slate-900";

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className={`${baseClasses} rounded-xl px-3 py-2 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all pr-8`}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-slate-900">
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
        variant === 'overlay' ? 'text-white/70' : 'text-slate-400'
      }`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;