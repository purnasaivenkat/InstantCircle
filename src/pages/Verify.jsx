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
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#1E293B] rounded-3xl p-8 border border-[#334155] shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-[#F8FAFC]">Verify Email</h2>
        <p className="text-[#94A3B8] mb-8 text-sm">
          Enter the 6-digit code sent to <br />
          <span className="text-[#6366F1] font-bold">{email}</span>
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#6366F1] transition-all"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-[#6366F1] text-white font-bold text-lg hover:bg-[#5558E3] transition-all shadow-lg shadow-[#6366F1]/20 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/signup')}
          className="mt-8 text-[#94A3B8] text-sm hover:text-[#6366F1] transition-colors"
        >
          Back to Sign Up
        </button>
      </motion.div>
    </div>
  );
};

export default Verify;
