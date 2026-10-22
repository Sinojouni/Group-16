import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Star, 
  TrendingUp, 
  Heart, 
  Clock, 
  Award,
  Grid3X3,
  Filter,
  SortAsc,
  Search,
  Flame,
  Laugh,
  Theater,
  Ghost,
  Rocket,
  Zap,
  ShieldAlert,
  Compass,
  Sparkles,
  Palette,
  Video,
  Check
} from 'lucide-react';
import { Movie, Genre } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import StaggeredAnimation from '../components/common/StaggeredAnimation';
import MovieCard from '../components/common/MovieCard';
import { getMovies } from '../services/movieService';

const GenresPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMovies, setShowMovies] = useState(false);

  // All available genres with Lucide vector icons and refined color schemes (No emojis)
  const allGenres = [
    { 
      name: 'Action', 
      nameAr: 'أكشن', 
      Icon: Flame, 
      accent: 'red',
      iconBox: 'bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
      glow: 'group-hover:border-red-500/50'
    },
    { 
      name: 'Comedy', 
      nameAr: 'كوميديا', 
      Icon: Laugh, 
      accent: 'amber',
      iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      glow: 'group-hover:border-amber-500/50'
    },
    { 
      name: 'Drama', 
      nameAr: 'دراما', 
      Icon: Theater, 
      accent: 'blue',
      iconBox: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]',
      glow: 'group-hover:border-blue-500/50'
    },
    { 
      name: 'Horror', 
      nameAr: 'رعب', 
      Icon: Ghost, 
      accent: 'purple',
      iconBox: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      glow: 'group-hover:border-purple-500/50'
    },
    { 
      name: 'Sci-Fi', 
      nameAr: 'خيال علمي', 
      Icon: Rocket, 
      accent: 'cyan',
      iconBox: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      glow: 'group-hover:border-cyan-500/50'
    },
    { 
      name: 'Romance', 
      nameAr: 'رومانسي', 
      Icon: Heart, 
      accent: 'pink',
      iconBox: 'bg-pink-500/10 text-pink-400 border-pink-500/20 group-hover:bg-pink-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]',
      glow: 'group-hover:border-pink-500/50'
    },
    { 
      name: 'Thriller', 
      nameAr: 'إثارة', 
      Icon: Zap, 
      accent: 'orange',
      iconBox: 'bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]',
      glow: 'group-hover:border-orange-500/50'
    },
    { 
      name: 'Crime', 
      nameAr: 'جريمة', 
      Icon: ShieldAlert, 
      accent: 'rose',
      iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:bg-rose-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
      glow: 'group-hover:border-rose-500/50'
    },
    { 
      name: 'Adventure', 
      nameAr: 'مغامرة', 
      Icon: Compass, 
      accent: 'emerald',
      iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      glow: 'group-hover:border-emerald-500/50'
    },
    { 
      name: 'Fantasy', 
      nameAr: 'فانتازيا', 
      Icon: Sparkles, 
      accent: 'violet',
      iconBox: 'bg-violet-500/10 text-violet-400 border-violet-500/20 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]',
      glow: 'group-hover:border-violet-500/50'
    },
    { 
      name: 'Animation', 
      nameAr: 'رسوم متحركة', 
      Icon: Palette, 
      accent: 'indigo',
      iconBox: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
      glow: 'group-hover:border-indigo-500/50'
    },
    { 
      name: 'Documentary', 
      nameAr: 'وثائقي', 
      Icon: Video, 
      accent: 'teal',
      iconBox: 'bg-teal-500/10 text-teal-400 border-teal-500/20 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]',
      glow: 'group-hover:border-teal-500/50'
    }
  ];

  // Get user's viewing history to suggest genres (simulated)
  const getUserViewingHistory = () => {
    if (!user) return [];
    const userMovies = movies.filter(movie => (movie.averageRating || 0) > 4.0);
    const genreCounts: { [key: string]: number } = {};
    
    userMovies.forEach(movie => {
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    
    return Object.keys(genreCounts)
      .sort((a, b) => genreCounts[b] - genreCounts[a])
      .slice(0, 4);
  };

  const userFavoriteGenres = user ? getUserViewingHistory() : [];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const allMovies = await getMovies();
        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let results = [...movies];

    // Filter by genre
    if (selectedGenre) {
      results = results.filter(movie => 
        Array.isArray(movie.genres) && movie.genres.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      results = results.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(movie.genres) && movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'year':
        results.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'runtime':
        results.sort((a, b) => (b.runtime || 0) - (a.runtime || 0));
        break;
      default:
        break;
    }

    setFilteredMovies(results);
  }, [movies, selectedGenre, searchQuery, sortBy]);

  const handleGenreClick = (genreName: string) => {
    if (selectedGenre === genreName && showMovies) {
      setSelectedGenre('');
      setShowMovies(false);
    } else {
      setSelectedGenre(genreName);
      setShowMovies(true);
      setTimeout(() => {
        const moviesSection = document.getElementById('movies-section');
        if (moviesSection) {
          moviesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const getGenreStats = (genreName: string) => {
    const genreMovies = movies.filter(movie => 
      Array.isArray(movie.genres) && movie.genres.some(genre => genre.toLowerCase() === genreName.toLowerCase())
    );
    const avgRating = genreMovies.length > 0 
      ? genreMovies.reduce((sum, movie) => sum + (movie.averageRating || 0), 0) / genreMovies.length 
      : 0;
    
    return {
      count: genreMovies.length,
      avgRating: avgRating.toFixed(1)
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            {t('browseGenres')}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {t('genresPageSubtitle')}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-gray-900/80 border border-gray-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 mb-10 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-5 h-5 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchGenreOrMovie')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl pr-11 pl-4 py-2.5 border border-gray-700/80 focus:outline-none focus:border-red-500 text-sm transition-colors"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">{t('sortByLabel')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white text-sm rounded-xl px-4 py-2.5 border border-gray-700/80 focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="rating">{t('highestRated')}</option>
                <option value="year">{t('newest')}</option>
                <option value="title">{t('name')}</option>
                <option value="runtime">{t('duration')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommended Genres for logged in user */}
        {user && userFavoriteGenres.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t('recommendedForYou')}</h2>
              <span className="bg-red-600/20 border border-red-500/30 text-red-400 px-3 py-0.5 rounded-full text-xs font-semibold">
                {t('personalized')}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userFavoriteGenres.map((genreName) => {
                const genre = allGenres.find(g => g.name === genreName);
                const stats = getGenreStats(genreName);
                const IconComponent = genre.Icon;
                
                return (
                  <button
                    key={genreName}
                    onClick={() => handleGenreClick(genre.name)}
                    className="group text-right relative overflow-hidden rounded-2xl p-5 bg-gradient-to-b from-gray-800/90 to-gray-900/90 border border-gray-750 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${genre.iconBox}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <Heart className="w-4 h-4 text-red-500 fill-current opacity-80" />
                    </div>
                    
                    <h3 className="text-white font-bold text-base mb-1">
                      {language === 'ar' ? genre.nameAr : genre.name}
                    </h3>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
                      {language === 'ar' ? genre.name : genre.nameAr}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/60">
                      <span>{stats.count} {t('movieItem')}</span>
                      <div className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span>{stats.avgRating}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Genres Section (Redesigned without emojis) */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-white tracking-tight">{t('allGenres')}</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {allGenres.map((genre, index) => {
              const stats = getGenreStats(genre.name);
              const isSelected = selectedGenre === genre.name;
              const IconComponent = genre.Icon;
              
              return (
                <StaggeredAnimation key={genre.name} direction="up" staggerDelay={index * 40} duration={400}>
                  <button
                    onClick={() => handleGenreClick(genre.name)}
                    className={`w-full group relative text-center rounded-2xl p-4 sm:p-5 transition-all duration-300 border backdrop-blur-md flex flex-col items-center justify-between ${
                      isSelected 
                        ? 'border-red-500 bg-gradient-to-b from-red-900/40 to-gray-900 shadow-[0_0_25px_rgba(239,68,68,0.3)] scale-[1.02]' 
                        : `border-gray-800/80 bg-gradient-to-b from-gray-800/90 via-gray-800/50 to-gray-900/90 hover:bg-gray-800/70 hover:-translate-y-1 hover:shadow-xl ${genre.glow}`
                    }`}
                  >
                    {/* Modern Vector Icon Box (Zero Emojis) */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 mx-auto mb-3.5 ${genre.iconBox}`}>
                      <IconComponent className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    
                    <h3 className="text-white font-bold text-sm sm:text-base mb-1 tracking-wide group-hover:text-white">
                      {language === 'ar' ? genre.nameAr : genre.name}
                    </h3>
                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider mb-3">
                      {language === 'ar' ? genre.name : genre.nameAr}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-xs w-full">
                      <span className="px-2 py-0.5 rounded-full bg-gray-800/80 border border-gray-700/60 text-gray-300 text-[10px] sm:text-[11px] font-medium">
                        {stats.count} {t('movieItem')}
                      </span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] sm:text-[11px] font-bold">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span>{stats.avgRating}</span>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[11px] font-bold">
                          <Check className="w-3 h-3" />
                          <span>{t('selected')}</span>
                        </span>
                      </div>
                    )}
                  </button>
                </StaggeredAnimation>
              );
            })}
          </div>
        </div>

        {/* Selected Genre Movies Grid */}
        {selectedGenre && showMovies && (
          <div id="movies-section" className="mb-12 scroll-mt-6">
            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-4">
                  {(() => {
                    const matched = allGenres.find(g => g.name === selectedGenre);
                    const MatchedIcon = matched?.Icon || Film;
                    return (
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${matched?.iconBox || 'bg-red-600/20 text-red-500 border-red-500/30'}`}>
                        <MatchedIcon className="w-6 h-6" />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {language === 'ar' 
                        ? `أفلام ${allGenres.find(g => g.name === selectedGenre)?.nameAr}` 
                        : `${selectedGenre} Movies`}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {allGenres.find(g => g.name === selectedGenre)?.name} • {filteredMovies.length} {t('moviesAvailable')}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedGenre('');
                    setShowMovies(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-xl border border-transparent hover:border-gray-700"
                  title={t('close')}
                >
                  ✕
                </button>
              </div>

              {/* Movies Grid */}
              {filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">{t('noMatchingMovies')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                  {filteredMovies.slice(0, 18).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} size="md" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GenresPage;
