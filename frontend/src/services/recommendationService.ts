import { Movie } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to transform backend movie data to frontend format
export const transformMovieData = (backendMovie: any): Movie => {
  let posterUrl = '';
  let backdropUrl = '';

  // 1. If backend gave a full URL (from OMDB poster sync)
  if (backendMovie.poster_path && backendMovie.poster_path.startsWith('http')) {
    posterUrl = backendMovie.poster_path;
    backdropUrl = backendMovie.poster_path;
  } else if (backendMovie.poster_path && backendMovie.poster_path.startsWith('/') && !backendMovie.poster_path.includes(`${backendMovie.tmdb_id}.jpg`)) {
    // Valid TMDB hash path
    posterUrl = `https://image.tmdb.org/t/p/w500${backendMovie.poster_path}`;
    backdropUrl = `https://image.tmdb.org/t/p/w1280${backendMovie.poster_path}`;
  } else {
    // Fallback: check localStorage cache or clean placeholder
    const title = backendMovie.title || 'Movie';
    const cached = typeof window !== 'undefined' ? localStorage.getItem(`poster_${title}`) : null;
    if (cached) {
      posterUrl = cached;
      backdropUrl = cached;
    } else {
      posterUrl = `https://placehold.co/380x560/1f2937/ffffff?text=${encodeURIComponent(title)}`;
      backdropUrl = `https://placehold.co/1280x720/1f2937/ffffff?text=${encodeURIComponent(title)}`;
    }
  }

  return {
    id: backendMovie.id,
    title: backendMovie.title,
    overview: backendMovie.overview,
    synopsis: backendMovie.overview,
    releaseYear: backendMovie.release_year,
    runtime: backendMovie.runtime || 0,
    rating: 'PG-13',
    averageRating: backendMovie.vote_average || 0,
    totalRatings: backendMovie.vote_count || 0,
    poster: posterUrl,
    posterPath: backendMovie.poster_path,
    backdrop: backdropUrl,
    backdropPath: backendMovie.poster_path,
    genres: Array.isArray(backendMovie.genres) ? backendMovie.genres : [],
    isTrending: backendMovie.popularity > 50,
    isFeatured: backendMovie.popularity > 70,
    cast: backendMovie.cast ? backendMovie.cast.map((name: string, index: number) => ({
      id: `cast-${index}`,
      name,
      character: '',
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
        console.log('User not authenticated, returning empty recommendations');
        return [];
      } else if (response.status === 503) {
        throw new Error('Recommendation service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error('Failed to fetch recommendations');
      }
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.results || []);
    return list.map((backendMovie: any) => transformMovieData(backendMovie));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// Get recommendations for homepage / featured view (uses Two-Tower AI model service)
export const getPublicRecommendations = async (token?: string): Promise<Movie[]> => {
  try {
    if (token) {
      const personal = await getRecommendations(token);
      if (personal && personal.length > 0) {
        return personal;
      }
    }

    const response = await fetch(`${API_BASE_URL}/recommendations/`);
    if (response.ok) {
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.results || []);
      return list.map((backendMovie: any) => transformMovieData(backendMovie));
    }
  } catch (error) {
    console.error('Error fetching public AI recommendations:', error);
  }
  return [];
};