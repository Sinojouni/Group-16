import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Movie } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface TrendingSectionProps {
  movies: Movie[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ movies }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-red-600" />
        <h2 className="text-3xl font-bold text-white">{t('trendingNow')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Trending Number Badge */}
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
  );
};

export default TrendingSection;