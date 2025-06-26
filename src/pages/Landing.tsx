import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  MessageCircle, 
  Camera, 
  Quote, 
  Megaphone, 
  Mic,
  ArrowRight,
  Zap
} from 'lucide-react';

const categories = [
  {
    id: 'taglines',
    title: 'Business Taglines',
    description: 'Memorable taglines that define your brand',
    icon: Target,
    gradient: 'from-neon-purple to-neon-pink',
    examples: ['Just Do It', 'Think Different', 'Have It Your Way']
  },
  {
    id: 'bios',
    title: 'Social Media Bios',
    description: 'Perfect bios for all your social profiles',
    icon: MessageCircle,
    gradient: 'from-neon-cyan to-neon-green',
    examples: ['Creative • Dreamer • Doer', 'Making magic happen ✨', 'Your daily dose of inspiration']
  },
  {
    id: 'captions',
    title: 'Instagram Captions',
    description: 'Engaging captions for your posts',
    icon: Camera,
    gradient: 'from-neon-pink to-neon-yellow',
    examples: ['Living my best life', 'Mood: Unstoppable', 'Creating memories one click at a time']
  },
  {
    id: 'quotes',
    title: 'Inspirational Quotes',
    description: 'Motivational quotes that inspire action',
    icon: Quote,
    gradient: 'from-neon-green to-neon-cyan',
    examples: ['Be the change you wish to see', 'Dream big, work hard', 'Success is a journey, not a destination']
  },
  {
    id: 'slogans',
    title: 'Marketing Slogans',
    description: 'Catchy slogans for your campaigns',
    icon: Megaphone,
    gradient: 'from-neon-yellow to-neon-purple',
    examples: ['Quality you can trust', 'Innovation at its finest', 'Where dreams come true']
  },
  {
    id: 'adlines',
    title: 'Ad Lines & Jingles',
    description: 'Memorable advertising lines',
    icon: Mic,
    gradient: 'from-neon-purple to-neon-cyan',
    examples: ['Get ready to be amazed', 'The best just got better', 'Experience the difference']
  }
];

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                background: [
                  'linear-gradient(45deg, #8b5cf6, #00ffff)',
                  'linear-gradient(45deg, #ff0080, #8b5cf6)',
                  'linear-gradient(45deg, #00ffff, #00ff88)',
                  'linear-gradient(45deg, #8b5cf6, #00ffff)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 blur-3xl opacity-20 rounded-full"
            />
            <h1 className="relative text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green bg-clip-text text-transparent">
                Lines Genius
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate creative, engaging lines for any purpose. From business taglines to social media captions, 
              we've got your creativity covered.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/generate"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
              >
                <Zap className="h-6 w-6 group-hover:animate-pulse" />
                <span>Generate Genius Lines</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Choose Your Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select from our diverse range of creative line categories, each tailored for specific use cases.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg"
                     style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                
                <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 transition-all duration-300 group-hover:border-neon-cyan/50 group-hover:shadow-xl group-hover:shadow-neon-purple/10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} mb-6 group-hover:animate-pulse`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-neon-cyan transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {category.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Examples:</p>
                    {category.examples.map((example, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="text-sm text-gray-700 dark:text-gray-300 italic"
                      >
                        "{example}"
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-dark-900/50 dark:to-dark-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Why Lines Genius?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  icon: Sparkles,
                  title: 'AI-Powered',
                  description: 'Advanced AI generates unique, creative lines tailored to your needs'
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description: 'Get multiple creative options in seconds, not hours'
                },
                {
                  icon: Target,
                  title: 'Targeted Results',
                  description: 'Customizable tones and styles for your specific audience'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};