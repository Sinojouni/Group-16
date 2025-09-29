import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Play } from 'lucide-react';
import { Movie } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'md', showInfo = true }) => {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useApp();
  const isInWatchlist = watchlist.includes(movie.id);

  const sizeClasses = {
    sm: 'w-28 h-42',
    md: 'w-36 h-54',
    lg: 'w-44 h-66',
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className={`relative ${sizeClasses[size]}`}>
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              {/* Play Button */}
              <Link
                to={`/movie/${movie.id}`}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all duration-200"
              >
                <Play className="w-5 h-5 text-white fill-current" />
              </Link>
              
              {/* Watchlist Button */}
              <button
                onClick={handleWatchlistToggle}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-1.5 hover:bg-opacity-30 transition-all duration-200"
              >
                {isInWatchlist ? (
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                ) : (
                  <Heart className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-1.5 right-1.5 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs">
              {movie.averageRating.toFixed(1)}
            </span>
          </div>

          {/* Trending badge */}
          {movie.isTrending && (
            <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              رائج
            </div>
          )}
        </div>
      </Link>

      {showInfo && (
        <div className="p-2.5">
          <h3 className="text-white font-medium text-sm mb-1 truncate">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-xs mb-1.5">
            {movie.releaseYear} • {movie.genres[0]}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-gray-400 text-xs">
                {movie.averageRating.toFixed(1)} ({movie.totalRatings})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;