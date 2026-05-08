import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { insforge } from '../lib/insforge';

const Verify = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await insforge.auth.verifyEmail({
        email,
        otp: code
      });

      if (error) throw error;

      alert('Email verified successfully! You can now sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Invalid verification code');
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
          className="glass p-12 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl text-center relative overflow-hidden"

        >
          {/* Subtle gradient overlay */}
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl font-black mb-2 text-[#F8FAFC] tracking-tight">Verify Email</h2>
          <p className="text-[#94A3B8] mb-10 text-base font-medium">
            Enter the 6-digit code sent to <br />
            <span className="text-[#6366F1] font-black">{email}</span>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl mb-8 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="space-y-2">
              <input
                type="text"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-5 text-center text-3xl font-black tracking-[0.5em] text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#6366F1]/50 focus:bg-white/10 transition-all shadow-inner"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-16 rounded-2xl font-black text-lg tracking-tight shadow-lg disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'VERIFY & CONTINUE'}
            </button>
          </form>

          <button 
            onClick={() => navigate('/signup')}
            className="mt-10 text-[#64748B] text-sm font-black uppercase tracking-widest hover:text-[#6366F1] transition-colors"
          >
            Back to Sign Up
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Verify;
