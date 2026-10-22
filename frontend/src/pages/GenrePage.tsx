import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Movie } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getMoviesByGenre } from '../services/movieService';

const GenrePage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const { t, language } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');

  const genreTranslations: { [key: string]: string } = {
    action: t('action'),
    comedy: t('comedy'),
    drama: t('drama'),
    horror: t('horror'),
    'sci-fi': t('sciFi'),
    'science fiction': t('sciFi'),
    romance: t('romance'),
    thriller: t('thriller'),
    crime: t('crime'),
    adventure: t('adventure'),
    fantasy: t('fantasy'),
    animation: t('animation'),
    documentary: t('documentary'),
    mystery: 'غموض',
    family: 'عائلي',
    history: 'تاريخي',
    war: 'حرب',
    western: 'ويسترن',
    music: 'موسيقى',
    foreign: 'أجنبي',
    'tv movie': 'فيلم تلفزيوني',
  };

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (!genre) return;
      
      try {
        setIsLoading(true);
        const genreMovies = await getMoviesByGenre(genre);
        setMovies(genreMovies);
      } catch (error) {
        console.error('Error fetching movies by genre:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [genre]);

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.averageRating - a.averageRating;
    if (sortBy === 'year') return b.releaseYear - a.releaseYear;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {genreTranslations[genre?.toLowerCase() || ''] || genre}
            </h1>
            <p className="text-gray-400">{movies.length} {t('moviesAvailable')}</p>
          </div>
          
          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="rating">{t('highestRated')}</option>
              <option value="year">{t('newest')}</option>
              <option value="title">{t('name')}</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Movie Poster */}
              <div className="relative h-80">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <span className="text-yellow-400 text-sm font-bold">★</span>
                  <span className="text-white text-sm font-medium">
                    {movie.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-4">
                {/* Match Percentage */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-bold text-sm">
                    {Math.round(movie.averageRating * 20)}% {t('match')}
                  </span>
                  <span className="text-white font-bold text-lg">
                    {movie.averageRating.toFixed(1)}
                  </span>
                </div>

                {/* Title and Year */}
                <h3 className="text-white font-bold text-lg mb-1 truncate">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{movie.releaseYear}</p>

                {/* Genres */}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenrePage;