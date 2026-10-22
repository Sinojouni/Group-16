import { Review, PaginatedResponse } from '../types';
import { getCinematicPoster, isValidPosterUrl } from './posterService';

import { API_BASE_URL } from './apiConfig';

// Helper function to transform backend rating data to Review format
export const transformRatingToReview = (rating: any): Review => {
  let poster = '';
  const posterPath = rating.poster_path || rating.movie_poster || '';
  if (posterPath && posterPath.startsWith('http')) {
    poster = posterPath;
  } else if (posterPath && posterPath.startsWith('/')) {
    poster = `https://image.tmdb.org/t/p/w500${posterPath}`;
  } else if (rating.movie_title) {
    let cached = null;
    try {
      if (typeof window !== 'undefined') {
        cached = localStorage.getItem(`omdb_poster_${rating.movie_title}`) || localStorage.getItem(`poster_${rating.movie_title}`);
      }
    } catch (_) {}
    poster = (cached && isValidPosterUrl(cached)) ? cached : getCinematicPoster(rating.movie_title);
  }

  const username = rating.user_email || rating.username || 'Anonymous';

  return {
    id: rating.id,
    userId: rating.user || rating.user_id,
    movieId: rating.movie_id || rating.movie,
    movieTitle: rating.movie_title || '',
    moviePoster: poster,
    movieReleaseYear: rating.release_year,
    movieVoteAverage: rating.vote_average,
    username: username,
    userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=dc2626&color=fff&size=32`,
    rating: typeof rating.score === 'number' ? rating.score : parseFloat(rating.score || 0),
    comment: rating.comment || '',
    likes: 0,
    isLiked: false,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at,
  };
};

// Get reviews for a movie
export const getReviews = async (movieId?: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> => {
  try {
    let url = `${API_BASE_URL}/ratings/`;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (movieId) {
      params.append('movie', movieId);
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Add query parameters to URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const data = await response.json();
    const rawList = data.results || (Array.isArray(data) ? data : []);
    const transformedReviews = rawList.map(transformRatingToReview);

    return {
      results: transformedReviews,
      count: typeof data.count === 'number' ? data.count : transformedReviews.length,
      next: data.next ? (page + 1).toString() : undefined,
      previous: data.previous ? (page - 1).toString() : undefined
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Get all reviews and ratings submitted by a specific user
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/?user=${userId}&limit=100`);
    if (!response.ok) {
      const fallbackRes = await fetch(`${API_BASE_URL}/ratings/user_ratings/?user_id=${userId}`);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const list = Array.isArray(fallbackData) ? fallbackData : (fallbackData.value || []);
        return list.map(transformRatingToReview);
      }
      throw new Error('Failed to fetch user reviews');
    }

    const data = await response.json();
    const list = data.results || (Array.isArray(data) ? data : []);
    return list.map(transformRatingToReview);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

// Add a review (which is actually a rating in the backend)
export const addReview = async (movieId: string, rating: number, comment: string, token: string): Promise<Review> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        movie: movieId,
        score: rating,
        comment: comment,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add review');
    }

    const data = await response.json();
    return transformRatingToReview(data);
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId: string, rating: number, comment: string, token: string): Promise<Review> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${reviewId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        score: rating,
        comment: comment,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update review');
    }

    const data = await response.json();
    
    // Transform rating data to review format
    return {
      id: data.id,
      userId: data.user,
      movieId: data.movie,
      username: data.user_email || 'Anonymous',
      userAvatar: `https://ui-avatars.com/api/?name=${data.user_email || 'A'}&background=dc2626&color=fff&size=32`,
      rating: data.score,
      comment: data.comment || '',
      likes: 0,
      isLiked: false,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${reviewId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Like a review (not implemented in backend yet)
export const likeReview = async (reviewId: string, token: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real app, this would update the backend
  console.log('Liked review:', reviewId);
};

// Unlike a review (not implemented in backend yet)
export const unlikeReview = async (reviewId: string, token: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real app, this would update the backend
  console.log('Unliked review:', reviewId);
};