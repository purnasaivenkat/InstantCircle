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
  const circle = location.state?.circle;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isOpeningPrivate, setIsOpeningPrivate] = useState(false);
  const scrollRef = useRef(null);

  const vibeName = vibe === 'vent' ? 'Release Circle' : vibe === 'advice' ? 'Sanctuary Circle' : vibe === 'chill' ? 'Drift Circle' : 'Dialogue Circle';

  const syncProfiles = async (msgs) => {
    try {
      const uniqueSenders = msgs.reduce((acc, m) => {
        if (m.user_id && m.user_display_name) acc[m.user_id] = m.user_display_name;
        return acc;
      }, {});

      for (const [uid, uname] of Object.entries(uniqueSenders)) {
        await insforge.database.from('profiles').upsert([{ id: uid, username: uname, email: `${uname}@afterhours.com` }], { onConflict: 'id' });
      }
    } catch (e) { console.error('Auto-sync failed:', e); }
  };

  useEffect(() => {
    if (!circle) {
      navigate('/home');
      return;
    }

    const fetchMessages = async () => {
      const { data } = await insforge.database.from('messages').select('*').eq('circle_id', circle.id).order('created_at', { ascending: true });
      if (data) {
        setMessages(data);
        syncProfiles(data);
      }
    };
    fetchMessages();

    const subscription = insforge.channel(`circle-${circle.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `circle_id=eq.${circle.id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [circle, navigate]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    
    await insforge.database.from('profiles').upsert([{ id: user.id, username: profile?.username || 'Guest', email: user.email }], { onConflict: 'id' });

    await insforge.database.from('messages').insert([{
      user_id: user?.id,
      user_display_name: profile?.username || 'Guest',
      text,
      circle_id: circle.id,
      vibe: vibe,
      created_at: new Date().toISOString()
    }]);
  };

  const handleUserClick = async (targetUsername) => {
    if (targetUsername === profile?.username || isOpeningPrivate) return;
    setIsOpeningPrivate(true);
    
    try {
      // 1. Resolve Target Profile
      const { data: targetProfile, error: pError } = await insforge.database
        .from('profiles')
        .select('id')
        .eq('username', targetUsername);
      
      const targetId = targetProfile?.[0]?.id;
      
      if (!targetId) {
        alert(`Cannot find profile for ${targetUsername}. Try again in a second.`);
        setIsOpeningPrivate(false);
        return;
      }

      // 2. Find Existing Chat (Two simple queries for 100% reliability)
      const { data: chatA } = await insforge.database
        .from('private_chats')
        .select('id')
        .eq('user1_id', user.id)
        .eq('user2_id', targetId)
        .maybeSingle();

      const { data: chatB } = await insforge.database
        .from('private_chats')
        .select('id')
        .eq('user1_id', targetId)
        .eq('user2_id', user.id)
        .maybeSingle();

      const existingChatId = chatA?.id || chatB?.id;

      if (existingChatId) {
        navigate(`/private-chat/${existingChatId}`);
      } else {
        // 3. Create New Chat
        const { data: newChat, error: nError } = await insforge.database
          .from('private_chats')
          .insert([{ user1_id: user.id, user2_id: targetId }])
          .select()
          .single();
        
        if (newChat) {
          navigate(`/private-chat/${newChat.id}`);
        } else {
          alert(`Error creating room: ${nError?.message || 'Please check your database.'}`);
        }
      }
    } catch (err) {
      alert(`System Error: ${err.message}`);
    } finally {
      setIsOpeningPrivate(false);
    }
  };


  return (
    <div className="flex-1 flex flex-col items-center h-full relative bg-[#050505]">
      <div className="w-full max-w-5xl h-full flex flex-col relative z-10">
        
        <div className="px-8 py-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="p-3 rounded-full hover:bg-white/5 text-[#64748B] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <div>
              <h3 className="font-black text-2xl text-[#F8FAFC] tracking-tighter">{vibeName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isOpeningPrivate ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`} />
                <p className="text-[9px] text-[#64748B] uppercase tracking-[0.3em] font-black">
                  {isOpeningPrivate ? 'LINKING PRIVATE CHANNEL...' : 'CONNECTED'}
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => syncProfiles(messages)} className="px-4 py-2 glass rounded-full text-[9px] font-black uppercase text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-all">Fix Rooms</button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 py-12 space-y-8 scroll-smooth scrollbar-thin">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} user={msg.user_display_name} text={msg.text} isCurrentUser={msg.user_id === user?.id} onUserClick={handleUserClick} />
          ))}
        </div>

        <div className="px-8 py-10">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What's in your heart tonight?"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-full px-10 py-6 text-lg outline-none focus:border-amber-500/20 text-[#F8FAFC] transition-all"
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

export default Circle;
