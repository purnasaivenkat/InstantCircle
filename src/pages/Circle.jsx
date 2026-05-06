import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { insforge } from '../lib/insforge';
import ChatMessage from '../components/ChatMessage';
import CircleTimer from '../components/CircleTimer';

const Circle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const vibe = location.state?.vibe || 'casual';
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const scrollRef = useRef(null);

  const vibeName = vibe === 'vent' ? 'Vent Circle' : vibe === 'advice' ? 'Advice Circle' : vibe === 'chill' ? 'Chill Circle' : 'Casual Circle';

  useEffect(() => {
    // Fetch initial messages from the database
    const fetchMessages = async () => {
      try {
        const { data } = await insforge.database
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (data) setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // Subscribe to new messages (with safety checks)
    let subscription;
    try {
      const channel = insforge.database.from('messages');
      if (channel && typeof channel.on === 'function') {
        subscription = channel
          .on('INSERT', (payload) => {
            setMessages((prev) => {
              // Avoid duplicates from optimistic updates
              const isDuplicate = prev.some(m => m.text === payload.new.text && m.user_id === payload.new.user_id);
              if (isDuplicate) return prev;
              return [...prev, payload.new];
            });
          })
          .subscribe();
      }
    } catch (err) {
      console.warn('Real-time subscription failed, falling back to polling or manual refresh.', err);
    }

    const warningTimer = setTimeout(() => setShowWarning(true), 30000);

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
      clearTimeout(warningTimer);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    // Optimistic update: Add message to local state immediately
    const optimisticMsg = {
      id: Date.now(),
      user_id: user?.id,
      user_display_name: profile?.username || 'Guest',
      text: textToSend,
      created_at: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await insforge.database.from('messages').insert([{
        user_id: user?.id,
        user_display_name: profile?.username || 'Guest',
        text: textToSend,
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F172A] relative">
      {/* Header */}
      <div className="bg-[#1E293B] px-4 py-4 border-b border-[#334155] shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-[#94A3B8]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h3 className="font-bold text-base text-[#F8FAFC]">{vibeName}</h3>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold">6 People Active</p>
          </div>
        </div>
        <CircleTimer durationSeconds={600} onEnd={() => navigate('/feedback')} />
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth min-h-0"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-sm font-medium text-[#F8FAFC]">You are the first one here!</p>
            <p className="text-xs text-[#94A3B8] mt-1">Say hi to start the conversation.</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            user={msg.user_display_name} 
            text={msg.text} 
            isCurrentUser={msg.user_id === user?.id} 
          />
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-tight">Riya is typing…</p>
          </motion.div>
        )}
      </div>

      {/* Warnings / Notifications */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-[#1E293B] border-2 border-[#6366F1]/30 rounded-2xl p-4 shadow-2xl z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">Ending in 30 seconds</h3>
                <p className="text-xs text-[#94A3B8] opacity-70">Wrap up your conversation</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-[#1E293B] px-4 py-6 border-t border-[#334155] shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Say something…"
            className="w-full bg-[#0F172A] rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#6366F1] text-[#F8FAFC] placeholder:text-[#64748B] shadow-inner pr-14"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center text-[#6366F1]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-[#64748B] mt-4 text-center font-bold uppercase tracking-widest opacity-60">
          No profiles. No judgment.
        </p>
      </div>
    </div>
  );
};

export default Circle;
