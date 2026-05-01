'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Waves, 
  Zap, 
  ChevronDown, 
  ShieldCheck, 
  Coffee, 
  Sparkles,
  ExternalLink,
  Globe,
  Mail
} from 'lucide-react';
import Preloader from '@/components/Preloader';

// Color Palette
const C = {
  bg:      '#05161A', // Deep Sea Background
  card:    '#072E33', // Deep Teal Card
  accent:  '#0F969C', // Teal Accent
  text:    '#6DA5C0', // Sky Blue Highlights
  white:   '#FFFFFF',
  muted:   '#294D61',
};

const FEATURED = [
  {
    name: 'Abyssal Cold Brew',
    tag: 'Slow Steeled · Earthy',
    price: 'Rp 35.000',
    img: '/abyssal_cold_brew_1777653654653.png',
    desc: 'Slow-steeped for 18 hours to bring out the deep, hidden tones of specialty beans.'
  },
  {
    name: 'Teal Cream Latte',
    tag: 'Smooth · Refreshing',
    price: 'Rp 32.000',
    img: '/kedai_core_hero_coffee_1777653633343.png',
    desc: 'Our signature latte infused with sky blue essence and topped with a velvety teal foam.'
  },
  {
    name: 'Sky Essence Pastry',
    tag: 'Crispy · Mirrored · Sweet',
    price: 'Rp 28.000',
    img: '/teal_pastry_1777653675593.png',
    desc: 'Artisan pastry with a teal mirror glaze, handcrafted to complement our deep sea brews.'
  }
];

