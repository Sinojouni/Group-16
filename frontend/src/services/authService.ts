import { LoginCredentials, RegisterCredentials, User } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Real authentication service that connects to Django backend
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username || credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return {
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        first_name: credentials.firstName,
        last_name: credentials.lastName,
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return {
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const validateToken = async (token: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Check if it's admin token
  if (token.includes('admin-token')) {
    return mockAdminUser;
  }
  
  // Default user
  return mockUser;
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return updated user (in real app, this would update the backend)
  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : mockUser;
  const updatedUser = { ...currentUser, ...userData };
  
  return updatedUser;
};

export const socialLogin = async (provider: string, token: string): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    user: mockUser,
    token: 'mock-social-token-' + Date.now()
  };
};

export const forgotPassword = async (email: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real app, this would send password reset email
  console.log('Password reset email would be sent to:', email);
};