
import React from 'react';
import { ArrowRight, Users, Video, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface OnboardingScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onSignUp, onLogin }) => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Video,
      title: t('onboarding.feature1.title'),
      description: t('onboarding.feature1.description')
    },
    {
      icon: Users,
      title: t('onboarding.feature2.title'),
      description: t('onboarding.feature2.description')
    },
    {
      icon: CheckCircle,
      title: t('onboarding.feature3.title'),
      description: t('onboarding.feature3.description')
    }
  ];

  return (
    <div  className="min-h-screen max-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-6">
      {/* Language Selector */}
      <div className="absolute top-8 right-6 z-10">
        <LanguageSelector />
      </div>
      
      {/* Header */}
      <div className="pt-3 pb-2 px-6 text-center">
        <div className="mx-auto mb-6 flex items-center justify-center">
          <img 
            src="/YOWORKS LOGO.png" 
            alt="Yo.Works" 
            className="h-16 w-auto object-contain"
          />
        </div>
        <p className="text-slate-600 text-lg leading-relaxed max-w-sm mx-auto">
          {t('onboarding.subtitle')}
        </p>
      </div>

      {/* Features */}
      <div className="flex-1 px-2 py-8 mt-[-15px]">
        <div className="space-y-6 max-w-md mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-fade-in">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="px-6 pb-8 space-y-4">
        <button
          onClick={onSignUp}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors"
        >
          <span>{t('onboarding.startNow')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={onLogin}
          className="w-full bg-white text-slate-900 py-4 rounded-2xl font-semibold text-lg border-2 border-slate-200 hover:border-slate-300 transition-colors"
        >
          {t('onboarding.haveAccount')}
        </button>

        <p className="text-xs text-slate-500 text-center leading-relaxed mt-6 px-4">
          {t('onboarding.terms')}
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreen;
