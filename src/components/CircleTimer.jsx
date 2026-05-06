import React, { useState, useEffect } from 'react';

const CircleTimer = ({ durationSeconds = 600, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = timeLeft <= 30;

  return (
    <div className={`px-3 py-1.5 rounded-full border ${
      isWarning
        ? 'bg-red-500/10 border-red-500/30'
        : 'bg-[#6366F1]/10 border-[#6366F1]/30'
    }`}>
      <span className={`text-xs font-semibold ${
        isWarning ? 'text-red-400' : 'text-[#6366F1]'
      }`}>
        {display}
      </span>
    </div>
  );
};

export default CircleTimer;
