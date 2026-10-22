import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, X, Lock, Star, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionType?: 'review' | 'watchlist' | 'rate';
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  actionType = 'review',
}) => {
  const { language } = useLanguage();
  const location = useLocation();

  if (!isOpen) return null;

  const isAr = language === 'ar';

  const defaultTitle = isAr
    ? 'يجب تسجيل الدخول أو إنشاء حساب'
    : 'Please Log In or Sign Up';

  const defaultDescription = isAr
    ? 'لتقييم هذا الفيلم وإضافة مراجعتك أو حفظه في قائمتك، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد مجاناً.'
    : 'To rate, review, or save this movie to your watchlist, please log in or create a free account.';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border border-red-500/30 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-[0_20px_60px_rgba(220,38,38,0.25)] text-center transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800/80 transition-colors"
          aria-label={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing Icon */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 bg-red-600/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-950/50 border border-red-400/30">
            {actionType === 'watchlist' ? (
              <Heart className="w-8 h-8 fill-current" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
          {title || defaultTitle}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 px-2">
          {description || defaultDescription}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Login Button */}
          <Link
            to="/login"
            state={{ from: location }}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base"
          >
            <LogIn className="w-5 h-5" />
            <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
          </Link>

          {/* Register Button */}
          <Link
            to="/register"
            state={{ from: location }}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 bg-gray-800/90 hover:bg-gray-800 text-white hover:text-red-400 font-bold py-3.5 px-6 rounded-2xl border border-gray-700/80 hover:border-red-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base"
          >
            <UserPlus className="w-5 h-5" />
            <span>{isAr ? 'إنشاء حساب جديد' : 'Create an Account'}</span>
          </Link>
        </div>

        {/* Continue as guest / Cancel */}
        <button
          onClick={onClose}
          className="mt-4 text-xs sm:text-sm text-gray-400 hover:text-gray-200 font-medium transition-colors"
        >
          {isAr ? 'إلغاء والمتابعة كزائر' : 'Cancel & Continue as Guest'}
        </button>
      </div>
    </div>
  );
};

export default AuthPromptModal;
