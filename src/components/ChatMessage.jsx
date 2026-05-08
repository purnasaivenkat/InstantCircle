import React from 'react';
import { motion } from 'framer-motion';

const ChatMessage = ({ user, text, isCurrentUser, onUserClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isCurrentUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
    >
      {!isCurrentUser && (
        <button 
          onClick={() => onUserClick && onUserClick(user)}
          className="text-[9px] font-black mb-3 text-amber-500/60 uppercase tracking-[0.3em] hover:text-amber-500 transition-colors flex items-center gap-2"
        >
          {user}
        </button>
      )}
      <div
        className={`px-8 py-5 rounded-[2rem] max-w-[80%] md:max-w-[65%] text-base md:text-lg leading-relaxed transition-all ${
          isCurrentUser
            ? 'bg-white text-black font-medium shadow-2xl'
            : 'bg-[#0f0f0f] text-[#F8FAFC] border border-white/5'
        }`}
      >
        {text}
      </div>
      <p className={`text-[8px] mt-2 font-black uppercase tracking-widest text-[#4b5563] ${isCurrentUser ? 'mr-4' : 'ml-4'}`}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </motion.div>
  );
};

export default ChatMessage;
