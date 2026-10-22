import { Review, PaginatedResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

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
    
    // Transform rating data to review format
    const transformedReviews = data.results.map((rating: any) => ({
      id: rating.id,
      userId: rating.user,
      movieId: rating.movie,
      username: rating.user_email || 'Anonymous', // Fallback to Anonymous if user_email is not available
      userAvatar: `https://ui-avatars.com/api/?name=${rating.user_email || 'A'}&background=dc2626&color=fff&size=32`,
      rating: rating.score,
      comment: rating.comment || '',
      likes: 0, // Backend doesn't have likes yet
      isLiked: false, // Backend doesn't have likes yet
      createdAt: rating.created_at,
    }));

    return {
      results: transformedReviews,
      count: data.count,
      next: data.next ? (page + 1).toString() : undefined,
      previous: data.previous ? (page - 1).toString() : undefined
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
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