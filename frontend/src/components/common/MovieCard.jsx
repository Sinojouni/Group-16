import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Play } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const MovieCard = ({ movie, size = 'md', showInfo = true }) => {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useApp();
  const isInWatchlist = watchlist.includes(movie.id);

  const sizeClasses = {
    sm: 'w-28 h-42',
    md: 'w-36 h-54',
    lg: 'w-44 h-66',
  };

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  // Format genres to show up to 2 genres
  const displayGenres = movie.genres.slice(0, 2).join(', ');

  return (
    <div className="group relative overflow-hidden rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className={`relative ${sizeClasses[size]}`}>
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target;
              // First try to use movie title as a fallback
              if (movie.title && movie.title.trim() !== '') {
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title)}&background=1a202c&color=fff&size=300&bold=true&length=2`;
              } else {
                target.src = 'https://placehold.co/300x450/1a202c/FFFFFF?text=No+Image';
              }
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              {/* Play Button */}
              <button
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/movie/${movie.id}`;
                }}
              >
                <Play className="w-5 h-5 text-white fill-current" />
              </button>
              
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
          
          {/* Featured badge */}
          {movie.isFeatured && (
            <div className="absolute bottom-1.5 left-1.5 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
              مميز
            </div>
          )}
        </div>
      </Link>

      {showInfo && (
        <div className="p-2.5">
          <h3 className="text-white font-medium text-sm mb-1 truncate" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-gray-400 text-xs mb-1.5 truncate" title={`${movie.releaseYear} • ${displayGenres}`}>
            {movie.releaseYear} • {displayGenres}
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