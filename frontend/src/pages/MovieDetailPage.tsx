import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Play, Plus, ThumbsUp, Calendar, Clock, Users, Award, Film } from 'lucide-react';
import { Movie, Review } from '../types';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getMovieById } from '../services/movieService';
import { getReviews, addReview as addReviewService } from '../services/reviewService';
import { getUserRating, rateMovie } from '../services/ratingService';
import { getActorPhoto } from '../services/actorService';
import MovieSEO from '../components/common/MovieSEO';
import { resolvePoster, isValidPosterUrl, getCinematicPoster } from '../services/posterService';
import AuthPromptModal from '../components/common/AuthPromptModal';

// Real Actor Card with authentic high-res photo and smooth fallback
const ActorCard: React.FC<{ name: string; character?: string }> = ({ name, character }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getActorPhoto(name).then((url) => {
      if (isMounted) {
        if (url) setPhoto(url);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [name]);

  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className="group text-center p-3.5 sm:p-4 rounded-2xl bg-gray-800/60 hover:bg-gray-800/90 border border-gray-700/60 hover:border-red-500/60 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-red-950/30">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700/80 group-hover:border-red-500 shadow-lg transition-all duration-300">
        {photo && !hasError ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-950/60 to-gray-800 text-red-400 font-black text-xl sm:text-2xl">
            {initial}
          </div>
        )}
      </div>
      <p className="text-white font-bold text-xs sm:text-sm group-hover:text-red-400 transition-colors line-clamp-2 leading-tight break-words" dir="auto" title={name}>
        {name}
      </p>
      {character ? (
        <p className="text-gray-400 text-xs line-clamp-1 mt-1" dir="auto" title={character}>{character}</p>
      ) : (
        <p className="text-red-400/90 text-[11px] mt-1 font-medium">طاقم التمثيل</p>
      )}
    </div>
  );
};

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { token } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [posterSrc, setPosterSrc] = useState<string>('');
  const [backdropSrc, setBackdropSrc] = useState<string>('');
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { addToWatchlist, removeFromWatchlist, watchlist } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadMovie = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const movieData = await getMovieById(id);
        setMovie(movieData);

        const initialPoster = movieData.poster || '';
        const initialBackdrop = movieData.backdrop || movieData.poster || '';
        setPosterSrc(initialPoster);
        setBackdropSrc(initialBackdrop);

        if (!isValidPosterUrl(initialPoster)) {
          resolvePoster(movieData).then((resolved) => {
            if (resolved) {
              setPosterSrc(resolved);
              setBackdropSrc(resolved);
            }
          });
        }
        
        // Load reviews for this movie
        try {
          const reviewsData = await getReviews(id);
          setReviews(reviewsData.results || []);
        } catch (_) {}
        
        // Load user's rating if authenticated
        if (token) {
          try {
            const userRatingData = await getUserRating(id, token);
            if (userRatingData) {
              setUserRating(userRatingData.score);
              setUserReview(userRatingData);
            }
          } catch (_) {}
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id, token]);

  // Fallback OMDB fetcher if poster or backdrop link fails
  const handleImageError = () => {
    if (!movie || !movie.title) return;
    resolvePoster(movie).then((resolved) => {
      if (resolved && resolved !== posterSrc) {
        setPosterSrc(resolved);
        setBackdropSrc(resolved);
      }
    });
  };

  const handleAddReview = async () => {
    if (!movie || userRating === 0 || !reviewComment.trim() || !token) return;

    try {
      const newReview = await addReviewService(movie.id, userRating, reviewComment, token);
      setReviews([newReview, ...reviews]);
      setShowReviewModal(false);
      setUserRating(0);
      setReviewComment('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleRateMovie = async (rating: number) => {
    if (!movie || !token) return;
    
    try {
      await rateMovie(movie.id, rating, token);
      setUserRating(rating);
      
      const reviewsData = await getReviews(movie.id);
      setReviews(reviewsData.results || []);
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  const isInWatchlist = watchlist.includes(movie?.id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t('movieNotFound')}</h1>
          <p className="text-gray-400">{t('movieNotFoundDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Dynamic SEO & AI GEO Engine for Movie */}
      <MovieSEO movie={movie} reviews={reviews} language={language} />

      {/* Hero Section */}
      <div className="relative min-h-[520px] md:h-[68vh] overflow-hidden flex items-end">
        {/* Ambient Blur Backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          {backdropSrc && (
            <img
              src={backdropSrc}
              alt=""
              className="w-full h-full object-cover filter blur-3xl scale-125 opacity-30"
              onError={handleImageError}
            />
          )}
          {backdropSrc && (
            <img
              src={backdropSrc}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30 filter brightness-90"
              onError={handleImageError}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>
        
        {/* Poster & Main Hero Info */}
        <div className="relative z-10 w-full p-6 sm:p-8 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8">
            
            {/* Movie Poster Card */}
            <div className="w-56 sm:w-64 md:w-72 flex-shrink-0">
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-white/10 bg-gray-900 group">
                {posterSrc ? (
                  <img
                    src={posterSrc}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-gray-500">
                    <Film className="w-12 h-12 mb-2 opacity-40 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-400">{movie.title}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Movie Meta Information */}
            <div className="flex-1 text-center md:text-right pb-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{(movie.averageRating || 0).toFixed(1)}</span>
                  <span className="text-gray-400 font-normal text-xs">({movie.totalRatings} {t('reviews')})</span>
                </div>
                {movie.releaseYear && (
                  <span className="text-gray-300 font-medium">{movie.releaseYear}</span>
                )}
                {movie.runtime > 0 && (
                  <span className="text-gray-400 font-medium">{movie.runtime} {t('minutes')}</span>
                )}
                <span className="bg-gray-800 border border-gray-700 text-gray-300 px-2.5 py-0.5 text-xs rounded font-medium">
                  {movie.rating || 'PG-13'}
                </span>
              </div>

              {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-gray-800/80 border border-gray-700/60 text-gray-300 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => token ? setShowReviewModal(true) : setShowAuthModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all duration-200 flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{t('rateReview')}</span>
                </button>
                
                <button
                  onClick={() => isInWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id)}
                  className="bg-gray-800/90 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold border border-gray-700 transition-all duration-200 flex items-center gap-2"
                >
                  {isInWatchlist ? (
                    <>
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      <span>{t('inWatchlist')}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{t('addToWatchlist')}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Details & Reviews Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Synopsis */}
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('synopsis')}</h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {movie.synopsis || movie.overview || 'لا تتوفر تفاصيل القصة حالياً لهذا العمل.'}
              </p>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{t('cast')}</h2>
                    <p className="text-gray-400 text-xs mt-0.5">طاقم التمثيل والأبطال الحقيقيين للعمل</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                  {movie.cast.map((member) => (
                    <ActorCard key={member.id} name={member.name} character={member.character} />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {t('reviews')} ({reviews.length})
                </h2>
                {token && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors"
                  >
                    {t('writeReview')}
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-800/80 border border-gray-700/80 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
                        {review.username ? review.username[0].toUpperCase() : 'U'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3 className="text-white font-bold text-sm">{review.username}</h3>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} readonly size="sm" />
                            <span className="text-gray-500 text-xs">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">{review.comment}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{review.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reviews.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">{t('noReviewsYet')}</p>
                    {token && (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                      >
                        {t('beFirstToReview')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-md sticky top-6">
              <h3 className="text-white font-bold text-lg mb-5 pb-3 border-b border-gray-800">{t('movieDetails')}</h3>
              
              <div className="space-y-4 text-sm">
                {movie.crew && movie.crew.length > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-800/50">
                    <span className="text-gray-400">{t('director')}:</span>
                    <span className="text-white font-medium">
                      {movie.crew.find(c => c.role === 'Director')?.name || 'غير محدد'}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between py-1 border-b border-gray-800/50">
                  <span className="text-gray-400">{t('runtime')}:</span>
                  <span className="text-white font-medium">{movie.runtime} {t('minutes')}</span>
                </div>
                
                <div className="flex justify-between py-1 border-b border-gray-800/50">
                  <span className="text-gray-400">سنة الإصدار:</span>
                  <span className="text-white font-medium">{movie.releaseYear}</span>
                </div>
                
                <div className="flex justify-between py-1 border-b border-gray-800/50">
                  <span className="text-gray-400">التصنيف العمري:</span>
                  <span className="text-white font-medium">{movie.rating || 'PG-13'}</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-gray-400 block mb-2">التصنيفات:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(movie.genres) && movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-gray-800 text-gray-300 px-2.5 py-1 text-xs rounded-lg border border-gray-700"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* User Rating Section */}
                {token ? (
                  <div className="pt-5 mt-4 border-t border-gray-800">
                    <span className="text-gray-300 font-semibold block mb-2">{t('yourRating')}:</span>
                    <StarRating
                      rating={userRating}
                      onRatingChange={handleRateMovie}
                      size="md"
                      className="justify-start"
                    />
                  </div>
                ) : (
                  <div className="pt-5 mt-4 border-t border-gray-800">
                    <span className="text-gray-300 font-semibold block mb-2">{t('yourRating')}:</span>
                    <div onClick={() => setShowAuthModal(true)} className="cursor-pointer inline-flex items-center gap-2 group" title={language === 'ar' ? 'سجل الدخول لتقييم الفيلم' : 'Sign in to rate'}>
                      <StarRating
                        rating={0}
                        onRatingChange={() => setShowAuthModal(true)}
                        size="md"
                        className="justify-start opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="text-xs text-gray-400 group-hover:text-red-400 transition-colors">
                        ({language === 'ar' ? 'سجل الدخول للتقييم' : 'Sign in to rate'})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && token && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{t('rateReview')}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('yourRating')}
              </label>
              <StarRating
                rating={userRating}
                onRatingChange={setUserRating}
                size="lg"
                className="justify-center"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('yourReview')}
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-red-500 text-sm"
                placeholder={t('shareYourThoughts')}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAddReview}
                disabled={userRating === 0 || !reviewComment.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('submitReview')}
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-4 rounded-xl font-bold border border-gray-700 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal for Guests */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionType="review"
      />
    </div>
  );
};

export default MovieDetailPage;