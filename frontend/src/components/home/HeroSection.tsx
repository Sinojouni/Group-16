import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../types';
import { mockMovies } from '../../data/mockData';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredMovies = mockMovies.filter(movie => movie.isFeatured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

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

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.backdrop}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">
                  {currentMovie.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">{currentMovie.releaseYear}</span>
              <span className="text-gray-300">{currentMovie.runtime} min</span>
              <span className="bg-gray-600 text-white px-2 py-1 text-xs rounded">
                {currentMovie.rating}
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              {currentMovie.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-gray-200 text-base leading-relaxed mb-6 max-w-xl">
              {currentMovie.synopsis.length > 200
                ? `${currentMovie.synopsis.substring(0, 200)}...`
                : currentMovie.synopsis}
            </p>

            <div className="flex gap-4">
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-red-700 transition-colors duration-200"
              >
                <Info className="w-5 h-5" />
                التفاصيل
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;