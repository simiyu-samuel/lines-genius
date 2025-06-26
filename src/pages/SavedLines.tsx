import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Copy, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle,
  Calendar,
  Tag,
  Trash,
  Lock
} from 'lucide-react';
import { useSavedLines, SavedLine } from '../context/SavedLinesContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const SavedLines: React.FC = () => {
  const { savedLines, deleteLine, clearAllLines } = useSavedLines();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-xl">
            <Lock className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              You need to be signed in to view and manage your saved lines. 
              Create an account to start building your collection of creative content.
            </p>
            <div className="space-y-4">
              <Link
                to="/auth"
                className="block w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
              >
                Sign In / Sign Up
              </Link>
              <Link
                to="/generate"
                className="block w-full bg-white/20 dark:bg-dark-700/50 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-neon-purple/30 hover:bg-white/30 dark:hover:bg-dark-600/50 transition-all duration-300"
              >
                Generate Lines First
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const categories = ['all', ...new Set(savedLines.map(line => line.category))];

  const filteredLines = savedLines.filter(line => {
    const matchesSearch = line.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || line.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      taglines: 'Business Taglines',
      bios: 'Social Media Bios',
      captions: 'Instagram Captions',
      quotes: 'Inspirational Quotes',
      slogans: 'Marketing Slogans',
      adlines: 'Ad Lines & Jingles',
    };
    return categoryMap[category] || category;
  };

  const getToneColor = (tone: string) => {
    const toneColors: Record<string, string> = {
      funny: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      corporate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      bold: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      romantic: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      minimalist: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      inspirational: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      motivational: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };
    return toneColors[tone] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Saved Lines
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personal collection of creative lines. Copy, organize, and manage your favorites.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-neon-purple/20 shadow-xl mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your lines..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-4 pr-10 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {filteredLines.length} of {savedLines.length} lines
              </span>
              
              {savedLines.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllLines}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 transition-colors duration-200 text-sm font-medium"
                >
                  <Trash className="h-4 w-4" />
                  <span>Clear All</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lines Grid */}
        <AnimatePresence mode="wait">
          {filteredLines.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredLines.map((line, index) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-neon-purple/20 shadow-xl hover:shadow-2xl hover:shadow-neon-purple/10 transition-all duration-300 hover:border-neon-cyan/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getToneColor(line.tone)}`}>
                        {line.tone}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-neon-purple/20 text-neon-purple">
                        {getCategoryLabel(line.category)}
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteLine(line.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md text-red-500 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <p className="text-gray-900 dark:text-white mb-4 font-medium leading-relaxed">
                    "{line.text}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(line.timestamp)}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(line.text, line.id)}
                      className="flex items-center space-x-1 px-3 py-1 rounded-md bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors duration-200 text-sm font-medium"
                    >
                      {copiedId === line.id ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : savedLines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <BookOpen className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No saved lines yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Start generating creative lines and save your favorites to build your collection.
              </p>
              <motion.a
                href="/generate"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
              >
                <BookOpen className="h-5 w-5" />
                <span>Generate Lines</span>
              </motion.a>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Search className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No lines match your search
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or category filter.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
              >
                <Filter className="h-5 w-5" />
                <span>Clear Filters</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};