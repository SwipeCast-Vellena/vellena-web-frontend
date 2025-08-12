// src/services/uploadVideo.ts

import { getBaseUrl } from './utils/baseUrl';

export const uploadVideo = async (file: File, token: string) => {
  const baseUrl = await getBaseUrl();
  const isMock = baseUrl.includes('mockapi');

  // If using mock, you might skip actual upload or simulate it
  if (isMock) {
    const mockResponse = { videoUrl: 'mock-video-url.mp4', msg: 'Mock upload success' };
    console.log("📦 Mock upload response:", mockResponse);
    return mockResponse;
  }

  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch(`${baseUrl}/api/upload-video`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type header when sending FormData; browser sets it automatically
    },
    body: formData,
  });

  const data = await response.json();

  // 🔍 Log the backend response
  console.log("📦 Backend upload response:", data);

  if (!response.ok) {
    throw new Error(data?.msg || 'Video upload failed');
  }

  return data; // expected { videoUrl, msg }
};
