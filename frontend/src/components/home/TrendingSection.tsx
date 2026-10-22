import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Movie } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import MovieCard from '../common/MovieCard';

const TrendingSection = ({ movies }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-red-600" />
        <h2 className="text-3xl font-bold text-white">{t('trendingNow')}</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie, index) => (
          <div key={movie.id} className="relative">
            {/* Trending Number Badge */}
            <div className="absolute top-2 left-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
              #{index + 1}
            </div>
            <MovieCard movie={movie} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;