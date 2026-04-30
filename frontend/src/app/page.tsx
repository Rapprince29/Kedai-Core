'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Waves, Zap } from 'lucide-react';
import Preloader from '@/components/Preloader';

const C = {
  bg:      '#05161A', // Deep Sea Background
  white:   '#072E33', // Deep Teal Card
  brown:   '#6DA5C0', // Sky Blue Highlights
  terra:   '#0F969C', // Teal Accent
  accent:  '#0C7075', // Dark Teal CTA
  muted:   '#294D61', // Muted Blue
};

const COFFEES = [
  {
    name: 'Deep Sea Espresso',
    tag: 'Bold · Deep · Aromatic',
    desc: 'A dark, intense shot with notes of the ocean floor, perfectly captured for the modern artisan.',
    price: 'Rp 28.000',
    accentColor: '#0F969C',
    bgTint: '#072E33',
    img: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=800&q=85&fit=crop',
  },
  {
    name: 'Teal Cream Latte',
    tag: 'Smooth · Refreshing · Fresh',
    desc: 'Our signature latte infused with sky blue essence and topped with a velvety teal foam.',
    price: 'Rp 32.000',
    accentColor: '#6DA5C0',
    bgTint: '#05161A',
    img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=85&fit=crop',
  },
  {
    name: 'Abyssal Cold Brew',
    tag: 'Cold · Earthy · Smooth',
    desc: 'Slow-steeped for 18 hours to bring out the deep, hidden tones of our specialty beans.',
    price: 'Rp 35.000',
    accentColor: '#0C7075',
    bgTint: '#072E33',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=85&fit=crop',
  },
];

export default function WelcomePage() {
  const [current,  setCurrent]  = useState(0);
  const [busy,     setBusy]     = useState(false);
  const [bgTint,   setBgTint]   = useState(COFFEES[0].bgTint);
  const [preloaderDone, setPreloaderDone] = useState(false);

  const nameRef     = useRef<HTMLHeadingElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const priceRef    = useRef<HTMLDivElement>(null);
  const circleRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preloaderDone) return;
    
    gsap.set(nameRef.current,  { y: 30, opacity: 0 });
    gsap.set(tagRef.current,   { y: 20, opacity: 0 });
    gsap.set(lineRef.current,  { scaleX: 0 });
    gsap.set(descRef.current,  { y: 20, opacity: 0 });
    gsap.set(priceRef.current, { y: 20, opacity: 0 });
    gsap.set(circleRef.current,{ scale: 0.8, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(circleRef.current, { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)' }, 0.2)
      .to(nameRef.current,   { y: 0, opacity: 1, duration: 0.8 }, 0.4)
      .to(tagRef.current,    { y: 0, opacity: 1, duration: 0.6 }, 0.5)
      .to(lineRef.current,   { scaleX: 1, duration: 0.5 }, 0.6)
      .to(descRef.current,   { y: 0, opacity: 1, duration: 0.6 }, 0.7)
      .to(priceRef.current,  { y: 0, opacity: 1, duration: 0.5 }, 0.8);
  }, [preloaderDone]);

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

    tl.to(circleRef.current, { scale: 0.8, x: -50 * dir, opacity: 0, duration: 0.4 }, 0)
      .to(nameRef.current, { y: -20, opacity: 0, duration: 0.3 }, 0)
      .set(circleRef.current, { x: 50 * dir, scale: 0.8 })
      .to(circleRef.current, { x: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }, 0.4)
      .to(nameRef.current, { y: 0, opacity: 1, duration: 0.5 }, 0.5);
  }, [busy, current]);

  const next = useCallback(() => goTo((current + 1) % COFFEES.length), [current, goTo]);

  const coffee = COFFEES[current];

  return (
    <>
      <Preloader onDone={() => setPreloaderDone(true)} />
      <main
        className="min-h-screen overflow-hidden flex flex-col lg:flex-row"
        style={{
          backgroundColor: C.bg,
          opacity: preloaderDone ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* LEFT: Visual */}
        <div
          className="relative lg:w-1/2 h-[50vh] lg:h-screen flex items-center justify-center transition-colors duration-700"
          style={{ backgroundColor: bgTint }}
        >
           <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle, #0F969C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <div ref={circleRef} className="relative w-64 h-64 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-white/10">
              <img src={coffee.img} alt={coffee.name} className="w-full h-full object-cover scale-110" />
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent" />
           </div>

           <div className="absolute bottom-10 flex gap-4">
              {COFFEES.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} 
                  className="w-12 h-1.5 rounded-full transition-all duration-300"
                  style={{ backgroundColor: i === current ? C.terra : 'rgba(255,255,255,0.1)' }} />
              ))}
           </div>
        </div>

        {/* RIGHT: Content */}
        <div className="lg:w-1/2 flex flex-col justify-center px-10 py-16 lg:px-24" style={{ backgroundColor: C.bg }}>
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
                 <Waves className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-teal-400">Deep Sea Artisan</span>
           </div>

           <h1 ref={nameRef} className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-6">
              {coffee.name}
           </h1>

           <p ref={tagRef} className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: C.brown }}>
              {coffee.tag}
           </p>

           <div ref={lineRef} className="w-16 h-1 bg-teal-500 mb-8 rounded-full" />

           <p ref={descRef} className="text-sm leading-relaxed opacity-60 text-white max-w-md mb-12 font-medium">
              {coffee.desc}
           </p>

           <div ref={priceRef} className="flex items-center gap-10">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Depth Price</p>
                 <p className="text-3xl font-black text-white">{coffee.price}</p>
              </div>
              <Link href="/menu">
                 <button className="flex items-center gap-3 px-10 py-5 rounded-full font-black text-xs tracking-widest uppercase text-[#05161A] transition-all hover:scale-105 active:scale-95 shadow-xl"
                   style={{ backgroundColor: C.terra, boxShadow: `0 20px 40px ${C.terra}40` }}>
                    Explore Depth
                    <ArrowRight className="w-5 h-5" />
                 </button>
              </Link>
           </div>
        </div>
      </main>
    </>
  );
}