export default function WelcomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me').then(res => {
      if (res.ok) {
        setIsLoggedIn(true);
      } else if (res.status === 401) {
        // Clear stale cookie to prevent loop
        fetch('/api/auth/logout', { method: 'POST' });
      }
    }).catch(() => {}).finally(() => setAuthLoading(false));

    if (!preloaderDone) return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial Entrance
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    )
    .fromTo(heroTitleRef.current, 
      { y: 100, opacity: 0, skewY: 5 }, 
      { y: 0, opacity: 1, skewY: 0, duration: 1.2 }, 
      '-=0.5'
    )
    .fromTo(heroImageRef.current,
      { scale: 1.2, opacity: 0, rotate: 5 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1.5, ease: 'expo.out' },
      '-=1'
    )
    .fromTo('.hero-cta',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8 },
      '-=0.8'
    );

    // Parallax effect on hero image based on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(heroImageRef.current, {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: 'power2.out'
      });
      
      gsap.to('.hero-glow', {
        x: xPos * 1.5,
        y: yPos * 1.5,
        duration: 1.5,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll Animations for sections
    gsap.utils.toArray('.reveal').forEach((elem: any) => {
      gsap.fromTo(elem, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
          }
        }
      );
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [preloaderDone]);

  return (
    <>
      <Preloader onDone={() => setPreloaderDone(true)} />
      
      <div 
        ref={scrollRef}
        className="min-h-screen selection:bg-teal-500 selection:text-white overflow-x-hidden"
        style={{ backgroundColor: C.bg, opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}
      >
        {/* Sticky Navigation */}
        <nav 
          ref={navRef}
          className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 backdrop-blur-md border-b border-white/5 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Waves className="w-5 h-5 text-teal-400" />
             </div>
             <span className="font-black tracking-[0.4em] uppercase text-xs text-white">KEDAI CORE</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
             <Link href="/menu" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-teal-400 transition-colors">Digital Menu</Link>
             <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-teal-400 transition-colors">Identity Log</Link>
             <Link href="/auth/register" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all">Join Essence</Link>
          </div>

          <Link href="/auth/login" className="md:hidden p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
             <ShieldCheck className="w-5 h-5 text-teal-400" />
          </Link>
        </nav>

        {/* HERO SECTION */}
        <section ref={heroRef} className="relative min-h-[100svh] flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
           {/* Abstract Background Elements */}
           <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-teal-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
           <div className="absolute top-0 left-0 w-full h-full opacity-10 md:opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #0F969C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

           <div className="relative z-10 text-center max-w-5xl mx-auto">
              <div className="hero-cta inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6 md:mb-8">
                 <Zap className="w-3 h-3 text-teal-400" />
                 <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-teal-400">Deep Sea Artisan v2.0</span>
              </div>

              <h1 ref={heroTitleRef} className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-white leading-[0.9] tracking-tighter mb-8 md:mb-12 uppercase break-words">
                 Code<br/><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>In Every</span><br/>Drop
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16">
                 <Link href={authLoading ? "#" : (isLoggedIn ? "/menu" : "/auth/login")} className={`hero-cta w-full sm:w-auto group relative px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-teal-500 text-[#05161A] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(15,150,156,0.3)] ${authLoading ? 'opacity-50 cursor-wait' : ''}`}>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                       {authLoading ? 'Checking Access...' : (isLoggedIn ? 'Open Digital Menu' : 'Login to View Menu')} 
                       <ArrowRight className={`w-4 h-4 transition-transform ${authLoading ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
                    </span>
                 </Link>
                 {!isLoggedIn && (
                   <Link href="/auth/register" className="hero-cta w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-center">
                      Create Identity
                   </Link>
                 )}
              </div>
           </div>

           <div ref={heroImageRef} className="relative w-full max-w-3xl aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/9] mt-6 md:mt-10 rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="/kedai_core_hero_coffee_1777653633343.png" 
                alt="Kedai Core Signature" 
                fill
                priority
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05161A] via-transparent to-transparent" />
           </div>

           <div className="absolute bottom-6 md:bottom-10 animate-bounce opacity-20">
              <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
           </div>
        </section>

        {/* FEATURED ESSENCE */}
        <section className="py-20 md:py-32 px-6 md:px-12 bg-white/[0.02]">
           <div className="max-w-7xl mx-auto">
              <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8">
                 <div>
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                       <Sparkles className="w-4 h-4 text-teal-400" />
                       <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">The Selection</span>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">Featured Essence</h2>
                 </div>
                 <p className="text-xs md:text-sm text-white/40 max-w-xs font-medium leading-relaxed">
                    Handcrafted brews and pastries designed to elevate your digital lifestyle.
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                 {FEATURED.map((item, idx) => (
                   <div 
                    key={idx} 
                    className="reveal group relative p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-white/5 border border-white/10 transition-all hover:bg-white/[0.08] hover:-translate-y-2"
                   >
                      <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8 border border-white/5">
                         <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                         <div>
                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-1">{item.name}</h3>
                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-teal-400">{item.tag}</p>
                         </div>
                         <span className="text-xs md:text-sm font-black text-white">{item.price}</span>
                      </div>
                      <p className="text-[10px] md:text-xs text-white/40 leading-relaxed mb-6 md:mb-8">{item.desc}</p>
                      <Link href={isLoggedIn ? "/menu" : "/auth/login"} className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-teal-400 transition-colors">
                         {isLoggedIn ? 'View Details' : 'Login to View'} <ExternalLink className="w-3 h-3" />
                      </Link>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="py-20 md:py-32 px-6 overflow-hidden">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="reveal relative order-2 lg:order-1">
                 <div className="absolute -top-10 md:-top-20 -left-10 md:-left-20 w-48 md:w-64 h-48 md:h-64 bg-teal-500/20 blur-[60px] md:blur-[100px] rounded-full" />
                 <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden border border-white/10 aspect-square">
                    <Image 
                      src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80&fit=crop" 
                      alt="Coffee Experience" 
                      fill
                      className="object-cover"
                    />
                 </div>
                 <div className="absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 p-6 md:p-10 rounded-[24px] md:rounded-[40px] bg-teal-500 text-[#05161A] shadow-2xl hidden sm:block">
                    <Coffee className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4" />
                    <p className="text-xl md:text-2xl font-black leading-tight uppercase tracking-tighter italic">Pure<br/>Depth</p>
                 </div>
              </div>

              <div className="reveal order-1 lg:order-2">
                 <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <div className="w-6 md:w-8 h-[1px] bg-teal-400" />
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">The Philosophy</span>
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 md:mb-10 leading-[0.9]">Beyond The<br/>Surface</h2>
                 <p className="text-sm md:text-lg text-white/60 font-medium leading-relaxed mb-8 md:mb-12">
                    Kedai Core is more than just a coffee shop. It&apos;s a digital sanctuary where artisanal flavors meet modern technology. We believe in depth&mdash;in flavor, in craft, and in the connections we build through every cup.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                    <div>
                       <h4 className="text-white font-black text-xl md:text-2xl mb-1 md:mb-2">100%</h4>
                       <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40">Artisan Beans</p>
                    </div>
                    <div>
                       <h4 className="text-white font-black text-xl md:text-2xl mb-1 md:mb-2">0.4s</h4>
                       <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40">Sync Speed</p>
                    </div>
                 </div>

                 <Link href={isLoggedIn ? "/menu" : "/auth/register"} className="inline-flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white group">
                    {isLoggedIn ? 'Explore The Menu' : 'Join The Collective'} <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-[#05161A] transition-all"><ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></div>
                 </Link>
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20 md:pt-32 pb-8 md:pb-12 px-6 md:px-12 border-t border-white/5">
           <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-12 mb-12 md:mb-20">
                 <div>
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                       <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                          <Waves className="w-4 h-4 text-teal-400" />
                       </div>
                       <span className="font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] text-white">Kedai Core</span>
                    </div>
                    <p className="text-white/40 text-[10px] md:text-xs font-medium tracking-wide">Crafting digital experiences through artisan flavors.</p>
                 </div>

                 <div className="flex gap-4 md:gap-6">
                    <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-teal-400 transition-colors border border-white/5"><Globe className="w-4 h-4 md:w-5 md:h-5" /></a>
                    <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-teal-400 transition-colors border border-white/5"><Mail className="w-4 h-4 md:w-5 md:h-5" /></a>
                    <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-teal-400 transition-colors border border-white/5"><Zap className="w-4 h-4 md:w-5 md:h-5" /></a>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 pt-8 md:pt-12 border-t border-white/5">
                 <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20">© 2026 KEDAI CORE. ALL RIGHTS RESERVED.</p>
                 <div className="flex gap-6 md:gap-10">
                    <a href="#" className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors">Terms of Sync</a>
                 </div>
              </div>
           </div>
        </footer>
      </div>
    </>
  );
}
