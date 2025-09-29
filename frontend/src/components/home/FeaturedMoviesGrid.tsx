import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Star } from 'lucide-react';
import { Movie } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface FeaturedMoviesGridProps {
  movies: Movie[];
  title: string;
}

const FeaturedMoviesGrid: React.FC<FeaturedMoviesGridProps> = ({ movies, title }) => {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useApp();
  const { t } = useLanguage();

  const handleWatchlistToggle = (movieId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (watchlist.includes(movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Movie Poster */}
            <div className="relative h-80">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-red-600 rounded-full p-4 hover:bg-red-700 transition-colors duration-200">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">
                  {movie.averageRating.toFixed(1)}
                </span>
              </div>

              {/* Watchlist Button */}
              <button
                onClick={(e) => handleWatchlistToggle(movie.id, e)}
                className="absolute top-3 left-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <Plus className={`w-5 h-5 ${watchlist.includes(movie.id) ? 'text-green-400' : 'text-white'}`} />
              </button>
            </div>

            {/* Movie Info */}
            <div className="p-4">
              {/* Rating */}
              <div className="flex items-center justify-end mb-2">
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

export default FeaturedMoviesGrid;