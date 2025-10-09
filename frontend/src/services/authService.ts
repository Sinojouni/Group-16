import { LoginCredentials, RegisterCredentials, User } from '../types';
import { mockUser, mockAdminUser } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Real authentication service that connects to Django backend
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Transform Django user data to our User type
    const user: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      firstName: data.user.first_name || '',
      lastName: data.user.last_name || '',
      isAdmin: data.user.is_staff || false,
      isVerified: data.user.is_email_verified || false,
      dateJoined: data.user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      reviewCount: 0 // This would need to be calculated from backend
    };

    return {
      user,
      token: data.access
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        first_name: credentials.firstName || '',
        last_name: credentials.lastName || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const data = await response.json();
    
    // Transform Django user data to our User type
    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      isAdmin: data.is_staff || false,
      isVerified: data.is_email_verified || false,
      dateJoined: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      reviewCount: 0
    };

    // After registration, automatically log in the user
    const loginResponse = await login({
      email: credentials.email,
      password: credentials.password,
      rememberMe: false
    });

    return loginResponse;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const validateToken = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    
    // Transform Django user data to our User type
    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      isAdmin: data.is_staff || false,
      isVerified: data.is_email_verified || false,
      dateJoined: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      reviewCount: 0 // This would need to be calculated from backend
    };

    return user;
  } catch (error) {
    console.error('Token validation error:', error);
    throw error;
  }
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Profile update failed');
    }

    const data = await response.json();
    
    // Transform Django user data to our User type
    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      isAdmin: data.is_staff || false,
      isVerified: data.is_email_verified || false,
      dateJoined: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      reviewCount: 0 // This would need to be calculated from backend
    };

    return user;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
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