export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  joinDate?: string;
  reviewCount?: number;
  isAdmin: boolean;
  isVerified: boolean;
  dateJoined: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  overview?: string;
  synopsis?: string;
  releaseDate?: string;
  releaseYear?: number;
  runtime: number;
  rating: string;
  averageRating: number;
  totalRatings: number;
  voteCount?: number;
  poster: string;
  posterPath?: string;
  backdrop: string;
  backdropPath?: string;
  genres: string[];
  isTrending: boolean;
  isFeatured: boolean;
  director?: string;
  cast?: Array<{ id: string; name: string; character: string; photo: string }>;
  crew?: Array<{ id: string; name: string; role: string; photo: string }>;
  reviews?: Review[];
  similarMovies?: string[];
  trailerUrl?: string;
  imdbId?: string;
  tmdbId?: number;
}

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  user?: User;
  movie?: Movie;
  username: string;
  userAvatar: string;
  rating: number;
  title?: string;
  comment: string;
  content?: string;
  isSpoiler?: boolean;
  likes: number;
  dislikes?: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Genre {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  movieCount: number;
}

export interface WatchlistItem {
  id: number;
  user: User;
  movie: Movie;
  addedAt: string;
  status: 'want_to_watch' | 'watching' | 'watched';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface SearchFilters {
  query?: string;
  genre?: string;
  year?: number;
  rating?: number;
  sortBy?: 'popularity' | 'rating' | 'release_date' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AppState {
  movies: Movie[];
  reviews: Review[];
  watchlist: string[];
  isLoading: boolean;
  error: string | null;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalReviews: number;
  totalGenres: number;
  recentUsers: User[];
  recentMovies: Movie[];
  topRatedMovies: Movie[];
  mostActiveUsers: User[];
}
