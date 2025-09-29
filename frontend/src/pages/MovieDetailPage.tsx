import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Play, Plus, ThumbsUp, Calendar, Clock, Users, Award } from 'lucide-react';
import { Movie } from '../types';
import { mockMovies, mockReviews } from '../data/mockData';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, watchlist, addReview } = useApp();

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      
      try {
        // Simulate API call
        setTimeout(() => {
          const foundMovie = mockMovies.find(m => m.id === id);
          if (foundMovie) {
            setMovie({
              ...foundMovie,
              reviews: mockReviews.filter(r => r.movieId === id)
            });
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const handleAddReview = async () => {
    if (!movie || userRating === 0 || !reviewComment.trim()) return;

    try {
      await addReview(movie.id, userRating, reviewComment);
      setShowReviewModal(false);
      setUserRating(0);
      setReviewComment('');
    } catch (error) {
      // Error handled in context
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
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-8">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl"
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
                  onClick={() => setShowReviewModal(true)}
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
              <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
            </div>

            {/* Cast */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{t('cast')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movie.cast.map((member) => (
                  <div key={member.id} className="text-center">
                    <img
                      src={member.photo || `https://ui-avatars.com/api/?name=${member.name}&background=374151&color=fff`}
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                    />
                    <p className="text-white font-medium text-sm">{member.name}</p>
                    <p className="text-gray-400 text-xs">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('reviews')} ({movie.reviews.length})
              </h2>
              
              <div className="space-y-6">
                {movie.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.username}&background=dc2626&color=fff`}
                        alt={review.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{review.username}</h3>
                          <StarRating rating={review.rating} readonly size="sm" />
                          <span className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{review.comment}</p>
                        
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">{t('movieDetails')}</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">{t('director')}:</span>
                  <span className="text-white ml-2">
                    {movie.crew.find(c => c.role === 'Director')?.name || 'Unknown'}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">{t('runtime')}:</span>
                  <span className="text-white ml-2">{movie.runtime} {t('minutes')}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Release Year:</span>
                  <span className="text-white ml-2">{movie.releaseYear}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-white ml-2">{movie.rating}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Genres:</span>
                  <div className="mt-1">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-block bg-gray-700 text-white px-2 py-1 text-xs rounded mr-1 mb-1"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
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
                {t('submitReview')}
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
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