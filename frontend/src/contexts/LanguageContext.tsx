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
    help: 'المساعدة',
    about: 'من نحن',
    search: 'البحث عن الأفلام والمسلسلات...',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    admin: 'الإدارة',
    recommendations: 'التوصيات',
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
    
    // Genres Page
    browseGenres: 'تصفح الأنواع',
    discoverMovies: 'اكتشف أفلامك المفضلة حسب النوع',
    recommendedForYou: 'مقترحة لك',
    personalized: 'مخصصة',
    basedOnPreferences: 'بناءً على تفضيلاتك',
    allGenres: 'جميع الأنواع',
    genreStats: 'إحصائيات الأنواع',
    totalMovies: 'إجمالي الأفلام',
    averageRating: 'متوسط التقييم',
    trendingMovies: 'الأفلام الرائجة',
    movies: 'أفلام',
    movie: 'فيلم',
    noMoviesFound: 'لا توجد أفلام',
    noMoviesInGenre: 'لم يتم العثور على أفلام في هذا النوع',
    loadMore: 'عرض المزيد',
    selected: 'مختار',
    close: 'إغلاق',
    
    // Search & Filter
    searchInGenres: 'البحث في الأنواع والأفلام...',
    sortBy: 'ترتيب حسب',
    highestRated: 'الأعلى تقييماً',
    newest: 'الأحدث',
    name: 'الاسم',
    duration: 'المدة',
    mostRelevant: 'الأكثر صلة',
    filter: 'فلاتر',
    allGenresFilter: 'جميع الأنواع',
    allYears: 'جميع السنوات',
    allRatings: 'جميع التقييمات',
    minRating: 'التقييم الأدنى',
    fourStars: '4+ نجوم',
    threeStars: '3+ نجوم',
    twoStars: '2+ نجوم',
    oneStar: '1+ نجوم',
    
    // Profile Page
    profilePage: 'الملف الشخصي',
    userInfo: 'معلومات المستخدم',
    activeMember: 'عضو نشط',
    joinedOn: 'انضم في',
    ratedMovies: 'الأفلام المقيمة',
    watchlist: 'قائمة المفضلة',
    recentReviews: 'آخر المراجعات',
    favoriteGenres: 'الأنواع المفضلة',
    recentActivity: 'النشاط الأخير',
    editProfile: 'تعديل الملف',
    personalInfo: 'معلومات شخصية',
    bio: 'نبذة شخصية',
    writeAboutYourself: 'اكتب نبذة عن نفسك...',
    saveChanges: 'حفظ التغييرات',
    
    // Movie Details
    movieDetails: 'تفاصيل الفيلم',
    yourRating: 'تقييمك',
    yourReview: 'ująعتك',
    shareYourThoughts: 'شارك أفكارك حول هذا الفيلم...',
    submitReview: 'إرسال المراجعة',
    similarTitles: 'عناوين مشابهة',
    movieInfo: 'معلومات الفيلم',
    director: 'المخرج',
    runtime: 'المدة',
    releaseYear: 'سنة الإصدار',
    rating: 'التقييم',
    genres: 'الأنواع',
    
    // Admin
    totalUsers: 'إجمالي المستخدمين',
    totalReviews: 'إجمالي المراجعات',
    activeUsers: 'المستخدمون النشطون',
    recentMovies: 'الأفلام الحديثة',
    manageMovies: 'إدارة الأفلام',
    manageReviews: 'إدارة المراجعات',
    addNewMovie: 'إضافة فيلم جديد',
    searchInMovies: 'البحث في الأفلام...',
    movieTitle: 'عنوان الفيلم',
    actions: 'الإجراءات',
    
    // Notifications
    notifications: 'الإشعارات',
    newNotification: 'إشعار جديد',
    
    // Time
    hoursAgo: 'منذ ساعات',
    daysAgo: 'منذ أيام',
    minutesAgo: 'منذ دقائق',
    
    // Additional
    toContinue: 'لمتابعة',
    signInToContinue: 'سجل دخولك لمتابعة',
    createAccountToJoin: 'أنشئ حسابك للانضمام',
    dontHaveAccount: 'ليس لديك حساب',
    signUpHere: 'سجل هنا',
    alreadyHaveAccount: 'لديك حساب بالفعل',
    signInHere: 'سجل دخولك هنا',
    iAgreeTo: 'أوافق على',
    and: 'و',
    
    // Footer
    projectDescription: 'منصة ذكية لتقييم الأفلام والمسلسلات مدعومة بالذكاء الاصطناعي. اكتشف، قيم، وشارك محتواك المفضل مع مجتمع عشاق السينما.',
    graduationProject: 'مشروع تخرج',
    teamDeepmind: 'فريق DeepMind - المجموعة 16',
    samsungCourse: 'دورة سامسونج للذكاء الاصطناعي',
    followUs: 'تابعنا',
    allRightsReserved: 'جميع الحقوق محفوظة',
    madeWithLove: 'صُنع بحب لعشاق السينما',
    poweredBy: 'مدعوم بـ',
    myReviews: 'مراجعاتي',
    
    // Movie Details
    movieNotFound: 'الفيلم غير موجود',
    movieNotFoundDescription: 'الفيلم الذي تبحث عنه غير موجود',
    minutes: 'دقيقة',
    synopsis: 'القصة',
    cast: 'الممثلون',
    director: 'المخرج',
    runtime: 'المدة',
    releaseYear: 'سنة الإصدار',
    rating: 'التقييم',
    genres: 'الأنواع',
    yourRating: 'تقييمك',
    yourReview: 'ująعتك',
    shareYourThoughts: 'شارك أفكارك حول هذا الفيلم...',
    submitReview: 'إرسال المراجعة',
    cancel: 'إلغاء',
    inWatchlist: 'في المفضلة',
    addToWatchlist: 'إضافة للمفضلة',
    rateReview: 'تقييم ومراجعة',
    
    // Reviews Page
    reviewsDescription: 'اكتشف آراء المستخدمين حول الأفلام والمسلسلات المفضلة',
    searchReviews: 'البحث في المراجعات...',
    newest: 'الأحدث',
    oldest: 'الأقدم',
    highestRated: 'الأعلى تقييماً',
    lowestRated: 'الأقل تقييماً',
    mostLiked: 'الأكثر إعجاباً',
    allRatings: 'جميع التقييمات',
    stars: 'نجوم',
    star: 'نجمة',
    noReviewsFound: 'لا توجد مراجعات',
    noReviewsDescription: 'لم يتم العثور على مراجعات تطابق معايير البحث',
    reply: 'رد',
    yesterday: 'أمس',
    weeksAgo: 'منذ أسابيع',
    
    // Watchlist Page
    watchlistDescription: 'الأفلام والمسلسلات التي أضفتها إلى قائمة المفضلة',
    searchInWatchlist: 'البحث في قائمة المفضلة...',
    dateAdded: 'تاريخ الإضافة',
    emptyWatchlist: 'قائمة المفضلة فارغة',
    emptyWatchlistDescription: 'لم تقم بإضافة أي أفلام إلى قائمة المفضلة بعد',
    browseMovies: 'تصفح الأفلام',
    removeFromWatchlist: 'إزالة من المفضلة',
    
    // Settings Page
    settingsDescription: 'إدارة إعدادات حسابك وتفضيلاتك',
    settingsCategories: 'فئات الإعدادات',
    profileSettings: 'إعدادات الملف الشخصي',
    privacySettings: 'إعدادات الخصوصية',
    appearanceSettings: 'إعدادات المظهر',
    profileVisibility: 'رؤية الملف الشخصي',
    public: 'عام',
    private: 'خاص',
    friendsOnly: 'الأصدقاء فقط',
    showEmail: 'إظهار البريد الإلكتروني',
    showEmailDescription: 'إظهار البريد الإلكتروني في الملف الشخصي',
    showWatchlist: 'إظهار قائمة المفضلة',
    showWatchlistDescription: 'إظهار قائمة المفضلة للآخرين',
    language: 'اللغة',
    fontSize: 'حجم الخط',
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',
    animations: 'الرسوم المتحركة',
    animationsDescription: 'تفعيل الرسوم المتحركة والانتقالات',
    
    // Help Page
    helpCenter: 'مركز المساعدة',
    helpDescription: 'ابحث عن إجابات لأسئلتك الشائعة أو تواصل معنا للحصول على المساعدة',
    searchInFAQ: 'ابحث في الأسئلة الشائعة...',
    gettingStarted: 'البدء',
    searchAndBrowse: 'البحث والتصفح',
    reviewsAndRatings: 'المراجعات والتقييمات',
    accountSettings: 'إعدادات الحساب',
    technicalSupport: 'الدعم التقني',
    didntFindWhatYouNeed: 'لم تجد ما تبحث عنه؟',
    contactUs: 'تواصل معنا وسنكون سعداء لمساعدتك',
    liveChat: 'الدردشة المباشرة',
    phone: 'الهاتف',
    responseWithin24Hours: 'الرد خلال 24 ساعة',
    available247: 'متاحة 24/7',
    immediateResponse: 'الرد الفوري',
    hours9to6: '9 صباحاً - 6 مساءً',
    
    // Admin Dashboard
    adminDescription: 'إدارة المحتوى والمستخدمين',
    exportData: 'تصدير البيانات',
    refresh: 'تحديث',
    quickActions: 'الإجراءات السريعة',
    manageUsers: 'إدارة المستخدمين',
    viewAnalytics: 'عرض التحليلات',
    overview: 'نظرة عامة',
    systemStatus: 'حالة النظام',
    database: 'قاعدة البيانات',
    api: 'واجهة برمجة التطبيقات',
    storage: 'التخزين',
    operational: 'يعمل',
    used: 'مستخدم',
    searchPlaceholder: 'البحث...',
    all: 'الكل',
    active: 'نشط',
    inactive: 'غير نشط',
    verified: 'متحقق',
    pending: 'في الانتظار',
    likes: 'إعجابات',
    dislikes: 'عدم إعجاب',
    fromLastMonth: 'من الشهر الماضي',
    
    // Admin functionality
    movieDeleted: 'تم حذف الفيلم بنجاح',
    reviewDeleted: 'تم حذف المراجعة بنجاح',
    userDeleted: 'تم حذف المستخدم بنجاح',
    userStatusUpdated: 'تم تحديث حالة المستخدم',
    movieAdded: 'تم إضافة الفيلم بنجاح',
    movieUpdated: 'تم تحديث الفيلم بنجاح',
    dataRefreshed: 'تم تحديث البيانات',
    dataExported: 'تم تصدير البيانات',
    fillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة',
    confirmDelete: 'تأكيد الحذف',
    deleteConfirmationMessage: 'هل أنت متأكد من أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
    enterMovieTitle: 'أدخل عنوان الفيلم',
    enterSynopsis: 'أدخل قصة الفيلم',
    enterPosterUrl: 'أدخل رابط الصورة',
    enterBackdropUrl: 'أدخل رابط الخلفية',
    posterUrl: 'رابط الصورة',
    backdropUrl: 'رابط الخلفية',
    previous: 'السابق',
    next: 'التالي',
    
    // Featured Movies Management
    featuredMoviesManagement: 'إدارة الأفلام المميزة',
    featuredMovies: 'أفلام مميزة',
    trending: 'رائج',
    addToFeatured: 'إضافة للمميزة',
    removeFromFeatured: 'إزالة من المميزة',
    addToTrending: 'إضافة للرائجة',
    removeFromTrending: 'إزالة من الرائجة',
    featuredStatusUpdated: 'تم تحديث حالة الفيلم المميز',
    trendingStatusUpdated: 'تم تحديث حالة الفيلم الرائج',
  },
  en: {
    // Header
    home: 'Home',
    trending: 'Trending',
    genres: 'Genres',
    help: 'Help',
    about: 'About Us',
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
    
    // Navigation
    recommendations: 'Recommendations',
    
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
    
    // Genres Page
    browseGenres: 'Browse Genres',
    discoverMovies: 'Discover your favorite movies by genre',
    recommendedForYou: 'Recommended for You',
    personalized: 'Personalized',
    basedOnPreferences: 'Based on your preferences',
    allGenres: 'All Genres',
    genreStats: 'Genre Statistics',
    totalMovies: 'Total Movies',
    averageRating: 'Average Rating',
    trendingMovies: 'Trending Movies',
    movies: 'Movies',
    movie: 'Movie',
    noMoviesFound: 'No Movies Found',
    noMoviesInGenre: 'No movies found in this genre',
    loadMore: 'Load More',
    selected: 'Selected',
    close: 'Close',
    
    // Search & Filter
    searchInGenres: 'Search in genres and movies...',
    sortBy: 'Sort by',
    highestRated: 'Highest Rated',
    newest: 'Newest',
    name: 'Name',
    duration: 'Duration',
    mostRelevant: 'Most Relevant',
    filter: 'Filters',
    allGenresFilter: 'All Genres',
    allYears: 'All Years',
    allRatings: 'All Ratings',
    minRating: 'Minimum Rating',
    fourStars: '4+ Stars',
    threeStars: '3+ Stars',
    twoStars: '2+ Stars',
    oneStar: '1+ Stars',
    
    // Profile Page
    profilePage: 'Profile',
    userInfo: 'User Information',
    activeMember: 'Active Member',
    joinedOn: 'Joined on',
    reviews: 'Review',
    ratedMovies: 'Rated Movies',
    watchlist: 'Watchlist',
    recentReviews: 'Recent Reviews',
    favoriteGenres: 'Favorite Genres',
    recentActivity: 'Recent Activity',
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    bio: 'Bio',
    writeAboutYourself: 'Write about yourself...',
    saveChanges: 'Save Changes',
    
    // Movie Details
    movieDetails: 'Movie Details',
    yourRating: 'Your Rating',
    yourReview: 'Your Review',
    shareYourThoughts: 'Share your thoughts about this movie...',
    submitReview: 'Submit Review',
    similarTitles: 'Similar Titles',
    movieInfo: 'Movie Information',
    director: 'Director',
    runtime: 'Runtime',
    releaseYear: 'Release Year',
    rating: 'Rating',
    genres: 'Genres',
    
    // Admin
    totalUsers: 'Total Users',
    totalMovies: 'Total Movies',
    totalReviews: 'Total Reviews',
    activeUsers: 'Active Users',
    recentMovies: 'Recent Movies',
    recentReviews: 'Recent Reviews',
    manageMovies: 'Manage Movies',
    manageReviews: 'Manage Reviews',
    addNewMovie: 'Add New Movie',
    searchInMovies: 'Search in movies...',
    movieTitle: 'Movie Title',
    year: 'Year',
    actions: 'Actions',
    
    // Notifications
    notifications: 'Notifications',
    newNotification: 'New Notification',
    
    // Time
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    minutesAgo: 'minutes ago',
    
    // Additional
    toContinue: 'to continue',
    signInToContinue: 'Sign in to your account to continue',
    createAccountToJoin: 'Create your account to join',
    dontHaveAccount: "Don't have an account",
    signUpHere: 'Sign up here',
    alreadyHaveAccount: 'Already have an account',
    signInHere: 'Sign in here',
    iAgreeTo: 'I agree to the',
    and: 'and',
    
    // Footer
    projectDescription: 'An intelligent platform for movie and series ratings powered by AI. Discover, rate, and share your favorite content with fellow movie enthusiasts.',
    graduationProject: 'Graduation Project',
    teamDeepmind: 'Team DeepMind - Group 16',
    samsungCourse: 'Samsung AI Course',
    followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved',
    madeWithLove: 'Made with love for movie lovers',
    poweredBy: 'Powered by',
    myReviews: 'My Reviews',
    
    // Movie Details
    movieNotFound: 'Movie Not Found',
    movieNotFoundDescription: 'The movie you are looking for does not exist',
    minutes: 'min',
    synopsis: 'Synopsis',
    cast: 'Cast',
    cancel: 'Cancel',
    inWatchlist: 'In Watchlist',
    addToWatchlist: 'Add to Watchlist',
    rateReview: 'Rate & Review',
    
    // Reviews Page
    reviewsDescription: 'Discover what users think about their favorite movies and shows',
    searchReviews: 'Search reviews...',
    oldest: 'Oldest',
    lowestRated: 'Lowest Rated',
    mostLiked: 'Most Liked',
    stars: 'stars',
    star: 'star',
    noReviewsFound: 'No Reviews Found',
    noReviewsDescription: 'No reviews found matching your search criteria',
    reply: 'Reply',
    yesterday: 'Yesterday',
    weeksAgo: 'weeks ago',
    
    // Watchlist Page
    watchlistDescription: 'Movies and shows you have added to your watchlist',
    searchInWatchlist: 'Search in watchlist...',
    dateAdded: 'Date Added',
    emptyWatchlist: 'Watchlist is Empty',
    emptyWatchlistDescription: 'You haven\'t added any movies to your watchlist yet',
    browseMovies: 'Browse Movies',
    removeFromWatchlist: 'Remove from Watchlist',
    
    // Settings Page
    settingsDescription: 'Manage your account settings and preferences',
    settingsCategories: 'Settings Categories',
    profileSettings: 'Profile Settings',
    privacySettings: 'Privacy Settings',
    appearanceSettings: 'Appearance Settings',
    profileVisibility: 'Profile Visibility',
    public: 'Public',
    private: 'Private',
    friendsOnly: 'Friends Only',
    showEmail: 'Show Email',
    showEmailDescription: 'Show email address in profile',
    showWatchlist: 'Show Watchlist',
    showWatchlistDescription: 'Show watchlist to others',
    language: 'Language',
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    animations: 'Animations',
    animationsDescription: 'Enable animations and transitions',
    
    // Help Page
    helpDescription: 'Find answers to your frequently asked questions or contact us for assistance',
    searchInFAQ: 'Search in FAQ...',
    gettingStarted: 'Getting Started',
    searchAndBrowse: 'Search & Browse',
    reviewsAndRatings: 'Reviews & Ratings',
    accountSettings: 'Account Settings',
    technicalSupport: 'Technical Support',
    didntFindWhatYouNeed: "Didn't find what you're looking for?",
    liveChat: 'Live Chat',
    phone: 'Phone',
    responseWithin24Hours: 'Response within 24 hours',
    available247: 'Available 24/7',
    immediateResponse: 'Immediate response',
    hours9to6: '9 AM - 6 PM',
    
    // Admin Dashboard
    adminDescription: 'Manage content and users',
    exportData: 'Export Data',
    refresh: 'Refresh',
    quickActions: 'Quick Actions',
    addMovie: 'Add Movie',
    manageUsers: 'Manage Users',
    viewAnalytics: 'View Analytics',
    overview: 'Overview',
    systemStatus: 'System Status',
    database: 'Database',
    api: 'API',
    storage: 'Storage',
    operational: 'Operational',
    used: 'Used',
    searchPlaceholder: 'Search...',
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
    verified: 'Verified',
    pending: 'Pending',
    likes: 'Likes',
    dislikes: 'Dislikes',
    fromLastMonth: 'from last month',
    
    // Admin functionality
    movieDeleted: 'Movie deleted successfully',
    reviewDeleted: 'Review deleted successfully',
    userDeleted: 'User deleted successfully',
    userStatusUpdated: 'User status updated',
    movieAdded: 'Movie added successfully',
    movieUpdated: 'Movie updated successfully',
    dataRefreshed: 'Data refreshed',
    dataExported: 'Data exported',
    fillRequiredFields: 'Please fill all required fields',
    confirmDelete: 'Confirm Delete',
    deleteConfirmationMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
    enterMovieTitle: 'Enter movie title',
    enterSynopsis: 'Enter movie synopsis',
    enterPosterUrl: 'Enter poster URL',
    enterBackdropUrl: 'Enter backdrop URL',
    posterUrl: 'Poster URL',
    backdropUrl: 'Backdrop URL',
    previous: 'Previous',
    next: 'Next',
    
    // Featured Movies Management
    featuredMoviesManagement: 'Featured Movies Management',
    featuredMovies: 'Featured Movies',
    featured: 'Featured',
    addToFeatured: 'Add to Featured',
    removeFromFeatured: 'Remove from Featured',
    addToTrending: 'Add to Trending',
    removeFromTrending: 'Remove from Trending',
    featuredStatusUpdated: 'Featured status updated',
    trendingStatusUpdated: 'Trending status updated',
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

