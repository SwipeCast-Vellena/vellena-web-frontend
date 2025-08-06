import React, { useState } from 'react';
import SplashScreen from '../components/SplashScreen';
import OnboardingScreen from '../components/OnboardingScreen';
import AuthScreen from '../components/AuthScreen';
import ProfileCreationScreen from '../components/ProfileCreationScreen';
import MainFeedScreen from '../components/MainFeedScreen';
import CampaignListScreen from '../components/CampaignListScreen';
import CampaignDetailScreen from '../components/CampaignDetailScreen';
import MatchConfirmationScreen from '../components/MatchConfirmationScreen';
import ChatScreen from '../components/ChatScreen';
import ProfileSettingsScreen from '../components/ProfileSettingsScreen';
import SearchScreen from '../components/SearchScreen';
import UserDetailScreen from '../components/UserDetailScreen';
import CampaignCreationScreen from '../components/CampaignCreationScreen';
import NavigationBar from '../components/NavigationBar';
import WalkthroughScreen from '../components/WalkthroughScreen';

type Screen = 
  | 'splash'
  | 'walkthrough'
  | 'onboarding'
  | 'signup'
  | 'login'
  | 'profile-creation'
  | 'main-feed'
  | 'campaigns'
  | 'campaign-detail'
  | 'campaign-creation'
  | 'match'
  | 'chat'
  | 'search'
  | 'profile'
  | 'user-detail';

interface Campaign {
  id: number;
  title: string;
  agency: string;
  description: string;
  deadline: string;
  timeLeft: string;
  requirements: {
    ageRange: string;
    height: string;
    gender: string;
    location: string;
  };
  budget: string;
  applicants: number;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleSplashComplete = () => {
    setCurrentScreen('walkthrough');
  };

  const handleWalkthroughComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleAuthBack = () => {
    setCurrentScreen('onboarding');
  };

  const handleAuthSuccess = () => {
    setCurrentScreen('profile-creation');
  };

  const handleProfileCreationBack = () => {
    setCurrentScreen('signup');
  };

  const handleProfileCreationComplete = () => {
    setCurrentScreen('main-feed');
  };

  const handleMatch = () => {
    setCurrentScreen('match');
  };

  const handleOpenChat = () => {
    setCurrentScreen('chat');
  };

  const handleContinueSwiping = () => {
    setCurrentScreen('main-feed');
  };

  const handleOpenCampaigns = () => {
    setCurrentScreen('campaigns');
  };

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCurrentScreen('campaign-detail');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('profile');
  };

  const handleLogout = () => {
    setCurrentScreen('onboarding');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'campaigns':
        setCurrentScreen('main-feed');
        break;
      case 'campaign-detail':
        setCurrentScreen('campaigns');
        break;
      case 'campaign-creation':
        setCurrentScreen('campaigns');
        break;
      case 'chat':
        setCurrentScreen('main-feed');
        break;
      case 'profile':
        setCurrentScreen('main-feed');
        break;
      case 'user-detail':
        setCurrentScreen('main-feed');
        break;
      default:
        setCurrentScreen('main-feed');
    }
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'feed':
        setCurrentScreen('main-feed');
        break;
      case 'campaigns':
        setCurrentScreen('campaigns');
        break;
      case 'search':
        setCurrentScreen('search');
        break;
      case 'chat':
        setCurrentScreen('chat');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
      default:
        setCurrentScreen('main-feed');
    }
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
    setCurrentScreen('user-detail');
  };

  const handleCreateCampaign = () => {
    setCurrentScreen('campaign-creation');
  };

  const showNavigation = ['main-feed', 'campaigns', 'search', 'chat', 'profile', 'user-detail', 'campaign-creation'].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      
      case 'walkthrough':
        return <WalkthroughScreen onComplete={handleWalkthroughComplete} />;
      
      case 'onboarding':
        return <OnboardingScreen onSignUp={handleSignUp} onLogin={handleLogin} />;
      
      case 'signup':
        return <AuthScreen isLogin={false} onBack={handleAuthBack} onSuccess={handleAuthSuccess} />;
      
      case 'login':
        return <AuthScreen isLogin={true} onBack={handleAuthBack} onSuccess={handleProfileCreationComplete} />;
      
      case 'profile-creation':
        return <ProfileCreationScreen onBack={handleProfileCreationBack} onComplete={handleProfileCreationComplete} />;
      
      case 'main-feed':
        return <MainFeedScreen onMatch={handleMatch} onOpenChat={handleOpenChat} onUserSelect={handleUserSelect} />;
      
      case 'campaigns':
        return <CampaignListScreen onBack={handleBack} onCampaignSelect={handleCampaignSelect} />;
      
      case 'campaign-detail':
        if (!selectedCampaign) return null;
        return <CampaignDetailScreen campaign={selectedCampaign} onBack={handleBack} onApply={handleBack} />;
      
      case 'campaign-creation':
        return <CampaignCreationScreen onBack={handleBack} onSave={handleBack} />;
      
      case 'match':
        return <MatchConfirmationScreen onStartChat={handleOpenChat} onContinueSwiping={handleContinueSwiping} />;
      
      case 'chat':
        return <ChatScreen onBack={handleBack} />;
      
      case 'search':
        return <SearchScreen onUserSelect={handleUserSelect} />;
      
      case 'profile':
        return <ProfileSettingsScreen onBack={handleBack} onLogout={handleLogout} />;
      
      case 'user-detail':
        return <UserDetailScreen userId={selectedUserId} onBack={handleBack} />;
      
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}
      {showNavigation && (
        <NavigationBar 
          activeTab={currentScreen === 'main-feed' ? 'feed' : currentScreen} 
          onTabChange={handleTabChange} 
        />
      )}
    </div>
  );
};

export default Index;
