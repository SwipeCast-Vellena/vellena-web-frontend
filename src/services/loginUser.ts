// src/services/loginUser.ts

import { getBaseUrl } from './utils/baseUrl';

export interface LoginFormData {
  email: string;
  password: string;
  role: string;
}

export const loginUser = async (formData: LoginFormData) => {
  const baseUrl = await getBaseUrl();
  const isMock = baseUrl.includes('mockapi');

  const response = await fetch(
    isMock ? `${baseUrl}/users` : `${baseUrl}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || 'Login failed');
  }

  return data; // expected to include { token, user, msg }
};
