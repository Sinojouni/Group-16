import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedMoviesGrid from '../components/home/FeaturedMoviesGrid';
import GenreBrowser from '../components/home/GenreBrowser';
import TrendingSection from '../components/home/TrendingSection';
import { mockMovies, genres } from '../data/mockData';

const HomePage: React.FC = () => {
  const trendingMovies = mockMovies.filter(movie => movie.isTrending);
  const featuredMovies = mockMovies.filter(movie => movie.isFeatured);
  const actionMovies = mockMovies.filter(movie => movie.genres.includes('Action'));
  const dramaMovies = mockMovies.filter(movie => movie.genres.includes('Drama'));
  const crimeMovies = mockMovies.filter(movie => movie.genres.includes('Crime'));

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Movies Grid */}
        <FeaturedMoviesGrid 
          movies={featuredMovies.length > 0 ? featuredMovies : mockMovies.slice(0, 8)} 
          title="الأفلام المقترحة لك" 
        />
        
        {/* Genre Browser */}
        <GenreBrowser />
        
        {/* Trending Section */}
        <TrendingSection movies={trendingMovies.slice(0, 8)} />
      </div>
    </div>
  );
};

export default HomePage;