import { API_BASE_URL } from './apiConfig';

// Rate a movie
export const rateMovie = async (movieId: string, score: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        movie: movieId,
        score: score,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || 'Failed to rate movie';
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error rating movie:', error);
    throw error;
  }
};

// Get user's rating for a specific movie
export const getUserRating = async (movieId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/?movie=${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rating');
    }

    const data = await response.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error fetching rating:', error);
    return null;
  }
};

// Get all ratings for a specific movie
export const getMovieRatings = async (movieId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/?movie=${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ratings');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
};

// Update an existing rating
export const updateRating = async (ratingId: string, score: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        score: score,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update rating');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

// Delete a rating
export const deleteRating = async (ratingId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete rating');
    }

    return true;
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
};