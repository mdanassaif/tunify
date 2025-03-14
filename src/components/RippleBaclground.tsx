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
  animationType: 'pulse' | 'orbit' | 'wave' | 'burst';
  zIndex: number;
  shadow: string;
}

export default function AdvancedRippleBackground() {
  const [ripples, setRipples] = useState<RippleCircle[]>([]);

  useEffect(() => {
    const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

    // Bold, high-contrast gradients with a futuristic vibe
    const vibrantColors = [
      'bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-orange-400',
      'bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-500',
      'bg-gradient-to-tr from-lime-500 via-teal-500 to-emerald-600',
      'bg-gradient-to-tr from-violet-600 via-indigo-500 to-blue-400',
      'bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600',
    ];

    const sizes = ['w-48 h-48', 'w-72 h-72', 'w-96 h-96']; // Larger for impact

    const animationTypes: RippleCircle['animationType'][] = [
      'pulse',
      'orbit',
      'wave',
      'burst',
    ];

    const shadows = [
      'shadow-[0_0_30px_rgba(236,72,153,0.5)]',
      'shadow-[0_0_30px_rgba(34,211,238,0.5)]',
      'shadow-[0_0_30px_rgba(52,211,153,0.5)]',
    ];

    const newRipples = Array.from({ length: 15 }).map(() => ({
      id: generateUniqueId(),
      color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      opacity: Math.random() * 0.5 + 0.4, // Higher opacity for boldness
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: Math.random() * 5 + 4, // Faster: 4-9s for energy
      animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
      zIndex: Math.floor(Math.random() * 30),
      shadow: shadows[Math.floor(Math.random() * shadows.length)],
    }));

    setRipples(newRipples);

    // Dynamic resize handler for responsiveness
    const handleResize = () => {
      setRipples((prev) =>
        prev.map((ripple) => ({
          ...ripple,
          left: Math.min(Math.max(ripple.left, 10), 90),
          top: Math.min(Math.max(ripple.top, 10), 90),
        }))
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gray-900">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`absolute rounded-full mix-blend-plus-lighter blur-lg 
            ${ripple.color} ${ripple.size} ${ripple.shadow}`}
          style={{
            left: `${ripple.left}%`,
            top: `${ripple.top}%`,
            opacity: ripple.opacity,
            zIndex: ripple.zIndex,
            animation: `${ripple.animationType} ${ripple.animationDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            transformOrigin: 'center center',
            filter: 'blur(25px)',
            willChange: 'transform, opacity',
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
        }

        @keyframes orbit {
          0% {
            transform: translateX(-20px) scale(0.8);
          }
          50% {
            transform: translateX(20px) scale(1.2);
          }
          100% {
            transform: translateX(-20px) scale(0.8);
          }
        }

        @keyframes wave {
          0% {
            transform: scale(0.7) translateY(0);
          }
          50% {
            transform: scale(1.3) translateY(-30px);
          }
          100% {
            transform: scale(0.7) translateY(0);
          }
        }

        @keyframes burst {
          0% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5) rotate(90deg);
            opacity: 0.9;
          }
          100% {
            transform: scale(0.5) rotate(180deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}