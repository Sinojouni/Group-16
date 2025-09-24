// App Configuration
export const APP_CONFIG = {
  name: 'MovieRate',
  version: '1.0.0',
  description: 'Modern movie rating and review platform',
  apiUrl: import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api',
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    profile: '/auth/profile/',
  },
  movies: {
    list: '/movies/',
    detail: '/movies/:id/',
    search: '/movies/search/',
    trending: '/movies/trending/',
    featured: '/movies/featured/',
  },
  reviews: {
    list: '/reviews/',
    create: '/reviews/',
    update: '/reviews/:id/',
    delete: '/reviews/:id/',
    like: '/reviews/:id/like/',
  },
  users: {
    profile: '/users/profile/',
    watchlist: '/users/watchlist/',
  },
  admin: {
    dashboard: '/admin/dashboard/',
    movies: '/admin/movies/',
    users: '/admin/users/',
    reviews: '/admin/reviews/',
  },
};

// App Constants
export const APP_CONSTANTS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  rating: {
    min: 1,
    max: 5,
    step: 0.5,
  },
  genres: [
    'Action',
    'Adventure',
    'Animation',
    'Biography',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Sport',
    'Thriller',
    'War',
    'Western',
  ],
  movieRatings: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
  languages: [
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'en', name: 'English', dir: 'ltr' },
  ],
};

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: '#DC2626',
    secondary: '#1F2937',
    background: '#111827',
    surface: '#1F2937',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  email: {
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  movie: {
    title: {
      minLength: 1,
      maxLength: 200,
    },
    synopsis: {
      minLength: 10,
      maxLength: 2000,
    },
    year: {
      min: 1888,
      max: new Date().getFullYear() + 5,
    },
    runtime: {
      min: 1,
      max: 600,
    },
  },
  review: {
    comment: {
      minLength: 10,
      maxLength: 1000,
    },
  },
};
