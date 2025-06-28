import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star,
  Award,
  Filter,
  Search,
  ArrowRight,
  Code,
  Palette,
  Zap,
  Target,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Programming' | 'Design' | 'Marketing' | 'Business';
  thumbnail: string;
  features: string[];
}

export const Courses: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);

  const courses: Course[] = [
    {
      id: '1',
      title: 'React Mastery: Build Modern Web Applications',
      description: 'Master React from basics to advanced concepts including hooks, context, and performance optimization.',
      instructor: 'Samuel Simiyu',
      duration: '12 hours',
      students: 2847,
      rating: 4.9,
      price: 199,
      level: 'Intermediate',
      category: 'Programming',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500',
      features: ['Lifetime access', 'Certificate of completion', 'Source code included', '24/7 support']
    },
    {
      id: '2',
      title: 'AI-Powered Content Creation Strategies',
      description: 'Learn how to leverage AI tools for creating engaging content that converts and builds your brand.',
      instructor: 'Wambia O. Kennedy',
      duration: '8 hours',
      students: 1923,
      rating: 4.8,
      price: 149,
      level: 'Beginner',
      category: 'Marketing',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500',
      features: ['AI tools access', 'Templates included', 'Live Q&A sessions', 'Community access']
    },
    {
      id: '3',
      title: 'Full-Stack JavaScript Development',
      description: 'Complete guide to building full-stack applications with Node.js, Express, React, and MongoDB.',
      instructor: 'Samuel Simiyu',
      duration: '20 hours',
      students: 3456,
      rating: 4.9,
      price: 299,
      level: 'Advanced',
      category: 'Programming',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=500',
      features: ['3 real projects', 'Deployment guide', 'Code reviews', 'Job interview prep']
    },
    {
      id: '4',
      title: 'UI/UX Design for Developers',
      description: 'Bridge the gap between design and development with practical UI/UX principles and tools.',
      instructor: 'Wambia O. Kennedy',
      duration: '10 hours',
      students: 1567,
      rating: 4.7,
      price: 179,
      level: 'Intermediate',
      category: 'Design',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=500',
      features: ['Figma templates', 'Design system', 'Portfolio projects', 'Feedback sessions']
    },
    {
      id: '5',
      title: 'Building a SaaS Business from Scratch',
      description: 'Complete blueprint for launching and scaling a profitable SaaS business in 2025.',
      instructor: 'Samuel Simiyu',
      duration: '15 hours',
      students: 892,
      rating: 4.8,
      price: 399,
      level: 'Advanced',
      category: 'Business',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500',
      features: ['Business plan template', 'Legal documents', 'Marketing strategies', '1-on-1 mentoring']
    },
    {
      id: '6',
      title: 'Python for Beginners: From Zero to Hero',
      description: 'Start your programming journey with Python. Perfect for complete beginners.',
      instructor: 'Wambia O. Kennedy',
      duration: '14 hours',
      students: 4123,
      rating: 4.9,
      price: 99,
      level: 'Beginner',
      category: 'Programming',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=500',
      features: ['Interactive exercises', 'Project-based learning', 'Beginner-friendly', 'Career guidance']
    }
  ];

  const categories = ['all', 'Programming', 'Design', 'Marketing', 'Business'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming': return Code;
      case 'Design': return Palette;
      case 'Marketing': return Target;
      case 'Business': return Zap;
      default: return BookOpen;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleEnrollment = async (courseId: string) => {
    if (!isAuthenticated) {
      // Redirect to auth
      window.location.href = '/auth';
      return;
    }

    setEnrollingCourse(courseId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setEnrolledCourses(prev => [...prev, courseId]);
    setEnrollingCourse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Premium Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Level up your skills with our comprehensive courses taught by industry experts. 
            From programming to business, we've got you covered.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-neon-purple/20 shadow-xl mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              {filteredCourses.length} of {courses.length} courses
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => {
            const CategoryIcon = getCategoryIcon(course.category);
            const isEnrolled = enrolledCourses.includes(course.id);
            const isEnrolling = enrollingCourse === course.id;
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 dark:border-neon-purple/20 shadow-xl hover:shadow-2xl hover:shadow-neon-purple/10 transition-all duration-300 hover:border-neon-cyan/50"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full p-2">
                      <CategoryIcon className="h-5 w-5 text-neon-purple" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neon-purple font-medium">{course.category}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-neon-cyan transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {course.features.slice(0, 2).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                        <Award className="h-3 w-3 text-neon-cyan" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${course.price}
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEnrollment(course.id)}
                      disabled={isEnrolling || isEnrolled}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isEnrolled
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-purple/25'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isEnrolling ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Enrolling...</span>
                        </>
                      ) : isEnrolled ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Enrolled</span>
                        </>
                      ) : (
                        <>
                          <span>Enroll</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-2xl p-8 text-center border border-neon-purple/30"
        >
          <BookOpen className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            We're constantly adding new courses based on community feedback. 
            Let us know what you'd like to learn next!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <Link
                to="/auth"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
              >
                <BookOpen className="h-5 w-5" />
                <span>Sign Up to Enroll</span>
              </Link>
            )}
            
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-white/20 dark:bg-dark-700/50 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold border border-gray-300 dark:border-neon-purple/30 hover:bg-white/30 dark:hover:bg-dark-600/50 transition-all duration-300"
            >
              <span>Request a Course</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};