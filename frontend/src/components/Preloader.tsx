'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/* ─── Palette ─────────────────────────────────────────────────────────────── */
const TERRA = '#8EB69B'; // Accent/Soft
const BROWN = '#051F20'; // Primary
const MUTED = '#DAF1DE'; // Highlights
const WARM  = '#163832'; // Secondary dark

/* ─── SVG Bean ────────────────────────────────────────────────────────────── */
function Bean({ size = 36, color = TERRA, op = 1, rot = 0 }: {
  size?: number; color?: string; op?: number; rot?: number;
}) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none"
      style={{ opacity: op, transform: `rotate(${rot}deg)` }}>
      <ellipse cx="30" cy="19.5" rx="30" ry="19.5" fill={color} />
      <path d="M30 4 Q30 19.5 30 35" stroke="#6B4226"
        strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(true);

  /* Refs for GSAP targets */
  const wrapRef      = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLDivElement>(null);
  const topPanelRef  = useRef<HTMLDivElement>(null);
  const btmPanelRef  = useRef<HTMLDivElement>(null);
  const nameRef      = useRef<HTMLDivElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const barTrackRef  = useRef<HTMLDivElement>(null);
  const barFillRef   = useRef<HTMLDivElement>(null);
  const b1           = useRef<HTMLDivElement>(null);
  const b2           = useRef<HTMLDivElement>(null);
  const b3           = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety net: if animation doesn't complete in 4.5s (e.g. HMR reload), force done
    const fallback = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 4500);

    const ctx = gsap.context(() => {
      /* ── Initial states ── */
      gsap.set(imgRef.current,      { scale: 1.15, opacity: 0 });
      gsap.set(nameRef.current,     { yPercent: 110, opacity: 0 });
      gsap.set(subRef.current,      { y: 18, opacity: 0 });
      gsap.set(barTrackRef.current, { opacity: 0 });
      gsap.set(barFillRef.current,  { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(topPanelRef.current, { yPercent: 0 });
      gsap.set(btmPanelRef.current, { yPercent: 0 });

      // Only animate beans that exist
      const beans = [b1.current, b2.current, b3.current].filter(Boolean);
      if (beans.length) gsap.set(beans, { scale: 0, opacity: 0 });

      /* ── Master timeline ── */
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(fallback);
          setVisible(false);
          onDone?.();
        },
      });

      /* Phase 1 — Image + beans appear */
      tl.to(imgRef.current, { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out' }, 0);
      if (beans.length) {
        tl.to(beans, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2.2)' }, 0.35);
      }

      /* Phase 2 — Brand name reveal */
      tl.to(nameRef.current,    { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }, 0.65)
        .to(subRef.current,     { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, 0.9)
        .to(barTrackRef.current,{ opacity: 1, duration: 0.3 }, 1.05)
        .to(barFillRef.current, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 1.1);

      /* Bean floating loops */
      if (b1.current) gsap.to(b1.current, { y: -14, rotation: 14, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      if (b2.current) gsap.to(b2.current, { y: -10, rotation: -10, duration: 5.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.9 });
      if (b3.current) gsap.to(b3.current, { y: -18, rotation: 16, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });

      /* Phase 3 — Cinematic split reveal */
      tl.to(barFillRef.current, { scaleX: 1.05, opacity: 0, duration: 0.35, ease: 'power2.in' }, 2.4);
      if (beans.length) {
        tl.to(beans, { scale: 0, opacity: 0, duration: 0.35, stagger: 0.06, ease: 'power2.in' }, 2.38);
      }
      tl.to(nameRef.current, { yPercent: -115, opacity: 0, duration: 0.5, ease: 'power3.in' }, 2.4)
        .to(subRef.current,  { y: -20, opacity: 0, duration: 0.4, ease: 'power2.in' }, 2.42)
        .to(imgRef.current,  { scale: 1.25, duration: 0.55, ease: 'power3.in' }, 2.35)
        /* Panels split */
        .to(topPanelRef.current, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, 2.7)
        .to(btmPanelRef.current, { yPercent: 100,  duration: 0.75, ease: 'power4.inOut' }, 2.7)
        .to(wrapRef.current,     { opacity: 0, duration: 0.15, ease: 'none' }, 3.38);
    }, wrapRef);

    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ backgroundColor: BROWN }}
    >
      {/* ── Full-screen coffee photo behind everything ── */}
      <div
        ref={imgRef}
        className="absolute inset-0 w-full h-full"
        style={{ transformOrigin: 'center center' }}
      >
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=85&fit=crop"
          alt="Coffee"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) brightness(0.7) contrast(1.1)' }}
        />
        {/* Deep forest overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(5,31,32,0.85) 0%, rgba(5,31,32,0.20) 55%, transparent 100%)' }}
        />
      </div>

      {/* ── TOP split panel (flies up on exit) ── */}
      <div
        ref={topPanelRef}
        className="absolute top-0 left-0 w-full h-1/2 pointer-events-none"
        style={{ backgroundColor: BROWN, zIndex: 10 }}
      />
      {/* ── BOTTOM split panel (flies down on exit) ── */}
      <div
        ref={btmPanelRef}
        className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none"
        style={{ backgroundColor: BROWN, zIndex: 10 }}
      />

      {/* ── Floating beans (above photo, below panels) ── */}
      <div ref={b1} className="absolute top-[14%] left-[8%] z-20 pointer-events-none"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>
        <Bean size={52} color={TERRA} op={0.9} rot={12} />
      </div>
      <div ref={b2} className="absolute top-[20%] right-[10%] z-20 pointer-events-none"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.20))' }}>
        <Bean size={36} color="#C17F5E" op={0.8} rot={-18} />
      </div>
      <div ref={b3} className="absolute bottom-[28%] right-[12%] z-20 pointer-events-none"
        style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.22))' }}>
        <Bean size={44} color="#6B4226" op={0.75} rot={25} />
      </div>

      {/* ── Center content (above photo) ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-[15vh]">

        {/* Name — overflow hidden for clip-path-like reveal */}
        <div style={{ overflow: 'hidden', lineHeight: 1 }}>
          <div
            ref={nameRef}
            className="text-center"
          >
            <span
              className="block font-bold italic leading-none tracking-tight"
              style={{
                fontSize: 'clamp(64px, 10vw, 110px)',
                color: '#FFFFFF',
                fontFamily: "'Cormorant Garamond', serif",
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              }}
            >
              Kedai&nbsp;<span style={{ color: TERRA }}>Code</span>
            </span>
          </div>
        </div>

        {/* Sub label */}
        <p
          ref={subRef}
          className="text-[12px] tracking-[0.5em] uppercase font-semibold mt-4 mb-8"
          style={{ color: 'rgba(142,182,155,0.70)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Modern Forest Menu
        </p>

        {/* Progress bar */}
        <div
          ref={barTrackRef}
          className="w-40 h-[2px] rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
        >
          <div
            ref={barFillRef}
            className="h-full rounded-full"
            style={{ backgroundColor: TERRA }}
          />
        </div>
      </div>
    </div>
  );
}
