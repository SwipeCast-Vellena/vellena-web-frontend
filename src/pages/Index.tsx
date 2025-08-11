import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";
import WalkthroughScreen from "../components/WalkthroughScreen";
import OnboardingScreen from "../components/OnboardingScreen";
import AuthScreen from "../components/AuthScreen";
import ProfileCreationScreen from "../components/ProfileCreationScreenModel";
import MainFeedScreen from "../components/MainFeedScreen";
import CampaignListScreen from "../components/CampaignListScreen";
import CampaignDetailScreen from "../components/CampaignDetailScreen";
import CampaignCreationScreen from "../components/CampaignCreationScreen";
import MatchConfirmationScreen from "../components/MatchConfirmationScreen";
import ChatScreen from "../components/ChatScreen";
import SearchScreen from "../components/SearchScreen";
import ProfileSettingsScreen from "../components/ProfileSettingsScreen";
import UserDetailScreen from "../components/UserDetailScreen";
import NavigationBar from "../components/NavigationBar";

export const SplashRoute = () => {
  const navigate = useNavigate();
  return <SplashScreen onComplete={() => navigate("/walkthrough")} />;
};

export const WalkthroughRoute = () => {
  const navigate = useNavigate();
  return <WalkthroughScreen onComplete={() => navigate("/onboarding")} />;
};

export const OnboardingRoute = () => {
  const navigate = useNavigate();
  return (
    <OnboardingScreen
      onSignUp={() => navigate("/signup")}
      onLogin={() => navigate("/login")}
    />
  );
};

export const SignUpRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthScreen
      isLogin={false}
      onBack={() => navigate("/onboarding")}
      onSuccess={(role: "model" | "agency") => {
        if (role === "model") {
          navigate("/model/profile-creation");
        } else {
          navigate("/agency/profile-creation");
        }
      }}
    />
  );
};


export const LoginRoute = () => {
  const navigate = useNavigate();
  return (
    <AuthScreen
      isLogin={true}
      onBack={() => navigate("/onboarding")}
      onSuccess={() => navigate("/feed")}
    />
  );
};

export const ProfileCreationRouteModel = () => {
  const navigate = useNavigate();
  return (
    <ProfileCreationScreen
      onBack={() => navigate("/signup")}
      onComplete={() => navigate("/feed")}
    />
  );
};

export const FeedRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <MainFeedScreen
        onMatch={() => navigate("/match")}
        onOpenChat={() => navigate("/chat")}
        onUserSelect={(id) => navigate(`/user/${id}`)}
      />
      <NavigationBar activeTab="feed" onTabChange={(tab) => navigate(`/${tab}`)} />
    </>
  );
};

export const CampaignsRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <CampaignListScreen
        onBack={() => navigate("/feed")} // ✅ Added
        onCampaignSelect={(c) => navigate(`/campaign/${c.id}`)}
      />
      <NavigationBar activeTab="campaigns" onTabChange={(tab) => navigate(`/${tab}`)} />
    </>
  );
};

export const CampaignDetailRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Temporary placeholder until you fetch from API
  const campaign = {
    id: Number(id),
    title: "Fashion Week Milano",
    agency: "Elite Models",
    description:
      "Campagna per la settimana della moda di Milano, cerchiamo modelle/i professionisti per sfilate ed eventi correlati.",
    deadline: "2025-08-31",
    timeLeft: "3 giorni",
    requirements: {
      ageRange: "18-30",
      height: "Minimo 170cm",
      gender: "Qualsiasi",
      location: "Milano, Italia",
    },
    budget: "€2000",
    applicants: 15,
  };

  return (
    <CampaignDetailScreen
      campaign={campaign}
      onBack={() => navigate("/campaigns")}
      onApply={() => navigate("/campaigns")}
    />
  );
};



export const CampaignCreateRoute = () => {
  const navigate = useNavigate();
  return (
    <CampaignCreationScreen onBack={() => navigate("/campaigns")} onSave={() => navigate("/campaigns")} />
  );
};

export const MatchRoute = () => {
  const navigate = useNavigate();
  return (
    <MatchConfirmationScreen
      onStartChat={() => navigate("/chat")}
      onContinueSwiping={() => navigate("/feed")}
    />
  );
};

export const ChatRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <ChatScreen onBack={() => navigate("/feed")} />
      <NavigationBar activeTab="chat" onTabChange={(tab) => navigate(`/${tab}`)} />
    </>
  );
};

export const SearchRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <SearchScreen onUserSelect={(id) => navigate(`/user/${id}`)} />
      <NavigationBar activeTab="search" onTabChange={(tab) => navigate(`/${tab}`)} />
    </>
  );
};

export const ProfileRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <ProfileSettingsScreen
        onBack={() => navigate("/feed")}
        onLogout={() => navigate("/onboarding")}
      />
      <NavigationBar activeTab="profile" onTabChange={(tab) => navigate(`/${tab}`)} />
    </>
  );
};

export const UserDetailRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <UserDetailScreen userId={Number(id)} onBack={() => navigate("/feed")} />
      <NavigationBar activeTab="user" onTabChange={(tab) => navigate(`/${tab}`)} />
    </>
  );
};
