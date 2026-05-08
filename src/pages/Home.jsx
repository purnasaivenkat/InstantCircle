import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import VibeCard from '../components/VibeCard';

const Home = () => {
  const [selectedVibe, setSelectedVibe] = useState(null);
  const { profile, user, logout, fetchProfile, debugMsg } = useAuth();


  const navigate = useNavigate();

  const vibes = [
    { id: 'vent', emoji: '🌑', label: 'Release thoughts' },
    { id: 'casual', emoji: '✨', label: 'Light talk' },
    { id: 'advice', emoji: '🕯️', label: 'Seeking light' },
    { id: 'chill', emoji: '🌊', label: 'Drift away' }
  ];

  const handleStart = () => {
    if (selectedVibe) {
      navigate('/matching', { state: { vibe: selectedVibe } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 max-w-7xl mx-auto w-full relative">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-24 px-8 absolute top-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            IC
          </div>
          <div className="hidden md:block">
            <h2 className="text-[#F8FAFC] font-black text-xl leading-tight">Welcome, {profile?.username || 'Guest'}</h2>
            <p className="text-[10px] text-amber-500/60 font-black uppercase tracking-[0.3em]">YOUR SESSION IS READY</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const email = user?.email || '';
              const uid = user?.id;
              if (uid) fetchProfile(uid);
              alert("Identity and Room sync refreshed!");
            }}
            className="px-6 py-2.5 rounded-full text-[10px] font-black text-amber-500 hover:text-white border border-amber-500/20 hover:bg-amber-500 transition-all uppercase tracking-widest"
          >
            REPAIR IDENTITY
          </button>
          <button 
            onClick={logout}
            className="px-6 py-2.5 rounded-full text-[10px] font-black text-[#64748B] hover:text-white border border-white/5 hover:bg-white/5 transition-all uppercase tracking-widest"
          >
            LOGOUT
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-8xl font-black mb-6 text-[#F8FAFC] tracking-tighter leading-none">
            What's on your <span className="text-gradient">mind</span> tonight?
          </h1>
          <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-50">
            Pick a mood and we'll connect you with a circle of companions who feel the same.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mb-20">
          {vibes.map((v) => (
            <VibeCard
              key={v.id}
              emoji={v.emoji}
              label={v.label}
              selected={selectedVibe === v.id}
              onClick={() => setSelectedVibe(v.id)}
            />
          ))}
        </div>

        <div className="w-full max-w-lg flex flex-col items-center gap-6">
          <button
            onClick={handleStart}
            disabled={!selectedVibe}
            className="h-20 w-full rounded-full bg-white text-black font-black text-2xl disabled:opacity-5 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            ENTER THE CIRCLE
          </button>

          <button
            onClick={() => navigate('/companion')}
            className="h-14 w-full rounded-full border border-white/10 text-white font-black text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-presence" />
            CHAT WITH COMPANION
          </button>

          
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 glass px-6 py-2.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]" />
              <p className="text-[10px] text-[#64748B] font-black uppercase tracking-[0.4em]">
                128 COMPANIONS ONLINE
              </p>
            </div>
            
            {/* Debug Monitor */}
            {debugMsg && (
              <div className="mt-4 px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-[8px] font-mono text-red-400 uppercase tracking-widest">{debugMsg}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
