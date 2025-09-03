import React from 'react';
import { Home, Search, MessageCircle, User, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationBarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  lastChatId?: string; // optional: last selected chat
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange, lastChatId }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const tabs = [
    { id: 'feed', icon: Home, label: t('nav.feed') },
    { id: 'campaigns', icon: Briefcase, label: t('nav.campaigns') },
    { id: 'chat', icon: MessageCircle, label: t('nav.chat') },
    { id: 'profile', icon: User, label: t('nav.profile') }
  ];

  const handleClick = (tabId: string) => {
    if (tabId === 'chat') {
      navigate(lastChatId ? `/model/chat/${lastChatId}` : '/model/chat/chat_campaign_model');
    } else if (tabId === 'feed') {
      navigate('/model/feed');
    } else if (tabId === 'campaigns') {
      navigate('/model/campaigns');
    } else if (tabId === 'profile') {
      navigate('/model/profile');
    }

    if (onTabChange) onTabChange(tabId);
  };




  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-1 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
                isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
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
