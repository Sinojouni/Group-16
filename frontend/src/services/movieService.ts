import { Movie, SearchFilters } from '../types';
import { mockMovies } from '../data/mockData';

// Mock movie service that works without backend
export const getMovies = async (filters?: SearchFilters): Promise<Movie[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let movies = [...mockMovies];
  
  if (filters) {
    // Apply filters
    if (filters.genre && filters.genre !== 'all') {
      movies = movies.filter(movie => movie.genres.includes(filters.genre!));
    }
    
    if (filters.year) {
      movies = movies.filter(movie => movie.releaseYear === filters.year);
    }
    
    if (filters.minRating) {
      movies = movies.filter(movie => movie.averageRating >= filters.minRating!);
    }
    
    if (filters.query) {
      movies = movies.filter(movie => 
        movie.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(filters.query!.toLowerCase()))
      );
    }
  }
  
  return movies;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const movie = mockMovies.find(m => m.id === id);
  if (!movie) {
    throw new Error('Movie not found');
  }
  
  return movie;
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockMovies.filter(movie => movie.isTrending);
};

export const getFeaturedMovies = async (): Promise<Movie[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockMovies.filter(movie => movie.isFeatured);
};

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockMovies.filter(movie => movie.genres.includes(genre));
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
    movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
  );
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