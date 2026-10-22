import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Movie } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { getFeaturedMovies } from '../../services/movieService';

interface HeroSectionProps {
  movies?: Movie[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ movies: propMovies }) => {
  const { movies: contextMovies } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Use movies from props, context, or fetch from API
  useEffect(() => {
    const loadFeaturedMovies = async () => {
      if (propMovies && propMovies.length > 0) {
        const featured = propMovies.filter(movie => movie.isFeatured);
        setFeaturedMovies(featured.length > 0 ? featured : propMovies.slice(0, 10));
      } else if (contextMovies && contextMovies.length > 0) {
        const featured = contextMovies.filter(movie => movie.isFeatured);
        setFeaturedMovies(featured.length > 0 ? featured : contextMovies.slice(0, 10));
      } else {
        try {
          const featured = await getFeaturedMovies();
          setFeaturedMovies(featured);
        } catch (error) {
          console.error('Error fetching featured movies:', error);
          setFeaturedMovies([]);
        }
      }
    };

    loadFeaturedMovies();
  }, [propMovies, contextMovies]);

  // Sync image source whenever slide or movies change
  useEffect(() => {
    if (featuredMovies.length > 0) {
      const movie = featuredMovies[currentSlide];
      const initial = movie.backdrop || movie.poster || '';
      setImageSrc(initial);
    }
  }, [currentSlide, featuredMovies]);

  useEffect(() => {
    if (featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  if (!featuredMovies.length) return null;

  const currentMovie = featuredMovies[currentSlide];

  const handleImageError = () => {
    if (currentMovie && currentMovie.title) {
      // Check localStorage
      try {
        const cached = localStorage.getItem(`poster_${currentMovie.title}`);
        if (cached && cached !== imageSrc) {
          setImageSrc(cached);
          return;
        }
      } catch (_) {}

      // Fetch from OMDB
      fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(currentMovie.title)}&apikey=trilogy`)
        .then(res => res.json())
        .then(data => {
          if (data && data.Response === 'True' && data.Poster && data.Poster.startsWith('http')) {
            setImageSrc(data.Poster);
            try { localStorage.setItem(`poster_${currentMovie.title}`, data.Poster); } catch (_) {}
          }
        })
        .catch(() => {});
    }
  };

  return (
    <div className="relative min-h-[550px] md:h-[70vh] overflow-hidden bg-gray-900 flex items-center">
      {/* Background Ambience & Backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover filter blur-2xl scale-125 opacity-25"
            onError={handleImageError}
          />
        )}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={currentMovie.title}
            className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90"
            onError={handleImageError}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-gray-900/50" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="flex items-center justify-between gap-8">
          
          {/* Movie Details */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
              <span>★ فيلم مميز</span>
              {currentMovie.isTrending && <span>• رائج الآن</span>}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-md">
              {currentMovie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                <Star className="w-4 h-4 fill-current text-amber-400" />
                <span>{(currentMovie.averageRating || 0).toFixed(1)}</span>
              </div>
              {currentMovie.releaseYear && (
                <span className="text-gray-300 font-medium">{currentMovie.releaseYear}</span>
              )}
              {currentMovie.runtime > 0 && (
                <span className="text-gray-400 font-medium">{currentMovie.runtime} دقيقة</span>
              )}
              <span className="bg-gray-800/80 border border-gray-700 text-gray-300 px-2 py-0.5 text-xs rounded font-medium">
                {currentMovie.rating || 'PG-13'}
              </span>
            </div>

            {Array.isArray(currentMovie.genres) && currentMovie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {currentMovie.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="bg-gray-800/70 border border-gray-700/60 text-gray-300 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl line-clamp-3">
              {currentMovie.synopsis || currentMovie.overview || 'قصة سينمائية مشوقة تأخذك في تجربة لا تُنسى.'}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Info className="w-5 h-5" />
                <span>التفاصيل الكاملة</span>
              </Link>
            </div>
          </div>

          {/* Floating Poster Showcase on Large screens */}
          {imageSrc && (
            <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-white/10 group transform hover:scale-105 transition-all duration-300">
                <img
                  src={imageSrc}
                  alt={currentMovie.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-semibold">{currentMovie.title}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 backdrop-blur-md border border-white/10 transition-all duration-200 z-20 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 backdrop-blur-md border border-white/10 transition-all duration-200 z-20 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 space-x-reverse z-20">
        {featuredMovies.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-8 h-2 bg-red-600' 
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;