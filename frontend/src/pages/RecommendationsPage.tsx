import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPublicRecommendations, getRecommendations } from '../services/recommendationService';
import { Movie } from '../types';
import MovieCard from '../components/common/MovieCard';
import { Star, TrendingUp, Sparkles, RefreshCw, Cpu, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RecommendationsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      // If user has token, check if they have personal recommendations
      if (token) {
        try {
          const personal = await getRecommendations(token);
          if (personal && personal.length > 0) {
            setRecommendedMovies(personal);
            setIsPersonalized(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log('Personal recommendation fallback to AI engine:', e);
        }
      }

      // Fallback: AI model public recommendations
      const aiRecs = await getPublicRecommendations(token);
      setRecommendedMovies(aiRecs);
      setIsPersonalized(false);
    } catch (err) {
      console.error('Error in RecommendationsPage:', err);
      setRecommendedMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white font-medium">{t('loadingRecommendations')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">
                {isPersonalized ? 'توصيات مخصصة لك' : 'توصيات الذكاء الاصطناعي'}
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              {isPersonalized 
                ? 'تم إنشاء هذه التوصيات بناءً على تقييماتك وتفضيلاتك الشخصية عبر نموذج Two-Tower العصبي.'
                : 'توصيات ذكية مدعومة بنموذج تعلم الآلة (PyTorch Two-Tower Recommendation Model).'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRecommendations}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-xl text-sm font-medium border border-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('refresh')}</span>
            </button>
          </div>
        </div>

        {/* Informational Banner */}
        {!isPersonalized && (
          <div className="mb-8 p-4 rounded-2xl bg-gray-800/80 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">توصيات نموذج الذكاء الاصطناعي الفعالة</h4>
                <p className="text-gray-400 text-xs">
                  {!user 
                    ? 'سجّل الدخول وقيّم 5 أفلام لتفعيل التوصيات المخصصة بالكامل لحسابك.' 
                    : 'قم بتقييم 5 أفلام على الأقل ليتم تدريب النموذج المخصص على ذوقك الشخصي.'}
                </p>
              </div>
            </div>
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                تسجيل الدخول الآن
              </button>
            ) : (
              <button
                onClick={() => navigate('/genres')}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-gray-700 transition-colors whitespace-nowrap"
              >
                استكشف وقيّم الأفلام
              </button>
            )}
          </div>
        )}

        {/* Movies Grid */}
        {recommendedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} size="md" />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">{t('noRecommendationsYet')}</h3>
            <p className="text-gray-400 text-sm mb-6">{t('rateSomeMoviesForRecommendations')}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              العودة للرئيسية
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RecommendationsPage;