import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { User, Movie, Review } from '../types';
import { mockMovies, mockReviews } from '../data/mockData';
import { Star, Heart, Edit, Settings, Camera, User as UserIcon, Mail, Calendar, Award } from 'lucide-react';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { watchlist } = useApp();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || ''
  });
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'reviews' | 'watchlist' | 'settings'>('reviews');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Simulate API calls
        setTimeout(() => {
          const reviews = mockReviews.filter(r => r.userId === user?.id);
          const movies = mockMovies.filter(m => watchlist.includes(m.id));
          setUserReviews(reviews);
          setUserMovies(movies);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, watchlist]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: user?.username || '',
      bio: user?.bio || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User not found</h1>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=dc2626&color=fff&size=150`}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
              />
              <button className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {user.bio && (
                    <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{user.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'reviews'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              My Reviews ({userReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'watchlist'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Watchlist ({userMovies.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'settings'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">My Reviews</h2>
              {userReviews.length === 0 ? (
                <div className="text-center py-12">
                  <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No reviews yet</h3>
                  <p className="text-gray-500">Start reviewing movies to see them here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userReviews.map((review) => {
                    const movie = mockMovies.find(m => m.id === review.movieId);
                    return (
                      <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                        <div className="flex gap-4">
                          <img
                            src={movie?.poster || ''}
                            alt={movie?.title || ''}
                            className="w-20 h-28 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold text-lg">
                                {movie?.title}
                              </h3>
                              <StarRating rating={review.rating} readonly size="sm" />
                              <span className="text-gray-400 text-sm">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-300 mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{review.likes} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">My Watchlist</h2>
              {userMovies.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Watchlist is empty</h3>
                  <p className="text-gray-500">Add movies to your watchlist to see them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userMovies.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-300 text-sm">{movie.averageRating.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm">({movie.totalRatings})</span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {movie.genres.slice(0, 2).map((genre) => (
                            <span
                              key={genre}
                              className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-gray-400 text-sm">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Review Notifications</h4>
                        <p className="text-gray-400 text-sm">Get notified when someone likes your review</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Recommendation Notifications</h4>
                        <p className="text-gray-400 text-sm">Get movie recommendations</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profile Visibility
                      </label>
                      <select className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show Email</h4>
                        <p className="text-gray-400 text-sm">Display email on profile</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show Watchlist</h4>
                        <p className="text-gray-400 text-sm">Make watchlist visible to others</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
