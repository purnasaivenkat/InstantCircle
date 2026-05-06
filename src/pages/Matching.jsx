import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { insforge } from '../lib/insforge';

const Matching = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vibe = location.state?.vibe || 'casual';
  const [peopleFound, setPeopleFound] = useState(0);

  useEffect(() => {
    const findOrCreateCircle = async () => {
      try {
        // Random delay to prevent race conditions (0.5s to 2s)
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));

        // Update simulated count for visual feedback
        const countInterval = setInterval(() => {
          setPeopleFound(prev => Math.min(prev + 1, 5));
        }, 800);

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        
        // 1. Find an active circle for this vibe with room
        const { data: existingCircles } = await insforge.database
          .from('circles')
          .select('*')
          .eq('vibe', vibe)
          .gt('created_at', tenMinutesAgo)
          .lt('user_count', 5)
          .order('created_at', { ascending: false })
          .limit(1);

        let circleToJoin;

        if (existingCircles && existingCircles.length > 0) {
          circleToJoin = existingCircles[0];
          // Update user count
          await insforge.database
            .from('circles')
            .update({ user_count: circleToJoin.user_count + 1 })
            .eq('id', circleToJoin.id);
        } else {
          // 2. Create new circle
          const { data: newCircles } = await insforge.database
            .from('circles')
            .insert([{ vibe, user_count: 1 }])
            .select();
          
          if (newCircles) circleToJoin = newCircles[0];
        }

        clearInterval(countInterval);
        setPeopleFound(5);

        // Navigate to circle with the circle object
        if (circleToJoin) {
          setTimeout(() => {
            navigate('/circle', { state: { vibe, circle: circleToJoin } });
          }, 1500); 
        }
      } catch (err) {
        console.error('Matching failed:', err);
        setTimeout(() => navigate('/home'), 5000);
      }
    };

    findOrCreateCircle();
  }, [vibe, navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-32 h-32 mb-12 relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border-4 border-[#334155] border-t-[#6366F1]"
        />
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
          {vibe === 'vent' ? '😤' : vibe === 'advice' ? '🧠' : vibe === 'chill' ? '😌' : '💬'}
        </div>
      </div>

      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-extrabold mb-4 text-[#F8FAFC]"
      >
        Finding your circle…
      </motion.h2>
      
      <div className="space-y-2">
        <p className="text-[#94A3B8] text-lg opacity-70">
          {peopleFound} of 6 people joined
        </p>
        <motion.p 
          key={peopleFound}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-[#6366F1] font-bold uppercase tracking-widest"
        >
          {peopleFound === 5 ? 'Almost ready!' : 'Searching for vibes…'}
        </motion.p>
      </div>

      <div className="absolute bottom-20 max-w-xs px-6">
        <p className="text-xs text-[#64748B] leading-relaxed">
          We match you with people who feel the same way right now. 
          Be kind, be open.
        </p>
      </div>
    </div>
  );
};

export default Matching;
