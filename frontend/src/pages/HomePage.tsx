import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedMoviesGrid from '../components/home/FeaturedMoviesGrid';
import GenreBrowser from '../components/home/GenreBrowser';
import TrendingSection from '../components/home/TrendingSection';
import FadeIn from '../components/common/FadeIn';
import StaggeredAnimation from '../components/common/StaggeredAnimation';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { getMovies, getTrendingMovies, getFeaturedMovies } from '../services/movieService';
import { Movie } from '../types';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { movies: contextMovies } = useApp();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use context movies if available, otherwise fetch from API
        let allMovies = contextMovies;
        if (!allMovies || allMovies.length === 0) {
          allMovies = await getMovies();
          setMovies(allMovies);
        }
        
        // Fetch trending movies
        const trending = await getTrendingMovies();
        setTrendingMovies(trending);
        
        // Fetch featured movies
        const featured = await getFeaturedMovies();
        setFeaturedMovies(featured);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contextMovies]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <FadeIn direction="fade" delay={0}>
        <HeroSection movies={featuredMovies.length > 0 ? featuredMovies : movies} />
      </FadeIn>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Movies Grid */}
        <StaggeredAnimation direction="up" staggerDelay={200} duration={800}>
          <FeaturedMoviesGrid 
            movies={featuredMovies.length > 0 ? featuredMovies : movies.slice(0, 8)} 
            title={t('featuredForYou')} 
          />
        </StaggeredAnimation>
        
        {/* Genre Browser */}
        <StaggeredAnimation direction="up" staggerDelay={400} duration={800}>
          <GenreBrowser />
        </StaggeredAnimation>
        
        {/* Trending Section */}
        <StaggeredAnimation direction="up" staggerDelay={600} duration={800}>
          <TrendingSection movies={trendingMovies.length > 0 ? trendingMovies : movies.slice(0, 8)} />
        </StaggeredAnimation>
      </div>
    </div>
  );
};

export default HomePage;