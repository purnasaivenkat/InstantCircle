import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      if (err.message?.includes('verification required')) {
        navigate('/verify', { state: { email } });
      } else {
        setError(err.message || 'Invalid email or password');
      }
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
        <h2 className="text-3xl font-bold mb-2 text-center text-[#F8FAFC]">Welcome Back</h2>
        <p className="text-[#94A3B8] text-center mb-8 text-sm">Sign in to your circle</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="••••••••"
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
              'Sign In'
            )}
          </button>
        </form>
        
        <p className="text-center mt-8 text-[#94A3B8] text-sm font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#6366F1] hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
