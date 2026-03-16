import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, TrendingUp, Eye, Mic, CheckCircle } from 'lucide-react';

const EnhancedHeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [eyeContact, setEyeContact] = useState(0);
  const [confidence, setConfidence] = useState(0);
  
  const aiQuestions = [
    "Tell me about your most impactful project...",
    "How do you handle technical challenges?",
    "Describe your leadership experience..."
  ];
  const [questionIndex, setQuestionIndex] = useState(0);

  // Typing animation
  useEffect(() => {
    const question = aiQuestions[questionIndex];
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= question.length) {
        setTypedText(question.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setQuestionIndex((prev) => (prev + 1) % aiQuestions.length);
          setTypedText('');
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [questionIndex]);

  // Score animations
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setCurrentScore((prev) => (prev >= 95 ? 72 : prev + 1));
      setEyeContact((prev) => (prev >= 88 ? 65 : prev + 1));
      setConfidence((prev) => (prev >= 92 ? 78 : prev + 1));
    }, 30);

    return () => clearInterval(scoreInterval);
  }, []);

  const roles = [
    { name: 'Software Engineering', color: 'from-blue-500 to-cyan-500' },
    { name: 'Data Science', color: 'from-purple-500 to-pink-500' },
    { name: 'Product Management', color: 'from-orange-500 to-red-500' },
    { name: 'HR Interviews', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      {/* Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Role Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start"
            >
              {roles.map((role, index) => (
                <motion.span
                  key={role.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full text-xs font-medium text-dark-300 border border-white/10 hover:border-white/20 transition-colors"
                >
                  {role.name}
                </motion.span>
              ))}
            </motion.div>

            {/* Enhanced Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Master Every Interview</span>
              <br />
              <span className="text-white">with </span>
              <span className="bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 bg-clip-text text-transparent">
                AI
              </span>
              <span className="text-white">-Powered Analytics</span>
            </h1>

            <p className="text-xl text-dark-400 mb-10 max-w-[520px] mx-auto lg:mx-0 leading-relaxed">
              Real-time performance tracking, instant feedback, and data-driven insights to transform your interview skills and land your dream role.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/live-interview">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-xl font-semibold text-lg overflow-hidden shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all flex items-center justify-center space-x-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Play className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Start Free Session</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.button>
              </Link>

              <Link to="/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-transparent border-2 border-white/10 hover:border-white/20 hover:bg-white/5 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>View Demo</span>
                </motion.button>
              </Link>
            </div>

            {/* Conversion Microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-dark-400"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-semantic-success" />
                <span>Free first session</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-semantic-success" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-semantic-success" />
                <span>Instant AI feedback</span>
              </div>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                  <div className="text-3xl font-bold text-white">
                    <CountUp end={5000} duration={2} />+
                  </div>
                </div>
                <div className="text-sm text-dark-400">Mock Sessions Completed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-semantic-success" />
                  <div className="text-3xl font-bold text-white">
                    <CountUp end={38} duration={2} />%
                  </div>
                </div>
                <div className="text-sm text-dark-400">Confidence Improvement</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-accent-500" />
                  <div className="text-3xl font-bold text-white">
                    <CountUp end={94} duration={2} />%
                  </div>
                </div>
                <div className="text-sm text-dark-400">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced AI Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main AI Card */}
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                {/* AI Avatar with Pulse */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur-xl opacity-50"
                    />
                    <div className="relative w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-white">AI Interviewer</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="text-xs text-gray-400">Live Analysis Active</div>
                    </div>
                  </div>
                </div>

                {/* Typing Animation Question */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-white/5 min-h-[80px]">
                  <div className="text-sm text-gray-300 font-medium mb-2">Current Question:</div>
                  <div className="text-base text-white">
                    {typedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-5 bg-violet-400 ml-1"
                    />
                  </div>
                </div>

                {/* Audio Waveform Visualization */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mic className="w-4 h-4 text-violet-400" />
                    <span className="text-xs text-gray-400">Voice Analysis</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 h-12 bg-slate-800/30 rounded-lg p-2">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [
                            Math.random() * 20 + 10,
                            Math.random() * 35 + 15,
                            Math.random() * 20 + 10
                          ]
                        }}
                        transition={{
                          duration: 0.5 + Math.random() * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-1 bg-gradient-to-t from-violet-600 to-indigo-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Live Transcript Scrolling */}
                <div className="bg-slate-800/30 rounded-lg p-3 mb-4 h-20 overflow-hidden">
                  <div className="text-xs text-gray-400 mb-1">Live Transcript:</div>
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-sm text-gray-300 space-y-1"
                  >
                    <p>"I led a team of five engineers..."</p>
                    <p>"We implemented a microservices..."</p>
                    <p>"The project resulted in 40% improvement..."</p>
                  </motion.div>
                </div>

                {/* Animated Score Counters */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-xl p-4 text-center border border-violet-500/20">
                    <motion.div
                      key={currentScore}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
                    >
                      {currentScore}
                    </motion.div>
                    <div className="text-xs text-gray-400 mt-1">Overall</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                    <motion.div
                      key={eyeContact}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                      {eyeContact}
                    </motion.div>
                    <div className="text-xs text-gray-400 mt-1">Eye Contact</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 text-center border border-green-500/20">
                    <motion.div
                      key={confidence}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                    >
                      {confidence}
                    </motion.div>
                    <div className="text-xs text-gray-400 mt-1">Confidence</div>
                  </div>
                </div>

                {/* Analysis Tags */}
                <div className="flex flex-wrap gap-2">
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400 flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Eye Contact Strong</span>
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400 flex items-center space-x-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Confidence Detected</span>
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full text-xs text-violet-400 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Clear Communication</span>
                  </motion.span>
                </div>
              </div>

              {/* Floating Status Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl px-4 py-2 shadow-lg shadow-green-500/25"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-white">Live</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Count Up Component
const CountUp = ({ end, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
};

export default EnhancedHeroSection;
