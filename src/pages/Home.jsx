import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import VibeCard from '../components/VibeCard';

const Home = () => {
  const [selectedVibe, setSelectedVibe] = useState(null);
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const vibes = [
    { id: 'vent', emoji: '😤', label: 'Just need to vent' },
    { id: 'casual', emoji: '💬', label: 'Casual chat' },
    { id: 'advice', emoji: '🧠', label: 'Need advice' },
    { id: 'chill', emoji: '😌', label: 'Just chilling' }
  ];

  const handleStart = () => {
    if (selectedVibe) {
      navigate('/matching', { state: { vibe: selectedVibe } });
    }
  };

  return (
    <div className="h-full flex flex-col relative px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-[#F8FAFC] font-bold">Hi, {profile?.username || 'Friend'}</h2>
          <p className="text-xs text-[#64748B]">Let's find your circle</p>
        </div>
        <button 
          onClick={logout}
          className="text-xs font-semibold text-[#94A3B8] hover:text-[#6366F1] transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold mb-3 text-[#F8FAFC] leading-tight"
        >
          What do you feel like right now?
        </motion.h1>
        <p className="text-[#94A3B8] text-sm mb-12 opacity-80">
          Pick your vibe. We'll match you instantly.
        </p>

        <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Footer Action */}
      <div className="mt-auto space-y-4 pt-8">
        <button
          onClick={handleStart}
          disabled={!selectedVibe}
          className="w-full h-14 rounded-2xl bg-[#6366F1] text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#5558E3] transition-all shadow-lg shadow-[#6366F1]/20"
        >
          Find my circle
        </button>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <p className="text-xs text-[#64748B] font-medium">128 people online now</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
