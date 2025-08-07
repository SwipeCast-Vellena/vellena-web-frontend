// src/services/registerUser.ts
import { getBaseUrl } from './utils/baseUrl';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const registerUser = async (formData: RegisterFormData) => {
  const baseUrl = await getBaseUrl();
  const isMock = baseUrl.includes('mockapi');

    const response = await fetch(
    isMock ? `${baseUrl}/users` : `${baseUrl}/api/auth/register`,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    }
    );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || 'Registration failed');
  }

  return data;
};


