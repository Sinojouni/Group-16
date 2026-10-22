import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { Movie } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import MovieCard from '../common/MovieCard';

interface TrendingSectionProps {
  movies: Movie[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ movies }) => {
  const { t } = useLanguage();

  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('trendingNow')}</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">الأكثر شعبية ومشاهدة هذا الأسبوع</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
        {movies.map((movie, index) => (
          <div key={movie.id} className="relative group">
            {/* Trending Rank Number Badge */}
            <div className="absolute -top-2.5 -left-2 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-red-900/50 z-20 border-2 border-gray-900 transform group-hover:scale-110 transition-transform">
              {index + 1}
            </div>
            <MovieCard movie={movie} size="md" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;