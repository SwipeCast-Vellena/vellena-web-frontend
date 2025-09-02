// src/services/campaignService.ts
import axios from "axios";
import { getBaseUrl } from "./utils/baseUrl"; // your helper to get backend URL

// Campaign payload matches backend expected fields
export interface CampaignPayload {
  title: string;                 // Job Title
  category: string;              // Job Category
  start_date: string;            // Job Date (start)
  end_date?: string;             // Job Date (optional end)
  start_time?: string;           // Approximate Hours (start)
  end_time?: string;             // Approximate Hours (end)
  city: string;                  // Job Location / City
  address?: string;              // Optional address
  compensation: string;          // Fixed Compensation (€)
  description: string;           // Job Description
  required_people: number;       // Number of people required
  deadline: string;              // Apply Deadline
  pro_only?: boolean;            // Preferences
  gender_preference?: "any" | "women" | "men";
}

// Create a new campaign
export const createCampaign = async (campaign: CampaignPayload, token: string) => {
  try {
    const baseUrl = await getBaseUrl();

    const payload = {
      title: campaign.title,
      category: campaign.category,
      start_date: campaign.start_date,
      end_date: campaign.end_date || null,
      start_time: campaign.start_time || null,
      end_time: campaign.end_time || null,
      city: campaign.city,
      address: campaign.address || null,
      compensation: Number(campaign.compensation),
      description: campaign.description,
      required_people: campaign.required_people,
      deadline: campaign.deadline,
      pro_only: campaign.pro_only || false,
      gender_preference: campaign.gender_preference || "any",
    };

    const response = await axios.post(`${baseUrl}/api/campaigns`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Update existing campaign by id
export const updateCampaign = async (
  id: string,
  campaign: CampaignPayload,
  token: string
) => {
  try {
    const baseUrl = await getBaseUrl();

    const payload = {
      title: campaign.title,
      category: campaign.category,
      start_date: campaign.start_date,
      end_date: campaign.end_date || null,
      start_time: campaign.start_time || null,
      end_time: campaign.end_time || null,
      city: campaign.city,
      address: campaign.address || null,
      compensation: Number(campaign.compensation),
      description: campaign.description,
      required_people: campaign.required_people,
      deadline: campaign.deadline,
      pro_only: campaign.pro_only || false,
      gender_preference: campaign.gender_preference || "any",
    };

    const response = await axios.put(`${baseUrl}/api/campaigns/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
