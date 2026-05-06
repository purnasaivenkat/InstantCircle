import React from 'react';
import { motion } from 'framer-motion';

const ChatMessage = ({ user, text, isCurrentUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={isCurrentUser ? 'text-right' : ''}
    >
      {!isCurrentUser && (
        <p className="text-xs font-semibold mb-1.5 text-[#94A3B8] opacity-70">{user}</p>
      )}
      <div
        className={`inline-block px-4 py-3 rounded-2xl max-w-[75%] text-sm shadow-sm ${
          isCurrentUser
            ? 'bg-[#6366F1] text-white rounded-br-sm'
            : 'bg-[#1E293B] text-[#F8FAFC] rounded-bl-sm'
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
