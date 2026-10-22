import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Play, Plus, ThumbsUp, Calendar, Clock, Users, Award } from 'lucide-react';
import { Movie, Review } from '../types';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getMovieById } from '../services/movieService';
import { getReviews, addReview as addReviewService } from '../services/reviewService';
import { getUserRating, rateMovie } from '../services/ratingService';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { token } = useAuth();
  const [movie, setMovie] = useState(null as Movie | null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState(null as Review | null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([] as Review[]);
  const { addToWatchlist, removeFromWatchlist, watchlist } = useApp();

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const movieData = await getMovieById(id);
        setMovie(movieData);

        // Load reviews for this movie
        const reviewsData = await getReviews(id);
        setReviews(reviewsData.results);

        // Load user's rating if authenticated
        if (token) {
          try {
            const userRatingData = await getUserRating(id, token);
            if (userRatingData) {
              setUserRating(userRatingData.score);
              setUserReview(userRatingData);
            }
          } catch (error) {
            console.log('User has not rated this movie yet');
          }
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id, token]);

  const handleAddReview = async () => {
    if (!movie || userRating === 0 || !reviewComment.trim() || !token) return;

    try {
      const newReview = await addReviewService(movie.id, userRating, reviewComment, token);
      setReviews([newReview, ...reviews]);
      setShowReviewModal(false);
      setUserRating(0);
      setReviewComment('');
      alert('تم إرسال مراجعتك بنجاح!');
    } catch (error) {
      console.error('Error adding review:', error);
      alert(`فشل إرسال المراجعة: ${error.message || 'حدث خطأ ما'}`);
    }
  };

  const handleRateMovie = async (rating: number) => {
    if (!movie || !token) return;

    try {
      await rateMovie(movie.id, rating, token);
      setUserRating(rating);

      // Refresh reviews after rating
      const reviewsData = await getReviews(movie.id);
      setReviews(reviewsData.results);

      // Show success message to user
      alert('تم إرسال تقييمك بنجاح!');
    } catch (error) {
      console.error('Error rating movie:', error);
      // Show error message to user
      alert(`فشل إرسال التقييم: ${error.message || 'حدث خطأ ما'}`);
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
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // First try to use movie title as a fallback
            if (movie.title && movie.title.trim() !== '') {
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title)}&background=1a202c&color=fff&size=1280&bold=true&length=2`;
            } else {
              target.src = 'https://placehold.co/1280x720/1a202c/FFFFFF?text=No+Image';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-8">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // First try to use movie title as a fallback
                if (movie.title && movie.title.trim() !== '') {
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title)}&background=1a202c&color=fff&size=300&bold=true&length=2`;
                } else {
                  target.src = 'https://placehold.co/300x450/1a202c/FFFFFF?text=No+Image';
                }
              }}
            />

            <div className="flex-1 pb-8">
              <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-white text-xl font-semibold">
                    {movie.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-300">({movie.totalRatings} {t('reviews')})</span>
                </div>
                <span className="text-gray-300">{movie.releaseYear}</span>
                <span className="text-gray-300">{movie.runtime} {t('minutes')}</span>
                <span className="bg-gray-600 text-white px-2 py-1 text-sm rounded">
                  {movie.rating}
                </span>
              </div>

              <div className="flex gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => token ? setShowReviewModal(true) : alert('Please login to rate this movie')}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  {t('rateReview')}
                </button>

                <button
                  onClick={() => isInWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id)}
                  className="bg-gray-800 bg-opacity-70 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
                >
                  {isInWatchlist ? (
                    <>
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                      {t('inWatchlist')}
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {t('addToWatchlist')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{t('synopsis')}</h2>
              <p className="text-gray-300 leading-relaxed">{movie.synopsis || movie.overview || 'No synopsis available'}</p>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">{t('cast')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.cast.map((member) => (
                    <div key={member.id} className="text-center">
                      <img
                        src={member.photo || `https://ui-avatars.com/api/?name=${member.name}&background=374151&color=fff`}
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${member.name}&background=374151&color=fff`;
                        }}
                      />
                      <p className="text-white font-medium text-sm">{member.name}</p>
                      <p className="text-gray-400 text-xs">{member.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {t('reviews')} ({reviews.length})
                </h2>
                {token && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
                  >
                    {t('writeReview')}
                  </button>
                )}
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.userAvatar}
                          alt={review.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{review.username}</h4>
                            <span className="text-gray-400 text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <StarRating rating={review.rating} readonly size="sm" />
                            <span className="text-gray-400 text-sm">
                              {review.rating}/5
                            </span>
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400">
                    {token ? t('noReviewsYet') : t('loginToSeeReviews')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Movie Details */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">{t('movieDetails')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">{t('releaseYear')}</p>
                    <p className="text-white">{movie.releaseYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">{t('runtime')}</p>
                    <p className="text-white">{movie.runtime} {t('minutes')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">{t('rating')}</p>
                    <p className="text-white">{movie.rating}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Rating Section */}
            {token && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('yourRating')}</h3>
                <div className="flex flex-col items-center">
                  <StarRating
                    rating={userRating}
                    onRatingChange={handleRateMovie}
                    size="lg"
                    className="justify-center mb-4"
                  />
                  <p className="text-gray-400 text-sm">
                    {userRating > 0 ? t('yourRating') : t('tapToRate')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && token && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
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
                className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder={t('shareYourThoughts')}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddReview}
                disabled={userRating === 0 || !reviewComment.trim()}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {t('submit')}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setUserRating(0);
                  setReviewComment('');
                }}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
