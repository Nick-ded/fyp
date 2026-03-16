import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, CheckCircle, TrendingUp, Users, Sparkles, Zap, Target } from 'lucide-react';

const SimpleHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pt-20 pb-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-gradient-xy" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Role Tags with gradient borders */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              {['Software Engineering', 'Data Science', 'Product Management', 'HR Interviews'].map((role, index) => (
                <span
                  key={role}
                  className={`px-4 py-2 bg-gradient-to-r ${
                    index % 4 === 0 ? 'from-blue-500/20 to-purple-500/20 border-blue-500/50' :
                    index % 4 === 1 ? 'from-purple-500/20 to-indigo-500/20 border-purple-500/50' :
                    index % 4 === 2 ? 'from-indigo-500/20 to-blue-500/20 border-indigo-500/50' :
                    'from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                  } text-white rounded-full text-sm border backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  {role}
                </Link>
              ))}
            </div>

            {/* Headline with gradient text */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 text-white leading-tight">
              Master Every
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
                Interview
              </span>
              <br />
              with <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Real-time performance tracking, instant feedback, and 
              <span className="text-blue-400 font-semibold"> data-driven insights</span> to land your dream role.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-10">
              <Link to="/live-interview">
                <button className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/25 hover:shadow-purple-500/25 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Start Free Session
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </Link>

              <Link to="/upload">
                <button className="group w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm hover:scale-105">
                  <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
                  Upload Recording
                </button>
              </Link>
            </div>

            {/* Enhanced Features */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-300 mb-12">
              <div className="flex items-center gap-3 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">Free first session</span>
              </div>
              <div className="flex items-center gap-3 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/30">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">No signup required</span>
              </div>
              <div className="flex items-center gap-3 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/30">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Instant AI feedback</span>
              </div>
            </div>

            {/* Enhanced Stats with gradients */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30">
              <div className="text-center lg:text-left group">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">5,000+</div>
                <div className="text-sm text-gray-400">Mock Sessions</div>
              </div>
              <div className="text-center lg:text-left group">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">38%</div>
                <div className="text-sm text-gray-400">Improvement</div>
              </div>
              <div className="text-center lg:text-left group">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">94%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced AI Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                {/* AI Header with gradient */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gradient-to-r from-blue-500/30 to-purple-500/30">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">AI Interviewer</div>
                    <div className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Live Analysis Active
                    </div>
                  </div>
                </div>

                {/* Question with gradient border */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 mb-6 border border-blue-500/30">
                  <div className="text-xs text-blue-400 mb-3 uppercase font-semibold">Current Question</div>
                  <div className="text-white text-lg">Tell me about your most impactful project...</div>
                </div>

                {/* Enhanced Scores with gradients */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 text-center border border-blue-500/30 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">95</div>
                    <div className="text-xs text-gray-300 mt-2">Overall</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 text-center border border-purple-500/30 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">88</div>
                    <div className="text-xs text-gray-300 mt-2">Eye Contact</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl p-4 text-center border border-indigo-500/30 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">92</div>
                    <div className="text-xs text-gray-300 mt-2">Confidence</div>
                  </div>
                </div>

                {/* Enhanced Tags */}
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-full text-sm text-green-300 font-medium">
                    Eye Contact Strong
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-full text-sm text-blue-300 font-medium">
                    Confidence High
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHeroSection;
