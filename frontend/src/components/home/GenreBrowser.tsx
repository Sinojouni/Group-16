import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAllGenres } from '../../services/movieService';

interface GenreData {
  name: string;
  nameAr: string;
  count: number;
  color: string;
}

const GenreBrowser = () => {
  const { t } = useLanguage();
  const [genres, setGenres] = useState([] as GenreData[]);
  const [loading, setLoading] = useState(true);

  // Predefined genre colors for consistent styling
  const genreColors = [
    'from-red-600 to-red-800',
    'from-yellow-600 to-yellow-800',
    'from-blue-600 to-blue-800',
    'from-purple-600 to-purple-800',
    'from-green-600 to-green-800',
    'from-pink-600 to-pink-800',
    'from-indigo-600 to-indigo-800',
    'from-teal-600 to-teal-800',
    'from-orange-600 to-orange-800',
    'from-cyan-600 to-cyan-800',
  ];

  // Map English genre names to Arabic translations
  const genreTranslations: { [key: string]: string } = {
    'Action': 'أكشن',
    'Comedy': 'كوميديا',
    'Drama': 'دراما',
    'Horror': 'رعب',
    'Science Fiction': 'خيال علمي',
    'Romance': 'رومانسي',
    'Thriller': 'إثارة',
    'Crime': 'جريمة',
    'Adventure': 'مغامرة',
    'Fantasy': 'فانتازيا',
    'Animation': 'رسوم متحركة',
    'Family': 'عائلي',
    'Mystery': 'غموض',
    'War': 'حرب',
    'Documentary': 'وثائقي',
    'Music': 'موسيقى',
    'Western': 'غربي',
    'History': 'تاريخي',
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const allGenres = await getAllGenres();
        
        // Transform genres to match the expected format
        const transformedGenres = allGenres.slice(0, 12).map((genre, index) => ({
          name: genre,
          nameAr: genreTranslations[genre] || genre,
          count: Math.floor(Math.random() * 300) + 50, // Simulated count
          color: genreColors[index % genreColors.length],
        }));
        
        setGenres(transformedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
        // Fallback to hardcoded genres if API fails
        setGenres([
          { name: 'Action', nameAr: 'أكشن', count: 245, color: 'from-red-600 to-red-800' },
          { name: 'Comedy', nameAr: 'كوميديا', count: 189, color: 'from-yellow-600 to-yellow-800' },
          { name: 'Drama', nameAr: 'دراما', count: 312, color: 'from-blue-600 to-blue-800' },
          { name: 'Horror', nameAr: 'رعب', count: 156, color: 'from-purple-600 to-purple-800' },
          { name: 'Science Fiction', nameAr: 'خيال علمي', count: 198, color: 'from-green-600 to-green-800' },
          { name: 'Romance', nameAr: 'رومانسي', count: 167, color: 'from-pink-600 to-pink-800' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('browseByGenre')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('browseByGenre')}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.name}
            to={`/genre/${encodeURIComponent(genre.name)}`}
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