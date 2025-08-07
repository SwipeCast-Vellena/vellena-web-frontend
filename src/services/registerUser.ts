// src/services/registerUser.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const registerUser = async (formData: RegisterFormData) => {
  console.log("Sending to backend:", formData);

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const errorData = await response.json();

  if (!response.ok) {
    throw new Error(errorData?.msg || 'Registration failed');
  }

  return errorData; // probably includes token and user info
};

