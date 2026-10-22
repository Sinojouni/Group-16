import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { getRecommendations } from '../services/recommendationService';
import { Movie } from '../types';
import MovieCard from '../components/common/MovieCard';
import { Star, TrendingUp, Film, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RecommendationsPage = () => {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const { movies } = useApp();
  const navigate = useNavigate();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) {
        setError('You must be logged in to view recommendations');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const recommendations = await getRecommendations(token);
        setRecommendedMovies(recommendations);

        // If recommendations is empty, don't show it as an error
        if (recommendations.length === 0) {
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        // Don't show error for empty array (already handled in service)
        if (err.message !== 'Failed to fetch recommendations') {
          setError(err.message || 'Failed to load recommendations');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token]);

  const handleRetry = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const recommendations = await getRecommendations(token);
      setRecommendedMovies(recommendations);

      // If recommendations is empty, don't show it as an error
      if (recommendations.length === 0) {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      // Don't show error for empty array (already handled in service)
      if (err.message !== 'Failed to fetch recommendations') {
        setError(err.message || 'Failed to load recommendations');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-gray-800 rounded-lg">
          <TrendingUp className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">{t('loginRequired')}</h2>
          <p className="text-gray-300 mb-6">{t('loginToSeeRecommendations')}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
          >
            {t('login')}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">{t('loadingRecommendations')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-white">{t('personalizedRecommendations')}</h1>
        </div>

        {error ? (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('recommendationError')}</h3>
            <p className="text-red-200 mb-4">{error}</p>
            {error.includes('rate at least 5 movies') ? (
              <div className="mt-4">
                <p className="text-red-200 mb-4">{t('rateMoreMovies')}</p>
                <button
                  onClick={() => navigate('/trending')}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                >
                  {t('browseMovies')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                {t('tryAgain')}
              </button>
            )}
          </div>
        ) : recommendedMovies.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                {t('basedOnYourRatings', { count: recommendedMovies.length })}
              </p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                {t('refresh')}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('noRecommendationsYet')}</h3>
            <p className="text-gray-300 mb-6">{t('rateSomeMoviesForRecommendations')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/trending')}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                {t('browseMovies')}
              </button>
              <button
                onClick={() => navigate('/genres')}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {t('exploreGenres')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;