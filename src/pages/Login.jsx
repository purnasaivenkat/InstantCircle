import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="w-full max-w-lg">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden"

        >
          {/* Subtle gradient overlay */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#F8FAFC] tracking-tight mb-2">Welcome Back</h2>
            <p className="text-sm text-[#94A3B8] font-medium">Log in to find your circle</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-[#6366F1]/50 focus:bg-white/10 text-white transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.2em] ml-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-[#6366F1]/50 focus:bg-white/10 text-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full h-16 rounded-2xl font-black text-lg tracking-tight mt-4"
            >
              LOG IN
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-[#64748B] font-medium">
            New here?{' '}
            <Link to="/signup" className="text-[#6366F1] font-black hover:text-[#818cf8] transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
