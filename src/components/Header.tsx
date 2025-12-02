import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  X,
  CreditCard,
  Users,
  GraduationCap,
  Code,
  ChevronDown
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const mainNavigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/generate', label: 'Generate', icon: Zap },
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const servicesItems = [
    { path: '/courses', label: 'Courses', icon: GraduationCap, description: 'Learn new skills' },
    { path: '/community', label: 'Community', icon: Users, description: 'Join our network' },
    { path: '/pricing', label: 'Pricing', icon: CreditCard, description: 'Choose your plan' },
    { path: '/api-docs', label: 'API', icon: Code, description: 'Developer tools' },
  ];

  const userNavigationItems = isAuthenticated 
    ? [{ path: '/saved', label: 'Saved Lines', icon: BookOpen }]
    : [];

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setShowServicesDropdown(false);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-dark-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50 shadow-soft"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg bg-gradient-primary w-10 h-10 flex items-center justify-center"
            >
              <img
                src={logo}
                alt="Lines Genius Logo"
                className="w-8 h-8 object-contain"
              />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-600 bg-clip-text text-transparent">
                Lines Genius
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                🎥💻 Code • Create • Laugh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Main Navigation */}
            {mainNavigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-primary-600 dark:text-primary-400 border border-neon-cyan/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-primary-600 dark:text-primary-400 hover:bg-white/10 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowServicesDropdown(true)}
              onMouseLeave={() => setShowServicesDropdown(false)}
            >
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  servicesItems.some(item => isActive(item.path))
                    ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-primary-600 dark:text-primary-400 border border-neon-cyan/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-primary-600 dark:text-primary-400 hover:bg-white/10 dark:hover:bg-white/5'
                }`}
              >
                <span className="font-medium">Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showServicesDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showServicesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white/95 dark:bg-dark-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 py-2 z-50"
                  >
                    {servicesItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors duration-200 ${
                          isActive(item.path) ? 'bg-neon-purple/10 text-secondary-600 dark:text-secondary-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive(item.path) ? 'bg-neon-purple/20' : 'bg-gray-100 dark:bg-dark-700'}`}>
                          <item.icon className={`h-4 w-4 ${isActive(item.path) ? 'text-secondary-600 dark:text-secondary-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        </div>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Navigation */}
            {userNavigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-primary-600 dark:text-primary-400 border border-neon-cyan/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-primary-600 dark:text-primary-400 hover:bg-white/10 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-white/20 dark:border-primary-300 dark:border-primary-700 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-neon-purple/25"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-dark-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-neon-purple/20">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/saved"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Saved Lines</span>
                      </Link>
                      
                      <Link
                        to="/pricing"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Subscription</span>
                      </Link>
                      
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
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-600 text-white font-medium hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-primary-600 dark:text-primary-400 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
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
              className="lg:hidden border-t border-gray-200 dark:border-dark-700 py-4"
            >
              <nav className="flex flex-col space-y-2">
                {/* Main Navigation */}
                {mainNavigationItems.map(({ path, label, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => handleNavigation(path)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-primary-600 dark:text-primary-400 border border-neon-cyan/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-primary-600 dark:text-primary-400 hover:bg-white/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}

                {/* Services */}
                <div className="px-4 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Services
                  </div>
                  {servicesItems.map(({ path, label, icon: Icon }) => (
                    <button
                      key={path}
                      onClick={() => handleNavigation(path)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left w-full ${
                        isActive(path)
                          ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-primary-600 dark:text-primary-400 border border-neon-cyan/30'
                          : 'text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-primary-600 dark:text-primary-400 hover:bg-white/10 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* User Navigation */}
                {userNavigationItems.map(({ path, label, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => handleNavigation(path)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-primary-600 dark:text-primary-400 border border-neon-cyan/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-primary-600 dark:text-primary-400 hover:bg-white/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};