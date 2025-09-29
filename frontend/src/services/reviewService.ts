import { Review, PaginatedResponse } from '../types';
import { mockReviews } from '../data/mockData';

// Mock review service that works without backend
export const getReviews = async (movieId?: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let reviews = [...mockReviews];
  
  if (movieId) {
    reviews = reviews.filter(review => review.movieId === movieId);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = reviews.slice(startIndex, endIndex);
  
  return {
    results: paginatedReviews,
    count: reviews.length,
    next: endIndex < reviews.length ? page + 1 : null,
    previous: page > 1 ? page - 1 : null
  };
};

export const addReview = async (movieId: string, rating: number, comment: string): Promise<Review> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newReview: Review = {
    id: 'review-' + Date.now(),
    userId: 'current-user',
    movieId: movieId,
    username: 'Current User',
    userAvatar: 'https://ui-avatars.com/api/?name=User&background=dc2626&color=fff&size=32',
    rating: rating,
    comment: comment,
    likes: 0,
    isLiked: false,
    createdAt: new Date().toISOString()
  };
  
  return newReview;
};

export const updateReview = async (reviewId: string, rating: number, comment: string): Promise<Review> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingReview = mockReviews.find(r => r.id === reviewId);
  if (!existingReview) {
    throw new Error('Review not found');
  }
  
  return {
    ...existingReview,
    rating,
    comment
  };
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In real app, this would delete from backend
  console.log('Deleted review:', reviewId);
};

export const likeReview = async (reviewId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real app, this would update the backend
  console.log('Liked review:', reviewId);
};

export const unlikeReview = async (reviewId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real app, this would update the backend
  console.log('Unliked review:', reviewId);
};