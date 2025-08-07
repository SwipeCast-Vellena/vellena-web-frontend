// src/services/loginUser.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface LoginFormData {
  email: string;
  password: string;
  role: string;
}

export const loginUser = async (formData: LoginFormData) => {
  console.log("Sending login data to backend:", formData);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.msg || 'Login failed');
  }

  return response.json(); // expected to include { token, user, msg }
};
