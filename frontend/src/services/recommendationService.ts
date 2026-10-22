import { Movie } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to transform backend movie data to frontend format
const transformMovieData = (backendMovie: any): Movie => {
  // Construct poster and backdrop URLs from tmdb_id if available
  let posterUrl = 'https://placehold.co/300x450/1a202c/FFFFFF?text=No+Image';
  let backdropUrl = 'https://placehold.co/1280x720/1a202c/FFFFFF?text=No+Image';
  
  // Check if we have a tmdb_id to construct proper image URLs
  if (backendMovie.tmdb_id) {
    posterUrl = `https://image.tmdb.org/t/p/w500/${backendMovie.tmdb_id}.jpg`;
    backdropUrl = `https://image.tmdb.org/t/p/w1280/${backendMovie.tmdb_id}.jpg`;
  } else if (backendMovie.poster_path) {
    // Fallback to existing poster_path if tmdb_id is not available
    if (backendMovie.poster_path.startsWith('/')) {
      // If poster_path starts with '/', it's a tmdbId-based path
      posterUrl = `https://image.tmdb.org/t/p/w500${backendMovie.poster_path}`;
      backdropUrl = `https://image.tmdb.org/t/p/w1280${backendMovie.poster_path}`;
    } else {
      // Otherwise, it's a full URL
      posterUrl = backendMovie.poster_path;
      backdropUrl = backendMovie.poster_path.replace('/w500/', '/w1280/');
    }
  }

  return {
    id: backendMovie.id,
    title: backendMovie.title,
    overview: backendMovie.overview,
    synopsis: backendMovie.overview,
    releaseYear: backendMovie.release_year,
    runtime: backendMovie.runtime || 0,
    rating: 'PG-13', // Default rating
    averageRating: backendMovie.vote_average || 0,
    totalRatings: backendMovie.vote_count || 0,
    poster: posterUrl,
    posterPath: backendMovie.poster_path,
    backdrop: backdropUrl,
    backdropPath: backendMovie.poster_path,
    genres: backendMovie.genres || [],
    isTrending: backendMovie.popularity > 50,
    isFeatured: backendMovie.popularity > 70,
    cast: backendMovie.cast ? backendMovie.cast.map((name: string, index: number) => ({
      id: `cast-${index}`,
      name,
      character: '', // Backend doesn't provide character info
      photo: 'https://placehold.co/150x150/1a202c/FFFFFF?text=Actor'
    })) : [],
    crew: backendMovie.directors ? backendMovie.directors.map((name: string, index: number) => ({
      id: `director-${index}`,
      name,
      role: 'Director',
      photo: 'https://placehold.co/150x150/1a202c/FFFFFF?text=Director'
    })) : [],
    reviews: [],
    similarMovies: [],
  };
};

// Get personalized recommendations for the current user
export const getRecommendations = async (token: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'You need to rate at least 5 movies to get recommendations.');
      } else if (response.status === 401) {
        // Return empty array for unauthorized requests instead of throwing an error
        console.log('User not authenticated, returning empty recommendations');
        return [];
      } else if (response.status === 503) {
        throw new Error('Recommendation service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error('Failed to fetch recommendations');
      }
    }

    const data = await response.json();
    
    // Transform backend data to frontend format using the existing movie service function
    const transformedMovies = data.map((backendMovie: any) => transformMovieData(backendMovie));

    return transformedMovies;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Instead of throwing error, return empty array to prevent app crashes
    return [];
  }
};