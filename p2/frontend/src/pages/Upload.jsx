import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Video, Mic, Sparkles, Clock, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const Upload = () => {
  const { theme } = useTheme();

  const uploadOptions = [
    {
      id: 'live-interview',
      title: 'Live AI Interview',
      description: 'Practice with our AI interviewer in real-time with instant feedback and comprehensive analysis.',
      icon: Mic,
      emoji: '🤖',
      color: 'blue',
      link: '/live-interview',
      features: [
        'Real-time AI conversation',
        'Instant feedback & scoring',
        'Cross-browser audio support',
        'Session recovery & persistence'
      ],
      badge: 'Recommended',
      gradient: 'from-blue-600 to-cyan-600',
      hoverGradient: 'from-blue-700 to-cyan-700',
      borderColor: 'blue-500/50',
      shadowColor: 'blue-500/20'
    },
    {
      id: 'resume-upload',
      title: 'Resume Analysis',
      description: 'Upload your professional resume to get personalized interview questions tailored to your experience.',
      icon: FileText,
      emoji: '📄',
      color: 'violet',
      link: '/enhanced-resume-upload',
      features: [
        'PDF, DOC, DOCX, TXT support',
        'Max size: 5 MB',
        'Instant text extraction',
        'Personalized questions'
      ],
      gradient: 'from-violet-600 to-purple-600',
      hoverGradient: 'from-violet-700 to-purple-700',
      borderColor: 'violet-500/50',
      shadowColor: 'violet-500/20'
    },
    {
      id: 'video-upload',
      title: 'Video Analysis',
      description: 'Upload your interview recording for comprehensive AI analysis of expressions, speech, and performance.',
      icon: Video,
      emoji: '🎥',
      color: 'indigo',
      link: '/video-upload',
      features: [
        'MP4, WebM, MOV, AVI support',
        'Max size: 100 MB',
        'Facial expression analysis',
        'Speech pattern insights'
      ],
      gradient: 'from-indigo-600 to-blue-600',
      hoverGradient: 'from-indigo-700 to-blue-700',
      borderColor: 'indigo-500/50',
      shadowColor: 'indigo-500/20'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms provide detailed insights into your interview performance'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get comprehensive feedback within minutes of completing your practice session'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is processed securely with enterprise-grade encryption and privacy protection'
    },
    {
      icon: Zap,
      title: 'Continuous Learning',
      description: 'Track your progress over time and see measurable improvements in your interview skills'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link 
              to="/" 
              className={`inline-flex items-center mb-6 transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className={`text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Choose Your Path
            </h1>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Select how you'd like to practice and improve your interview skills with our AI-powered platform
            </p>
          </motion.div>

          {/* Upload Options Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
            {uploadOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Link to={option.link}>
                  <div className={`glass rounded-2xl p-8 border border-surface-border hover:border-${option.borderColor} 
                    transition-all duration-300 h-full cursor-pointer group-hover:shadow-xl 
                    group-hover:shadow-${option.shadowColor} group-hover:-translate-y-2`}>
                    
                    {/* Badge */}
                    {option.badge && (
                      <div className={`absolute -top-3 -right-3 bg-gradient-to-r ${option.gradient} 
                        text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                        {option.badge}
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-${option.color}-500/20 rounded-xl flex items-center justify-center 
                        group-hover:bg-${option.color}-500/30 transition-all duration-300 professional-glow`}>
                        <option.icon className={`w-8 h-8 text-${option.color}-400`} />
                      </div>
                      <span className="text-4xl">{option.emoji}</span>
                    </div>

                    {/* Content */}
                    <h2 className={`text-2xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {option.title}
                    </h2>
                    <p className={`mb-6 leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {option.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {option.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3 text-sm">
                          <span className={`text-${option.color}-400 font-bold`}>✓</span>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className={`inline-flex items-center space-x-2 text-${option.color}-400 font-semibold 
                      group-hover:space-x-3 transition-all duration-300`}>
                      <span>Get Started</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Why Choose Our Platform?
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Experience the future of interview preparation with cutting-edge AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass rounded-xl p-6 border border-surface-border text-center hover:border-blue-500/30 
                    transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 
                    professional-glow">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-8 border border-surface-border text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Ready to Ace Your Next Interview?
              </h3>
              <p className={`text-lg mb-8 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Join thousands of professionals who have improved their interview skills with our AI-powered platform. 
                Start with a live interview session for the most comprehensive experience.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/live-interview"
                    className="px-8 py-4 bg-gradient-accent text-white rounded-xl hover:shadow-xl 
                      transition-all duration-200 font-semibold professional-glow flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Start Live Interview
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/enhanced-resume-upload"
                    className="px-8 py-4 glass glass-hover text-white rounded-xl transition-all 
                      duration-200 font-semibold flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Upload Resume
                  </Link>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-surface-border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">10K+</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Interviews Analyzed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">95%</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Success Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">4.9★</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    User Rating
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
