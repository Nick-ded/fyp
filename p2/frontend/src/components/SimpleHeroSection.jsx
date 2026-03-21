import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, CheckCircle } from 'lucide-react';

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
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              {['Software Engineering', 'Data Science', 'Product Management', 'HR Interviews'].map((role) => (
                <span
                  key={role}
                  className="px-3 py-1.5 bg-slate-800 text-gray-300 rounded-full text-sm border border-slate-700 hover:border-violet-500 hover:bg-slate-700 transition-colors cursor-pointer font-medium"
                >
                  {role}
                </span>
              ))}
            </div>

            <h1 className="heading-h1 mb-6 text-white">
              Master Every Interview
              <br />
              with <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="body-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Real-time performance tracking, instant feedback, and data-driven insights to land your dream role.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <Link
                to="/interview-selection"
                className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Free Session
              </Link>
              <Link
                to="/upload"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Recording
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-400 mb-8">
              {['Free first session', 'No signup required', 'Instant AI feedback'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="body-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800">
              {[['5,000+', 'Mock Sessions'], ['38%', 'Improvement'], ['94%', 'Success Rate']].map(([val, label]) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white mb-1">{val}</div>
                  <div className="caption">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - AI Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                {/* AI Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
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

                {/* Question */}
                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                  <div className="caption uppercase mb-2">Current Question</div>
                  <p className="body-base text-white font-sans">Tell me about your most impactful project...</p>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[['95', 'Overall', 'text-violet-400'], ['88', 'Eye Contact', 'text-blue-400'], ['92', 'Confidence', 'text-green-400']].map(([score, label, color]) => (
                    <div key={label} className="bg-slate-800 rounded-lg p-3 text-center">
                      <div className={`text-2xl font-bold ${color}`}>{score}</div>
                      <div className="caption mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400 font-medium">
                    Eye Contact Strong
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400 font-medium">
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
