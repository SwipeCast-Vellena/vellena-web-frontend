
import React from 'react';
import { Home, Search, MessageCircle, User, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'feed', icon: Home, label: t('nav.feed') },
    { id: 'search', icon: Search, label: t('nav.search') },
    { id: 'campaigns', icon: Briefcase, label: t('nav.campaigns') },
    { id: 'chat', icon: MessageCircle, label: t('nav.chat') },
    { id: 'profile', icon: User, label: t('nav.profile') }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-1 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-slate-900' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
