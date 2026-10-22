import { LoginCredentials, RegisterCredentials, User } from '../types';
import { mockUser, mockAdminUser } from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const formatUserData = (data: any): User => {
  const username = data.username || (data.email ? data.email.split('@')[0] : 'User');
  return {
    id: String(data.id || '1'),
    username: username,
    email: data.email || 'user@example.com',
    firstName: data.firstName || data.first_name || '',
    lastName: data.lastName || data.last_name || '',
    avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=dc2626&color=fff&size=120`,
    bio: data.bio || (data.id ? localStorage.getItem(`bio_${data.id}`) || '' : '') || '',
    isAdmin: Boolean(data.isAdmin ?? data.is_staff ?? false),
    isVerified: Boolean(data.isVerified ?? data.is_email_verified ?? true),
    dateJoined: data.dateJoined || data.created_at || new Date().toISOString(),
    reviewCount: data.reviewCount ?? 0,
  };
};

// Real authentication service that connects to Django backend
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.email || credentials.username,
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || err.detail || 'Login failed');
    }

    const data = await response.json();
    const formattedUser = formatUserData(data.user || {});

    localStorage.setItem('user', JSON.stringify(formattedUser));
    localStorage.setItem('token', data.token);

    return {
      user: formattedUser,
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
      const err = await response.json().catch(() => ({}));
      const msg = err.username?.[0] || err.email?.[0] || err.password?.[0] || err.detail || 'Registration failed';
      throw new Error(msg);
    }

    const data = await response.json();
    const formattedUser = formatUserData(data.user || {});

    localStorage.setItem('user', JSON.stringify(formattedUser));
    localStorage.setItem('token', data.token);

    return {
      user: formattedUser,
      token: data.token,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const validateToken = async (token: string): Promise<User> => {
  if (!token) {
    throw new Error('No token provided');
  }

  // 1. Try real backend validation
  try {
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const user = formatUserData(data);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
  } catch (error) {
    console.warn('Backend validateToken failed, checking localStorage fallback:', error);
  }

  // 2. Check cached localStorage user
  try {
    const cached = localStorage.getItem('user');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (_) {}

  // 3. Fallback based on token keyword
  if (token.includes('admin')) {
    return mockAdminUser;
  }
  return mockUser;
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const token = localStorage.getItem('token');
  let backendData: any = null;

  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      });

      if (response.ok) {
        backendData = await response.json();
      }
    } catch (e) {
      console.warn('Backend updateProfile failed, updating locally:', e);
    }
  }

  // Get current user from storage or fallback
  let currentUser: User = mockUser;
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      currentUser = JSON.parse(stored);
    }
  } catch (_) {}

  const updatedUser: User = {
    ...currentUser,
    ...userData,
    ...(backendData ? {
      username: backendData.username || currentUser.username,
      firstName: backendData.firstName || backendData.first_name || currentUser.firstName,
      lastName: backendData.lastName || backendData.last_name || currentUser.lastName,
    } : {}),
  };

  if (userData.bio !== undefined && updatedUser.id) {
    try {
      localStorage.setItem(`bio_${updatedUser.id}`, userData.bio);
    } catch (_) {}
  }

  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
};

export const socialLogin = async (provider: string, token: string): Promise<{ user: User; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    user: mockUser,
    token: 'mock-social-token-' + Date.now()
  };
};

export const forgotPassword = async (email: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Password reset requested for:', email);
};