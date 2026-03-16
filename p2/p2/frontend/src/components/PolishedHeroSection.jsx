import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, TrendingUp, Eye, Mic, CheckCircle, Zap, Target, Award } from 'lucide-react';

const PolishedHeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [eyeContact, setEyeContact] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const aiQuestions = [
    "Tell me about your most impactful project and the results you achieved...",
    "How do you approach solving complex technical challenges in your work?",
    "Describe a time when you demonstrated leadership in a difficult situation..."
  ];
  const [questionIndex, setQuestionIndex] = useState(0);

  // Enhanced typing animation with natural pauses
  useEffect(() => {
    const question = aiQuestions[questionIndex];
    let currentIndex = 0;
    setIsTyping(true);
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= question.length) {
        setTypedText(question.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setTimeout(() => {
          setQuestionIndex((prev) => (prev + 1) % aiQuestions.length);
          setTypedText('');
        }, 3000);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, [questionIndex]);

  // Smooth score animations with realistic fluctuation
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setCurrentScore((prev) => {
        const target = 95;
        const min = 72;
        if (prev >= target) return Math.max(min, prev - Math.random() * 3);
        return Math.min(target, prev + Math.random() * 2);
      });
      
      setEyeContact((prev) => {
        const target = 88;
        const min = 65;
        if (prev >= target) return Math.max(min, prev - Math.random() * 2);
        return Math.min(target, prev + Math.random() * 1.5);
      });
      
      setConfidence((prev) => {
        const target = 92;
        const min = 78;
        if (prev >= target) return Math.max(min, prev - Math.random() * 2.5);
        return Math.min(target, prev + Math.random() * 1.8);
      });
    }, 50);

    return () => clearInterval(scoreInterval);
  }, []);

  const roles = [
    { name: 'Software Engineering', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { name: 'Data Science', icon: '📊', color: 'from-purple-500 to-pink-500' },
    { name: 'Product Management', icon: '🎯', color: 'from-orange-500 to-red-500' },
    { name: 'HR & Leadership', icon: '👥', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Enhanced Background with better depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Enhanced Radial Glows with animation */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-purple-600/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"
      />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Role Tags - Improved spacing and interaction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {roles.map((role, index) => (
                <motion.div
                  key={role.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" 
                       style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                  <div className="relative px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer flex items-center space-x-2">
                    <span className="text-base">{role.icon}</span>
                    <span>{role.name}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Headline with better typography */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
              >
                <span className="text-white block mb-2">Master Every Interview</span>
                <span className="text-white">with </span>
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                    AI
                  </span>
                  <motion.span
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 blur-2xl opacity-50"
                  />
                </span>
                <span className="text-white">-Powered</span>
                <br />
                <span className="text-white">Analytics</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl text-gray-400 max-w-[540px] mx-auto lg:mx-0 leading-relaxed"
              >
                Real-time performance tracking, instant feedback, and data-driven insights to transform your interview skills and land your dream role.
              </motion.p>
            </div>

            {/* Enhanced CTA Buttons with better hierarchy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/live-interview" className="group">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg overflow-hidden shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 flex items-center justify-center space-x-3 w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Play className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Start Free Session</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                    }}
                  />
                </motion.button>
              </Link>

              <Link to="/upload" className="group">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-8 py-4 bg-transparent border-2 border-white/10 hover:border-violet-500/50 hover:bg-white/5 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
                >
                  <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>View Demo</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Enhanced Conversion Microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm"
            >
              {[
                { icon: CheckCircle, text: 'Free first session', color: 'text-green-400' },
                { icon: Zap, text: 'No signup required', color: 'text-blue-400' },
                { icon: Target, text: 'Instant AI feedback', color: 'text-violet-400' }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Stats with better visual hierarchy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5"
            >
              {[
                { icon: Sparkles, value: 5000, suffix: '+', label: 'Mock Sessions', color: 'text-violet-400' },
                { icon: TrendingUp, value: 38, suffix: '%', label: 'Avg. Improvement', color: 'text-green-400' },
                { icon: Award, value: 94, suffix: '%', label: 'Success Rate', color: 'text-blue-400' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="text-center lg:text-left group cursor-default"
                >
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <div className="text-3xl font-bold text-white">
                      <CountUp end={stat.value} duration={2} />
                      <span>{stat.suffix}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Polished AI Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main AI Card with enhanced glassmorphism */}
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
                
                {/* AI Avatar with enhanced pulse */}
                <div className="relative flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur-2xl"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="relative w-16 h-16 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/50"
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white mb-1">AI Interviewer</div>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                      />
                      <div className="text-sm text-gray-400">Live Analysis Active</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Question Display */}
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-5 mb-5 border border-white/5 min-h-[100px] backdrop-blur-sm">
                  <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                    <span>Current Question</span>
                  </div>
                  <div className="text-base text-white leading-relaxed">
                    {typedText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-5 bg-violet-400 ml-1 align-middle"
                      />
                    )}
                  </div>
                </div>

                {/* Enhanced Audio Waveform */}
                <div className="mb-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Mic className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Voice Analysis</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
                  </div>
                  <div className="flex items-end justify-center space-x-1.5 h-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-3 border border-white/5">
                    {[...Array(24)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [
                            `${Math.random() * 30 + 20}%`,
                            `${Math.random() * 60 + 30}%`,
                            `${Math.random() * 30 + 20}%`
                          ]
                        }}
                        transition={{
                          duration: 0.4 + Math.random() * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.05
                        }}
                        className="w-1 bg-gradient-to-t from-violet-600 via-purple-500 to-indigo-400 rounded-full shadow-lg shadow-violet-500/30"
                        style={{ minHeight: '20%' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Enhanced Live Transcript */}
                <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-xl p-4 mb-5 h-24 overflow-hidden border border-white/5">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                    <span>Live Transcript</span>
                  </div>
                  <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="text-sm text-gray-300 space-y-2 leading-relaxed"
                  >
                    <p>"I led a team of five engineers to develop..."</p>
                    <p>"We implemented a microservices architecture..."</p>
                    <p>"The project resulted in 40% performance improvement..."</p>
                  </motion.div>
                </div>

                {/* Enhanced Score Counters */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { value: currentScore, label: 'Overall', gradient: 'from-violet-500 to-indigo-500', bg: 'from-violet-500/10 to-indigo-500/10', border: 'border-violet-500/30' },
                    { value: eyeContact, label: 'Eye Contact', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/30' },
                    { value: confidence, label: 'Confidence', gradient: 'from-green-500 to-emerald-500', bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/30' }
                  ].map((score, index) => (
                    <motion.div
                      key={score.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`relative bg-gradient-to-br ${score.bg} rounded-xl p-4 text-center border ${score.border} backdrop-blur-sm cursor-default group overflow-hidden`}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${score.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                      />
                      <motion.div
                        key={Math.floor(score.value)}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`text-3xl font-bold bg-gradient-to-r ${score.gradient} bg-clip-text text-transparent relative z-10`}
                      >
                        {Math.round(score.value)}
                      </motion.div>
                      <div className="text-xs text-gray-400 mt-1.5 font-medium relative z-10">{score.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Analysis Tags */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Eye, text: 'Eye Contact Strong', color: 'green', delay: 0 },
                    { icon: TrendingUp, text: 'Confidence High', color: 'blue', delay: 0.5 },
                    { icon: Sparkles, text: 'Clear Speech', color: 'violet', delay: 1 }
                  ].map((tag) => (
                    <motion.span
                      key={tag.text}
                      animate={{ 
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: tag.delay }}
                      className={`px-3 py-1.5 bg-${tag.color}-500/10 border border-${tag.color}-500/30 rounded-full text-xs text-${tag.color}-400 flex items-center space-x-1.5 font-medium backdrop-blur-sm`}
                    >
                      <tag.icon className="w-3.5 h-3.5" />
                      <span>{tag.text}</span>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Enhanced Floating Status Badge */}
              <motion.div
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl px-5 py-3 shadow-2xl shadow-green-500/40 border border-green-400/20"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2.5 h-2.5 bg-white rounded-full shadow-lg shadow-white/50"
                  />
                  <span className="text-sm font-bold text-white tracking-wide">LIVE</span>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Enhanced CountUp Component with easing
const CountUp = ({ end, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * easeOutQuart(progress)));
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

export default PolishedHeroSection;
