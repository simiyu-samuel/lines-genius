import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg 
        transition-all duration-200 
        backdrop-blur-sm 
        border border-white/20 
        hover:shadow-lg 
        ${theme === 'dark' 
          ? 'bg-gradient-to-r from-neon-purple/30 to-neon-cyan/30 dark:border-neon-purple/30 hover:shadow-neon-purple/25'
          : 'bg-gradient-to-r from-[#ff6ec4]/30 to-[#08f7fe]/30 hover:shadow-[#ff6ec4]/30'
        }`}

    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-neon-purple" />
        ) : (
          <Sun className="h-5 w-5 text-[#ff6ec4]" />
        )}
      </motion.div>
    </motion.button>
  );
};