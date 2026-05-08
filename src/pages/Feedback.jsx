import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Feedback = () => {
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center w-full relative overflow-hidden">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="text-7xl mb-8">✨</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#F8FAFC] tracking-tighter">
            You weren't <span className="text-gradient">alone</span> tonight.
          </h2>
          <p className="text-[#94A3B8] text-lg mb-12 font-medium opacity-80">
            You connected with other people who shared your vibe.
          </p>

          {!voted ? (
            <div className="mb-12">
              <p className="text-xs font-black text-[#6366F1] mb-8 uppercase tracking-[0.3em]">
                How was this circle experience?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setVoted(true)}
                  className="glass-card p-6 rounded-[2rem] text-sm font-black border border-white/5 hover:border-[#6366f1] transition-all flex flex-col items-center justify-center gap-4"
                >
                  <span className="text-3xl">👍</span> Helpful
                </button>
                <button
                  onClick={() => setVoted(true)}
                  className="glass-card p-6 rounded-[2rem] text-sm font-black border border-white/5 hover:border-[#6366f1] transition-all flex flex-col items-center justify-center gap-4"
                >
                  <span className="text-3xl">😐</span> Okay
                </button>
                <button
                  onClick={() => setVoted(true)}
                  className="glass-card p-6 rounded-[2rem] text-sm font-black border border-white/5 hover:border-red-500/50 transition-all flex flex-col items-center justify-center gap-4"
                >
                  <span className="text-3xl">👎</span> Not great
                </button>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-8 glass border border-[#10b981]/20 rounded-[2.5rem]"
            >
              <p className="text-[#10b981] font-black text-2xl tracking-tight">Thanks for your feedback!</p>
              <p className="text-[#10b981]/70 text-sm mt-2 font-medium tracking-wide">Your response helps us improve the circles.</p>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-6 max-w-md mx-auto">
            <button
              onClick={() => navigate('/home')}
              className="btn-primary flex-1 h-16 rounded-2xl font-black text-lg tracking-tight"
            >
              JOIN ANOTHER
            </button>
            <button
              onClick={() => navigate('/home')}
              className="flex-1 h-16 rounded-2xl glass border border-white/10 text-[#F8FAFC] font-black text-lg tracking-tight hover:bg-white/5 transition-all"
            >
              NEW VIBE
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
