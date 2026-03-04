import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Upload = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-5xl font-bold mb-3">📤 Upload & Analyze</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose what you'd like to upload and get instant AI-powered feedback
            </p>
          </motion.div>

          {/* Upload Options Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Resume Upload Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <Link to="/profile">
                <div className="glass rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-all h-full cursor-pointer group-hover:shadow-xl group-hover:shadow-violet-500/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-violet-500/20 rounded-xl flex items-center justify-center group-hover:bg-violet-500/30 transition-all">
                      <FileText className="w-8 h-8 text-violet-400" />
                    </div>
                    <span className="text-3xl">📄</span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3">Resume Upload</h2>
                  <p className="text-gray-400 mb-6">
                    Upload your professional resume to get personalized interview questions tailored to your experience and skills.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-violet-400">✓</span>
                      <span>Supported: PDF, DOC, DOCX, TXT</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-violet-400">✓</span>
                      <span>Max size: 5 MB</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-violet-400">✓</span>
                      <span>Instant text extraction</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center space-x-2 text-violet-400 font-semibold group-hover:space-x-3 transition-all">
                    <span>Go to Profile</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Video Upload Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <Link to="/video-upload">
                <div className="glass rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all h-full cursor-pointer group-hover:shadow-xl group-hover:shadow-indigo-500/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-all">
                      <Video className="w-8 h-8 text-indigo-400" />
                    </div>
                    <span className="text-3xl">🎥</span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3">Video Upload</h2>
                  <p className="text-gray-400 mb-6">
                    Upload your interview recording to get comprehensive AI analysis of your facial expressions, speech patterns, and overall performance.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-indigo-400">✓</span>
                      <span>Supported: MP4, WebM, MOV, AVI</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-indigo-400">✓</span>
                      <span>Max size: 100 MB</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-indigo-400">✓</span>
                      <span>Instant AI analysis</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center space-x-2 text-indigo-400 font-semibold group-hover:space-x-3 transition-all">
                    <span>Upload Video</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">✨ Why Upload?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">Personalized Feedback</h3>
                <p className="text-sm text-gray-400">
                  Get AI-powered insights tailored to your specific interview performance
                </p>
              </div>
              <div className="glass rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Instant Analysis</h3>
                <p className="text-sm text-gray-400">
                  Receive detailed feedback within minutes of uploading
                </p>
              </div>
              <div className="glass rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-gray-400">
                  Monitor your improvement over multiple practice sessions
                </p>
              </div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 border border-white/10 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">🚀 Get Started</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Start by uploading your resume to get personalized interview questions, then record and upload your practice interviews to get detailed feedback.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/profile"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all font-semibold"
              >
                📄 Upload Resume
              </Link>
              <Link
                to="/video-upload"
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-semibold"
              >
                🎥 Upload Video
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
