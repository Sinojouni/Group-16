import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Film, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  TrendingUp,
  Star,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Download,
  Upload,
  RefreshCw,
  X,
  Save,
  Calendar,
  Clock as ClockIcon,
  Tag
} from 'lucide-react';
import { Movie, User, Review } from '../types';
import { mockMovies, mockReviews } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StaggeredAnimation from '../components/common/StaggeredAnimation';
import StarRating from '../components/common/StarRating';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: string, id: string} | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [newMovie, setNewMovie] = useState({
    title: '',
    releaseYear: new Date().getFullYear(),
    runtime: 0,
    genres: [] as string[],
    rating: 'PG-13',
    synopsis: '',
    poster: '',
    backdrop: '',
    isFeatured: false,
    isTrending: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination logic
  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: any[]) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Mock users data
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@movierate.com',
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
      isVerified: true,
      dateJoined: '2024-01-01',
      reviewCount: 0
    },
    {
      id: '2',
      username: 'john_doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: false,
      isVerified: true,
      dateJoined: '2024-02-15',
      reviewCount: 12
    },
    {
      id: '3',
      username: 'jane_smith',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      isAdmin: false,
      isVerified: false,
      dateJoined: '2024-03-20',
      reviewCount: 8
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMovies(mockMovies);
      setReviews(mockReviews);
      setUsers(mockUsers);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && movie.isTrending) ||
      (filterStatus === 'inactive' && !movie.isTrending);
    return matchesSearch && matchesFilter;
  });

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && review.isLiked) ||
      (filterStatus === 'inactive' && !review.isLiked);
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isVerified) ||
      (filterStatus === 'inactive' && !user.isVerified);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalMovies: movies.length,
    totalReviews: reviews.length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isVerified).length,
    pendingReviews: reviews.filter(r => !r.isLiked).length,
    averageRating: movies.reduce((sum, movie) => sum + movie.averageRating, 0) / movies.length
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    const { type, id } = itemToDelete;
    if (type === 'movie') {
      setMovies(movies.filter(m => m.id !== id));
      showNotification('success', t('movieDeleted'));
    } else if (type === 'review') {
      setReviews(reviews.filter(r => r.id !== id));
      showNotification('success', t('reviewDeleted'));
    } else if (type === 'user') {
      setUsers(users.filter(u => u.id !== id));
      showNotification('success', t('userDeleted'));
    }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleStatus = (type: string, id: string) => {
    if (type === 'user') {
      setUsers(users.map(u => 
        u.id === id ? { ...u, isVerified: !u.isVerified } : u
      ));
      showNotification('success', t('userStatusUpdated'));
    }
  };

  const handleAddMovie = () => {
    if (!newMovie.title || !newMovie.synopsis) {
      showNotification('error', t('fillRequiredFields'));
      return;
    }

    const movie: Movie = {
      id: Date.now().toString(),
      title: newMovie.title,
      releaseYear: newMovie.releaseYear,
      runtime: newMovie.runtime,
      genres: newMovie.genres,
      rating: newMovie.rating,
      synopsis: newMovie.synopsis,
      poster: newMovie.poster || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      backdrop: newMovie.backdrop || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200',
      averageRating: 0,
      totalRatings: 0,
      isFeatured: newMovie.isFeatured,
      isTrending: newMovie.isTrending,
      cast: [],
      crew: [],
      reviews: [],
      similarMovies: []
    };

    setMovies([movie, ...movies]);
    setNewMovie({
      title: '',
      releaseYear: new Date().getFullYear(),
      runtime: 0,
      genres: [],
      rating: 'PG-13',
      synopsis: '',
      poster: '',
      backdrop: '',
      isFeatured: false,
      isTrending: false
    });
    setShowAddModal(false);
    showNotification('success', t('movieAdded'));
  };

  const handleEditMovie = () => {
    if (!selectedItem || !newMovie.title || !newMovie.synopsis) {
      showNotification('error', t('fillRequiredFields'));
      return;
    }

    setMovies(movies.map(m => 
      m.id === selectedItem.id 
        ? { 
            ...m, 
            title: newMovie.title,
            releaseYear: newMovie.releaseYear,
            runtime: newMovie.runtime,
            genres: newMovie.genres,
            rating: newMovie.rating,
            synopsis: newMovie.synopsis,
            poster: newMovie.poster || m.poster,
            backdrop: newMovie.backdrop || m.backdrop,
            isFeatured: newMovie.isFeatured,
            isTrending: newMovie.isTrending
          }
        : m
    ));
    setShowEditModal(false);
    setSelectedItem(null);
    showNotification('success', t('movieUpdated'));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMovies(mockMovies);
      setReviews(mockReviews);
      setUsers(mockUsers);
      setIsLoading(false);
      showNotification('success', t('dataRefreshed'));
    }, 1000);
  };

  const handleExportData = () => {
    const data = {
      movies,
      reviews,
      users,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', t('dataExported'));
  };

  const handleGenreToggle = (genre: string) => {
    setNewMovie(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleToggleFeatured = (movieId: string) => {
    setMovies(movies.map(movie => 
      movie.id === movieId 
        ? { ...movie, isFeatured: !movie.isFeatured }
        : movie
    ));
    showNotification('success', t('featuredStatusUpdated'));
  };

  const handleToggleTrending = (movieId: string) => {
    setMovies(movies.map(movie => 
      movie.id === movieId 
        ? { ...movie, isTrending: !movie.isTrending }
        : movie
    ));
    showNotification('success', t('trendingStatusUpdated'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{t('adminDashboard')}</h1>
              <p className="text-gray-400 text-lg">{t('adminDescription')}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('exportData')}
              </button>
              <button 
                onClick={handleRefresh}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t('refresh')}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StaggeredAnimation direction="up" staggerDelay={0} duration={600}>
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">{t('totalMovies')}</p>
                <p className="text-3xl font-bold text-white">{stats.totalMovies}</p>
                <p className="text-red-200 text-sm">+12% {t('fromLastMonth')}</p>
              </div>
              <Film className="w-12 h-12 text-red-200" />
            </div>
          </div>
          </StaggeredAnimation>

          <StaggeredAnimation direction="up" staggerDelay={100} duration={600}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{t('totalUsers')}</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-blue-200 text-sm">+8% {t('fromLastMonth')}</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          </StaggeredAnimation>

          <StaggeredAnimation direction="up" staggerDelay={200} duration={600}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">{t('totalReviews')}</p>
                <p className="text-3xl font-bold text-white">{stats.totalReviews}</p>
                <p className="text-green-200 text-sm">+25% {t('fromLastMonth')}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-green-200" />
            </div>
          </div>
          </StaggeredAnimation>

          <StaggeredAnimation direction="up" staggerDelay={300} duration={600}>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">{t('averageRating')}</p>
                <p className="text-3xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
                <p className="text-purple-200 text-sm">+0.3 {t('fromLastMonth')}</p>
              </div>
              <Star className="w-12 h-12 text-purple-200" />
            </div>
          </div>
          </StaggeredAnimation>
        </div>

        {/* Featured Movies Management */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{t('featuredMoviesManagement')}</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {movies.filter(m => m.isFeatured).length} {t('featuredMovies')}
              </span>
              <span className="text-sm text-gray-400">
                {movies.filter(m => m.isTrending).length} {t('trendingMovies')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.filter(m => m.isFeatured || m.isTrending).slice(0, 6).map((movie) => (
              <div key={movie.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm truncate">{movie.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {movie.isFeatured && (
                        <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {t('featured')}
                        </span>
                      )}
                      {movie.isTrending && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 fill-current" />
                          {t('trending')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleToggleFeatured(movie.id)}
                      className={`p-1 rounded ${
                        movie.isFeatured 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-gray-400 hover:text-yellow-300'
                      }`}
                      title={movie.isFeatured ? t('removeFromFeatured') : t('addToFeatured')}
                    >
                      <Star className={`w-4 h-4 ${movie.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleToggleTrending(movie.id)}
                      className={`p-1 rounded ${
                        movie.isTrending 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-gray-400 hover:text-green-300'
                      }`}
                      title={movie.isTrending ? t('removeFromTrending') : t('addToTrending')}
                    >
                      <TrendingUp className={`w-4 h-4 ${movie.isTrending ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              {t('addMovie')}
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-3"
            >
              <Users className="w-5 h-5" />
              {t('manageUsers')}
            </button>
            <button 
              onClick={() => setActiveTab('overview')}
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-3"
            >
              <BarChart3 className="w-5 h-5" />
              {t('viewAnalytics')}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: t('overview'), icon: BarChart3 },
                { id: 'movies', label: t('movies'), icon: Film },
                { id: 'users', label: t('users'), icon: Users },
                { id: 'reviews', label: t('reviews'), icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="all">{t('all')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Movies */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">{t('recentMovies')}</h3>
                    <div className="space-y-3">
                      {movies.slice(0, 5).map((movie) => (
                        <div key={movie.id} className="flex items-center gap-3">
                          <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{movie.title}</h4>
                            <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm">{movie.averageRating.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">{t('recentReviews')}</h3>
                    <div className="space-y-3">
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{review.username[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium">{review.username}</span>
                              <StarRating rating={review.rating} readonly size="sm" />
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{t('systemStatus')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">{t('database')}</p>
                        <p className="text-gray-400 text-sm">{t('operational')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">{t('api')}</p>
                        <p className="text-gray-400 text-sm">{t('operational')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">{t('storage')}</p>
                        <p className="text-gray-400 text-sm">85% {t('used')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Movies Tab */}
            {activeTab === 'movies' && (
              <div className="space-y-4">
                {getPaginatedData(filteredMovies).map((movie) => (
                  <div key={movie.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{movie.title}</h3>
                          {movie.isFeatured && (
                            <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              {t('featured')}
                            </span>
                          )}
                          {movie.isTrending && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 fill-current" />
                              {t('trending')}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{movie.releaseYear} • {movie.runtime} {t('minutes')}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={movie.averageRating} readonly size="sm" />
                          <span className="text-gray-400 text-sm">{movie.totalRatings} {t('ratings')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFeatured(movie.id)}
                        className={`p-2 rounded ${
                          movie.isFeatured 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-gray-400 hover:text-yellow-300'
                        }`}
                        title={movie.isFeatured ? t('removeFromFeatured') : t('addToFeatured')}
                      >
                        <Star className={`w-4 h-4 ${movie.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleToggleTrending(movie.id)}
                        className={`p-2 rounded ${
                          movie.isTrending 
                            ? 'text-green-400 hover:text-green-300' 
                            : 'text-gray-400 hover:text-green-300'
                        }`}
                        title={movie.isTrending ? t('removeFromTrending') : t('addToTrending')}
                      >
                        <TrendingUp className={`w-4 h-4 ${movie.isTrending ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(movie);
                          setNewMovie({
                            title: movie.title,
                            releaseYear: movie.releaseYear || new Date().getFullYear(),
                            runtime: movie.runtime,
                            genres: movie.genres,
                            rating: movie.rating,
                            synopsis: movie.synopsis || '',
                            poster: movie.poster,
                            backdrop: movie.backdrop,
                            isFeatured: movie.isFeatured,
                            isTrending: movie.isTrending
                          });
                          setShowEditModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-2"
                        title={t('edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('movie', movie.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Pagination for Movies */}
                {getTotalPages(filteredMovies) > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      {t('previous')}
                    </button>
                    {Array.from({ length: getTotalPages(filteredMovies) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages(filteredMovies)}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      {t('next')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {getPaginatedData(filteredUsers).map((user) => (
                  <div key={user.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{user.username[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{user.username}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {user.isAdmin && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{t('admin')}</span>
                          )}
                          {user.isVerified ? (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">{t('verified')}</span>
                          ) : (
                            <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">{t('pending')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus('user', user.id)}
                        className={`p-2 rounded ${
                          user.isVerified 
                            ? 'text-green-400 hover:text-green-300' 
                            : 'text-yellow-400 hover:text-yellow-300'
                        }`}
                      >
                        {user.isVerified ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete('user', user.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Pagination for Users */}
                {getTotalPages(filteredUsers) > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      {t('previous')}
                    </button>
                    {Array.from({ length: getTotalPages(filteredUsers) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages(filteredUsers)}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      {t('next')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {getPaginatedData(filteredReviews).map((review) => (
                  <div key={review.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{review.username[0]}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{review.username}</h4>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} readonly size="sm" />
                            <span className="text-gray-400 text-sm">{review.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300 p-2">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('review', review.id)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{review.likes} {t('likes')}</span>
                      <span>{review.dislikes || 0} {t('dislikes')}</span>
                    </div>
                  </div>
                ))}
                
                {/* Pagination for Reviews */}
                {getTotalPages(filteredReviews) > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      {t('previous')}
                    </button>
                    {Array.from({ length: getTotalPages(filteredReviews) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages(filteredReviews)}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      {t('next')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{t('addMovie')}</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('title')}</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder={t('enterMovieTitle')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('releaseYear')}</label>
                  <input
                    type="number"
                    value={newMovie.releaseYear}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, releaseYear: parseInt(e.target.value) }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('runtime')} ({t('minutes')})</label>
                  <input
                    type="number"
                    value={newMovie.runtime}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, runtime: parseInt(e.target.value) }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('rating')}</label>
                <select
                  value={newMovie.rating}
                  onChange={(e) => setNewMovie(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('genres')}</label>
                <div className="flex flex-wrap gap-2">
                  {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Crime'].map(genre => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        newMovie.genres.includes(genre)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('synopsis')}</label>
                <textarea
                  value={newMovie.synopsis}
                  onChange={(e) => setNewMovie(prev => ({ ...prev, synopsis: e.target.value }))}
                  rows={4}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder={t('enterSynopsis')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('posterUrl')}</label>
                  <input
                    type="url"
                    value={newMovie.poster}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, poster: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder={t('enterPosterUrl')}
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('backdropUrl')}</label>
                  <input
                    type="url"
                    value={newMovie.backdrop}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, backdrop: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder={t('enterBackdropUrl')}
                  />
                </div>
              </div>

              {/* Featured and Trending Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={newMovie.isFeatured}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isFeatured" className="text-white text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {t('featured')}
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isTrending"
                    checked={newMovie.isTrending}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, isTrending: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isTrending" className="text-white text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    {t('trending')}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleAddMovie}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {t('addMovie')}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{t('editMovie')}</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('title')}</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('releaseYear')}</label>
                  <input
                    type="number"
                    value={newMovie.releaseYear}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, releaseYear: parseInt(e.target.value) }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('runtime')} ({t('minutes')})</label>
                  <input
                    type="number"
                    value={newMovie.runtime}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, runtime: parseInt(e.target.value) }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('rating')}</label>
                <select
                  value={newMovie.rating}
                  onChange={(e) => setNewMovie(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('genres')}</label>
                <div className="flex flex-wrap gap-2">
                  {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Crime'].map(genre => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        newMovie.genres.includes(genre)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">{t('synopsis')}</label>
                <textarea
                  value={newMovie.synopsis}
                  onChange={(e) => setNewMovie(prev => ({ ...prev, synopsis: e.target.value }))}
                  rows={4}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('posterUrl')}</label>
                  <input
                    type="url"
                    value={newMovie.poster}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, poster: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('backdropUrl')}</label>
                  <input
                    type="url"
                    value={newMovie.backdrop}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, backdrop: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* Featured and Trending Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editIsFeatured"
                    checked={newMovie.isFeatured}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="editIsFeatured" className="text-white text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {t('featured')}
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editIsTrending"
                    checked={newMovie.isTrending}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, isTrending: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="editIsTrending" className="text-white text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    {t('trending')}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleEditMovie}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {t('save')}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">{t('confirmDelete')}</h2>
            </div>
            <p className="text-gray-300 mb-6">
              {t('deleteConfirmationMessage')}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                {t('delete')}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;