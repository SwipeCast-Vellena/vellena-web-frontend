import { getBaseUrl } from './utils/baseUrl';

export interface AgencyProfileFormData {
  name: string;
  operating_years: number;
  no_of_employees: number;
  location: string;
  professional_bio: string;
  website?: string | null;
}

export const createOrUpdateAgencyProfile = async (formData: AgencyProfileFormData) => {
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
    // Try real backend first
    let response = await fetch(`${baseUrl}/api/agency/profile`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });

    // If real backend fails and we're not already using mock, retry with mock API
    if (!response.ok && !isMock) {
      console.warn('⚠️ Real backend failed, retrying with MockAPI...');
      const mockUrl = import.meta.env.VITE_MOCK_API_URL;
      response = await fetch(`${mockUrl}/agency/profile`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });
    }

    // Parse JSON response, handle parse errors explicitly
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(`Invalid JSON response: ${jsonError.message}`);
    }

    if (!response.ok) {
      throw new Error(data?.msg || 'Failed to save agency profile');
    }

    return data; // expected to include { agency, msg }
  } catch (err) {
    console.error('❌ Agency profile creation/update failed:', err);
    throw err;
  }
};
