import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Play, Film } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

const MovieCard = ({ movie, size = 'md', showInfo = true }) => {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useApp();
  const { t } = useLanguage();
  const isInWatchlist = watchlist.includes(movie.id);
  const [imageError, setImageError] = useState(false);
  const [currentPoster, setCurrentPoster] = useState(movie.poster || '');

  // Width classes based on size; height is handled by aspect-[2/3]
  const sizeClasses = {
    sm: 'w-28 sm:w-32',
    md: 'w-full',
    lg: 'w-44 sm:w-52',
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
  const displayGenres = Array.isArray(movie.genres) 
    ? movie.genres.slice(0, 2).join(', ') 
    : '';

  const handleImageError = () => {
    if (!imageError && movie.title) {
      setImageError(true);
      // Try local storage cache first
      try {
        const cached = localStorage.getItem(`poster_${movie.title}`);
        if (cached && cached !== currentPoster) {
          setCurrentPoster(cached);
          return;
        }
      } catch (_) {}

      // Fallback: fetch from OMDB
      fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&apikey=trilogy`)
        .then(res => res.json())
        .then(data => {
          if (data && data.Response === 'True' && data.Poster && data.Poster.startsWith('http')) {
            setCurrentPoster(data.Poster);
            try { localStorage.setItem(`poster_${movie.title}`, data.Poster); } catch (_) {}
          }
        })
        .catch(() => {});
    }
  };

  return (
    <div className={`group relative flex flex-col ${sizeClasses[size] || 'w-full'} transition-all duration-300 hover:-translate-y-1`}>
      <Link to={`/movie/${movie.id}`} className="block w-full">
        <div className="relative w-full aspect-[2/3] bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800/80 group-hover:border-red-500/50 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all duration-300">
          
          {/* Subtle placeholder icon shown behind or on error */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center text-gray-500">
            <Film className="w-10 h-10 mb-2 opacity-30 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium line-clamp-2 px-1 opacity-70">
              {movie.title}
            </span>
          </div>

          {/* Poster image */}
          {currentPoster && (
            <img
              src={currentPoster}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          )}

          {/* Dark gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {/* Play Button */}
              <div
                className="bg-red-600/90 text-white rounded-full p-2.5 shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              
              {/* Watchlist Button */}
              <button
                onClick={handleWatchlistToggle}
                className="bg-black/60 backdrop-blur-md border border-white/20 rounded-full p-2 hover:bg-black/80 transition-all duration-200"
                title={isInWatchlist ? t('removeWatchlist') : t('addWatchlist')}
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
          <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md z-10">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-semibold">
              {(movie.averageRating || 0).toFixed(1)}
            </span>
          </div>

          {/* Trending badge */}
          {movie.isTrending && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
              {t('trendingBadge')}
            </div>
          )}
          
          {/* Featured badge */}
          {movie.isFeatured && !movie.isTrending && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
              {t('featuredBadge')}
            </div>
          )}
        </div>
      </Link>

      {showInfo && (
        <div className="pt-2.5 px-0.5">
          <Link to={`/movie/${movie.id}`}>
            <h3 
              className="text-white font-semibold text-sm leading-snug truncate group-hover:text-red-400 transition-colors" 
              title={movie.title}
            >
              {movie.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
            <span className="truncate max-w-[70%]">
              {movie.releaseYear || ''} {displayGenres ? `• ${displayGenres}` : ''}
            </span>
            {movie.totalRatings > 0 && (
              <span className="text-gray-500 text-[11px]">
                ({movie.totalRatings})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;