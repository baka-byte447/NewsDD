import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, Loader } from 'lucide-react';
import NewsCard from './NewsCard.js';
import api  from '../utils/api.js';
import { getPreferences } from '../utils/storage.js';

const Dashboard = ({ 
  activeCategory, 
  preferences, 
  onNewsClick,
  refreshTrigger 
}) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [activeCategory, preferences, refreshTrigger]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.fetchNews(
        activeCategory,
        'en', // Always fetch in English first
        preferences.language || 'en'
      );

      setNews(response.articles || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchNews();
  };

  if (loading && news.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary-500"
        >
          <Loader className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Unable to load news
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {activeCategory === 'general' ? 'Top Stories' : `${activeCategory} News`}
          </h2>
          {lastUpdated && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* News Grid */}
      {news.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {news.map((article, index) => (
              <motion.div
                key={article.id || article.url}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <NewsCard 
                  article={article} 
                  onClick={onNewsClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No articles found for this category.
            </p>
          </div>
        )
      )}

      {/* Loading More */}
      {loading && news.length > 0 && (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-primary-500"
          >
            <Loader className="w-6 h-6" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
