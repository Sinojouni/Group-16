import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedMoviesGrid from '../components/home/FeaturedMoviesGrid';
import GenreBrowser from '../components/home/GenreBrowser';
import TrendingSection from '../components/home/TrendingSection';
import FadeIn from '../components/common/FadeIn';
import StaggeredAnimation from '../components/common/StaggeredAnimation';
import { mockMovies, genres } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const trendingMovies = mockMovies.filter(movie => movie.isTrending);
  const featuredMovies = mockMovies.filter(movie => movie.isFeatured);
  const actionMovies = mockMovies.filter(movie => movie.genres.includes('Action'));
  const dramaMovies = mockMovies.filter(movie => movie.genres.includes('Drama'));
  const crimeMovies = mockMovies.filter(movie => movie.genres.includes('Crime'));

  return (
    <div className="min-h-screen bg-gray-900">
      <FadeIn direction="fade" delay={0}>
        <HeroSection />
      </FadeIn>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Movies Grid */}
        <StaggeredAnimation direction="up" staggerDelay={200} duration={800}>
          <FeaturedMoviesGrid 
            movies={featuredMovies.length > 0 ? featuredMovies : mockMovies.slice(0, 8)} 
            title={t('featuredForYou')} 
          />
        </StaggeredAnimation>
        
        {/* Genre Browser */}
        <StaggeredAnimation direction="up" staggerDelay={400} duration={800}>
          <GenreBrowser />
        </StaggeredAnimation>
        
        {/* Trending Section */}
        <StaggeredAnimation direction="up" staggerDelay={600} duration={800}>
          <TrendingSection movies={trendingMovies.slice(0, 8)} />
        </StaggeredAnimation>
      </div>
    </div>
  );
};

export default HomePage;