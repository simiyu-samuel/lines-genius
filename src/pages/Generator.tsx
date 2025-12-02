import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2,
  Copy, 
  Save, 
  Download,
  RefreshCw,
  CheckCircle,
  Lock,
  AlertCircle,
  TrendingUp,
  Zap,
  Star,
  Heart,
  FileText,
  FileJson,
  Table,
  ChevronDown,
  Settings,
  BarChart3,
  Lightbulb,
  Target
} from 'lucide-react';
import { generateLines } from '../services/openaiService';
import { useSavedLines } from '../context/SavedLinesContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { exportToText, exportToJSON, exportToCSV, copyAllToClipboard } from '../utils/exportLines';

const categories = [
  { value: 'taglines', label: 'Business Taglines', icon: Target, color: 'from-primary-500 to-primary-600' },
  { value: 'bios', label: 'Social Media Bios', icon: Star, color: 'from-secondary-500 to-secondary-600' },
  { value: 'captions', label: 'Instagram Captions', icon: Heart, color: 'from-accent-500 to-accent-600' },
  { value: 'quotes', label: 'Inspirational Quotes', icon: Lightbulb, color: 'from-warning-500 to-warning-600' },
  { value: 'slogans', label: 'Marketing Slogans', icon: TrendingUp, color: 'from-success-500 to-success-600' },
  { value: 'adlines', label: 'Ad Lines & Jingles', icon: Zap, color: 'from-danger-500 to-danger-600' },
];

const tones = [
  { value: 'funny', label: 'Funny', emoji: '😄' },
  { value: 'corporate', label: 'Corporate', emoji: '💼' },
  { value: 'bold', label: 'Bold', emoji: '🔥' },
  { value: 'romantic', label: 'Romantic', emoji: '💕' },
  { value: 'minimalist', label: 'Minimalist', emoji: '✨' },
  { value: 'inspirational', label: 'Inspirational', emoji: '🌟' },
  { value: 'motivational', label: 'Motivational', emoji: '💪' },
];

