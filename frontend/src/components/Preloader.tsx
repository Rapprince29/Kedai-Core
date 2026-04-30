'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Waves, Zap } from 'lucide-react';

const C = {
  bg: '#05161A',
  teal: '#0F969C',
  dark: '#072E33'
};

interface PreloaderProps {
  onDone?: () => void;
}

export default function Preloader({ onDone }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          display: 'none',
          onComplete: () => {
            if (onDone) onDone();
          }
        });
      }
    });

    tl.fromTo(logoRef.current, 
      { scale: 0.8, opacity: 0, rotate: -10 }, 
      { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)' }
    )
    .fromTo(textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(barRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power2.inOut' },
      '-=0.2'
    )
    .to([logoRef.current, textRef.current, barRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.4,
      delay: 0.5,
      ease: 'power2.in'
    });

    return () => { tl.kill(); };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      <div className="relative flex flex-col items-center">
        <div ref={logoRef} className="mb-8 relative">
           <div className="absolute inset-0 bg-teal-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
           <div className="w-24 h-24 rounded-[32px] flex items-center justify-center relative z-10" style={{ backgroundColor: C.dark, border: `1px solid ${C.teal}40` }}>
              <Waves className="w-12 h-12 text-teal-400" />
           </div>
           <Zap className="w-6 h-6 absolute -top-2 -right-2 text-teal-400 animate-bounce" />
        </div>

        <div ref={textRef} className="text-center">
          <h1 className="text-2xl font-black tracking-[0.5em] text-white uppercase mb-2">KEDAI CODE</h1>
          <p className="text-[10px] tracking-[0.6em] uppercase text-teal-400 font-bold opacity-60">System Syncing...</p>
        </div>

        <div className="w-48 h-[2px] mt-10 rounded-full overflow-hidden bg-white/5">
          <div ref={barRef} className="h-full w-full origin-left bg-teal-400" />
        </div>
      </div>

      {/* Decorative waves */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none">
         <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill={C.teal} d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
         </svg>
      </div>
    </div>
  );
}
