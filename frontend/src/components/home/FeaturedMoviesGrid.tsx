import React from 'react';
import { Movie } from '../../types';
import MovieCard from '../common/MovieCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface FeaturedMoviesGridProps {
  movies: Movie[];
  title: string;
}

const FeaturedMoviesGrid: React.FC<FeaturedMoviesGridProps> = ({ movies, title }) => {
  const { t } = useLanguage();

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="mb-14">
      {/* Header section */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {title}
        </h2>
      </div>
      
      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size="md" />
        ))}
      </div>
    </section>
  );
};

export default FeaturedMoviesGrid;