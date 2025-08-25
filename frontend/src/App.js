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

// Login/Signup Component (email/password)
const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await api.signup({ email, password, name });
        onLogin(res.user);
      } else {
        const res = await api.login({ email, password });
        onLogin(res.user);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
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
            {mode === 'signup' ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'signup' ? (
            <span>
              Already have an account?{' '}
              <button className="text-primary-600 dark:text-primary-400" onClick={() => setMode('login')}>Sign in</button>
            </span>
          ) : (
            <span>
              No account yet?{' '}
              <button className="text-primary-600 dark:text-primary-400" onClick={() => setMode('signup')}>Create one</button>
            </span>
          )}
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