export const Generator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState('taglines');
  const [tone, setTone] = useState('corporate');
  const [prompt, setPrompt] = useState('');
  const [generatedLines, setGeneratedLines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [allCopied, setAllCopied] = useState(false);
  const [generationService, setGenerationService] = useState<'api' | 'fallback' | undefined>(undefined);
  
  const { saveLine } = useSavedLines();
  const { 
    canGenerate, 
    refreshUsage, 
    hasFeature 
  } = useSubscription();

  // Check authentication on mount
  useEffect(() => {
    // Component mounted
  }, [user]);

  const handleGenerate = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (isGenerating || !canGenerate) return;
    
    setIsGenerating(true);
    setGeneratedLines([]);
    setError(null);
    
    try {
      const response = await generateLines({ 
        category, 
        tone, 
        prompt: hasFeature('customPrompts') ? prompt : '',
        count: 4 
      });
      
      setGeneratedLines(response.lines);
      setGenerationService(response.service);
      
      await refreshUsage();
      
    } catch (generationError: any) {
      console.error('Generation failed:', generationError);
      setError(generationError.message || 'Failed to generate lines. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewGenerate = () => {
    const previewLines = [
      "Unlock your creative potential with AI",
      "Sign in to generate unlimited amazing lines"
    ];
    setGeneratedLines(previewLines);
    setGenerationService('fallback');
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleSaveLine = async (text: string, index: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await saveLine({
        text,
        category,
        tone,
      });
      setSavedIndex(index);
      setTimeout(() => setSavedIndex(null), 2000);
    } catch (error: any) {
      console.error('Failed to save line:', error);
      setError(error.message || 'Failed to save line');
    }
  };

  const handleCopyAll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await copyAllToClipboard(generatedLines);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy all lines:', error);
      setError('Failed to copy lines to clipboard');
    }
  };

  const handleExport = (format: 'txt' | 'json' | 'csv') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      switch (format) {
        case 'txt':
          exportToText(generatedLines, category, tone);
          break;
        case 'json':
          exportToJSON(generatedLines, category, tone, prompt);
          break;
        case 'csv':
          exportToCSV(generatedLines, category, tone);
          break;
      }
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export lines');
    }
  };

  const selectedCategory = categories.find(c => c.value === category);
  const CategoryIcon = selectedCategory?.icon || Target;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-gradient-primary rounded-full mb-4">
            <Wand2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AI Line Generator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create stunning, creative lines powered by advanced AI technology
          </p>
        </motion.div>

        {/* Authentication Warning for Non-Logged Users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Lock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sign in to unlock full features
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get access to unlimited generations, save your favorite lines, export in multiple formats, and more!
                </p>
                <button
                  onClick={() => navigate('/auth')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105"
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Sign In / Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-large p-6 border border-gray-200 dark:border-dark-700">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuration</h2>
              </div>

              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Category
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <motion.button
                          key={cat.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCategory(cat.value)}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                            category === cat.value
                              ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-medium`
                              : 'bg-gray-50 dark:bg-dark-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{cat.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Choose Tone
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {tones.map((toneOption) => (
                      <motion.button
                        key={toneOption.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTone(toneOption.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          tone === toneOption.value
                            ? 'bg-gradient-secondary text-white shadow-medium'
                            : 'bg-gray-50 dark:bg-dark-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-600 hover:border-secondary-300 dark:hover:border-secondary-700'
                        }`}
                      >
                        <span className="mr-2">{toneOption.emoji}</span>
                        {toneOption.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt */}
                {user && hasFeature('customPrompts') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Custom Requirements (Optional)
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Add specific keywords, product details, or requirements..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    />
                  </div>
                )}

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={user ? handleGenerate : handlePreviewGenerate}
                  disabled={isGenerating || (!!user && !canGenerate)}
                  className="w-full bg-gradient-primary text-white px-6 py-4 rounded-xl font-semibold shadow-large hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>{user ? 'Generate Lines' : 'Try Preview'}</span>
                    </>
                  )}
                </motion.button>

                {!user && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Preview mode: Limited to 2 sample lines
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-large p-6 border border-gray-200 dark:border-dark-700 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <CategoryIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Lines</h2>
                  {generationService && user && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      generationService === 'api' 
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300'
                    }`}>
                      {generationService === 'api' ? '🤖 AI-Powered' : '✨ Smart Fallback'}
                    </span>
                  )}
                </div>
                
                {generatedLines.length > 0 && user && (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyAll}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 hover:bg-accent-200 dark:hover:bg-accent-900/50 transition-colors duration-200 text-sm font-medium"
                    >
                      {allCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy All</span>
                        </>
                      )}
                    </motion.button>
                    
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-900/50 transition-colors duration-200 text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                        <ChevronDown className="h-4 w-4" />
                      </motion.button>
                      
                      <AnimatePresence>
                        {showExportMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-xl shadow-large border border-gray-200 dark:border-dark-600 overflow-hidden z-10"
                          >
                            <button
                              onClick={() => handleExport('txt')}
                              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors text-left"
                            >
                              <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                              <span className="text-sm text-gray-700 dark:text-gray-200">Export as TXT</span>
                            </button>
                            <button
                              onClick={() => handleExport('json')}
                              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors text-left"
                            >
                              <FileJson className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                              <span className="text-sm text-gray-700 dark:text-gray-200">Export as JSON</span>
                            </button>
                            <button
                              onClick={() => handleExport('csv')}
                              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors text-left"
                            >
                              <Table className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                              <span className="text-sm text-gray-700 dark:text-gray-200">Export as CSV</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-danger-500" />
                        <span className="text-sm text-danger-700 dark:text-danger-300">
                          {error}
                        </span>
                      </div>
                    </motion.div>
                  ) : isGenerating ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
                        <Sparkles className="h-8 w-8 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg font-medium">Creating genius lines...</p>
                    </motion.div>
                  ) : generatedLines.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {generatedLines.map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-dark-700 dark:to-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-medium transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-gray-900 dark:text-white text-lg font-medium leading-relaxed flex-1 pr-4">
                              "{line}"
                            </p>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => copyToClipboard(line, index)}
                                className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 hover:bg-accent-200 dark:hover:bg-accent-900/50 transition-colors duration-200"
                                title="Copy"
                              >
                                {copiedIndex === index ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </motion.button>
                              
                              {user && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleSaveLine(line, index)}
                                  className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-900/50 transition-colors duration-200"
                                  title="Save"
                                >
                                  {savedIndex === index ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </motion.button>
                              )}
                            </div>
                          </div>
                          
                          {!user && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                              <button
                                onClick={() => navigate('/auth')}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center space-x-1"
                              >
                                <Lock className="h-3 w-3" />
                                <span>Sign in to save and export</span>
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="bg-gradient-primary p-6 rounded-full mb-6">
                        <Sparkles className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Ready to Create Magic?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                        Select your category and tone, then click "Generate Lines" to create amazing content!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 shadow-soft">
            <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Generate creative lines in seconds with our advanced AI technology
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 shadow-soft">
            <div className="bg-gradient-secondary p-3 rounded-lg w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multiple Formats
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Export your lines in TXT, JSON, or CSV format for any use case
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 shadow-soft">
            <div className="bg-gradient-accent p-3 rounded-lg w-fit mb-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Save Favorites
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Keep your best lines organized and accessible anytime, anywhere
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
