import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <div className="text-6xl mb-8 animate-float">✨</div>
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-[#F8FAFC]">
          Instant Circle
        </h1>
        <p className="text-[#94A3B8] text-lg mb-12 leading-relaxed">
          Connect instantly with like-minded individuals based on your current feelings.
          Genuine conversations in a safe space.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/signup')}
            className="w-full h-14 rounded-2xl bg-[#6366F1] text-white font-bold text-lg hover:bg-[#5558E3] transition-all shadow-lg shadow-[#6366F1]/30"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full h-14 rounded-2xl border-2 border-[#334155] text-[#F8FAFC] font-bold text-lg hover:border-[#6366F1] transition-all"
          >
            I already have an account
          </button>
        </div>
      </motion.div>
      
      <p className="absolute bottom-10 text-xs text-[#64748B]">
        No profiles. No judgment. Just connection.
      </p>
    </div>
  );
};

export default Welcome;
