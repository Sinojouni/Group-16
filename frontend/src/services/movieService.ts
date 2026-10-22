import { Movie, SearchFilters } from '../types';

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

  // Add fallback for missing movie titles
  if (!backendMovie.title || backendMovie.title.trim() === '') {
    backendMovie.title = 'Unknown Movie';
  }

  // Add fallback to generate posters using movie title as a last resort
  if (posterUrl === 'https://placehold.co/300x450/1a202c/FFFFFF?text=No+Image') {
    posterUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(backendMovie.title)}&background=1a202c&color=fff&size=300&bold=true&length=2`;
    backdropUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(backendMovie.title)}&background=1a202c&color=fff&size=1280&bold=true&length=2`;
  }

  return {
    id: backendMovie.id,
    title: backendMovie.title,
    overview: backendMovie.overview,
    synopsis: backendMovie.overview,
    releaseYear: backendMovie.release_year,
    runtime: backendMovie.runtime || 0,
    rating: 'PG-13', // Default rating, could be enhanced if backend provides this
    averageRating: backendMovie.vote_average || 0,
    totalRatings: backendMovie.vote_count || 0,
    poster: posterUrl,
    posterPath: backendMovie.poster_path,
    backdrop: backdropUrl,
    backdropPath: backendMovie.poster_path,
    genres: Array.isArray(backendMovie.genres) ? backendMovie.genres : [],
    isTrending: backendMovie.popularity > 50, // Simple trending logic based on popularity
    isFeatured: backendMovie.popularity > 70, // Simple featured logic based on popularity
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

// Real movie service that connects to Django backend
export const getMovies = async (filters?: SearchFilters): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    const movies = data.results || data;
    
    // Transform backend data to frontend format
    return Array.isArray(movies) 
      ? movies.map(transformMovieData)
      : [transformMovieData(movies)];
  } catch (error) {
    console.error('Error fetching movies:', error);
    // Fallback to empty array if backend is not available
    return [];
  }
};

export const getMovieById = async (id: string): Promise<Movie> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${id}/`);
    if (!response.ok) {
      throw new Error('Movie not found');
    }
    const backendMovie = await response.json();
    return transformMovieData(backendMovie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`);
    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }
    const data = await response.json();
    const movies = data.results || data;
    
    // Filter for trending movies (high popularity)
    const trendingMovies = Array.isArray(movies) 
      ? movies.filter((movie: any) => movie.popularity > 50)
      : [];
      
    return trendingMovies.map(transformMovieData);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const getFeaturedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured movies');
    }
    const data = await response.json();
    const movies = data.results || data;
    
    // Filter for featured movies (very high popularity)
    const featuredMovies = Array.isArray(movies) 
      ? movies.filter((movie: any) => movie.popularity > 70)
      : [];
      
    return featuredMovies.map(transformMovieData);
  } catch (error) {
    console.error('Error fetching featured movies:', error);
    return [];
  }
};

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies by genre');
    }
    const data = await response.json();
    const movies = data.results || data;
    
    // Filter for movies by genre
    const genreMovies = Array.isArray(movies) 
      ? movies.filter((movie: any) => 
          movie.genres && movie.genres.includes(genre)
        )
      : [];
      
    return genreMovies.map(transformMovieData);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};

export const getAllGenres = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies for genre extraction');
    }
    const data = await response.json();
    const movies = data.results || data;
    
    // Extract all unique genres from movies
    const allGenres = new Set<string>();
    
    if (Array.isArray(movies)) {
      movies.forEach((movie: any) => {
        if (Array.isArray(movie.genres)) {
          movie.genres.forEach((genre: string) => {
            allGenres.add(genre);
          });
        }
      });
    }
    
    // Convert Set to array and sort alphabetically
    return Array.from(allGenres).sort();
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`);
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    const data = await response.json();
    const movies = data.results || data;
    
    // Filter for movies by search query
    const searchResults = Array.isArray(movies) 
      ? movies.filter((movie: any) => 
          movie.title && movie.title.toLowerCase().includes(query.toLowerCase())
        )
      : [];
      
    return searchResults.map(transformMovieData);
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const addToWatchlist = async (movieId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real app, this would update the backend
  console.log('Added to watchlist:', movieId);
};

export const removeFromWatchlist = async (movieId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real app, this would update the backend
  console.log('Removed from watchlist:', movieId);
};

export const getWatchlist = async (): Promise<Movie[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return empty watchlist for now
  return [];
};