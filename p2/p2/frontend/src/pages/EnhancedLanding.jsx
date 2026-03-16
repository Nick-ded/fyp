import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import EnhancedHeroSection from '../components/EnhancedHeroSection';
import TrustStrip from '../components/TrustStrip';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const EnhancedLanding = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <Navbar />
      
      {/* Hero with Scroll Animation */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <EnhancedHeroSection />
      </motion.div>

      {/* Trust Strip */}
      <TrustStrip />

      {/* Features with Slide-up Animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <FeaturesSection />
      </motion.div>

      {/* How It Works with Slide-up Animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <HowItWorks />
      </motion.div>

      {/* Testimonials with Slide-up Animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <TestimonialsSection />
      </motion.div>

      <Footer />
    </div>
  );
};

export default EnhancedLanding;
