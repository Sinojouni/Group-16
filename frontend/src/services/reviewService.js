import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';

const reviewApi = axios.create({
  baseURL: `${API_BASE_URL}/reviews/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
reviewApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addReview = async (movieId, rating, comment) => {
  try {
    const response = await reviewApi.post('', {
      movie: movieId,
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في إضافة التقييم');
  }
};

export const updateReview = async (reviewId, rating, comment) => {
  try {
    const response = await reviewApi.put(`${reviewId}/`, {
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في تحديث التقييم');
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await reviewApi.delete(`${reviewId}/`);
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'فشل في حذف التقييم');
  }
};

export const getReviewsByMovie = async (movieId, page = 1) => {
  try {
    const response = await reviewApi.get(`/movie/${movieId}?page=${page}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

export const getReviewsByUser = async (userId, page = 1) => {
  try {
    const response = await reviewApi.get(`/user/${userId}?page=${page}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
  }
};

export const likeReview = async (reviewId) => {
  try {
    const response = await reviewApi.post(`/${reviewId}/like`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to like review');
  }
};
