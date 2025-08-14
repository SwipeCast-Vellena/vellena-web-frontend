// src/stores/campaignStore.ts
import  { create } from 'zustand';
import { getCampaigns, Campaign } from '../services/getCampaigns';

interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  getCampaignById: (id: number) => Campaign | undefined;
  updateApplicationCount: (id: number) => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  loading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCampaigns();
      set({ campaigns: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getCampaignById: (id: number) => {
    return get().campaigns.find((c) => c.id === id);
  },

  updateApplicationCount: (id: number) => {
  set((state) => ({
    campaigns: state.campaigns.map((c) =>
      c.id === id ? { ...c, application_count: c.application_count + 1 } : c
    ),
  }));
},

}));
