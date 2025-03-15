'use client';

import React, { useEffect, useState } from 'react';

interface RippleCircle {
  id: string;
  color: string;
  size: string;
  left: number;
  top: number;
  animationDuration: number;
}

export default function AdvancedRippleBackground() {
  const [ripples, setRipples] = useState<RippleCircle[]>([]);

  useEffect(() => {
    const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

    const colors = [
      'bg-fuchsia-600',
      'bg-cyan-500',
      'bg-lime-500',
    ];

    const sizes = ['w-48 h-48', 'w-72 h-72'];

    const newRipples = Array.from({ length: 5 }).map(() => ({
      id: generateUniqueId(),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: Math.random() * 4 + 3,
    }));

    setRipples(newRipples);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gray-900">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`absolute rounded-full ${ripple.color} ${ripple.size}`}
          style={{
            left: `${ripple.left}%`,
            top: `${ripple.top}%`,
            opacity: 0.3,
            animation: `pulse ${ripple.animationDuration}s ease-in-out infinite`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}