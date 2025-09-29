import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Calendar, Clock, Filter, Search, SortAsc, Grid3X3, List, Trash2, Eye } from 'lucide-react';
import { Movie } from '../types';
import { mockMovies } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import StaggeredAnimation from '../components/common/StaggeredAnimation';

const WatchlistPage: React.FC = () => {
  const { t } = useLanguage();
  const { watchlist, removeFromWatchlist } = useApp();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('added');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const watchlistMovies = mockMovies.filter(movie => watchlist.includes(movie.id));
      setMovies(watchlistMovies);
      setFilteredMovies(watchlistMovies);
      setIsLoading(false);
    }, 500);
  }, [watchlist]);

  useEffect(() => {
    let results = [...movies];

    // Filter by search query
    if (searchQuery) {
      results = results.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by genre
    if (filterBy !== 'all') {
      results = results.filter(movie => movie.genres.includes(filterBy));
    }

    // Sort results
    switch (sortBy) {
      case 'added':
        // Sort by order added to watchlist (simulated)
        results.sort((a, b) => watchlist.indexOf(a.id) - watchlist.indexOf(b.id));
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        results.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'year':
        results.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case 'runtime':
        results.sort((a, b) => b.runtime - a.runtime);
        break;
      default:
        break;
    }

    setFilteredMovies(results);
  }, [movies, searchQuery, sortBy, filterBy, watchlist]);

  const handleRemoveFromWatchlist = (movieId: string) => {
    removeFromWatchlist(movieId);
  };

  const getUniqueGenres = () => {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genres.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-white">{t('watchlist')}</h1>
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {movies.length} {t('movies')}
            </span>
          </div>
          <p className="text-gray-400 text-lg">
            {t('watchlistDescription')}
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
                  placeholder={t('searchInWatchlist')}
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
                <option value="added">{t('dateAdded')}</option>
                <option value="title">{t('title')}</option>
                <option value="rating">{t('rating')}</option>
                <option value="year">{t('year')}</option>
                <option value="runtime">{t('runtime')}</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {t('filter')}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">{t('genres')}:</span>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="all">{t('allGenres')}</option>
                    {getUniqueGenres().map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Movies Display */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery || filterBy !== 'all' ? t('noMoviesFound') : t('emptyWatchlist')}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterBy !== 'all' ? t('noMoviesDescription') : t('emptyWatchlistDescription')}
            </p>
            {!searchQuery && filterBy === 'all' && (
              <Link
                to="/"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 inline-flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                {t('browseMovies')}
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredMovies.map((movie, index) => (
                  <StaggeredAnimation key={movie.id} direction="up" staggerDelay={index * 100} duration={600}>
                    <div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <Link to={`/movie/${movie.id}`} className="block">
                      <div className="relative h-80">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm font-medium">
                            {movie.averageRating.toFixed(1)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFromWatchlist(movie.id);
                          }}
                          className="absolute top-3 left-3 bg-red-600 bg-opacity-80 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </Link>

                    <div className="p-4">
                      <h3 className="text-white font-bold text-lg mb-1 truncate">
                        {movie.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{movie.releaseYear}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {movie.genres.slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">{movie.runtime} {t('minutes')}</span>
                        </div>
                        <StarRating rating={movie.averageRating} readonly size="sm" />
                      </div>
                    </div>
                  </div>
                  </StaggeredAnimation>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200">
                    <div className="flex items-start gap-4">
                      <Link to={`/movie/${movie.id}`} className="flex-shrink-0">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-24 h-36 object-cover rounded-lg"
                        />
                      </Link>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link to={`/movie/${movie.id}`} className="text-white font-bold text-xl hover:text-red-400 transition-colors duration-200">
                              {movie.title}
                            </Link>
                            <p className="text-gray-400 text-sm mb-2">{movie.releaseYear}</p>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromWatchlist(movie.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <StarRating rating={movie.averageRating} readonly size="sm" />
                          <span className="text-gray-400 text-sm">{movie.averageRating.toFixed(1)}</span>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{movie.runtime} {t('minutes')}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.map((genre) => (
                            <span
                              key={genre}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
