// src/services/uploadVideo.ts

import { getBaseUrl } from './utils/baseUrl';

// Upload video
export function uploadVideo(
  file: File,
  token: string,
  callback: (err?: any, data?: any) => void
) {
  getBaseUrl()
    .then((baseUrl) => {
      const formData = new FormData();
      formData.append('video', file);

      fetch(`${baseUrl}/api/upload-video`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) return callback(data?.msg || 'Upload failed');
          callback(null, data);
        })
        .catch((err) => callback(err));
    })
    .catch((err) => callback(err));
}

// Delete video
export function deleteVideo(token: string, callback: (err?: any, data?: any) => void) {
  getBaseUrl()
    .then((baseUrl) => {
      fetch(`${baseUrl}/api/model/video`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) return callback(data?.message || 'Failed to delete video');
          callback(null, data);
        })
        .catch((err) => callback(err));
    })
    .catch((err) => callback(err));
}

// Replace video = just upload new one
export function replaceVideo(
  file: File,
  token: string,
  callback: (err?: any, data?: any) => void
) {
  uploadVideo(file, token, callback);
}