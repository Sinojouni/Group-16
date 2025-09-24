import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  try {
    const response = await authApi.post('/login/', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.response?.data?.error || 'فشل في تسجيل الدخول');
  }
};

export const register = async (credentials) => {
  try {
    const response = await authApi.post('/register/', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.response?.data?.error || 'فشل في إنشاء الحساب');
  }
};

export const validateToken = async (token) => {
  try {
    const response = await authApi.get('/user/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('رمز غير صالح');
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await authApi.put('/profile/', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في تحديث الملف الشخصي');
  }
};


export const forgotPassword = async (email) => {
  try {
    await authApi.post('/forgot-password', { email });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};
