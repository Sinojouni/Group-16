// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  reviewCount: number;
  isAdmin: boolean;
}

// Auth Types
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
  acceptTerms: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Movie Types
export interface CastMember {
  id: string;
  name: string;
  character: string;
  photo?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  releaseYear: number;
  runtime: number;
  genres: string[];
  rating: string;
  averageRating: number;
  totalRatings: number;
  synopsis: string;
  cast: CastMember[];
  crew: CrewMember[];
  reviews: Review[];
  similarMovies: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  movieId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

// App State Types
export interface AppState {
  movies: Movie[];
  reviews: Review[];
  watchlist: string[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchFilters {
  query?: string;
  genre?: string;
  year?: number;
  rating?: number;
  sortBy?: 'title' | 'year' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Component Props Types
export interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
  showGenres?: boolean;
  className?: string;
}

export interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// API Response Types
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

// Social Login Types
export interface SocialLoginProvider {
  name: string;
  icon: string;
  color: string;
  url: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalReviews: number;
  recentUsers: User[];
  recentReviews: Review[];
}

// Form Types
export interface MovieFormData {
  title: string;
  synopsis: string;
  releaseYear: number;
  runtime: number;
  genres: string[];
  rating: string;
  poster: string;
  backdrop: string;
}

export interface UserFormData {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
}

// Theme Types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Watchlist Types
export interface WatchlistItem {
  id: string;
  movieId: string;
  userId: string;
  addedAt: string;
  movie: Movie;
}

// Genre Types
export interface Genre {
  id: string;
  name: string;
  slug: string;
  movieCount: number;
  color?: string;
}

// Filter Types
export interface MovieFilters {
  genres: string[];
  years: number[];
  ratings: number[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Search Types
export interface SearchResult {
  movies: Movie[];
  total: number;
  page: number;
  hasMore: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Toast Types
export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Pagination Types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

// Dropdown Types
export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Chart Types (for admin dashboard)
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

// Settings Types
export interface UserSettings {
  language: 'ar' | 'en';
  theme: 'dark' | 'light';
  notifications: {
    email: boolean;
    push: boolean;
    reviews: boolean;
    recommendations: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showWatchlist: boolean;
  };
}
