import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Feedback = () => {
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <div className="text-6xl mb-8">✨</div>
        <h2 className="text-4xl font-extrabold mb-4 text-[#F8FAFC] leading-tight">
          You weren't alone tonight.
        </h2>
        <p className="text-[#94A3B8] text-lg mb-12 opacity-80">
          You connected with 5 other people.
        </p>

        {!voted ? (
          <div className="mb-12">
            <p className="text-sm font-bold text-[#94A3B8] mb-6 uppercase tracking-widest">
              How was this circle?
            </p>
            <div className="grid grid-cols-1 gap-3 px-4">
              <button
                onClick={() => setVoted(true)}
                className="w-full py-4 bg-[#1E293B] rounded-2xl text-sm font-bold border border-[#334155] hover:border-[#6366F1] transition-all flex items-center justify-center gap-3"
              >
                <span className="text-xl">👍</span> Helpful
              </button>
              <button
                onClick={() => setVoted(true)}
                className="w-full py-4 bg-[#1E293B] rounded-2xl text-sm font-bold border border-[#334155] hover:border-[#6366F1] transition-all flex items-center justify-center gap-3"
              >
                <span className="text-xl">😐</span> Okay
              </button>
              <button
                onClick={() => setVoted(true)}
                className="w-full py-4 bg-[#1E293B] rounded-2xl text-sm font-bold border border-[#334155] hover:border-red-500 transition-all flex items-center justify-center gap-3"
              >
                <span className="text-xl">👎</span> Not great
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl"
          >
            <p className="text-[#22C55E] font-bold text-lg">Thanks for your feedback!</p>
            <p className="text-[#22C55E]/70 text-xs mt-1">Your response helps improve the circles.</p>
          </motion.div>
        )}

        <div className="space-y-4 px-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full h-14 rounded-2xl bg-[#6366F1] text-white font-bold text-lg hover:bg-[#5558E3] transition-all shadow-lg shadow-[#6366F1]/20"
          >
            Join another circle
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full h-14 rounded-2xl border-2 border-[#334155] text-[#F8FAFC] font-bold text-lg hover:border-[#6366F1] transition-all"
          >
            Try a different vibe
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Feedback;
