import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Mail, Heart, ExternalLink, Users, Award, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="text-2xl font-bold text-red-600 flex items-center gap-2">
              MovieRate
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">AI</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('projectDescription')}
            </p>
            
            {/* Project Info */}
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-300">{t('graduationProject')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-gray-300">{t('teamDeepmind')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">{t('samsungCourse')}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">{t('followUs')}</h4>
              <div className="flex space-x-4">
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm">GitHub</span>
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm">Twitter</span>
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm">Instagram</span>
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  title="Email"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm">Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('trending')}
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('genres')}
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('help')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('search')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('account')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('profile')}
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('myReviews')}
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('watchlist')}
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  {t('settings')}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-gray-400 text-sm">
                © 2025 MovieRate. {t('allRightsReserved')}.
              </p>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{t('madeWithLove')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>{t('poweredBy')}</span>
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent font-bold">
                AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;