import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signup(email, password, username);
      navigate('/verify', { state: { email } });
    } catch (err) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#1E293B] rounded-3xl p-8 border border-[#334155] shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-[#F8FAFC]">Create Account</h2>
        <p className="text-[#94A3B8] text-center mb-8 text-sm">Join the circle</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider ml-1">Username (Display Name)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#6366F1] transition-all placeholder:text-[#64748B]"
              placeholder="How should people call you?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#6366F1] transition-all placeholder:text-[#64748B]"
              placeholder="name@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#6366F1] transition-all placeholder:text-[#64748B]"
              placeholder="At least 6 characters"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-[#6366F1] text-white font-bold text-lg hover:bg-[#5558E3] transition-all shadow-lg shadow-[#6366F1]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        
        <p className="text-center mt-8 text-[#94A3B8] text-sm font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6366F1] hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
