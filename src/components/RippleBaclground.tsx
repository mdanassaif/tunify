'use client';

import React, { useEffect, useState } from 'react';

interface RippleCircle {
  id: string;
  color: string;
  size: string;
  opacity: number;
  left: number;
  top: number;
  animationDuration: number;
  animationType: 'expand' | 'contract' | 'rotate' | 'transform';
  zIndex: number;
}

export default function AdvancedRippleBackground() {
  const [ripples, setRipples] = useState<RippleCircle[]>([]);

  useEffect(() => {
    const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

    const vibrantColors = [
      'bg-gradient-to-r from-pink-500 to-pink-300',
      'bg-gradient-to-r from-blue-500 to-blue-300', 
      'bg-gradient-to-r from-green-500 to-green-300',
      'bg-gradient-to-r from-purple-500 to-purple-300', 
      'bg-gradient-to-r from-indigo-500 to-indigo-300',
      'bg-gradient-to-r from-red-500 to-red-300',
      'bg-gradient-to-r from-yellow-500 to-yellow-300'
    ];

    const sizes = [
      'w-32 h-32', 
      'w-48 h-48', 
      'w-56 h-56'
    ];

    const animationTypes: RippleCircle['animationType'][] = ['expand', 'rotate'];

    const newRipples = Array.from({ length: 10 }).map(() => ({
      id: generateUniqueId(),
      color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      opacity: Math.random() * 0.5 + 0.3,
      left: Math.random() * 100,  // Reduced range for better layout on smaller screens
      top: Math.random() * 100,   // Reduced range
      animationDuration: Math.random() * 8 + 8, // 8-16 seconds for shorter animation times
      animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
      zIndex: Math.floor(Math.random() * 10)
    }));

    setRipples(newRipples);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`absolute rounded-full mix-blend-screen blur-sm 
            ${ripple.color} ${ripple.size}`}
          style={{
            left: `${ripple.left}%`,
            top: `${ripple.top}%`,
            opacity: ripple.opacity,
            zIndex: ripple.zIndex,
            animation: `
              ${ripple.animationType} 
              ${ripple.animationDuration}s 
              ease-in-out 
              infinite 
              alternate
            `,
            transformOrigin: 'center center'
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes expand {
          0% {
            transform: scale(0.4) rotate(0deg);
          }
          50% {
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            transform: scale(0.4) rotate(360deg);
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg) scale(0.8);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
