import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar.js';
import Dashboard from './components/Dashboard.js';
import OnboardingModal from './components/OnboardingModal.js';
import NewsModal from './components/NewsModal.js';
import SettingsModal from './components/SettingsModal.js';
import SavedArticles from './components/SavedArticles.js';
import { 
  getPreferences, 
  savePreferences, 
  defaultPreferences,
  getReadingStreak,
  getDailyReads 
} from './utils/storage.js';
import api  from './utils/api.js'; 
// import { getUser } from './utils/api'; 
import './styles/globals.css';

// Login Component
const LoginPage = ({ onLogin }) => {
  const handleLogin = (provider) => {
    const BACKEND_URL = "http://localhost:5000";
    window.location.href = `${BACKEND_URL}/auth/login/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📰</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            NewsDigest
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your personalized news experience
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('github')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="font-medium">Continue with GitHub</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};




// Shared Article Component
const SharedArticle = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const shareId = window.location.pathname.split('/shared/')[1];
    if (shareId) {
      fetchSharedArticle(shareId);
    }
  }, []);

  const fetchSharedArticle = async (shareId) => {
    try {
      const response = await api.getSharedArticle(shareId);
      setArticle(response.article);
    } catch (err) {
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary-500"
        >
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The shared article could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Article content similar to NewsModal but as a page */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {article.translatedTitle || article.title}
            </h1>
            
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            {(article.translatedDescription || article.description) && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {article.translatedDescription || article.description}
              </p>
            )}

            {article.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Key Points</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  {article.summary.split('\n').map((line, index) => (
                    line.trim() && (
                      <p key={index} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    )
                  ))}
                </div>
              </div>
            )}

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [activeCategory, setActiveCategory] = useState('general');
  
  // Modal states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  
  // Saved articles state
  const [showSavedArticles, setShowSavedArticles] = useState(false);
  
  // Stats state for re-rendering
  const [statsUpdate, setStatsUpdate] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Initialize app
    initializeApp();
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const initializeApp = async () => {
    try {
      // Load preferences first
      const savedPrefs = getPreferences();
      setPreferences(savedPrefs);
      setDarkMode(savedPrefs.theme === 'dark');
      
      // Set initial category from preferences
      if (savedPrefs.categories.length > 0) {
        setActiveCategory(savedPrefs.categories[0]);
      }
  
      // Check authentication
      const userData = await api.getUser();
      
      if (userData) {
        setUser(userData);
        
        // Show onboarding if no preferences saved
        if (savedPrefs === defaultPreferences) {
          setShowOnboarding(true);
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Also update your handleLogin function to be more explicit
  const handleLogin = (userData) => {
    console.log('Logging in user:', userData); // Debug log
    setUser(userData);
    setShowOnboarding(true);
  };



  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      // Clear any sensitive local data if needed
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleOnboardingComplete = async (newPreferences) => {
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    
    // Set active category to first selected category
    if (newPreferences.categories.length > 0) {
      setActiveCategory(newPreferences.categories[0]);
    }
    
    // Save to backend if user is logged in
    if (user) {
      try {
        await api.savePreferences(newPreferences);
      } catch (error) {
        console.error('Failed to save preferences to backend:', error);
      }
    }
    
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSettingsSave = async (newPreferences) => {
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    
    // Update dark mode if changed
    if (newPreferences.theme !== (darkMode ? 'dark' : 'light')) {
      setDarkMode(newPreferences.theme === 'dark');
    }
    
    // Save to backend if user is logged in
    if (user) {
      try {
        await api.savePreferences(newPreferences);
      } catch (error) {
        console.error('Failed to save preferences to backend:', error);
      }
    }
    
    setRefreshTrigger(prev => prev + 1);
  };

  const handleNewsClick = (article) => {
    setSelectedNews(article);
  };

  const handleStatsUpdate = () => {
    setStatsUpdate(prev => prev + 1);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSavedArticlesClick = () => {
    setShowSavedArticles(true);
  };

  const handleBackToDashboard = () => {
    setShowSavedArticles(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary-500"
        >
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Routes>
          {/* Shared Article Route */}
          <Route path="/shared/:shareId" element={<SharedArticle />} />
          
          {/* Main App Routes */}
          <Route path="/*" element={
            user ? (
              <>
                <Navbar
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  user={user}
                  onSettingsClick={() => setShowSettings(true)}
                  onLogout={handleLogout}
                  categories={preferences.categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  onSavedArticlesClick={handleSavedArticlesClick}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {showSavedArticles ? (
                    <SavedArticles
                      onNewsClick={handleNewsClick}
                      onBack={handleBackToDashboard}
                    />
                  ) : (
                    <Routes>
                      <Route path="/dashboard" element={
                        <Dashboard
                          activeCategory={activeCategory}
                          preferences={preferences}
                          onNewsClick={handleNewsClick}
                          refreshTrigger={refreshTrigger}
                        />
                      } />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  )}
                </main>

                {/* Modals */}
                <OnboardingModal
                  isOpen={showOnboarding}
                  onClose={() => setShowOnboarding(false)}
                  onComplete={handleOnboardingComplete}
                  initialPreferences={preferences}
                />

                <SettingsModal
                  isOpen={showSettings}
                  onClose={() => setShowSettings(false)}
                  preferences={preferences}
                  onSave={handleSettingsSave}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />

                <NewsModal
                  article={selectedNews}
                  isOpen={!!selectedNews}
                  onClose={() => setSelectedNews(null)}
                  onStatsUpdate={handleStatsUpdate}
                />
              </>
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
