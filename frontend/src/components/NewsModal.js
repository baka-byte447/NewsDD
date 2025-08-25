import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Share2,
  Calendar,
  Globe,
  BookmarkCheck
} from 'lucide-react';
import { 
  saveArticle, 
  removeSavedArticle, 
  getSavedArticles,
  voteArticle,
  getArticleVote,
  incrementDailyReads,
  updateReadingStreak
} from '../utils/storage.js';
import api  from '../utils/api.js';

const NewsModal = ({ article, isOpen, onClose, onStatsUpdate }) => {
  const [vote, setVote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (article) {
      setVote(getArticleVote(article.id));
      setIsSaved(getSavedArticles().some(a => a.id === article.id));
      
      // Track reading and update stats
      incrementDailyReads();
      updateReadingStreak();
      if (onStatsUpdate) onStatsUpdate();
    }
  }, [article, onStatsUpdate]);

  const handleVote = (voteType) => {
    if (!article) return;
    
    const newVote = vote === voteType ? null : voteType;
    setVote(newVote);
    voteArticle(article.id, newVote);
  };

  const handleSave = () => {
    if (!article) return;

    if (isSaved) {
      removeSavedArticle(article.id);
      setIsSaved(false);
    } else {
      saveArticle(article);
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    if (!article || isSharing) return;

    setIsSharing(true);
    try {
      const response = await api.shareArticle(article);
      setShareUrl(response.shareUrl);
      
      // Copy to clipboard
      navigator.clipboard.writeText(response.shareUrl);
      
      // Show success (you could add a toast here)
      setTimeout(() => setShareUrl(''), 3000);
    } catch (error) {
      console.error('Failed to share article:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="relative">
          {/* Hero Image */}
          {article.urlToImage && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white hover:text-gray-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Source Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              {article.source}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {article.translatedTitle || article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            
            {article.originalLanguage && article.originalLanguage !== 'en' && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 px-2 py-1 rounded-full text-xs">
                  Translated from {article.originalLanguage.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {(article.translatedDescription || article.description) && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {article.translatedDescription || article.description}
            </p>
          )}

          {/* Summary */}
          {article.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Key Points
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="prose dark:prose-invert max-w-none">
                  {article.summary.split('\n').map((line, index) => (
                    line.trim() && (
                      <p key={index} className="text-sm text-gray-700 dark:text-gray-300 mb-2 last:mb-0">
                        {line}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Original Link */}
          <div className="mb-6">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Read Full Article
            </a>
          </div>

          {/* Share Success Message */}
          {shareUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <p className="text-sm text-green-700 dark:text-green-400">
                Share link copied to clipboard!
              </p>
            </motion.div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Voting */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('up')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all ${
                  vote === 'up'
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Like</span>
              </button>

              <button
                onClick={() => handleVote('down')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all ${
                  vote === 'down'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Dislike</span>
              </button>
            </div>

            {/* Save & Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all ${
                  isSaved
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="text-xs sm:text-sm font-medium">
                  {isSaved ? 'Saved' : 'Save'}
                </span>
              </button>

              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  {isSharing ? 'Sharing...' : 'Share'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsModal;