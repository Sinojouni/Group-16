import React, { useState, useEffect, useRef } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import { Movie } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import MovieCard from '../common/MovieCard';
import Pagination from '../common/Pagination';
import { getPaginatedTrendingMovies } from '../../services/movieService';

interface TrendingSectionProps {
  movies?: Movie[];
}

const PAGE_SIZE = 24;

const TrendingSection: React.FC<TrendingSectionProps> = ({ movies: initialMovies }) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>(initialMovies || []);
  const [totalCount, setTotalCount] = useState(12988);
  const [totalPages, setTotalPages] = useState(Math.ceil(12988 / PAGE_SIZE));
  const [isLoading, setIsLoading] = useState(false);

  // Load first page or paginated page
  useEffect(() => {
    let isMounted = true;

    const fetchPage = async () => {
      try {
        setIsLoading(true);
        const data = await getPaginatedTrendingMovies(currentPage, PAGE_SIZE);
        if (isMounted) {
          if (data.movies.length > 0) {
            setMovies(data.movies);
          }
          if (data.count > 0) {
            setTotalCount(data.count);
            setTotalPages(data.totalPages);
          }
        }
      } catch (err) {
        console.error('Error fetching trending movies page:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // If initial movies are provided and we are on page 1 and they have 24 items, use them;
    // otherwise fetch from the backend to ensure a full complete 24-item grid.
    if (currentPage === 1 && initialMovies && initialMovies.length >= PAGE_SIZE) {
      setMovies(initialMovies.slice(0, PAGE_SIZE));
    } else {
      fetchPage();
    }

    return () => {
      isMounted = false;
    };
  }, [currentPage, initialMovies]);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    // Smooth scroll to top of section
    if (sectionRef.current) {
      const topOffset = sectionRef.current.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section ref={sectionRef} className="mb-14 scroll-mt-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('trendingNow')}</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{t('popularThisWeek')}</p>
          </div>
        </div>

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-red-400 font-semibold bg-red-950/40 border border-red-900/60 px-3 py-1.5 rounded-full">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{t('loading')}</span>
          </div>
        )}
      </div>
      
      {/* Movies Grid - Perfectly filled for 24 items: 6 cols (4 rows), 4 cols (6 rows), 3 cols (8 rows), 2 cols (12 rows) */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 sm:gap-5 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {movies.map((movie, index) => {
          const rank = (currentPage - 1) * PAGE_SIZE + index + 1;
          return (
            <div key={`${movie.id}-${rank}`} className="relative group">
              {/* Trending Rank Number Badge */}
              <div className="absolute -top-2.5 -left-2 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-red-900/50 z-20 border-2 border-gray-900 transform group-hover:scale-110 transition-transform">
                {rank}
              </div>
              <MovieCard movie={movie} size="md" />
            </div>
          );
        })}
      </div>

      {/* Pagination Controls / سجل التنقلات */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </section>
  );
};

export default TrendingSection;