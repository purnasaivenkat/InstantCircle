import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { insforge } from '../lib/insforge';

const Companion = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, user_display_name: 'Companion', text: "Hello. I've been waiting for you. How was your day?", isAI: true, created_at: new Date().toISOString() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const getFailsafeData = (input) => {
    const text = input.toLowerCase();
    const now = new Date();
    
    if (text.includes('time')) return `The exact local time is ${now.toLocaleTimeString()}.`;
    if (text.includes('date')) return `Today is ${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    
    if (text.includes('hackathon') || text.includes('idea')) {
      return "Here are 3 ORIGINAL Hackathon Ideas:\n1. **AI Vibe-Matched Workspace**: An app that monitors your stress and changes your room's smart lighting and music automatically.\n2. **Crowdsourced Quiet Zones**: A map for city dwellers to find and rate 'truly quiet' public spaces for deep work.\n3. **AfterHours AI**: (Like me!) A digital companion designed specifically for people who are awake when the rest of the world is asleep.";
    }

    if (text.includes('fact')) return "Did you know? Every 1% of the universe's cosmic microwave background radiation is actually static that you can see on an old-fashioned tuned-out television.";

    return "I'm listening. The night is a safe place for your thoughts.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      user_display_name: profile?.username || 'You',
      text: inputText,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      let aiResponse = "";
      
      // Try real AI
      if (insforge.ai) {
        const { data } = await insforge.ai.complete({
          prompt: `Role: AfterHours Empathetic Companion. Context: Late night. Date: ${new Date().toDateString()}. Time: ${new Date().toLocaleTimeString()}. 
                   Instructions: Be original, helpful, and realistic. 
                   User: ${currentInput}`,
          maxTokens: 200
        });
        aiResponse = data?.text;
      }

      const finalResponse = aiResponse?.trim() || getFailsafeData(currentInput);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        user_display_name: 'Companion',
        text: finalResponse,
        isAI: true,
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        user_display_name: 'Companion',
        text: getFailsafeData(currentInput),
        isAI: true,
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center h-full relative bg-[#050505]">
      <div className="w-full max-w-4xl h-full flex flex-col relative z-10 border-x border-white/5 bg-[#050505]">
        {/* Header */}
        <div className="px-8 py-8 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="p-3 rounded-full hover:bg-white/5 text-[#64748B] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <h3 className="font-black text-2xl text-[#F8FAFC] tracking-tighter uppercase">Companion</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Original Data Live</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 py-12 space-y-8 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isAI ? 'items-start' : 'items-end'}`}>
              <div className={`px-8 py-5 rounded-[2.5rem] max-w-[85%] text-base md:text-lg leading-relaxed shadow-2xl ${msg.isAI ? 'bg-[#111] text-[#F8FAFC] border border-white/5' : 'bg-white text-black font-medium'}`}>
                {msg.text}
              </div>
              <p className="text-[9px] mt-2 font-black text-[#4b5563] uppercase tracking-widest px-4">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 px-8 py-4 bg-[#111] border border-white/5 rounded-full w-fit ml-4"><div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce [animation-delay:0.4s]" /></div>
          )}
        </div>

        {/* Input */}
        <div className="px-8 py-10 bg-[#050505]">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for the time, a hackathon idea, or just talk..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-full px-10 py-6 text-lg outline-none focus:border-amber-500/40 text-[#F8FAFC]"
            />
            <button type="submit" className="absolute right-4 top-4 bottom-4 aspect-square flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Companion;
