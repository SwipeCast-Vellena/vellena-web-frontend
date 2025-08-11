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
  FeedRoute,
  CampaignsRoute,
  CampaignDetailRoute,
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

          {/* Main Routes */}
          <Route path="/feed" element={<FeedRoute />} />
          <Route path="/campaigns" element={<CampaignsRoute />} />
          <Route path="/campaign/:id" element={<CampaignDetailRoute />} />
          <Route path="/campaign-create" element={<CampaignCreateRoute />} />
          <Route path="/match" element={<MatchRoute />} />
          <Route path="/chat" element={<ChatRoute />} />
          <Route path="/search" element={<SearchRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/user/:id" element={<UserDetailRoute />} />

          {/* Agency */}

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
