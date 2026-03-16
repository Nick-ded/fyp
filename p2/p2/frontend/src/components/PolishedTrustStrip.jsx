import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp } from 'lucide-react';

const PolishedTrustStrip = () => {
  const companies = [
    { name: 'Google', logo: '🔍' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Meta', logo: '👁️' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Netflix', logo: '🎬' },
    { name: 'Tesla', logo: '⚡' },
    { name: 'Uber', logo: '🚗' },
    { name: 'Airbnb', logo: '🏠' },
    { name: 'Spotify', logo: '🎵' }
  ];

  const stats = [
    { icon: Users, value: '5,000+', label: 'Candidates Trained' },
    { icon: Building2, value: '200+', label: 'Partner Companies' },
    { icon: TrendingUp, value: '94%', label: 'Placement Success' }
  ];

  return (
    <section className="relative py-20 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
      {/* Subtle animated gradient */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/3 to-transparent bg-[length:200%_100%]"
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4"
          >
            <Building2 className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-400 uppercase tracking-wider">Trusted By Industry Leaders</span>
          </motion.div>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Our candidates have successfully landed roles at top companies worldwide
          </p>
        </motion.div>

        {/* Company Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 items-center justify-items-center">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="group relative"
            >
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
              />
              
              {/* Company card */}
              <div className="relative flex flex-col items-center space-y-3 p-6 rounded-2xl bg-white/5 border border-white/5 group-hover:border-violet-500/30 group-hover:bg-white/10 transition-all duration-300 backdrop-blur-sm min-w-[140px]">
                <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110">
                  {company.logo}
                </div>
                <div className="text-lg font-bold text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                  {company.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative group"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Stat card */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 group-hover:border-violet-500/30 backdrop-blur-sm transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            Join <span className="text-violet-400 font-semibold">thousands of successful candidates</span> who transformed their interview skills
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PolishedTrustStrip;
