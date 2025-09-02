import { getBaseUrl } from './utils/baseUrl';

type Callback = (err?: string | null, data?: any) => void;

// 🔹 Utility to handle API response
async function handleResponse(res: Response, callback: Callback) {
  let data: any;
  try {
    data = await res.json();
  } catch {
    return callback('INVALID_RESPONSE');
  }

  if (!res.ok) {
    if (data?.msg?.includes('Only 3 photos allowed')) {
      return callback('MAX_LIMIT');
    }
    return callback(data?.msg || 'UPLOAD_FAILED');
  }

  callback(null, data);
}

// 🔹 Upload model photos (max 3 per group)
export function uploadModelPhotos(files: File[], token: string, callback: Callback) {
  getBaseUrl()
    .then((baseUrl) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      fetch(`${baseUrl}/api/model/photos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then((res) => handleResponse(res, callback))
        .catch(() => callback('NETWORK_ERROR'));
    })
    .catch(() => callback('NETWORK_ERROR'));
}

// 🔹 Fetch my own photos (as model)
export function fetchMyModelPhotos(token: string, callback: Callback) {
  getBaseUrl()
    .then((baseUrl) => {
      fetch(`${baseUrl}/api/model/photos`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => handleResponse(res, callback))
        .catch(() => callback('NETWORK_ERROR'));
    })
    .catch(() => callback('NETWORK_ERROR'));
}

// 🔹 Fetch photos by model ID (for agency)
export function fetchPhotosByModelId(modelId: string, token: string, callback: Callback) {
  getBaseUrl()
    .then((baseUrl) => {
      fetch(`${baseUrl}/api/model/photos/by-model/${modelId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => handleResponse(res, callback))
        .catch(() => callback('NETWORK_ERROR'));
    })
    .catch(() => callback('NETWORK_ERROR'));
}
