import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';

const movieApi = axios.create({
  baseURL: `${API_BASE_URL}/movies/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
movieApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMovies = async () => {
  try {
    const response = await movieApi.get('');
    return response.data.results || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في جلب الأفلام');
  }
};

export const getMovieById = async (id) => {
  try {
    const response = await movieApi.get(`${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في جلب تفاصيل الفيلم');
  }
};

export const searchMovies = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters.query) params.append('search', filters.query);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    if (filters.minRating) params.append('rating__gte', filters.minRating.toString());
    if (filters.sortBy) params.append('ordering', filters.sortBy);

    const response = await movieApi.get(`?${params}`);
    return response.data.results || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في البحث');
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await movieApi.get('/trending');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trending movies');
  }
};

export const getFeaturedMovies = async () => {
  try {
    const response = await movieApi.get('/featured/');
    return response.data.results || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في جلب الأفلام المميزة');
  }
};

export const getMoviesByGenre = async (genre) => {
  try {
    const response = await movieApi.get(`/?genres=${genre}`);
    return response.data.results || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في جلب أفلام هذا النوع');
  }
};

export const addToWatchlist = async (movieId) => {
  try {
    await movieApi.post(`/${movieId}/watchlist`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add to watchlist');
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    await movieApi.delete(`/${movieId}/watchlist`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove from watchlist');
  }
};

export const getWatchlist = async () => {
  try {
    const response = await movieApi.get('/watchlist');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch watchlist');
  }
};
