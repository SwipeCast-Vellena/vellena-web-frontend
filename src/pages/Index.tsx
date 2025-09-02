import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";
import WalkthroughScreen from "../components/WalkthroughScreen";
import OnboardingScreen from "../components/OnboardingScreen";
import AuthScreen from "../components/AuthScreen";
import ProfileCreationScreenModel from "../components/ProfileCreationScreenModel";
import ProfileCreationScreenAgency from "../components/ProfileCreationScreenAgency";
import MainFeedScreenModel from "../components/MainFeedScreenModel"
import MainFeedScreenAgency from "../components/MainFeedScreenAgency";
import CampaignListScreen from "../components/CampaignListScreen";
import { CampaignDetailRoute } from "../components/CampaignDetailRoute";
import CampaignCreationScreen from "../components/CampaignCreationScreen";
import MatchConfirmationScreen from "../components/MatchConfirmationScreen";
import ChatScreen from "../components/ChatScreen";
import ChatPage from "@/components/ChatPage";
import ChatPageAgency from "@/components/ChatPageAgency";

import SearchScreen from "../components/SearchScreen";
import ProfileSettingsScreen from "../components/ProfileSettingsScreen";
import UserDetailScreen from "../components/UserDetailScreen";
import NavigationBar from "../components/NavigationBar";
import Navbarmodel from "../components/NavBarModel"
import ProfileEditScreenAgency from "@/components/ProfileEditScreenAgency";
import CampaignListScreenAgency from "@/components/CampaignListScreenAgency";

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
        } 
        else {
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
            onSuccess={(role: "model" | "agency") => {
        if (role === "model") {
          navigate("/model/feed");
        } 
        else {
          navigate("/agency/feed");
        }
      }}
    />
  );
};

export const ProfileCreationRouteModel = () => {
  const navigate = useNavigate();
  return (
    <ProfileCreationScreenModel
      onBack={() => navigate("/signup")}
      onComplete={() => navigate("/model/feed")}
    />
  );
};

export const ModelFeedRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <MainFeedScreenModel
        onCampaignSelect={(c) => navigate(`/model/campaign/${c.id}`)}
        onEditProfile={() => navigate("/model/profile")}
      />
      <Navbarmodel
        activeTab="feed"
        onTabChange={(tab) => navigate(`/model/${tab}`)}
      />
    </>
  );
};



export const ProfileCreationRouteAgency = () => {
  const navigate = useNavigate();
  return (
    <ProfileCreationScreenAgency
      onBack={() => navigate("/signup")}
      onComplete={() => navigate("/agency/feed")}
    />
  );
};

export const AgencyFeedRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <MainFeedScreenAgency
        onMatch={() => navigate("/match")}
        onOpenChat={() => navigate("/chat")}
        onUserSelect={(id) => navigate(`/user/${id}`)}
      />
      <NavigationBar
        activeTab="agency/feed"
        onTabChange={(tab) => navigate(`/agency/${tab}`)}
      />

    </>
  );
};

export const CampaignsRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <CampaignListScreen
        onBack={() => navigate("/model/feed")}
        onCampaignSelect={(c) => navigate(`/model/campaign/${c.id}`)}
      />
      <Navbarmodel
        activeTab="campaigns"
        onTabChange={(tab) => navigate(`/model/${tab}`)}
      />
    </>
  );
};



export const AgencyCampaignRoute=()=>{
  const navigate=useNavigate();
  return (
    <>
    <CampaignListScreenAgency
    onBack={() => navigate(-1)}
    onCampaignSelect={(c) => navigate(`/agency/campaign/${c.id}`)} 
    />
    <NavigationBar activeTab="campaigns" onTabChange={(tab) => navigate(`/agency/${tab}`)} />
    </>
  )
}

export const CampaignDetailRouteWrapper = () => {
  const navigate = useNavigate();
  return (
    <CampaignDetailRoute
      onBack={() => navigate("/model/campaigns")}
      onApply={() => navigate("/model/campaigns")}
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
      onContinueSwiping={() => navigate("/agency/feed")}
    />
  );
};

export const ChatRoute = () => {
  const navigate = useNavigate();
  const defaultChatId = "chat_campaign_model";

  return (
    <>
      <ChatPage />
      <Navbarmodel
        activeTab="chat"
        lastChatId={defaultChatId}   // pass default chat id
        onTabChange={(tab) => {
          if (tab === "chat") {
            navigate(`/model/chat/${defaultChatId}`);
          } else {
            navigate(`/model/${tab}`);
          }
        }}
      />
    </>
  );
};

export const AgencyChatRoute = () => {
  const navigate = useNavigate();
  const defaultChatId = "chat_campaign_model";

  return (
    <>
      <ChatPageAgency />
      <NavigationBar
        activeTab="chat"  // pass default chat id
        onTabChange={(tab) => {
          if (tab === "chat") {
            navigate(`/agency/chat/${defaultChatId}`);
          } else {
            navigate(`/agency/${tab}`);
          }
        }}
      />
    </>
  );
};

export const SearchRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <SearchScreen onUserSelect={(id) => navigate(`/user/${id}`)} />
      <NavigationBar activeTab="search" onTabChange={(tab) => navigate(`/agency/${tab}`)} />
    </>
  );
};

export const ProfileRoute = () => {
  const navigate = useNavigate();
  return (
    <>
      <ProfileSettingsScreen
        onBack={() => navigate("/model/feed")}
        onLogout={() => navigate("/onboarding")}
      />
      <Navbarmodel
        activeTab="profile"
        onTabChange={(tab) => navigate(`/model/${tab}`)}
      />
    </>
  );
};

export const AgencyRoute=()=>{
  const navigate=useNavigate();
  return (
    <>
    <ProfileEditScreenAgency
    onBack={()=>navigate(-1)}
    onComplete={()=>navigate("")}/>
    <NavigationBar activeTab="profile" onTabChange={(tab) => navigate(`/agency/${tab}`)} />
    </>
  )

}

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
