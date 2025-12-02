import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Zap,
  Star,
  TrendingUp,
  Users,
  Shield,
  Rocket,
  CheckCircle,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const categories = [
  {
    id: 'taglines',
    title: 'Business Taglines',
    description: 'Memorable taglines that define your brand',
    icon: Target,
    gradient: 'from-primary-500 to-primary-600',
    examples: ['Just Do It', 'Think Different', 'Have It Your Way']
  },
  {
    id: 'bios',
    title: 'Social Media Bios',
    description: 'Perfect bios for all your social profiles',
    icon: MessageCircle,
    gradient: 'from-secondary-500 to-secondary-600',
    examples: ['Creative • Dreamer • Doer', 'Making magic happen ✨']
  },
  {
    id: 'captions',
    title: 'Instagram Captions',
    description: 'Engaging captions for your posts',
    icon: Camera,
    gradient: 'from-accent-500 to-accent-600',
    examples: ['Living my best life', 'Mood: Unstoppable']
  },
  {
    id: 'quotes',
    title: 'Inspirational Quotes',
    description: 'Motivational quotes that inspire action',
    icon: Quote,
    gradient: 'from-success-500 to-success-600',
    examples: ['Be the change', 'Dream big, work hard']
  },
  {
    id: 'slogans',
    title: 'Marketing Slogans',
    description: 'Catchy slogans that sell',
    icon: Megaphone,
    gradient: 'from-warning-500 to-warning-600',
    examples: ['Quality you can trust', 'Innovation at its finest']
  },
  {
    id: 'adlines',
    title: 'Ad Lines & Jingles',
    description: 'Memorable advertising lines',
    icon: Mic,
    gradient: 'from-danger-500 to-danger-600',
    examples: ['Get ready to be amazed', 'The best just got better']
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate creative lines in seconds with advanced AI',
    color: 'primary'
  },
  {
    icon: Star,
    title: 'High Quality',
    description: 'Professional-grade content powered by GPT-3.5',
    color: 'secondary'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared',
    color: 'accent'
  },
  {
    icon: TrendingUp,
    title: 'Always Improving',
    description: 'Regular updates with new features and improvements',
    color: 'success'
  },
];

const stats = [
  { value: '10K+', label: 'Lines Generated' },
  { value: '500+', label: 'Happy Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-full mb-6"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Creative Line Generator
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate stunning taglines, bios, captions, and more in seconds. 
              Powered by advanced AI technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? '/generate' : '/auth')}
                className="btn-primary flex items-center space-x-2 text-lg"
              >
                <Rocket className="h-5 w-5" />
                <span>{user ? 'Start Generating' : 'Get Started Free'}</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/pricing')}
                className="btn-outline text-lg"
              >
                View Pricing
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                What Can You Create?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from multiple categories to generate the perfect content for your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card card-hover p-6 cursor-pointer group"
                  onClick={() => navigate('/generate')}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.gradient} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="space-y-2">
                    {category.examples.map((example, i) => (
                      <div key={i} className="text-sm text-gray-500 dark:text-gray-400 italic">
                        "{example}"
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Try it now</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Why Choose Lines Genius?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make content creation effortless
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className={`inline-flex p-4 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900/30 mb-4`}>
                    <Icon className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="h-16 w-16 text-white mx-auto mb-6" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Amazing Content?
            </h2>
            
            <p className="text-xl text-white/90 mb-8">
              Join thousands of creators who trust Lines Genius for their content needs
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? '/generate' : '/auth')}
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold shadow-large hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>{user ? 'Start Creating' : 'Sign Up Free'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/pricing')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
              >
                View Plans
              </motion.button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Free forever plan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
