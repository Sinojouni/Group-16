import React from 'react';
import { Movie } from '../../types';
import MovieCard from '../common/MovieCard';
import { useLanguage } from '../../contexts/LanguageContext';

const FeaturedMoviesGrid = ({ movies, title }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">{title}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size="md" />
        ))}
      </div>
    </div>
  );
};

export default FeaturedMoviesGrid;