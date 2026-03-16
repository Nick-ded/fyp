import React from 'react';
import { motion } from 'framer-motion';

const TrustStrip = () => {
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
    'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify'
  ];

  return (
    <section className="relative py-16 border-y border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Candidates placed at companies like
          </p>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="group relative"
            >
              {/* Company Name as Logo */}
              <div className="text-2xl font-bold text-gray-600 group-hover:text-gray-400 transition-colors duration-300 filter grayscale group-hover:grayscale-0">
                {company}
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Join <span className="text-violet-400 font-semibold">5,000+</span> candidates who've successfully landed their dream roles
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStrip;
