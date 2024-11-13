import { User } from "../types";
import { AuthResponse } from "../types";

const API_BASE_URL = 'http://localhost:3000/api/v1'; // adjust to match your backend URL

export const authApi = {
  signup: async (userData: Omit<User, 'user_id' | 'cibil_score'> & { password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return response.json();
  },

  signin: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signin failed');
    }
    
    return response.json();
  },
};