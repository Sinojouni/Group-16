import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Movie, Review, AppState, SearchFilters } from '../types';
import * as movieService from '../services/movieService';
import * as reviewService from '../services/reviewService';
import toast from 'react-hot-toast';

interface AppContextType extends AppState {
  searchMovies: (filters: SearchFilters) => Promise<Movie[]>;
  getMovieDetails: (id: string) => Promise<Movie>;
  addToWatchlist: (movieId: string) => Promise<void>;
  removeFromWatchlist: (movieId: string) => Promise<void>;
  addReview: (movieId: string, rating: number, comment: string) => Promise<void>;
  updateReview: (reviewId: string, rating: number, comment: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  likeReview: (reviewId: string) => Promise<void>;
  loadMovies: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'ADD_MOVIE'; payload: Movie }
  | { type: 'UPDATE_MOVIE'; payload: Movie }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'UPDATE_REVIEW'; payload: Review }
  | { type: 'DELETE_REVIEW'; payload: string }
  | { type: 'ADD_TO_WATCHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'ADD_MOVIE':
      return { ...state, movies: [...state.movies, action.payload] };
    case 'UPDATE_MOVIE':
      return {
        ...state,
        movies: state.movies.map(movie =>
          movie.id === action.payload.id ? action.payload : movie
        ),
      };
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };
    case 'ADD_REVIEW':
      return { ...state, reviews: [...state.reviews, action.payload] };
    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        ),
      };
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload),
      };
    case 'ADD_TO_WATCHLIST':
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter(id => id !== action.payload),
      };
    default:
      return state;
  }
};

const initialState: AppState = {
  movies: [],
  reviews: [],
  watchlist: [],
  isLoading: false,
  error: null,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const movies = await movieService.getMovies();
      dispatch({ type: 'SET_MOVIES', payload: movies });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchMovies = async (filters: SearchFilters): Promise<Movie[]> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const movies = await movieService.searchMovies(filters);
      return movies;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getMovieDetails = async (id: string): Promise<Movie> => {
    try {
      return await movieService.getMovieById(id);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const addToWatchlist = async (movieId: string) => {
    try {
      await movieService.addToWatchlist(movieId);
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: movieId });
      toast.success('Added to watchlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to watchlist');
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    try {
      await movieService.removeFromWatchlist(movieId);
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movieId });
      toast.success('Removed from watchlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from watchlist');
    }
  };

  const addReview = async (movieId: string, rating: number, comment: string) => {
    try {
      const review = await reviewService.addReview(movieId, rating, comment);
      dispatch({ type: 'ADD_REVIEW', payload: review });
      toast.success('Review added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add review');
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment: string) => {
    try {
      const review = await reviewService.updateReview(reviewId, rating, comment);
      dispatch({ type: 'UPDATE_REVIEW', payload: review });
      toast.success('Review updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update review');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId);
      dispatch({ type: 'DELETE_REVIEW', payload: reviewId });
      toast.success('Review deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const likeReview = async (reviewId: string) => {
    try {
      const review = await reviewService.likeReview(reviewId);
      dispatch({ type: 'UPDATE_REVIEW', payload: review });
    } catch (error: any) {
      toast.error(error.message || 'Failed to like review');
    }
  };

  const value: AppContextType = {
    ...state,
    searchMovies,
    getMovieDetails,
    addToWatchlist,
    removeFromWatchlist,
    addReview,
    updateReview,
    deleteReview,
    likeReview,
    loadMovies,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};