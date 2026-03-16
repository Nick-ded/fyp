import React from 'react';
import SimpleNavbar from '../components/SimpleNavbar';
import SimpleHeroSection from '../components/SimpleHeroSection';
import SimpleTrustStrip from '../components/SimpleTrustStrip';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const SimpleLanding = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <SimpleNavbar />
      <SimpleHeroSection />
      <SimpleTrustStrip />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default SimpleLanding;
