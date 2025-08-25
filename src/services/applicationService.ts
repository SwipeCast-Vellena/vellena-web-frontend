// src/services/applicationService.ts
import { getBaseUrl } from './utils/baseUrl';

export const applyToCampaign = async (campaignId: number) => {
  const baseUrl = await getBaseUrl();
  const token = localStorage.getItem('token');

  const response = await fetch(`${baseUrl}/api/campaigns_apply/${campaignId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
  });

  const data = await response.json();
  console.log("📦 Raw response from backend:", data);  // 👈 log here
  if (!response.ok) throw new Error(data.msg || 'Failed to apply');
  return data;
};
