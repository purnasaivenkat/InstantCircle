import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(email, password, username);
      navigate('/verify');
    } catch (err) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
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
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#F8FAFC] tracking-tight mb-2">Create Account</h2>
            <p className="text-sm text-[#94A3B8] font-medium">Join the circle instantly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.2em] ml-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-[#6366F1]/50 focus:bg-white/10 text-white transition-all"
                placeholder="What should we call you?"
                required
              />
            </div>

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
                placeholder="Minimum 6 characters"
                minLength={6}
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
              disabled={loading}
              className="btn-primary w-full h-16 rounded-2xl font-black text-lg tracking-tight mt-4 disabled:opacity-50"
            >
              {loading ? 'CREATING...' : 'SIGN UP'}
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-[#64748B] font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6366F1] font-black hover:text-[#818cf8] transition-colors">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
