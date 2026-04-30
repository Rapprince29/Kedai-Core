'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Preloader from '@/components/Preloader';

const C = {
  bg:     '#051F20', // Primary (Background)
  white:  '#0B2B26', // Secondary
  brown:  '#DAF1DE', // Highlights (Text)
  terra:  '#8EB69B', // Soft Elements
  accent: '#235347', // Accent
  muted:  '#8EB69B', // Text/Soft
  sand:   '#163832', // Secondary dark
  warm:   '#163832', // Secondary dark
};

const COFFEES = [
  {
    name: 'Forest Espresso',
    tag: 'Bold · Deep · Aromatic',
    desc: 'A dark, intense shot with notes of cedar and cocoa, perfectly captured for the modern artisan.',
    price: 'Rp 28.000',
    accentColor: '#8EB69B',
    bgTint: '#0B2B26',
    img: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=800&q=85&fit=crop',
  },
  {
    name: 'Mint Cream Latte',
    tag: 'Smooth · Minty · Fresh',
    desc: 'Our signature latte infused with fresh mint and topped with a velvety cream foam.',
    price: 'Rp 32.000',
    accentColor: '#DAF1DE',
    bgTint: '#163832',
    img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=85&fit=crop',
  },
  {
    name: 'Moss Cold Brew',
    tag: 'Cold · Earthy · Smooth',
    desc: 'Slow-steeped for 18 hours to bring out the deep, earthy tones of our specialty beans.',
    price: 'Rp 35.000',
    accentColor: '#235347',
    bgTint: '#0B2B26',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=85&fit=crop',
  },
  {
    name: 'Artisan Flat White',
    tag: 'Balanced · Velvety',
    desc: 'A perfectly balanced ratio of ristretto and microfoam, creating a smooth, artisan experience.',
    price: 'Rp 30.000',
    accentColor: '#8EB69B',
    bgTint: '#163832',
    img: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=800&q=85&fit=crop',
  },
  {
    name: 'Cedar Pour Over',
    tag: 'Floral · Complex',
    desc: 'Hand-crafted filter coffee that reveals delicate floral and woody notes.',
    price: 'Rp 38.000',
    accentColor: '#DAF1DE',
    bgTint: '#0B2B26',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85&fit=crop',
  },
];

