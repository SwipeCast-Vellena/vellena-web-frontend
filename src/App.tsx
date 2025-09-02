import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

import {
  SplashRoute,
  WalkthroughRoute,
  OnboardingRoute,
  SignUpRoute,
  LoginRoute,
  ProfileCreationRouteModel,
  ProfileCreationRouteAgency,
  ModelFeedRoute,
  AgencyFeedRoute,
  CampaignsRoute,
  CampaignDetailRouteWrapper,
  CampaignCreateRoute,
  MatchRoute,
  ChatRoute,
  AgencyChatRoute,
  SearchRoute,
  ProfileRoute,
  UserDetailRoute,
  AgencyRoute,
  AgencyCampaignRoute
} from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* Common */}
          <Route path="/" element={<SplashRoute />} />
          <Route path="/walkthrough" element={<WalkthroughRoute />} />
          <Route path="/onboarding" element={<OnboardingRoute />} />
          <Route path="/signup" element={<SignUpRoute />} />
          <Route path="/login" element={<LoginRoute />} />

          {/* Model */}
          <Route path="/model/profile-creation" element={<ProfileCreationRouteModel />} />
          <Route path="/model/feed" element={<ModelFeedRoute />} />
          <Route path="/model/match" element={<MatchRoute />} />
          <Route path="/model/chat" element={<ChatRoute />} />
          <Route path="/model/chat/:chatId" element={<ChatRoute />} />
          <Route path="/model/profile" element={<ProfileRoute />} />
          <Route path="/model/campaigns" element={<CampaignsRoute />} />
          <Route path="/model/campaign/:id" element={<CampaignDetailRouteWrapper />} />


          {/* Main Routes */}
          <Route path="/user/:id" element={<UserDetailRoute />} />

          {/* Agency */}
          <Route path="/agency/profile-creation" element={<ProfileCreationRouteAgency />} />
          <Route path="/agency/feed" element={<AgencyFeedRoute />} />
          <Route path="/agency/search" element={<SearchRoute />} />
          <Route path="/agency/profile" element={<AgencyRoute />} />
          <Route path="/agency/campaigns" element={<AgencyCampaignRoute/>} />
          <Route path="/agency/chat" element={<AgencyChatRoute />} />
          <Route path="/agency/chat/:chatId" element={<AgencyChatRoute />} />
          <Route path="/agency/campaign-create" element={<CampaignCreateRoute />} />
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
