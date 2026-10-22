import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Flame, 
  Laugh, 
  Theater, 
  Ghost, 
  Rocket, 
  Heart, 
  Zap, 
  ShieldAlert, 
  Compass, 
  Sparkles, 
  Palette, 
  Video,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAllGenres } from '../../services/movieService';

interface GenreItem {
  name: string;
  nameAr: string;
  Icon: React.ElementType;
  iconBox: string;
  glow: string;
}

const genreMetaMap: { [key: string]: { nameAr: string; Icon: React.ElementType; iconBox: string; glow: string } } = {
  'Action': {
    nameAr: 'أكشن',
    Icon: Flame,
    iconBox: 'bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    glow: 'group-hover:border-red-500/50'
  },
  'Comedy': {
    nameAr: 'كوميديا',
    Icon: Laugh,
    iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    glow: 'group-hover:border-amber-500/50'
  },
  'Drama': {
    nameAr: 'دراما',
    Icon: Theater,
    iconBox: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    glow: 'group-hover:border-blue-500/50'
  },
  'Horror': {
    nameAr: 'رعب',
    Icon: Ghost,
    iconBox: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    glow: 'group-hover:border-purple-500/50'
  },
  'Science Fiction': {
    nameAr: 'خيال علمي',
    Icon: Rocket,
    iconBox: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    glow: 'group-hover:border-cyan-500/50'
  },
  'Romance': {
    nameAr: 'رومانسي',
    Icon: Heart,
    iconBox: 'bg-pink-500/10 text-pink-400 border-pink-500/20 group-hover:bg-pink-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]',
    glow: 'group-hover:border-pink-500/50'
  },
  'Thriller': {
    nameAr: 'إثارة',
    Icon: Zap,
    iconBox: 'bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]',
    glow: 'group-hover:border-orange-500/50'
  },
  'Crime': {
    nameAr: 'جريمة',
    Icon: ShieldAlert,
    iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:bg-rose-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    glow: 'group-hover:border-rose-500/50'
  },
  'Adventure': {
    nameAr: 'مغامرة',
    Icon: Compass,
    iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    glow: 'group-hover:border-emerald-500/50'
  },
  'Fantasy': {
    nameAr: 'فانتازيا',
    Icon: Sparkles,
    iconBox: 'bg-violet-500/10 text-violet-400 border-violet-500/20 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    glow: 'group-hover:border-violet-500/50'
  },
  'Animation': {
    nameAr: 'رسوم متحركة',
    Icon: Palette,
    iconBox: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
    glow: 'group-hover:border-indigo-500/50'
  },
  'Documentary': {
    nameAr: 'وثائقي',
    Icon: Video,
    iconBox: 'bg-teal-500/10 text-teal-400 border-teal-500/20 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]',
    glow: 'group-hover:border-teal-500/50'
  }
};

const defaultGenresList: string[] = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Science Fiction', 'Romance',
  'Thriller', 'Crime', 'Adventure', 'Fantasy', 'Animation', 'Documentary'
];

const GenreBrowser: React.FC = () => {
  const { t, language } = useLanguage();
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const allGenres = await getAllGenres();
        const displayList = allGenres.length > 0 
          ? allGenres.filter(g => genreMetaMap[g]).slice(0, 12)
          : defaultGenresList;

        const transformed: GenreItem[] = displayList.map(name => {
          const meta = genreMetaMap[name] || {
            nameAr: name,
            Icon: Layers,
            iconBox: 'bg-red-500/10 text-red-400 border-red-500/20 group-hover:bg-red-600 group-hover:text-white',
            glow: 'group-hover:border-red-500/50'
          };
          return {
            name,
            nameAr: meta.nameAr,
            Icon: meta.Icon,
            iconBox: meta.iconBox,
            glow: meta.glow
          };
        });

        setGenres(transformed);
      } catch (error) {
        console.error('Error in GenreBrowser fetch:', error);
        const fallback: GenreItem[] = defaultGenresList.map(name => {
          const meta = genreMetaMap[name];
          return {
            name,
            nameAr: meta.nameAr,
            Icon: meta.Icon,
            iconBox: meta.iconBox,
            glow: meta.glow
          };
        });
        setGenres(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 text-center">{t('browseByGenre')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-900/60 rounded-2xl animate-pulse border border-gray-800"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('browseByGenre')}</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">{t('browseByGenreSubtitle')}</p>
        </div>
        <Link 
          to="/genres" 
          className="text-xs sm:text-sm text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>{t('viewAll')}</span>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {genres.map((genre) => {
          const IconComponent = genre.Icon;
          return (
            <Link
              key={genre.name}
              to={`/genre/${encodeURIComponent(genre.name)}`}
              className={`group relative text-center rounded-2xl p-4 sm:p-5 transition-all duration-300 border backdrop-blur-md flex flex-col items-center justify-between border-gray-800/80 bg-gradient-to-b from-gray-900/90 via-gray-800/60 to-gray-900/90 hover:bg-gray-800/70 hover:-translate-y-1 hover:shadow-xl ${genre.glow}`}
            >
              {/* Sleek Vector Icon (Zero Emojis) */}
              <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 mx-auto mb-3 ${genre.iconBox}`}>
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110" />
              </div>
              
              <h3 className="text-white font-bold text-sm sm:text-base mb-0.5 tracking-wide group-hover:text-white transition-colors">
                {language === 'ar' ? genre.nameAr : genre.name}
              </h3>
              <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">
                {language === 'ar' ? genre.name : genre.nameAr}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default GenreBrowser;