import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import { 
  Sparkles, 
  Github, 
  Twitter, 
  Youtube, 
  Mail, 
  Heart,
  Code,
  Laugh,
  Video
} from 'lucide-react';
import { sendEmail, SUBSCRIPTION_TEMPLATE_ID } from '../components/MailService'; // Import SUBSCRIPTION_TEMPLATE_ID

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Lines-Genius/.githbub', label: 'GitHub' },
    { icon: Youtube, href: 'https://www.youtube.com/@LinesGenius', label: 'YouTube' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Generate Lines', href: '/generate' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const features = [
    { icon: Video, label: 'Programming Videos' },
    { icon: Laugh, label: 'Coding Humor' },
    { icon: Code, label: 'Project Showcases' },
    { icon: Sparkles, label: 'Creative Lines' },
  ];

  // State for email subscription
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle subscription form submission
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Prepare data for EmailJS subscription template
    const subscriptionData = {
      subscriber_email: email,
      subscription_date: new Date().toISOString(),
      to_email: email // Dynamic recipient set to the user's input email
    };

    try {
      console.log('Attempting to use subscription template:', SUBSCRIPTION_TEMPLATE_ID); // Debug log
      const result = await sendEmail(subscriptionData, SUBSCRIPTION_TEMPLATE_ID);
      if (result.success) {
        setIsSubscribed(true);
        setEmail(''); // Clear the input
        setTimeout(() => setIsSubscribed(false), 3000); // Hide success message after 3 seconds
      } else {
        const errorMsg = (result.error && typeof result.error === 'object' && 'message' in result.error)
          ? (result.error as { message?: string }).message
          : 'Unknown error occurred. Check console for details.';
        setError(`Failed to subscribe: ${errorMsg}`);
        console.error('Subscription error:', result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Check console for details.');
      console.error('Subscription error:', err);
    }

    setIsSubmitting(false);
  };

  return (
    <footer className="bg-gradient-to-br from-white/5 to-gray-50/5 dark:from-dark-900/50 dark:to-dark-800/50 backdrop-blur-lg border-t border-white/20 dark:border-neon-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan">
                <img
                  src={logo}
                  alt="Lines Genius Logo"
                  className="w-10 h-10 object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  Lines Genius
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  🎥💻 Code • Create • Laugh
                </p>
              </div>
            </motion.div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Blending creativity, programming, and humor to make coding exciting and accessible for everyone. 
              Generate creative lines, watch educational content, and enjoy coding jokes!
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <feature.icon className="h-4 w-4 text-neon-cyan" />
                  <span>{feature.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-2 rounded-lg bg-white/10 dark:bg-dark-700/50 text-gray-600 dark:text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/20 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-neon-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Get the latest programming tips, creative content, and coding humor delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                disabled={isSubmitting || isSubscribed}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isSubscribed}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </motion.button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {isSubscribed && <p className="text-green-500 text-sm">Thank you for subscribing!</p>}
            </form>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/20 dark:border-neon-purple/20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
              <span>© {currentYear} Lines Genius. Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for developers worldwide</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};