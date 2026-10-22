import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Star, 
  TrendingUp, 
  Heart, 
  Clock, 
  Award,
  Grid3X3,
  Filter,
  SortAsc,
  Search
} from 'lucide-react';
import { Movie, Genre } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import StaggeredAnimation from '../components/common/StaggeredAnimation';
import { getMovies } from '../services/movieService';

const GenresPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMovies, setShowMovies] = useState(false);

  // All available genres
  const allGenres = [
    { name: 'Action', nameAr: 'أكشن', icon: '🎬', color: 'bg-red-600' },
    { name: 'Comedy', nameAr: 'كوميديا', icon: '😄', color: 'bg-yellow-500' },
    { name: 'Drama', nameAr: 'دراما', icon: '🎭', color: 'bg-blue-600' },
    { name: 'Horror', nameAr: 'رعب', icon: '👻', color: 'bg-purple-600' },
    { name: 'Sci-Fi', nameAr: 'خيال علمي', icon: '🚀', color: 'bg-green-600' },
    { name: 'Romance', nameAr: 'رومانسي', icon: '💕', color: 'bg-pink-600' },
    { name: 'Thriller', nameAr: 'إثارة', icon: '⚡', color: 'bg-orange-600' },
    { name: 'Crime', nameAr: 'جريمة', icon: '🔍', color: 'bg-gray-600' },
    { name: 'Adventure', nameAr: 'مغامرة', icon: '🗺️', color: 'bg-indigo-600' },
    { name: 'Fantasy', nameAr: 'فانتازيا', icon: '🧙‍♂️', color: 'bg-violet-600' },
    { name: 'Animation', nameAr: 'رسوم متحركة', icon: '🎨', color: 'bg-cyan-600' },
    { name: 'Documentary', nameAr: 'وثائقي', icon: '📹', color: 'bg-teal-600' }
  ];

  // Get user's viewing history to suggest genres (simulated)
  const getUserViewingHistory = () => {
    if (!user) return [];
    // Simulate user's viewing history based on mock data
    const userMovies = movies.filter(movie => 
      (movie.averageRating || 0) > 4.0 // Simulate user likes highly rated movies
    );
    const genreCounts: { [key: string]: number } = {};
    
    userMovies.forEach(movie => {
      movie.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    return Object.keys(genreCounts)
      .sort((a, b) => genreCounts[b] - genreCounts[a])
      .slice(0, 4);
  };

  // User's favorite genres (simulated - will be replaced with AI recommendations)
  const userFavoriteGenres = user ? getUserViewingHistory() : [];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const allMovies = await getMovies();
        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let results = [...movies];

    // Filter by genre
    if (selectedGenre) {
      results = results.filter(movie => 
        movie.genres.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      results = results.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'year':
        results.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'runtime':
        results.sort((a, b) => b.runtime - a.runtime);
        break;
      default:
        break;
    }

    setFilteredMovies(results);
  }, [movies, selectedGenre, searchQuery, sortBy]);

  const handleGenreClick = (genreName: string) => {
    setSelectedGenre(genreName);
    setShowMovies(true);
    // Scroll to movies section
    setTimeout(() => {
      const moviesSection = document.getElementById('movies-section');
      if (moviesSection) {
        moviesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const getGenreStats = (genreName: string) => {
    const genreMovies = movies.filter(movie => 
      movie.genres.some(genre => genre.toLowerCase() === genreName.toLowerCase())
    );
    const avgRating = genreMovies.length > 0 
      ? genreMovies.reduce((sum, movie) => sum + movie.averageRating, 0) / genreMovies.length 
      : 0;
    
    return {
      count: genreMovies.length,
      avgRating: avgRating.toFixed(1)
    };
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
          <div className="flex items-center gap-3 mb-4">
            <Grid3X3 className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-white">{t('browseGenres')}</h1>
          </div>
          <p className="text-gray-400 text-lg">
            {t('discoverMovies')}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('searchInGenres')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="rating">{t('highestRated')}</option>
                <option value="year">{t('newest')}</option>
                <option value="title">{t('name')}</option>
                <option value="runtime">{t('duration')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommended Genres Section */}
        {user && userFavoriteGenres.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-white">{t('recommendedForYou')}</h2>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {t('personalized')}
              </span>
              <span className="text-gray-400 text-sm">
                {t('basedOnPreferences')}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {userFavoriteGenres.map((genreName) => {
                const genre = allGenres.find(g => g.name === genreName);
                const stats = getGenreStats(genreName);
                
                return (
                  <Link
                    key={genreName}
                    to={`/genre/${genreName.toLowerCase()}`}
                    className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-700 hover:border-red-600"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${genre?.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {genre?.icon}
                      </div>
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-2">{genre?.nameAr}</h3>
                    <p className="text-gray-400 text-sm mb-3">{genre?.name}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{stats.count} فيلم</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{stats.avgRating}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Genres Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-white">{t('allGenres')}</h2>
          </div>
          
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {allGenres.map((genre, index) => {
              const stats = getGenreStats(genre.name);
              const isSelected = selectedGenre === genre.name;
              
              return (
                <StaggeredAnimation key={genre.name} direction="up" staggerDelay={index * 100} duration={600}>
                  <button
                    onClick={() => handleGenreClick(genre.name)}
                    className={`group relative bg-gray-800 rounded-xl p-4 hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 ${
                      isSelected 
                        ? 'border-red-600 bg-red-600/20' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${genre.color} rounded-xl flex items-center justify-center text-3xl mx-auto mb-3 transition-transform duration-200 group-hover:scale-110`}>
                      {genre.icon}
                    </div>
                    
                    <h3 className="text-white font-bold text-sm mb-1">{genre.nameAr}</h3>
                    <p className="text-gray-400 text-xs mb-2">{genre.name}</p>
                    
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-gray-400">{stats.count} {t('movie')}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white">{stats.avgRating}</span>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-2">
                        <span className="text-red-400 text-xs font-medium">✓ {t('selected')}</span>
                      </div>
                    )}
                  </div>
                </button>
                </StaggeredAnimation>
              );
            })}
          </div>
        </div>

        {/* Movies Grid */}
        {selectedGenre && showMovies && (
          <div id="movies-section" className="mb-8">
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${allGenres.find(g => g.name === selectedGenre)?.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {allGenres.find(g => g.name === selectedGenre)?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      أفلام {allGenres.find(g => g.name === selectedGenre)?.nameAr}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {allGenres.find(g => g.name === selectedGenre)?.name} • {filteredMovies.length} فيلم
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedGenre('');
                    setShowMovies(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              {/* Genre Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">إجمالي الأفلام</span>
                  </div>
                  <p className="text-white font-bold text-lg">{filteredMovies.length}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">متوسط التقييم</span>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {filteredMovies.length > 0 
                      ? (filteredMovies.reduce((sum, movie) => sum + movie.averageRating, 0) / filteredMovies.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">الأفلام الرائجة</span>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {filteredMovies.filter(movie => movie.isTrending).length}
                  </p>
                </div>
              </div>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="text-center py-12">
                <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">لا توجد أفلام</h3>
                <p className="text-gray-400">لم يتم العثور على أفلام في هذا النوع</p>
              </div>
            ) : (
              <>
                {/* Movies Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredMovies.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    >
                      <div className="relative h-80">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 right-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm font-medium">
                            {movie.averageRating.toFixed(1)}
                          </span>
                        </div>
                        {movie.isTrending && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            رائج
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold text-lg mb-1 truncate">
                          {movie.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{movie.releaseYear}</p>
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.slice(0, 2).map((genre) => (
                            <span
                              key={genre}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {filteredMovies.length > 8 && (
                  <div className="text-center mt-8">
                    <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700">
                      عرض المزيد
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Popular Genres Stats */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">إحصائيات الأنواع</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allGenres.slice(0, 6).map((genre) => {
              const stats = getGenreStats(genre.name);
              return (
                <div key={genre.name} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${genre.color} rounded-lg flex items-center justify-center text-lg`}>
                      {genre.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{genre.nameAr}</h4>
                      <p className="text-gray-400 text-sm">{stats.count} فيلم</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{stats.avgRating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenresPage;
