'use client';

import { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import { gsap } from 'gsap';
import { useMenuStore } from '@/store/menuStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, ArrowLeft, Search, X, Clock, ChevronRight, Waves, Zap, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import MenuCard from '@/components/menu/MenuCard';
import axios from 'axios';

const C = {
  bg:      '#05161A', // Deep Sea Background
  white:   '#072E33', // Deep Teal Card
  brown:   '#6DA5C0', // Sky Blue Highlights
  terra:   '#0F969C', // Teal Accent
  accent:  '#0C7075', // Dark Teal CTA
  muted:   '#294D61', // Muted Blue
  border:  'rgba(15,150,156,0.15)', // Teal border
};

const CATEGORIES = ['Semua', 'Coffee', 'Pastry', 'Non-Coffee'];
const FLAVORS = ['Semua', 'Manis', 'Pahit', 'Segar'];
const HISTORY_KEY = 'kedai_search_history_v2';

export default function MenuPage() {
  const { getTotalPrice, getTotalItems } = useCartStore();
  const { items: allMenuItems, fetchMenu, loading } = useMenuStore();
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted,        setMounted]        = useState(false);
  const [lastStatus,     setLastStatus]    = useState<string | null>(null);

  const playNotifySound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Sound blocked by browser policy'));
  };
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeFlavor,   setActiveFlavor]   = useState('Semua');
  const [searchQuery,    setSearchQuery]     = useState('');
  const [searchFocused,  setSearchFocused]   = useState(false);
  const [showFilters,    setShowFilters]    = useState(false);
  const [history,        setHistory]         = useState<string[]>([]);

  const flavorOptions = useMemo(() => {
    if (activeCategory === 'Coffee') return ['Semua', 'Manis', 'Pahit', 'Segar'];
    if (activeCategory === 'Non-Coffee') return ['Semua', 'Manis', 'Segar'];
    if (activeCategory === 'Pastry') return ['Semua', 'Manis', 'Gurih'];
    return ['Semua', 'Manis', 'Pahit', 'Segar', 'Gurih'];
  }, [activeCategory]);

  useEffect(() => { 
    setMounted(true);
    fetchMenu();

    const interval = setInterval(async () => {
      try {
        const res = await axios.get('/api/transactions/latest');
        if (res.data && res.data.status !== lastStatus) {
           if (lastStatus) playNotifySound();
           setLastStatus(res.data.status);
        }
      } catch (err) {}
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchMenu, lastStatus]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveHistory = (q: string) => {
    if (!q.trim()) return;
    const next = [q, ...history.filter(h => h !== q)].slice(0, 5);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400); // Doherty Threshold
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredMenu = useMemo(() =>
    allMenuItems.filter(item => {
      const matchCat   = activeCategory === 'Semua' || item.category === activeCategory;
      const matchFlavor = activeFlavor === 'Semua' || item.flavor === activeFlavor;
      const matchQuery = item.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchCat && matchFlavor && matchQuery;
    }), [activeCategory, activeFlavor, debouncedQuery, allMenuItems]);

  useLayoutEffect(() => {
    const targets = menuRefs.current.filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(targets,
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)', clearProps: 'all' }
    );
  }, [filteredMenu]);

  return (
    <div className="min-h-screen pb-36 text-white" style={{ backgroundColor: C.bg }}>

      {/* ── IMMERSIVE HEADER ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-3xl px-6 py-5 flex justify-between items-center"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-4">
          <Link href="/"
            className="p-2.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tighter">KEDAI CODE</h1>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">System Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to exit the Deep Sea?')) {
                await axios.post('/api/auth/logout');
                window.location.href = '/auth/login';
              }
            }}
            className="p-2 md:p-2.5 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95 opacity-40 hover:opacity-100"
            style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
          </button>
          
          <Link href="/cart"
            className="relative p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" style={{ color: C.terra }} />
            {getTotalItems() > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[8px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full text-[#05161A]"
                style={{ backgroundColor: C.terra }}>
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* ── HERO HEADER ── */}
      <div className="px-6 mt-8 mb-6">
        <div className="relative h-48 rounded-[32px] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80&fit=crop"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05161A] via-[#05161A]/80 to-transparent p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-teal-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">Deep Sea Offer</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">
              CRAFTED BY<br/>CODE & WATER
            </h2>
            <p className="text-xs font-medium opacity-60 tracking-wider">Experience the depth of artisan flavors.</p>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="px-6 space-y-4">
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-3xl transition-all"
          style={{
            backgroundColor: C.white,
            border: `1px solid ${searchFocused ? C.terra : C.border}`,
            boxShadow: searchFocused ? `0 0 40px ${C.terra}15` : 'none',
          }}>
          <Search className="w-5 h-5 shrink-0" style={{ color: searchFocused ? C.terra : C.muted }} />
          <input
            type="text"
            placeholder="Search flavor depth..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            onKeyDown={e => { if (e.key === 'Enter') saveHistory(searchQuery); }}
            className="flex-grow bg-transparent outline-none text-sm font-medium placeholder:opacity-30"
          />
          {searchQuery && <X className="w-4 h-4 cursor-pointer" onClick={() => setSearchQuery('')} />}
        </div>

        {/* ── CATEGORY SCROLL ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all"
              style={
                cat === activeCategory
                  ? { backgroundColor: C.terra, color: C.bg }
                  : { backgroundColor: C.white, color: C.brown, border: `1px solid ${C.border}` }
              }>
              {cat}
            </button>
          ))}
        </div>

        {/* ── DYNAMIC FILTER PANEL ── */}
        <div className="flex items-center gap-3 py-1">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition-all ${showFilters ? 'bg-teal-400 text-[#05161A]' : 'bg-teal-400/10 text-teal-400'} border border-teal-400/20`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          
          <div className="flex-grow flex gap-2 overflow-x-auto scrollbar-none py-1">
            {showFilters && flavorOptions.map(flavor => (
              <button
                key={flavor}
                onClick={() => setActiveFlavor(flavor)}
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all animate-in slide-in-from-left-2 ${flavor === activeFlavor ? 'bg-teal-400 text-[#05161A]' : 'bg-white/5 text-white/40 border border-white/5'}`}
              >
                {flavor}
              </button>
            ))}
            {!showFilters && (
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 py-2">Tap slider to refine flavor...</p>
            )}
          </div>
        </div>
      </div>

      {/* ── MENU GRID ── */}
      <div className="px-6 mt-8 flex flex-col gap-4">
        <div className="flex justify-between items-end mb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Available Essence</p>
          <span className="text-[10px] font-black text-teal-400">{filteredMenu.length} items</span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Waves className="w-10 h-10 mx-auto animate-bounce text-teal-400 opacity-20" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Syncing with Deep Sea...</p>
          </div>
        ) : filteredMenu.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-20">
          {filteredMenu.map((item, idx) => (
            <MenuCard 
              key={item.id} 
              item={item} 
              ref={el => { menuRefs.current[idx] = el; }}
            />
          ))}
        </div>
        ) : (
          <div className="py-24 text-center opacity-40">
             <Search className="w-12 h-12 mx-auto mb-4" />
             <p className="text-sm font-black italic">No flavors found in this depth.</p>
          </div>
        )}
      </div>

      {/* ── STICKY CHECKOUT (Fitts's Law) ── */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-10 left-6 right-6 z-50">
          <Link href="/cart">
            <div
              className="p-5 rounded-[28px] flex justify-between items-center transition-all hover:brightness-110 active:scale-95"
              style={{
                backgroundColor: C.terra,
                boxShadow: `0 20px 60px ${C.terra}40`,
              }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/10">
                   <ShoppingCart className="w-5 h-5 text-[#05161A]" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#05161A]/60">Proceed to Depth</p>
                   <span className="font-black text-[#05161A]">{getTotalItems()} Item Selected</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#05161A]">
                  Rp {getTotalPrice().toLocaleString('id-ID')}
                </span>
                <ChevronRight className="w-6 h-6 text-[#05161A]/40" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
