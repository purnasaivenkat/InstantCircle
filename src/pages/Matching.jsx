import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Matching = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vibe = location.state?.vibe || 'casual';
  const [peopleFound, setPeopleFound] = useState(0);

  useEffect(() => {
    // Simulate matching process
    const timers = [
      setTimeout(() => setPeopleFound(1), 800),
      setTimeout(() => setPeopleFound(2), 1500),
      setTimeout(() => setPeopleFound(3), 2400),
      setTimeout(() => setPeopleFound(4), 3500),
      setTimeout(() => setPeopleFound(5), 4800),
      setTimeout(() => navigate('/circle', { state: { vibe } }), 6000)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [navigate, vibe]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-32 h-32 mb-12 relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border-4 border-[#334155] border-t-[#6366F1]"
        />
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
          {vibe === 'vent' ? '😤' : vibe === 'advice' ? '🧠' : vibe === 'chill' ? '😌' : '💬'}
        </div>
      </div>

      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-extrabold mb-4 text-[#F8FAFC]"
      >
        Finding your circle…
      </motion.h2>
      
      <div className="space-y-2">
        <p className="text-[#94A3B8] text-lg opacity-70">
          {peopleFound} of 6 people joined
        </p>
        <motion.p 
          key={peopleFound}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-[#6366F1] font-bold uppercase tracking-widest"
        >
          {peopleFound === 5 ? 'Almost ready!' : 'Searching for vibes…'}
        </motion.p>
      </div>

      <div className="absolute bottom-20 max-w-xs px-6">
        <p className="text-xs text-[#64748B] leading-relaxed">
          We match you with people who feel the same way right now. 
          Be kind, be open.
        </p>
      </div>
    </div>
  );
};

export default Matching;