// ── SVG Bean shape ────────────────────────────────────────────────────────────
function Bean({ size = 40, color = '#A0522D', op = 1, rotate = 0 }: {
  size?: number; color?: string; op?: number; rotate?: number;
}) {
  return (
    <svg
      width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none"
      style={{ opacity: op, transform: `rotate(${rotate}deg)` }}
    >
      <ellipse cx="30" cy="19.5" rx="30" ry="19.5" fill={color} />
      <path d="M30 4 Q30 19.5 30 35" stroke={color === '#F2F0EB' ? '#DDD0BE' : '#6B4226'}
        strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export default function WelcomePage() {
  const [current,  setCurrent]  = useState(0);
  const [busy,     setBusy]     = useState(false);
  const [bgTint,   setBgTint]   = useState(COFFEES[0].bgTint);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Content refs (right panel)
  const nameWrapRef = useRef<HTMLDivElement>(null);
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const priceRef    = useRef<HTMLDivElement>(null);

  // Image refs (left panel)
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const circleRef   = useRef<HTMLDivElement>(null);

  // Bean refs
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);
  const b4 = useRef<HTMLDivElement>(null);
  const b5 = useRef<HTMLDivElement>(null);

  // ── Entry animation (first render) ──────────────────────────────────────────
  useEffect(() => {
    // Reset for clip-path text reveal
    gsap.set(nameRef.current,  { yPercent: 110, opacity: 0 });
    gsap.set(tagRef.current,   { y: 20, opacity: 0 });
    gsap.set(lineRef.current,  { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(descRef.current,  { y: 24, opacity: 0 });
    gsap.set(priceRef.current, { y: 16, opacity: 0 });
    gsap.set(circleRef.current,{ scale: 0.7, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(circleRef.current, { scale: 1, opacity: 1, duration: 1.1, ease: 'back.out(1.2)' }, 0.2)
      .to(nameRef.current,   { yPercent: 0, opacity: 1, duration: 0.9 }, 0.6)
      .to(tagRef.current,    { y: 0, opacity: 1, duration: 0.65 }, 0.9)
      .to(lineRef.current,   { scaleX: 1, duration: 0.55 }, 1.0)
      .to(descRef.current,   { y: 0, opacity: 1, duration: 0.6 }, 1.1)
      .to(priceRef.current,  { y: 0, opacity: 1, duration: 0.5 }, 1.25);
  }, []);

  // ── Floating beans ───────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(b1.current, { y: -22, rotation: 16, duration: 5.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(b2.current, { y: -14, rotation: -10, duration: 6.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.3 });
      gsap.to(b3.current, { y: -28, rotation: 18, duration: 4.7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.7 });
      gsap.to(b4.current, { y: -12, rotation: -14, duration: 5.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.1 });
      gsap.to(b5.current, { y: -18, rotation: 10, duration: 7.1, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.4 });
    });
    return () => ctx.revert();
  }, []);

  // ── Slide transition ─────────────────────────────────────────────────────────
  const goTo = useCallback((next: number) => {
    if (busy || next === current) return;
    setBusy(true);
    const dir = next > current ? 1 : -1;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setCurrent(next);
        setBgTint(COFFEES[next].bgTint);
        setBusy(false);
      },
    });

    // ── EXIT ──
    // Image: scale down + slide out
    tl.to(circleRef.current, {
        scale: 0.78, xPercent: -30 * dir, opacity: 0,
        duration: 0.5, ease: 'power2.in',
      }, 0)
    // Name: clip-path slide up out
      .to(nameRef.current, { yPercent: -110, opacity: 0, duration: 0.38, ease: 'power2.in' }, 0.02)
      .to(tagRef.current,  { y: -16, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.05)
      .to(lineRef.current, { scaleX: 0, transformOrigin: dir > 0 ? 'right center' : 'left center', duration: 0.3 }, 0.06)
      .to(descRef.current, { y: -14, opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.08)
      .to(priceRef.current,{ y: -10, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.10)

    // ── ENTER (after mid-point) ──
    // Image arrives from opposite side
      .set(circleRef.current, { xPercent: 30 * dir, scale: 0.82, opacity: 0 })
      .to(circleRef.current, {
          xPercent: 0, scale: 1, opacity: 1,
          duration: 0.7, ease: 'back.out(1.1)',
        }, 0.42)

    // Text reveals with clip-path stagger
      .set(nameRef.current,  { yPercent: 105, opacity: 0 })
      .set(tagRef.current,   { y: 22, opacity: 0 })
      .set(lineRef.current,  { scaleX: 0, transformOrigin: 'left center' })
      .set(descRef.current,  { y: 26, opacity: 0 })
      .set(priceRef.current, { y: 18, opacity: 0 })
      .to(nameRef.current,   { yPercent: 0, opacity: 1, duration: 0.65 }, 0.52)
      .to(tagRef.current,    { y: 0, opacity: 1, duration: 0.5 }, 0.65)
      .to(lineRef.current,   { scaleX: 1, duration: 0.48 }, 0.72)
      .to(descRef.current,   { y: 0, opacity: 1, duration: 0.48 }, 0.78)
      .to(priceRef.current,  { y: 0, opacity: 1, duration: 0.42 }, 0.86);
  }, [busy, current]);

  const prev = useCallback(() => goTo((current - 1 + COFFEES.length) % COFFEES.length), [current, goTo]);
  const next = useCallback(() => goTo((current + 1) % COFFEES.length), [current, goTo]);

  // ── Wheel + touch support ────────────────────────────────────────────────────
  useEffect(() => {
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel < 900) return;
      lastWheel = now;
      if (e.deltaY > 30)  next();
      if (e.deltaY < -30) prev();
    };
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 50) { dy > 0 ? next() : prev(); }
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [next, prev]);

  const coffee = COFFEES[current];

  return (
    <>
      <Preloader onDone={() => setPreloaderDone(true)} />
      <main
        className="min-h-screen overflow-hidden"
        style={{
          backgroundColor: C.bg,
          opacity: preloaderDone ? 1 : 0,
          pointerEvents: preloaderDone ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
      {/* Preload all slide images */}
      <div className="hidden" aria-hidden="true">
        {COFFEES.map(c => <img key={c.name} src={c.img} alt="" width={1} height={1} />)}
      </div>

      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ════════════════════ LEFT: Visual ════════════════════ */}
        <div
          className="relative lg:w-[55%] h-[50vh] lg:h-screen overflow-hidden flex items-center justify-center transition-colors duration-700"
          style={{ backgroundColor: bgTint }}
        >
          {/* Subtle dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(28,16,7,0.06) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          {/* ── Main coffee circle ── */}
          <div
            ref={circleRef}
            className="relative w-[270px] h-[270px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden shadow-2xl"
            style={{ boxShadow: `0 50px 120px ${coffee.accentColor}30, 0 10px 40px rgba(0,0,0,0.12)` }}
          >
            <img
              ref={imgRef}
              src={coffee.img}
              alt={coffee.name}
              className="w-full h-full object-cover scale-110"
              style={{
                filter: 'saturate(1.12) contrast(1.05)',
                transition: 'src 0s',
              }}
            />
            {/* Warm color overlay matching accent */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: `linear-gradient(145deg, ${coffee.accentColor}14 0%, transparent 55%)` }} />
          </div>

          {/* ── Floating beans ── */}
          <div ref={b1} className="absolute top-[9%] left-[7%] pointer-events-none"
            style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.18))' }}>
            <Bean size={54} color={coffee.accentColor} />
          </div>
          <div ref={b2} className="absolute top-[16%] right-[8%] pointer-events-none"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.14))' }}>
            <Bean size={36} color={C.accent} op={0.85} rotate={-15} />
          </div>
          <div ref={b3} className="absolute bottom-[15%] left-[10%] pointer-events-none"
            style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.18))' }}>
            <Bean size={44} color="#C17F5E" op={0.9} rotate={20} />
          </div>
          <div ref={b4} className="absolute bottom-[24%] right-[7%] pointer-events-none"
            style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))' }}>
            <Bean size={30} color={coffee.accentColor} op={0.65} rotate={-8} />
          </div>
          <div ref={b5} className="absolute top-[44%] left-[4%] pointer-events-none"
            style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.10))' }}>
            <Bean size={22} color={C.muted} op={0.5} rotate={30} />
          </div>

          {/* ── Counter + prev/next ── */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              style={{ backgroundColor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: C.brown }} />
            </button>
            <span
              className="px-5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest"
              style={{ backgroundColor: 'rgba(255,255,255,0.65)', color: C.muted, backdropFilter: 'blur(12px)' }}
            >
              {String(current + 1).padStart(2, '0')} / {String(COFFEES.length).padStart(2, '0')}
            </span>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              style={{ backgroundColor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
            >
              <ArrowRight className="w-4 h-4" style={{ color: C.brown }} />
            </button>
          </div>

          {/* Top badge */}
          <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)' }}>
            <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: C.accent }}>
              ☕ Coffee Flavours
            </span>
          </div>
        </div>

        {/* ════════════════════ RIGHT: Content ════════════════════ */}
        <div
          className="relative lg:w-[45%] flex flex-col items-start justify-center px-10 py-14 lg:px-16 lg:py-0 overflow-hidden"
          style={{ backgroundColor: C.white }}
        >
          {/* ── Functional dot navigation ── */}
          <div className="hidden lg:flex flex-col gap-3 absolute right-7 top-1/2 -translate-y-1/2 z-20">
            {COFFEES.map((c, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                title={c.name}
                className="rounded-full transition-all duration-400"
                style={{
                  width:  i === current ? '10px' : '6px',
                  height: i === current ? '10px' : '6px',
                  backgroundColor: i === current ? C.terra : C.sand,
                  boxShadow: i === current ? `0 0 0 3px ${C.terra}25` : 'none',
                }}
              />
            ))}
          </div>

          {/* Mobile pill dots */}
          <div className="flex lg:hidden gap-2 mb-7">
            {COFFEES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="rounded-full transition-all duration-400"
                style={{ width: i === current ? '28px' : '8px', height: '8px', backgroundColor: i === current ? C.terra : C.sand }}
              />
            ))}
          </div>

          {/* Brand */}
          <p className="text-[11px] tracking-[0.48em] uppercase font-semibold mb-6" style={{ color: C.muted }}>
            ✦ Coffee Flavours
          </p>

          {/* Name — clip-path container so overflow is hidden */}
          <div ref={nameWrapRef} style={{ overflow: 'hidden', lineHeight: 1 }}>
            <h1
              ref={nameRef}
              className="font-bold italic leading-[0.9] tracking-tight"
              style={{
                fontSize: 'clamp(60px, 8vw, 100px)',
                color: C.brown,
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {coffee.name}
            </h1>
          </div>

          {/* Tag */}
          <p
            ref={tagRef}
            className="text-[11px] tracking-[0.3em] uppercase font-semibold mt-5"
            style={{ color: coffee.accentColor }}
          >
            {coffee.tag}
          </p>

          {/* Animated line */}
          <div
            ref={lineRef}
            className="my-4 h-[1.5px] rounded-full"
            style={{ width: '40px', backgroundColor: coffee.accentColor, opacity: 0.5 }}
          />

          {/* Description */}
          <p
            ref={descRef}
            className="text-[13.5px] leading-relaxed max-w-[310px] font-light mb-7"
            style={{ color: C.muted }}
          >
            {coffee.desc}
          </p>

          {/* Price + CTA */}
          <div ref={priceRef} className="flex items-center gap-7 mb-10">
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase font-semibold mb-0.5" style={{ color: C.muted }}>Harga</p>
              <p
                className="text-2xl font-bold italic"
                style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
              >
                {coffee.price}
              </p>
            </div>
            <Link href="/menu" prefetch={true}>
              <button
                className="group flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-sm tracking-[0.08em] uppercase transition-all hover:scale-105 active:scale-95 text-white"
                style={{ backgroundColor: C.terra, boxShadow: `0 16px 48px ${C.terra}38` }}
              >
                ORDER NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="flex items-center gap-3">
            <div className="w-px h-8" style={{ backgroundColor: C.sand }} />
            <p className="text-[10px] tracking-[0.35em] uppercase font-medium" style={{ color: `${C.muted}60` }}>
              Scroll untuk explore
            </p>
          </div>

          {/* Footer */}
          <p className="absolute bottom-8 left-16 text-[9px] tracking-[0.3em] uppercase"
            style={{ color: `${C.muted}45` }}>
            Kedai Core · Digital Menu
          </p>
        </div>
      </div>
      </main>
    </>
  );
}
