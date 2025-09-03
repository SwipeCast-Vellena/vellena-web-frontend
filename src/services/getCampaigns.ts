// src/services/campaignService.ts
import { getBaseUrl } from './utils/baseUrl';

export interface Campaign {
  id: number;
  agency_name: string;
  title: string;
  category: 'Hostess' | 'Model' | 'Photographer' | 'Promoter' | 'Waiter' | 'Other';
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  city: string;
  address?: string;
  compensation: number;
  description: string;
  application_count: number; // mapped from required_people
  deadline: string;
  pro_only: boolean;
  gender_preference: 'any' | 'women' | 'men';
}

export const getCampaigns = async (): Promise<Campaign[]> => {
  const baseUrl = await getBaseUrl();
  const token = localStorage.getItem('token');

  const response = await fetch(`${baseUrl}/api/campaigns`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || 'Failed to fetch campaigns');
  }

  // Map DB fields to frontend-friendly structure
  return data.map((item: any) => ({
    id: item.id,
    agency_name: item.agency_name, // should come from backend join
    title: item.title,
    category: item.category,
    start_date: item.start_date,
    end_date: item.end_date || null,
    start_time: item.start_time || null,
    end_time: item.end_time || null,
    city: item.city,
    address: item.address || null,
    compensation: item.compensation,
    description: item.description,
    application_count: item.required_people, // mapped
    deadline: item.deadline,
    pro_only: !!item.pro_only,
    gender_preference: item.gender_preference,
  }));
};

export const getSpecificCampaigns = async (): Promise<Campaign[]> => {
  const baseUrl = await getBaseUrl();
  const token = localStorage.getItem('token');

  const response = await fetch(`${baseUrl}/api/specific-campaigns`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || 'Failed to fetch campaigns');
  }

  // Map DB fields to frontend-friendly structure
  return data.map((item: any) => ({
    id: item.id,
    agency_name: item.agency_name, // should come from backend join
    title: item.title,
    category: item.category,
    start_date: item.start_date,
    end_date: item.end_date || null,
    start_time: item.start_time || null,
    end_time: item.end_time || null,
    city: item.city,
    address: item.address || null,
    compensation: item.compensation,
    description: item.description,
    application_count: item.required_people, // mapped
    deadline: item.deadline,
    pro_only: !!item.pro_only,
    gender_preference: item.gender_preference,
  }));
};
