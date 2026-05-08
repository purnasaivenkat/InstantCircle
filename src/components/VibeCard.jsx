import React from 'react';
import { motion } from 'framer-motion';

const VibeCard = ({ emoji, label, selected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative glass-card p-10 md:p-12 rounded-[3.5rem] flex flex-col items-center justify-center gap-6 group ${
        selected 
          ? 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.1)]' 
          : 'border-white/5'
      }`}
    >
      <div className={`text-5xl md:text-6xl transition-all duration-700 ${selected ? 'scale-125 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'opacity-40 group-hover:opacity-100'}`}>
        {emoji}
      </div>
      <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${
        selected ? 'text-white' : 'text-[#64748B]'
      }`}>
        {label}
      </p>
      
      {selected && (
        <motion.div 
          layoutId="active-vibe"
          className="absolute inset-0 rounded-[3.5rem] border border-amber-500/20"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default VibeCard;
