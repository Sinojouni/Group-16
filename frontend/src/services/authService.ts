import { LoginCredentials, RegisterCredentials, User } from '../types';
import { mockUser, mockAdminUser } from '../data/mockData';

// Mock authentication service that works without backend
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if it's admin login
  if (credentials.email === 'admin@movierate.com' || credentials.username === 'admin') {
    return {
      user: mockAdminUser,
      token: 'mock-admin-token-' + Date.now()
    };
  }
  
  // Default user login
  return {
    user: mockUser,
    token: 'mock-user-token-' + Date.now()
  };
};

export const register = async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create new user from credentials
  const newUser: User = {
    id: 'user-' + Date.now(),
    username: credentials.username,
    email: credentials.email,
    firstName: credentials.firstName || '',
    lastName: credentials.lastName || '',
    isAdmin: false,
    isVerified: true,
    dateJoined: new Date().toISOString().split('T')[0],
    reviewCount: 0
  };
  
  return {
    user: newUser,
    token: 'mock-token-' + Date.now()
  };
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