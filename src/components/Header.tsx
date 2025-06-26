import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/logo.png';
import {
  Home, 
  Zap, 
  BookOpen, 
  Info, 
  Mail, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/generate', label: 'Generate', icon: Zap },
    ...(isAuthenticated ? [{ path: '/saved', label: 'Saved', icon: BookOpen }] : []),
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 dark:bg-dark-900/90 backdrop-blur-lg border-b border-white/20 dark:border-neon-purple/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan w-10 h-10"
            >
              <img
                src={logo}
                alt="Lines Genius Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                Lines Genius
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                🎥💻 Code • Create • Laugh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan hover:bg-white/10 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-white/20 dark:border-neon-purple/30 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-neon-purple/25"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                    {user?.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-dark-800/90 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 dark:border-neon-purple/20 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-neon-purple/20">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-white/20 dark:border-neon-purple/20 py-4"
            >
              <nav className="flex flex-col space-y-2">
                {navigationItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan hover:bg-white/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};