import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown, Filter, Search, SortAsc, User, Calendar, MessageSquare } from 'lucide-react';
import { Review, Movie } from '../types';
import { mockReviews, mockMovies } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';

const ReviewsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      setFilteredReviews(mockReviews);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let results = [...reviews];

    // Filter by search query
    if (searchQuery) {
      results = results.filter(review =>
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.movie && review.movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by rating
    if (filterBy !== 'all') {
      const rating = parseInt(filterBy);
      results = results.filter(review => review.rating === rating);
    }

    // Sort results
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        results.sort((a, b) => a.rating - b.rating);
        break;
      case 'mostLiked':
        results.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    setFilteredReviews(results);
  }, [reviews, searchQuery, sortBy, filterBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('yesterday');
    if (diffDays < 7) return `${diffDays} ${t('daysAgo')}`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} ${t('weeksAgo')}`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-white">{t('reviews')}</h1>
          </div>
          <p className="text-gray-400 text-lg">
            {t('reviewsDescription')}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('searchReviews')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="newest">{t('newest')}</option>
                <option value="oldest">{t('oldest')}</option>
                <option value="highest">{t('highestRated')}</option>
                <option value="lowest">{t('lowestRated')}</option>
                <option value="mostLiked">{t('mostLiked')}</option>
              </select>
            </div>

            {/* Filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {t('filter')}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">{t('rating')}:</span>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="all">{t('allRatings')}</option>
                    <option value="5">5 {t('stars')}</option>
                    <option value="4">4 {t('stars')}</option>
                    <option value="3">3 {t('stars')}</option>
                    <option value="2">2 {t('stars')}</option>
                    <option value="1">1 {t('star')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t('noReviewsFound')}</h3>
              <p className="text-gray-400">{t('noReviewsDescription')}</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-gray-800 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <img
                    src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.username}&background=dc2626&color=fff`}
                    alt={review.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    {/* Review Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-semibold">{review.username}</h3>
                        <StarRating rating={review.rating} readonly size="sm" />
                        <span className="text-gray-400 text-sm">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      {review.movie && (
                        <Link
                          to={`/movie/${review.movie.id}`}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                        >
                          {review.movie.title}
                        </Link>
                      )}
                    </div>
                    
                    {/* Review Content */}
                    <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>
                    
                    {/* Review Actions */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{review.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">{review.dislikes || 0}</span>
                      </button>
                      
                      <button className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                        {t('reply')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredReviews.length > 10 && (
          <div className="text-center mt-8">
            <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700">
              {t('loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
