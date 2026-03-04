import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, FileText, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EnhancedResumeUpload from '../components/EnhancedResumeUpload';
import { getCurrentUser } from '../api/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUploadSuccess = (result) => {
    // Reload user profile to get updated resume info
    loadUserProfile();
  };

  const handleResumeUploadError = (error) => {
    console.error('Resume upload error:', error);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your account and resume</p>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 border border-white/10 mb-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user?.full_name || user?.username}</h2>
                  <p className="text-gray-400">@{user?.username}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <div className="flex items-center space-x-3 glass rounded-lg p-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>{user?.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Member Since</label>
                <div className="glass rounded-lg p-3">
                  <span>{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Resume Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">📄 Resume Management</h2>
              <p className="text-gray-400">Upload and manage your professional resume</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Upload Component */}
              <div className="lg:col-span-2">
                <EnhancedResumeUpload
                  onUploadSuccess={handleResumeUploadSuccess}
                  onUploadError={handleResumeUploadError}
                />
              </div>

              {/* Current Resume Status */}
              <div>
                {user?.resume_filename ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-6 border border-green-500/30 h-full"
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400">Resume Active</h4>
                        <p className="text-xs text-gray-500">Ready to use</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-1">Filename</p>
                        <p className="text-sm text-gray-300 break-all">{user.resume_filename}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-1">Uploaded</p>
                        <p className="text-sm text-gray-300">
                          {new Date(user.resume_uploaded_at).toLocaleDateString()}
                        </p>
                      </div>

                      {user.resume_text && (
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-2">Preview</p>
                          <div className="p-3 bg-white/5 rounded border border-white/10 max-h-32 overflow-y-auto">
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {user.resume_text.substring(0, 300)}...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-6 border border-yellow-500/30 h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="text-4xl mb-3">📋</div>
                    <h4 className="font-semibold text-yellow-400 mb-1">No Resume Yet</h4>
                    <p className="text-xs text-gray-400">
                      Upload your resume to get started with personalized interview questions
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6 border border-white/10"
            >
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Personalized Questions</h3>
              <p className="text-sm text-gray-400">
                AI generates interview questions based on your resume
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 border border-white/10"
            >
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-400">
                Monitor your interview performance over time
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6 border border-white/10"
            >
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Secure Storage</h3>
              <p className="text-sm text-gray-400">
                Your resume is encrypted and kept private
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
