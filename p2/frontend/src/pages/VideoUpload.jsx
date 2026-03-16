import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';

const VideoUpload = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link to="/" className="inline-flex items-center text-dark-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-5xl font-bold mb-3">🎥 Upload Interview Video</h1>
            <p className="text-xl text-dark-400">
              Record your interview and get instant AI-powered feedback
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <UploadForm />
            </motion.div>

            {/* Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Requirements Card */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">📋 Requirements</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-dark-300 mb-1">Supported Formats</p>
                    <p className="text-xs text-dark-400">MP4, WebM, MOV, AVI</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-300 mb-1">Maximum Size</p>
                    <p className="text-xs text-dark-400">100 MB</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-300 mb-1">Recommended Duration</p>
                    <p className="text-xs text-dark-400">2-10 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-300 mb-1">Resolution</p>
                    <p className="text-xs text-dark-400">720p or higher</p>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="glass rounded-2xl p-6 border border-accent-500/30 bg-accent-500/5">
                <h3 className="text-lg font-semibold mb-4">💡 Tips for Best Results</h3>
                <ul className="space-y-2 text-sm text-dark-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-400 mt-1">✓</span>
                    <span>Ensure good lighting on your face</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-400 mt-1">✓</span>
                    <span>Use a quiet environment</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-400 mt-1">✓</span>
                    <span>Maintain eye contact with camera</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-400 mt-1">✓</span>
                    <span>Speak clearly and confidently</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-400 mt-1">✓</span>
                    <span>Avoid background distractions</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8">✨ What You Get</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6 border border-white/10 hover:border-accent-500/50 transition-all">
                <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="font-semibold mb-2">Facial Analysis</h3>
                <p className="text-sm text-dark-400">
                  AI analyzes eye contact, facial expressions, and head stability
                </p>
              </div>

              <div className="glass rounded-xl p-6 border border-white/10 hover:border-accent-500/50 transition-all">
                <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="font-semibold mb-2">Speech Analysis</h3>
                <p className="text-sm text-dark-400">
                  Evaluate speech rate, filler words, pitch, and energy levels
                </p>
              </div>

              <div className="glass rounded-xl p-6 border border-white/10 hover:border-accent-500/50 transition-all">
                <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="font-semibold mb-2">Detailed Feedback</h3>
                <p className="text-sm text-dark-400">
                  Get actionable insights and personalized recommendations
                </p>
              </div>
            </div>
          </motion.div>

          {/* Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-8">🚀 How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-accent-400">1</span>
                </div>
                <h4 className="font-semibold mb-2">Record</h4>
                <p className="text-sm text-dark-400">
                  Record your interview response
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-accent-400">2</span>
                </div>
                <h4 className="font-semibold mb-2">Upload</h4>
                <p className="text-sm text-dark-400">
                  Upload your video file
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-accent-400">3</span>
                </div>
                <h4 className="font-semibold mb-2">Analyze</h4>
                <p className="text-sm text-dark-400">
                  AI analyzes your performance
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-accent-400">4</span>
                </div>
                <h4 className="font-semibold mb-2">Improve</h4>
                <p className="text-sm text-dark-400">
                  Get actionable feedback
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-dark-400 mb-4">
              Ready to improve your interview skills?
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              <span>📄 Upload Resume First</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
