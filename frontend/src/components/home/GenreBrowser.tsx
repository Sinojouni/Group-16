import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface GenreData {
  name: string;
  nameAr: string;
  count: number;
  color: string;
}

const GenreBrowser: React.FC = () => {
  const { t } = useLanguage();

  const genres: GenreData[] = [
    { name: 'action', nameAr: 'أكشن', count: 245, color: 'from-red-600 to-red-800' },
    { name: 'comedy', nameAr: 'كوميديا', count: 189, color: 'from-yellow-600 to-yellow-800' },
    { name: 'drama', nameAr: 'دراما', count: 312, color: 'from-blue-600 to-blue-800' },
    { name: 'horror', nameAr: 'رعب', count: 156, color: 'from-purple-600 to-purple-800' },
    { name: 'sci-fi', nameAr: 'خيال علمي', count: 198, color: 'from-green-600 to-green-800' },
    { name: 'romance', nameAr: 'رومانسي', count: 167, color: 'from-pink-600 to-pink-800' },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('browseByGenre')}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.name}
            to={`/genre/${genre.name}`}
            className="group relative overflow-hidden rounded-lg h-32 hover:scale-105 transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-90`} />
            
            <div className="relative h-full flex flex-col justify-between p-4">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{genre.nameAr}</h3>
                <p className="text-white text-sm opacity-90">{genre.count} {t('movie')}</p>
              </div>
              
              <ChevronRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-end" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenreBrowser;