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
  SearchRoute,
  ProfileRoute,
  UserDetailRoute,
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

          {/* Main Routes */}
          <Route path="/campaign-create" element={<CampaignCreateRoute />} />
          <Route path="/chat" element={<ChatRoute />} />
          <Route path="/search" element={<SearchRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/user/:id" element={<UserDetailRoute />} />

          {/* Agency */}
          <Route path="/agency/profile-creation" element={<ProfileCreationRouteAgency />} />
          <Route path="/agency/feed" element={<AgencyFeedRoute />} />
          <Route path="/model/campaigns" element={<CampaignsRoute />} />
          <Route path="/model/campaign/:id" element={<CampaignDetailRouteWrapper />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
