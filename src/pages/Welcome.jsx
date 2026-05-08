import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-[#050505]">
      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] -z-10 animate-pulse [animation-delay:3s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px] -z-10" />

      <div className="w-full max-w-5xl flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <span className="text-[10px] font-black tracking-[0.4em] text-amber-500/60 uppercase mb-4 block">
            YOUR NIGHTTIME SANCTUARY
          </span>
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-[#F8FAFC] leading-[0.9]">
            Instant <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-300 to-indigo-300">Circle</span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-2xl text-[#94A3B8] mb-16 max-w-2xl font-medium leading-relaxed opacity-60"
        >
          A quiet space for deep conversation. <br />
          Connect with a circle that understands your mood tonight.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row gap-6 w-full max-w-md"
        >
          <button
            onClick={() => navigate('/signup')}
            className="h-16 px-12 rounded-full bg-white text-black font-black text-lg tracking-tight hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            START A SESSION
          </button>
          <button
            onClick={() => navigate('/login')}
            className="h-16 px-12 rounded-full border border-white/20 text-white font-black text-lg tracking-tight hover:bg-white/5 transition-all"
          >
            LOG IN
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-24 flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64748B]">
            Currently 2.4k users unwinding
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
