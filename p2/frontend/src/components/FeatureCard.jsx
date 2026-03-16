import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="card card-hover rounded-xl p-6 group min-h-[280px] flex flex-col focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-400"
    >
      <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-dark-400 leading-relaxed text-sm flex-grow">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
