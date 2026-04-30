'use client';

import { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import { gsap } from 'gsap';
import { useMenuStore } from '@/store/menuStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, ArrowLeft, Search, X, Clock, ChevronRight, Sparkles, Sun, Moon, Coffee } from 'lucide-react';
import Link from 'next/link';
import MenuCard from '@/components/menu/MenuCard';

const C = {
  bg:      '#051F20', // Primary (Background)
  white:   '#0B2B26', // Secondary
  brown:   '#DAF1DE', // Highlights (Text)
  terra:   '#8EB69B', // Soft Elements
  accent:  '#235347', // Accent
  muted:   '#8EB69B', // Text/Soft
  sand:    '#163832', // Secondary dark
  warm:    '#163832', // Secondary dark
  border:  'rgba(142,182,155,0.15)', // Soft green border
};

const CATEGORIES = ['Semua', 'Coffee', 'Pastry', 'Non-Coffee'];
const HISTORY_KEY = 'kedai_search_history';
const MAX_HISTORY = 6;

function CoffeeBean({ size = 28, color = '#A0522D', opacity = 1 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none" style={{ opacity }}>
      <ellipse cx="30" cy="19.5" rx="30" ry="19.5" fill={color} />
      <path d="M30 4 Q30 19.5 30 35" stroke="#6B4226" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export default function MenuPage() {
  const { getTotalPrice, getTotalItems } = useCartStore();
  const { items: allMenuItems, fetchMenu, loading } = useMenuStore();
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted,        setMounted]        = useState(false);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery,    setSearchQuery]     = useState('');
  const [searchFocused,  setSearchFocused]   = useState(false);
  const [history,        setHistory]         = useState<string[]>([]);
  const [currentTime,    setCurrentTime]     = useState(new Date().getHours());

  useEffect(() => { 
    setMounted(true);
    fetchMenu();
    setCurrentTime(new Date().getHours());
  }, [fetchMenu]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveHistory = (q: string) => {
    if (!q.trim()) return;
    const next = [q, ...history.filter(h => h !== q)].slice(0, MAX_HISTORY);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const deleteHistory = (item: string) => {
    const next = history.filter(h => h !== item);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const clearAllHistory = () => { setHistory([]); localStorage.removeItem(HISTORY_KEY); };
  const applyHistory    = (q: string) => { setSearchQuery(q); setSearchFocused(false); };

  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const sourceItems = mounted ? allMenuItems : [];

  const filteredMenu = useMemo(() =>
    sourceItems.filter(item => {
      const matchCat   = activeCategory === 'Semua' || item.category === activeCategory;
      const matchQuery = item.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchCat && matchQuery;
    }), [activeCategory, debouncedQuery, sourceItems]);

  const smartFilter = useMemo(() => {
    if (currentTime >= 6 && currentTime < 11) return { label: 'Morning Vibes', sub: 'Try our artisan coffee', icon: <Coffee className="w-3.5 h-3.5" />, category: 'Coffee' };
    if (currentTime >= 15 && currentTime < 19) return { label: 'Afternoon Chill', sub: 'Perfect with pastries', icon: <Sparkles className="w-3.5 h-3.5" />, category: 'Pastry' };
    return null;
  }, [currentTime]);

  useLayoutEffect(() => {
    const targets = menuRefs.current.filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(targets,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
  }, [filteredMenu]);

  const showDropdown = searchFocused && history.length > 0 && !searchQuery;

  return (
    <div className="min-h-screen pb-36" style={{ backgroundColor: C.bg }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl px-5 py-4 flex justify-between items-center"
        style={{ backgroundColor: `${C.bg}F2`, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-3">
          <Link href="/"
            className="p-2 rounded-full transition-all hover:brightness-95"
            style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}>
            <ArrowLeft className="w-5 h-5" style={{ color: C.muted }} />
          </Link>
          <div>
            <h1
              className="text-xl font-bold italic tracking-tight leading-none"
              style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
            >
              Kedai Code
            </h1>
            <p className="text-[9px] tracking-[0.25em] uppercase font-semibold" style={{ color: C.muted }}>
              Artisan Forest Menu
            </p>
          </div>
        </div>

        <Link href="/cart"
          className="relative p-2.5 rounded-full"
          style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}>
          <ShoppingCart className="w-5 h-5" style={{ color: C.brown }} />
          {getTotalItems() > 0 && (
            <span
              className="absolute -top-1 -right-1 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full text-white"
              style={{ backgroundColor: C.terra }}>
              {getTotalItems()}
            </span>
          )}
        </Link>
      </header>

      {/* ── HERO STRIP ── */}
      <div
        className="mx-5 mt-5 mb-4 rounded-[20px] overflow-hidden relative"
        style={{ height: '120px', backgroundColor: C.warm }}
      >
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=70&fit=crop"
          alt="Coffee"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        <div className="float-a absolute top-3 right-16 pointer-events-none">
          <CoffeeBean size={28} color={C.terra} opacity={0.8} />
        </div>
        <div className="float-b absolute bottom-4 right-8 pointer-events-none">
          <CoffeeBean size={20} color={C.accent} opacity={0.6} />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-0.5" style={{ color: C.muted }}>
            Our Artisan Collection
          </p>
          <h2
            className="text-2xl font-bold italic leading-tight"
            style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
          >
            Savor the Moment
          </h2>
        </div>
      </div>

      {/* ── SMART FILTER SUGGESTION ── */}
      {smartFilter && !searchQuery && (
        <div className="px-5 mb-4 animate-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => setActiveCategory(smartFilter.category)}
            className="w-full flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: `${C.terra}15`, borderColor: `${C.terra}30` }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: C.terra, color: C.bg }}>
                {smartFilter.icon}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.terra }}>{smartFilter.label}</p>
                <p className="text-xs font-medium" style={{ color: C.brown }}>{smartFilter.sub}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: C.terra }} />
          </button>
        </div>
      )}

      {/* ── SEARCH ── */}
      <div className="px-5 pb-2 relative">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
          style={{
            backgroundColor: C.white,
            border: `1.5px solid ${searchFocused ? C.terra : C.border}`,
            boxShadow: searchFocused ? `0 0 0 3px ${C.terra}12` : `0 2px 12px rgba(107,66,38,0.06)`,
          }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: searchFocused ? C.terra : C.muted }} />
          <input
            type="text"
            placeholder="Search artisan menu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            onKeyDown={e => { if (e.key === 'Enter') saveHistory(searchQuery); }}
            className="flex-grow bg-transparent outline-none text-sm"
            style={{ color: C.brown, caretColor: C.terra }}
          />
          {searchQuery &&
            <button onClick={() => setSearchQuery('')}>
              <X className="w-4 h-4" style={{ color: C.muted }} />
            </button>
          }
        </div>

        {/* ── SEARCH HISTORY DROPDOWN ── */}
        {showDropdown && (
          <div
            className="absolute left-5 right-5 mt-2 rounded-2xl z-40 overflow-hidden"
            style={{
              backgroundColor: C.white,
              border: `1px solid ${C.border}`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
            }}>
            <div className="flex justify-between items-center px-4 pt-3 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>
                Recent
              </span>
              <button onClick={clearAllHistory} className="text-[10px] font-bold" style={{ color: C.terra }}>
                Clear All
              </button>
            </div>
            {history.map(item => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-all"
                style={{ borderTop: `1px solid ${C.border}` }}>
                <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: C.muted }} />
                <span className="flex-grow text-sm font-medium" style={{ color: C.brown }} onClick={() => applyHistory(item)}>
                  {item}
                </span>
                <button onClick={() => deleteHistory(item)}>
                  <X className="w-3 h-3" style={{ color: C.muted }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all"
              style={
                isActive
                  ? { backgroundColor: C.terra, color: C.bg, boxShadow: `0 6px 20px ${C.terra}30` }
                  : { backgroundColor: C.white, color: C.muted, border: `1px solid ${C.border}` }
              }>
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── COUNT LABEL ── */}
      <div className="px-5 pb-3">
        <p className="text-[11px] tracking-widest uppercase font-semibold" style={{ color: `${C.muted}80` }}>
          {filteredMenu.length} Creations
          {searchQuery ? ` · "${searchQuery}"` : ''}
        </p>
      </div>

      {/* ── MENU LIST ── */}
      <div className="px-5 flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: `${C.terra}40`, borderTopColor: C.terra }}></div>
            <p className="mt-4 text-sm font-semibold tracking-widest uppercase" style={{ color: C.muted }}>Syncing Forest flavors...</p>
          </div>
        ) : filteredMenu.length > 0 ? (
          filteredMenu.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              ref={(el) => { menuRefs.current[index] = el; }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: C.warm }}>
              <Search className="w-7 h-7" style={{ color: C.muted }} />
            </div>
            <p
              className="font-bold text-lg italic"
              style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
            >
              Creation not found
            </p>
            <p className="text-sm mt-1 mb-5" style={{ color: C.muted }}>Try another forest flavor</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('Semua'); }}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: C.terra, color: C.bg, boxShadow: `0 8px 24px ${C.terra}30` }}>
              Reset Essence
            </button>
          </div>
        )}
      </div>

      {/* ── FLOATING CART BAR ── */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-8 left-5 right-5 z-50">
          <Link href="/cart">
            <div
              className="p-4 rounded-2xl flex justify-between items-center"
              style={{
                backgroundColor: C.terra,
                boxShadow: `0 20px 60px ${C.terra}45`,
              }}>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-lg text-xs font-black" style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: C.bg }}>
                  {getTotalItems()} Item
                </div>
                <span className="font-semibold" style={{ color: C.bg }}>View Forest Cart</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-black" style={{ color: C.bg }}>
                  Rp {getTotalPrice().toLocaleString('id-ID')}
                </span>
                <ChevronRight className="w-5 h-5" style={{ color: `${C.bg}70` }} />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
