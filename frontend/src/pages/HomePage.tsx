import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedMoviesGrid from '../components/home/FeaturedMoviesGrid';
import GenreBrowser from '../components/home/GenreBrowser';
import TrendingSection from '../components/home/TrendingSection';
import FadeIn from '../components/common/FadeIn';
import StaggeredAnimation from '../components/common/StaggeredAnimation';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getMovies, getTrendingMovies, getFeaturedMovies } from '../services/movieService';
import { getPublicRecommendations } from '../services/recommendationService';
import { Movie } from '../types';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { movies: contextMovies } = useApp();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Movie[]>([]);
  const [isAiPowered, setIsAiPowered] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Base movies
        let allMovies = contextMovies;
        if (!allMovies || allMovies.length === 0) {
          allMovies = await getMovies();
          setMovies(allMovies);
        } else {
          setMovies(allMovies);
        }
        
        // 2. Fetch trending movies
        try {
          const trending = await getTrendingMovies();
          setTrendingMovies(trending);
        } catch (e) {
          console.error('Error fetching trending:', e);
        }

        // 3. Connect actively to the Two-Tower AI Recommendation System
        try {
          const recs = await getPublicRecommendations(token);
          if (recs && recs.length > 0) {
            setAiRecommendations(recs);
            setIsAiPowered(true);
          } else {
            const fallbackFeatured = await getFeaturedMovies();
            setAiRecommendations(fallbackFeatured.length > 0 ? fallbackFeatured : allMovies.slice(0, 12));
            setIsAiPowered(false);
          }
        } catch (recErr) {
          console.error('Error fetching recommendations:', recErr);
          const fallbackFeatured = await getFeaturedMovies();
          setAiRecommendations(fallbackFeatured.length > 0 ? fallbackFeatured : allMovies.slice(0, 12));
          setIsAiPowered(false);
        }

      } catch (error) {
        console.error('Error in HomePage fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contextMovies, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white font-medium">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <FadeIn direction="fade" delay={0}>
        <HeroSection movies={aiRecommendations.length > 0 ? aiRecommendations : movies} />
      </FadeIn>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendations Section */}
        <StaggeredAnimation direction="up" staggerDelay={200} duration={800}>
          <FeaturedMoviesGrid 
            movies={aiRecommendations.length > 0 ? aiRecommendations : movies.slice(0, 12)} 
            title={t('featuredForYou')} 
          />
        </StaggeredAnimation>
        
        {/* Genre Browser (Emoji-free Modern Cards) */}
        <StaggeredAnimation direction="up" staggerDelay={400} duration={800}>
          <GenreBrowser />
        </StaggeredAnimation>
        
        {/* Trending Section */}
        <StaggeredAnimation direction="up" staggerDelay={600} duration={800}>
          <TrendingSection movies={trendingMovies.length > 0 ? trendingMovies : movies.slice(0, 12)} />
        </StaggeredAnimation>
      </div>
    </div>
  );
};

export default HomePage;