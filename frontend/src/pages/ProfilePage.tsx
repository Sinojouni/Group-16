import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Star, 
  Heart, 
  Edit3, 
  Settings, 
  LogOut, 
  Film, 
  MessageSquare,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Movie, Review } from '../types';
import { mockMovies, mockReviews } from '../data/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { watchlist } = useApp();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  useEffect(() => {
    // Simulate API call to get user's data
    setTimeout(() => {
      // Get user's rated movies
      const ratedMovies = mockMovies.filter(movie => 
        mockReviews.some(review => review.userId === user?.id && review.movieId === movie.id)
      );
      setUserMovies(ratedMovies);

      // Get user's reviews
      const userReviewsData = mockReviews.filter(review => review.userId === user?.id);
      setUserReviews(userReviewsData);
      
      setIsLoading(false);
    }, 500);
  }, [user?.id]);

  const handleEditProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=dc2626&color=fff&size=120`}
                alt={user?.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors duration-200"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {user?.firstName || user?.lastName 
                    ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() 
                    : user?.username}
                </h1>
                {user?.username && (
                  <span className="text-gray-400 text-sm font-medium">@{user.username}</span>
                )}
                <span className="bg-green-600/20 border border-green-500/30 text-green-400 px-3 py-0.5 rounded-full text-xs font-semibold">
                  {t('activeMember')}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{t('joinedOn')} {user?.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Star className="w-4 h-4" />
                  <span>{userReviews.length} {t('reviews')}</span>
                </div>
              </div>

              {user?.bio && (
                <p className="text-gray-300 leading-relaxed">{user.bio}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                تعديل الملف
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-gray-400 text-sm">الأفلام المقيمة</p>
                <p className="text-2xl font-bold text-white">{userMovies.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-gray-400 text-sm">المراجعات</p>
                <p className="text-2xl font-bold text-white">{userReviews.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-600" />
              <div>
                <p className="text-gray-400 text-sm">قائمة المفضلة</p>
                <p className="text-2xl font-bold text-white">{watchlist.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-gray-400 text-sm">متوسط التقييم</p>
                <p className="text-2xl font-bold text-white">
                  {userReviews.length > 0 
                    ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              مراجعاتي
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'watchlist'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              قائمة المفضلة
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              النشاط الأخير
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Reviews */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">آخر المراجعات</h3>
              <div className="space-y-4">
                {userReviews.slice(0, 3).map((review) => {
                  const movie = mockMovies.find(m => m.id === review.movieId);
                  return (
                    <div key={review.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={movie?.poster}
                          alt={movie?.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{movie?.title}</h4>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} readonly size="sm" />
                            <span className="text-gray-400 text-sm">
                              {new Date(review.createdAt).toLocaleDateString('ar')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{review.comment}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Favorite Genres */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">الأنواع المفضلة</h3>
              <div className="flex flex-wrap gap-2">
                {['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Romance'].map((genre) => (
                  <span
                    key={genre}
                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {userReviews.map((review) => {
              const movie = mockMovies.find(m => m.id === review.movieId);
              return (
                <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={movie?.poster}
                      alt={movie?.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold text-lg">{movie?.title}</h3>
                        <StarRating rating={review.rating} readonly size="sm" />
                        <span className="text-gray-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString('ar')}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{review.comment}</p>
                      <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white transition-colors duration-200">
                          <Heart className="w-4 h-4" />
                        </button>
                        <span className="text-gray-400 text-sm">{review.likes} إعجاب</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchlist.map((movieId) => {
              const movie = mockMovies.find(m => m.id === movieId);
              if (!movie) return null;
              
              return (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative h-80">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">
                        {movie.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{movie.releaseYear}</p>
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">النشاط الأخير</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>قمت بتقييم فيلم "The Dark Knight" بـ 5 نجوم</span>
                  <span className="text-gray-500 text-sm">منذ ساعتين</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Heart className="w-4 h-4" />
                  <span>أضفت فيلم "Inception" إلى قائمة المفضلة</span>
                  <span className="text-gray-500 text-sm">منذ 5 ساعات</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>كتبت مراجعة لفيلم "Pulp Fiction"</span>
                  <span className="text-gray-500 text-sm">منذ يوم</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-5">{t('editProfile') || 'تعديل الملف الشخصي'}</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    placeholder="الاسم الأول"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    اسم العائلة
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    placeholder="اسم العائلة"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-red-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full bg-gray-800/50 border border-gray-700/60 text-gray-500 rounded-xl p-3 text-sm cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  نبذة شخصية
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-red-500 text-sm"
                  placeholder="اكتب نبذة عن نفسك..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditProfile}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-bold transition-colors duration-200"
              >
                {t('saveChanges') || 'حفظ التغييرات'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-4 rounded-xl font-bold border border-gray-700 transition-colors duration-200"
              >
                {t('cancel') || 'إلغاء'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
