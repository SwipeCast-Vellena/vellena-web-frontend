// src/services/createOrUpdateModelProfile.ts

import { getBaseUrl } from './utils/baseUrl';

export interface ModelProfileFormData {
  name: string;
  age: number;
  genre: string; // maps from "gender" in form
  height: string;
  location: string;
  category: string;
  description: string; // maps from "bio" in form
  video_portfolio?: string | null;
}

export const createOrUpdateModelProfile = async (formData: ModelProfileFormData) => {
  const baseUrl = await getBaseUrl(); // Checks backend availability and returns base URL or mock
  const isMock = baseUrl.includes('mockapi');

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  try {
    // Try real backend (or current baseUrl)
    let response = await fetch(`${baseUrl}/api/model/profile`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });

    // If real backend fails and we're not already on mock, fallback to mock API
    if (!response.ok && !isMock) {
      console.warn('⚠️ Real backend failed, retrying with MockAPI...');
      const mockUrl = import.meta.env.VITE_MOCK_API_URL;
      response = await fetch(`${mockUrl}/model/profile`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });
    }

    // Try parsing JSON, catch errors if response is not JSON (e.g. HTML error page)
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(`Invalid JSON response: ${jsonError.message}`);
    }

    if (!response.ok) {
      throw new Error(data?.msg || 'Failed to save model profile');
    }

    return data; // { model, msg }
  } catch (err) {
    console.error('❌ Profile creation failed:', err);
    throw err;
  }
};
