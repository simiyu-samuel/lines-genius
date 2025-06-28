import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Video, 
  BookOpen, 
  Award,
  Calendar,
  Star,
  ArrowRight,
  Crown,
  Zap,
  Heart,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Community: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinedTier, setJoinedTier] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const communityFeatures = [
    {
      icon: MessageCircle,
      title: 'Exclusive Discord',
      description: 'Join our private Discord community with 1000+ creators and developers',
      gradient: 'from-neon-purple to-neon-pink'
    },
    {
      icon: Video,
      title: 'Live Workshops',
      description: 'Weekly live coding sessions and creative workshops with industry experts',
      gradient: 'from-neon-cyan to-neon-green'
    },
    {
      icon: BookOpen,
      title: 'Premium Courses',
      description: 'Access to exclusive programming courses and creative content strategies',
      gradient: 'from-neon-pink to-neon-yellow'
    },
    {
      icon: Award,
      title: 'Certification Programs',
      description: 'Earn verified certificates in programming and content creation',
      gradient: 'from-neon-green to-neon-cyan'
    }
  ];

  const membershipTiers = [
    {
      id: 'community',
      name: 'Community',
      price: 19.99,
      icon: Users,
      features: [
        'Exclusive Discord access',
        'Weekly live Q&A sessions',
        'Community challenges',
        'Early access to content',
        'Member-only resources'
      ],
      gradient: 'from-neon-purple to-neon-cyan'
    },
    {
      id: 'mastermind',
      name: 'Mastermind',
      price: 497,
      icon: Crown,
      popular: true,
      features: [
        'Everything in Community',
        'Small group mentoring (max 10 people)',
        'Monthly 1-on-1 sessions',
        'Direct access to founders',
        'Business strategy guidance',
        'Revenue sharing opportunities'
      ],
      gradient: 'from-neon-cyan to-neon-green'
    }
  ];

  const upcomingEvents = [
    {
      id: 'react-masterclass',
      title: 'React Masterclass: Building Modern UIs',
      date: 'March 15, 2025',
      time: '2:00 PM EST',
      type: 'Workshop',
      price: 49,
      spots: 25
    },
    {
      id: 'content-creation',
      title: 'Content Creation for Developers',
      date: 'March 22, 2025',
      time: '1:00 PM EST',
      type: 'Live Session',
      price: 25,
      spots: 50
    },
    {
      id: 'ai-marketing',
      title: 'AI-Powered Marketing Strategies',
      date: 'March 29, 2025',
      time: '3:00 PM EST',
      type: 'Masterclass',
      price: 75,
      spots: 15
    }
  ];

  const handleJoinCommunity = async (tierId: string) => {
    if (!isAuthenticated) {
      // Redirect to auth
      window.location.href = '/auth';
      return;
    }

    setSelectedTier(tierId);
    setIsJoining(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setJoinedTier(tierId);
    setIsJoining(false);
    setSelectedTier(null);

    // Reset after 3 seconds
    setTimeout(() => setJoinedTier(null), 3000);
  };

  const handleEventRegistration = async (eventId: string) => {
    if (!isAuthenticated) {
      // Redirect to auth
      window.location.href = '/auth';
      return;
    }

    setSelectedEvent(eventId);
    setIsRegistering(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setRegisteredEvents(prev => [...prev, eventId]);
    setIsRegistering(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Join Our Community
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with like-minded creators, learn from industry experts, and grow your skills 
            in our exclusive community of developers and content creators.
          </p>
        </motion.div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {communityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-neon-purple/20 shadow-xl hover:shadow-2xl hover:shadow-neon-purple/10 transition-all duration-300 text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} mb-4 group-hover:animate-pulse`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Membership Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Membership Tiers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {membershipTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className={`relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl ${
                  tier.popular 
                    ? 'border-neon-purple/50 shadow-xl shadow-neon-purple/10 scale-105' 
                    : 'border-white/20 dark:border-neon-purple/20 hover:border-neon-cyan/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tier.gradient} mb-4`}>
                    <tier.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      /month
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-neon-pink flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJoinCommunity(tier.id)}
                  disabled={isJoining && selectedTier === tier.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    joinedTier === tier.id
                      ? 'bg-green-500 text-white'
                      : tier.popular
                      ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg hover:shadow-xl hover:shadow-neon-purple/25'
                      : 'bg-white/20 dark:bg-dark-700/50 text-gray-900 dark:text-white border border-gray-300 dark:border-neon-purple/30 hover:bg-white/30 dark:hover:bg-dark-600/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isJoining && selectedTier === tier.id ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : joinedTier === tier.id ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Joined!</span>
                    </>
                  ) : (
                    <>
                      <span>Join {tier.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-neon-purple/20 shadow-xl hover:shadow-2xl hover:shadow-neon-purple/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-neon-purple/20 text-neon-purple">
                    {event.type}
                  </span>
                  <span className="text-lg font-bold text-neon-cyan">
                    ${event.price}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Zap className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4" />
                    <span>{event.spots} spots available</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEventRegistration(event.id)}
                  disabled={isRegistering && selectedEvent === event.id}
                  className={`w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    registeredEvents.includes(event.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-purple/25'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isRegistering && selectedEvent === event.id ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : registeredEvents.includes(event.id) ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <span>Register Now</span>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-2xl p-8 text-center border border-neon-purple/30"
        >
          <Users className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Level Up Your Skills?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and developers who are already part of our thriving community. 
            Start your journey today and unlock your creative potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
              >
                <Users className="h-5 w-5" />
                <span>Sign Up to Join</span>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleJoinCommunity('community')}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
              >
                <Users className="h-5 w-5" />
                <span>Join Community</span>
              </motion.button>
            )}
            
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-white/20 dark:bg-dark-700/50 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold border border-gray-300 dark:border-neon-purple/30 hover:bg-white/30 dark:hover:bg-dark-600/50 transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Learn More</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};