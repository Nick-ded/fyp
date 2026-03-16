import React from 'react';

const SimpleTrustStrip = () => {
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
    'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify'
  ];

  return (
    <section className="py-16 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
            Trusted By Industry Leaders
          </p>
          <p className="text-gray-500">
            Our candidates have successfully landed roles at top companies worldwide
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {companies.map((company) => (
            <div
              key={company}
              className="flex items-center justify-center p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-violet-500 transition-colors"
            >
              <span className="text-lg font-bold text-gray-500 hover:text-gray-300 transition-colors">
                {company}
              </span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-white mb-2">5,000+</div>
            <div className="text-sm text-gray-400">Candidates Trained</div>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-white mb-2">200+</div>
            <div className="text-sm text-gray-400">Partner Companies</div>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-white mb-2">94%</div>
            <div className="text-sm text-gray-400">Placement Success</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleTrustStrip;
