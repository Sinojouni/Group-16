import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Header
    home: 'الرئيسية',
    trending: 'الرائج',
    genres: 'الأنواع',
    search: 'البحث عن الأفلام والمسلسلات...',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    admin: 'الإدارة',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    
    // Home Page
    featuredForYou: 'الأفلام المقترحة لك',
    browseByGenre: 'تصفح حسب النوع',
    trendingNow: 'المتداول الآن',
    match: 'مطابقة',
    year: 'سنة',
    
    // Genres
    action: 'أكشن',
    comedy: 'كوميديا',
    drama: 'دراما',
    horror: 'رعب',
    sciFi: 'خيال علمي',
    romance: 'رومانسي',
    
    // Movie Details
    details: 'التفاصيل',
    rateReview: 'تقييم ومراجعة',
    addToWatchlist: 'إضافة للمفضلة',
    inWatchlist: 'في المفضلة',
    synopsis: 'القصة',
    cast: 'الممثلون',
    reviews: 'المراجعات',
    
    // Footer
    quickLinks: 'روابط سريعة',
    account: 'الحساب',
    support: 'الدعم',
    helpCenter: 'مركز المساعدة',
    contactUs: 'اتصل بنا',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    username: 'اسم المستخدم',
    confirmPassword: 'تأكيد كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    createAccount: 'إنشاء حساب',
    welcomeBack: 'مرحباً بعودتك',
    joinCommunity: 'انضم لمجتمع عشاق السينما',
    
    // Admin
    adminDashboard: 'لوحة الإدارة',
    contentManagement: 'إدارة المحتوى',
    userManagement: 'إدارة المستخدمين',
    addMovie: 'إضافة فيلم',
    editMovie: 'تعديل فيلم',
    deleteMovie: 'حذف فيلم',
    
    // Common
    title: 'العنوان',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
  },
  en: {
    // Header
    home: 'Home',
    trending: 'Trending',
    genres: 'Genres',
    search: 'Search movies, shows...',
    profile: 'Profile',
    settings: 'Settings',
    admin: 'Admin',
    logout: 'Logout',
    login: 'Login',
    register: 'Sign Up',
    
    // Home Page
    featuredForYou: 'Featured For You',
    browseByGenre: 'Browse by Genre',
    trendingNow: 'Trending Now',
    match: 'Match',
    year: 'Year',
    
    // Genres
    action: 'Action',
    comedy: 'Comedy',
    drama: 'Drama',
    horror: 'Horror',
    sciFi: 'Sci-Fi',
    romance: 'Romance',
    
    // Movie Details
    details: 'Details',
    rateReview: 'Rate & Review',
    addToWatchlist: 'Add to Watchlist',
    inWatchlist: 'In Watchlist',
    synopsis: 'Synopsis',
    cast: 'Cast',
    reviews: 'Reviews',
    
    // Footer
    quickLinks: 'Quick Links',
    account: 'Account',
    support: 'Support',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    
    // Auth
    email: 'Email Address',
    password: 'Password',
    username: 'Username',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    welcomeBack: 'Welcome back',
    joinCommunity: 'Join our community of movie enthusiasts',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    contentManagement: 'Content Management',
    userManagement: 'User Management',
    addMovie: 'Add Movie',
    editMovie: 'Edit Movie',
    deleteMovie: 'Delete Movie',
    
    // Common
    title: 'Title',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Set document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};