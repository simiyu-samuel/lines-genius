import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Copy, 
  Save, 
  Sparkles, 
  Settings,
  RefreshCw,
  CheckCircle,
  Crown,
  Lock,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { generateLines } from '../services/openaiService';
import { generateLinesFallback } from '../utils/mockAI';
import { useSavedLines } from '../context/SavedLinesContext';
import { useSubscription } from '../context/SubscriptionContext';
import { UsageIndicator } from '../components/UsageIndicator';
import { Link } from 'react-router-dom';

const categories = [
  { value: 'taglines', label: 'Business Taglines' },
  { value: 'bios', label: 'Social Media Bios' },
  { value: 'captions', label: 'Instagram Captions' },
  { value: 'quotes', label: 'Inspirational Quotes' },
  { value: 'slogans', label: 'Marketing Slogans' },
  { value: 'adlines', label: 'Ad Lines & Jingles' },
];

const tones = [
  { value: 'funny', label: 'Funny' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'bold', label: 'Bold' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'motivational', label: 'Motivational' },
];

export const Generator: React.FC = () => {
  const [category, setCategory] = useState('taglines');
  const [tone, setTone] = useState('corporate');
  const [prompt, setPrompt] = useState('');
  const [generatedLines, setGeneratedLines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  
  const { saveLine } = useSavedLines();
  const { 
    currentPlan, 
    canGenerate, 
    upgradeRequired, 
    incrementUsage, 
    hasFeature 
  } = useSubscription();

  const handleGenerate = async () => {
    if (isGenerating || !canGenerate) return;
    
    setIsGenerating(true);
    setGeneratedLines([]);
    setError(null);
    setUsingFallback(false);
    
    try {
      // Try OpenAI first
      const response = await generateLines({ 
        category, 
        tone, 
        prompt: hasFeature('customPrompts') ? prompt : '',
        count: 4 
      });
      
      setGeneratedLines(response.lines);
      incrementUsage();
      
    } catch (openaiError) {
      console.warn('OpenAI failed, falling back to mock AI:', openaiError);
      
      try {
        // Fallback to mock AI
        setUsingFallback(true);
        const fallbackLines = await generateLinesFallback({ 
          category, 
          tone, 
          prompt: hasFeature('customPrompts') ? prompt : '' 
        });
        
        setGeneratedLines(fallbackLines);
        incrementUsage();
        
      } catch (fallbackError) {
        console.error('Both OpenAI and fallback failed:', fallbackError);
        setError('Failed to generate lines. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
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

  const handleSaveLine = (text: string, index: number) => {
    saveLine({
      text,
      category,
      tone,
    });
    setSavedIndex(index);
    setTimeout(() => setSavedIndex(null), 2000);
  };

  const isFeatureRestricted = (feature: string) => {
    switch (feature) {
      case 'customPrompts':
        return !hasFeature('customPrompts');
      case 'advancedTones':
        return !currentPlan.limits.tones.includes(tone);
      case 'advancedCategories':
        return !currentPlan.limits.categories.includes(category);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Generate Creative Lines
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powered by AI to create amazing lines for your needs. Customize your preferences below.
          </p>
          
          {/* AI Status Indicator */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            {usingFallback ? (
              <>
                <WifiOff className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  Using offline mode
                </span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  AI-powered generation
                </span>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-xl"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="h-6 w-6 text-neon-purple" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuration</h2>
            </div>

            {/* Usage Indicator */}
            <div className="mb-6">
              <UsageIndicator />
            </div>

            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isFeatureRestricted('advancedCategories')}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {categories.map((cat) => (
                      <option 
                        key={cat.value} 
                        value={cat.value}
                        disabled={!currentPlan.limits.categories.includes(cat.value)}
                      >
                        {cat.label} {!currentPlan.limits.categories.includes(cat.value) ? '(Pro)' : ''}
                      </option>
                    ))}
                  </select>
                  {isFeatureRestricted('advancedCategories') && (
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((toneOption) => {
                    const isRestricted = !currentPlan.limits.tones.includes(toneOption.value);
                    return (
                      <button
                        key={toneOption.value}
                        onClick={() => !isRestricted && setTone(toneOption.value)}
                        disabled={isRestricted}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                          tone === toneOption.value
                            ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg'
                            : isRestricted
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'bg-white/50 dark:bg-dark-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-dark-600/50 border border-gray-200 dark:border-neon-purple/20'
                        }`}
                      >
                        {toneOption.label}
                        {isRestricted && (
                          <Crown className="absolute top-1 right-1 h-3 w-3 text-neon-purple" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Prompt {!hasFeature('customPrompts') && '(Pro Feature)'}
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={hasFeature('customPrompts') 
                      ? "Add any specific requirements, product details, or keywords..."
                      : "Upgrade to Pro to use custom prompts..."
                    }
                    rows={4}
                    disabled={!hasFeature('customPrompts')}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {!hasFeature('customPrompts') && (
                    <Lock className="absolute top-3 right-3 h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Generate Button */}
              {upgradeRequired ? (
                <Link
                  to="/pricing"
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-6 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25 flex items-center justify-center space-x-2"
                >
                  <Crown className="h-5 w-5" />
                  <span>Upgrade to Continue</span>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !canGenerate}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-6 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Generate Lines</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-xl"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-neon-cyan" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Lines</h2>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </span>
                    </div>
                  </motion.div>
                ) : isGenerating ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-12"
                  >
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-300">Creating genius lines...</p>
                    </div>
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
                        className="group relative bg-white/50 dark:bg-dark-700/50 rounded-lg p-4 border border-gray-200 dark:border-neon-purple/20 hover:border-neon-cyan/50 transition-all duration-200 hover:shadow-lg hover:shadow-neon-purple/10"
                      >
                        <p className="text-gray-900 dark:text-white mb-3 font-medium leading-relaxed">
                          "{line}"
                        </p>
                        
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard(line, index)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-md bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors duration-200 text-sm font-medium"
                          >
                            {copiedIndex === index ? (
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
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSaveLine(line, index)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-md bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 transition-colors duration-200 text-sm font-medium"
                          >
                            {savedIndex === index ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Saved!</span>
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                <span>Save</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Sparkles className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Click "Generate Lines" to create amazing content!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* OpenAI Setup Instructions */}
        {!import.meta.env.VITE_OPENAI_API_KEY && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Setup OpenAI Integration
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  To enable AI-powered line generation, add your OpenAI API key to the environment variables.
                </p>
                <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3 font-mono text-sm">
                  <p className="text-blue-900 dark:text-blue-200">
                    VITE_OPENAI_API_KEY=your_openai_api_key_here
                  </p>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};