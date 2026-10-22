import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TrendingPage from './pages/TrendingPage';
import GenrePage from './pages/GenrePage';
import GenresPage from './pages/GenresPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProfilePage from './pages/ProfilePage';
import ReviewsPage from './pages/ReviewsPage';
import WatchlistPage from './pages/WatchlistPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import HelpPage from './pages/HelpPage';
import AboutPage from './pages/AboutPage';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 flex flex-col">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#ffffff',
                    border: '1px solid #374151',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
              
              <Header />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/movie/:id" element={<MovieDetailPage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/genres" element={<GenresPage />} />
                  <Route path="/genre/:genre" element={<GenrePage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/watchlist"
                    element={
                      <ProtectedRoute>
                        <WatchlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recommendations"
                    element={
                      <ProtectedRoute>
                        <RecommendationsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Footer Pages */}
                  <Route
                    path="/help"
                    element={
                      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                        <h1 className="text-white text-2xl">Help Center - Coming Soon</h1>
                      </div>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                        <h1 className="text-white text-2xl">Contact Us - Coming Soon</h1>
                      </div>
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                        <h1 className="text-white text-2xl">Privacy Policy - Coming Soon</h1>
                      </div>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                        <h1 className="text-white text-2xl">Terms of Service - Coming Soon</h1>
                      </div>
                    }
                  />

                  {/* Catch-all route */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                          <p className="text-gray-400 mb-8">Page not found</p>
                          <a href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200">
                            Go Home
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;