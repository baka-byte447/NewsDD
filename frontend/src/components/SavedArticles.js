import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, Calendar, ExternalLink } from 'lucide-react';
import { getSavedArticles, removeSavedArticle } from '../utils/storage.js';
import NewsCard from './NewsCard.js';

const SavedArticles = ({ onNewsClick, onBack }) => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedArticles();
  }, []);

  const loadSavedArticles = () => {
    const articles = getSavedArticles();
    setSavedArticles(articles);
    setLoading(false);
  };

  const handleRemoveArticle = (articleId) => {
    removeSavedArticle(articleId);
    loadSavedArticles(); // Reload the list
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-primary-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Saved Articles
                </h1>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No saved articles yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Articles you save will appear here for easy access
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArticles.map((article, index) => (
              <motion.div
                key={article.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <NewsCard
                  article={article}
                  onClick={onNewsClick}
                  className="h-full"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveArticle(article.id)}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                {/* Saved Date */}
                {article.savedAt && (
                  <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.savedAt)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedArticles;
