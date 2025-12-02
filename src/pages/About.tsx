import React from 'react';
import { motion } from 'framer-motion';
import nasri from '../assets/images/nasri.jpg';
import wambia from '../assets/images/wambia.jpg';
import { 
  Code, 
  Video, 
  Laugh, 
  Users, 
  Target, 
  Sparkles,
  Play,
  BookOpen,
  Lightbulb,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const features = [
    {
      icon: Video,
      title: 'Programming Videos',
      description: 'Educational and entertaining content for developers of all levels. From beginner tutorials to advanced concepts.',
      gradient: 'from-primary-500 to-secondary-600'
    },
    {
      icon: Laugh,
      title: 'Coding Humor',
      description: 'Light-hearted jokes and memes to brighten your coding sessions and make programming more enjoyable.',
      gradient: 'from-accent-500 to-success-600'
    },
    {
      icon: Code,
      title: 'Project Showcases',
      description: 'Showcasing creative and practical programming projects that inspire and teach real-world development.',
      gradient: 'from-secondary-500 to-warning-600'
    },
    {
      icon: Sparkles,
      title: 'Creative Lines Generator',
      description: 'AI-powered tool to generate creative lines for business taglines, social media, and marketing content.',
      gradient: 'from-success-500 to-accent-600'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Developers Reached' },
    { number: '500+', label: 'Videos Created' },
    { number: '50K+', label: 'Lines Generated' },
    { number: '100+', label: 'Projects Showcased' }
  ];

  const team = [
    {
      name: 'Samuel Simiyu',
      role: 'Founder & Lead Developer',
      bio: 'Full-stack developer blending code, creativity, and AI to build next-gen tools that spark innovation for creators and devs.',
      avatar: nasri
    },
    {
      name: 'Wambia O. Kennedy',
      role: 'Frontend Developer & Content Creator',
      bio: 'Passionate frontend developer and creative educator who crafts visually stunning interfaces and produces fun, insightful programming videos that inspire our community.',
      avatar: wambia
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              About Lines Genius
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              🎥💻 Where creativity meets code. We blend programming education, humor, and innovation 
              to make the developer journey exciting and accessible for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-xl mb-16"
          >
            <div className="text-center mb-8">
              <Target className="h-12 w-12 text-neon-cyan mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-neon-purple mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Educate</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Provide high-quality programming education that's both comprehensive and engaging.
                </p>
              </div>
              
              <div className="text-center">
                <Heart className="h-8 w-8 text-neon-pink mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Inspire</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Showcase amazing projects and creative solutions that inspire developers to build more.
                </p>
              </div>
              
              <div className="text-center">
                <Users className="h-8 w-8 text-neon-green mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build a supportive community where developers can learn, share, and grow together.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-xl hover:shadow-2xl hover:shadow-neon-purple/10 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 group-hover:animate-pulse`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-neon-cyan transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-2xl p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Our Impact
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-neon-purple/20 shadow-xl text-center hover:shadow-2xl hover:shadow-neon-purple/10 transition-all duration-300"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={`${member.name} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-neon-purple font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-2xl p-8 border border-neon-purple/30">
            <Lightbulb className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Start your journey with Lines Genius today. Generate creative content, 
              learn new skills, and connect with fellow developers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/generate"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Lines</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 bg-white/20 dark:bg-dark-700/50 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-neon-purple/30 hover:bg-white/30 dark:hover:bg-dark-600/50 transition-all duration-300"
                >
                  <Users className="h-5 w-5" />
                  <span>Get in Touch</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};