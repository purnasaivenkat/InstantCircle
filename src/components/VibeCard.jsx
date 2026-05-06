import React from 'react';
import { motion } from 'framer-motion';

const VibeCard = ({ emoji, label, selected, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`h-24 rounded-2xl transition-all flex items-center gap-3 px-4 shadow-sm cursor-pointer ${
        selected
          ? 'bg-[#6366F1] border-2 border-[#6366F1] shadow-lg shadow-[#6366F1]/20'
          : 'bg-[#1E293B] border-2 border-[#334155] hover:border-[#6366F1]/50'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold text-left leading-tight">{label}</span>
    </motion.button>
  );
};

export default VibeCard;
