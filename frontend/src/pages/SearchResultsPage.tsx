import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SortAsc, Grid, List, Star, Clock, Calendar, TrendingUp, Award, Users, Eye } from 'lucide-react';
import { Movie } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import LazyImage from '../components/common/LazyImage';
import FadeIn from '../components/common/FadeIn';
import AnimatedCard from '../components/common/AnimatedCard';
import StaggeredAnimation from '../components/common/StaggeredAnimation';
import useDebounce from '../hooks/useDebounce';
import { searchMovies, getMovies } from '../services/movieService';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    type: 'all' // all, movie, series
  });
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, 300);
  // Memoized search results for better performance
  const searchResults = useMemo(() => {
    if (!debouncedQuery) return movies;
    
    const searchTerm = debouncedQuery.toLowerCase();
    
    return movies.filter(movie => {
      // Search in title
      const titleMatch = movie.title.toLowerCase().includes(searchTerm);
      
      // Search in genres
      const genreMatch = movie.genres.some(genre => 
        genre.toLowerCase().includes(searchTerm)
      );
      
      // Search in cast names
      const castMatch = movie.cast?.some(actor => 
        actor.name.toLowerCase().includes(searchTerm)
      ) || false;
      
      // Search in director
      const directorMatch = movie.director?.toLowerCase().includes(searchTerm) || false;
      
      // Search in synopsis
      const synopsisMatch = movie.synopsis?.toLowerCase().includes(searchTerm) || false;
      
      return titleMatch || genreMatch || castMatch || directorMatch || synopsisMatch;
    }).sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const searchTerm = debouncedQuery.toLowerCase();
      
      // Exact matches first
      if (aTitle === searchTerm && bTitle !== searchTerm) return -1;
      if (bTitle === searchTerm && aTitle !== searchTerm) return 1;
      
      // Starts with search term
      if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1;
      if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1;
      
      // Contains search term
      if (aTitle.includes(searchTerm) && !bTitle.includes(searchTerm)) return -1;
      if (bTitle.includes(searchTerm) && !aTitle.includes(searchTerm)) return 1;
      
      // Sort by rating if no relevance difference
      return (b.averageRating || 0) - (a.averageRating || 0);
    });
  }, [debouncedQuery, movies]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        if (debouncedQuery) {
          // Perform search
          const searchResults = await searchMovies(debouncedQuery);
          setMovies(searchResults);
          setFilteredMovies(searchResults);
        } else {
          // Load all movies if no search query
          const allMovies = await getMovies();
          setMovies(allMovies);
          setFilteredMovies(allMovies);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
        setFilteredMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedQuery]);

  useEffect(() => {
    let results = [...movies];

    // Apply filters
    if (filters.genre) {
      results = results.filter(movie => 
        movie.genres.some(genre => genre.toLowerCase() === filters.genre.toLowerCase())
      );
    }

    if (filters.year) {
      results = results.filter(movie => movie.releaseYear === parseInt(filters.year));
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      results = results.filter(movie => movie.averageRating >= minRating);
    }

    // Apply sorting
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
      case 'trending':
        results.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return b.averageRating - a.averageRating;
        });
        break;
      case 'popular':
        results.sort((a, b) => b.totalRatings - a.totalRatings);
        break;
      default:
        // Relevance - keep original order
        break;
    }

    setFilteredMovies(results);
  }, [movies, filters, sortBy]);

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Crime'];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

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
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-red-600" />
            <h1 className="text-3xl font-bold text-white">
              نتائج البحث عن "{query}"
            </h1>
          </div>
          <p className="text-gray-400">
            تم العثور على {filteredMovies.length} نتيجة
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث عن أفلام ومسلسلات..."
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  defaultValue={query}
                  onChange={(e) => {
                    const newQuery = e.target.value;
                    if (newQuery !== query) {
                      window.location.href = `/search?q=${encodeURIComponent(newQuery)}`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                فلاتر
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="relevance">الأكثر صلة</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="year">الأحدث</option>
                <option value="title">الاسم</option>
                <option value="runtime">المدة</option>
                <option value="trending">الرائج</option>
                <option value="popular">الأكثر شعبية</option>
              </select>

              <div className="flex bg-gray-700 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-l-lg transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-r-lg transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    النوع
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">جميع الأنواع</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    السنة
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">جميع السنوات</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    التقييم الأدنى
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({...filters, rating: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">جميع التقييمات</option>
                    <option value="4">4+ نجوم</option>
                    <option value="3">3+ نجوم</option>
                    <option value="2">2+ نجوم</option>
                    <option value="1">1+ نجوم</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-400 mb-6">
              جرب البحث بكلمات مختلفة أو استخدم الفلاتر لتضييق النتائج
            </p>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              العودة للرئيسية
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'
              : 'space-y-4'
          }>
            {filteredMovies.map((movie, index) => (
              viewMode === 'grid' ? (
                <StaggeredAnimation key={movie.id} direction="up" staggerDelay={index * 100} duration={600}>
                  <AnimatedCard hoverScale hoverGlow>
                    <Link
                      to={`/movie/${movie.id}`}
                      className="group relative bg-gray-800 rounded-lg overflow-hidden block"
                    >
                  <div className="relative h-80">
                    <LazyImage
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
                  </AnimatedCard>
                </StaggeredAnimation>
              ) : (
                <StaggeredAnimation key={movie.id} direction="up" staggerDelay={index * 100} duration={600}>
                  <AnimatedCard>
                    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <Link to={`/movie/${movie.id}`} className="flex-shrink-0">
                      <LazyImage
                        src={movie.poster}
                        alt={movie.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <Link to={`/movie/${movie.id}`}>
                        <h3 className="text-white font-bold text-xl mb-2 hover:text-red-400 transition-colors duration-200">
                          {movie.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-gray-400">{movie.releaseYear}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">
                            {movie.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{movie.runtime} دقيقة</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {movie.synopsis}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                          <span
                            key={genre}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                    </div>
                  </AnimatedCard>
                </StaggeredAnimation>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
