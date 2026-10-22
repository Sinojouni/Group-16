import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import { Movie } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getTrendingMovies } from '../services/movieService';

const TrendingPage: React.FC = () => {
  const { t } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setIsLoading(true);
        const trendingMovies = await getTrendingMovies();
        setMovies(trendingMovies);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.averageRating - a.averageRating;
    if (sortBy === 'year') return b.releaseYear - a.releaseYear;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-white">{t('trendingNow')}</h1>
          </div>
          
          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="year">الأحدث</option>
              <option value="title">الاسم</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMovies.map((movie, index) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Trending Rank */}
              <div className="absolute top-3 left-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
                #{index + 1}
              </div>

              {/* Movie Poster */}
              <div className="relative h-80">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <span className="text-yellow-400 text-sm font-bold">★</span>
                  <span className="text-white text-sm font-medium">
                    {movie.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-4">
                {/* Match Percentage */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-bold text-sm">
                    {Math.round(movie.averageRating * 20)}% {t('match')}
                  </span>
                  <span className="text-white font-bold text-lg">
                    {movie.averageRating.toFixed(1)}
                  </span>
                </div>

                {/* Title and Year */}
                <h3 className="text-white font-bold text-lg mb-1 truncate">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{movie.releaseYear}</p>

                {/* Genres */}
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
      </div>
    </div>
  );
};

export default TrendingPage;