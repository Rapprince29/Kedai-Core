'use client';

import { MenuItem, useCartStore } from '@/store/cartStore';
import { Plus, Minus, X, Info, Star } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

const C = {
  bg:      '#05161A', // Deep Sea Background
  white:   '#072E33', // Deep Teal Card
  brown:   '#6DA5C0', // Sky Blue Highlights
  terra:   '#0F969C', // Teal Accent
  accent:  '#0C7075', // Dark Teal CTA
  muted:   '#294D61', // Muted Blue
  warm:    '#05161A', // Background dark
  border:  'rgba(15,150,156,0.15)', // Teal border
};

// ── Fallback images per category from Unsplash ────────────────────────────────
const FALLBACKS: Record<string, string[]> = {
  Coffee: [
    'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=75&fit=crop',
  ],
  Pastry: [
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=75&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=75&fit=crop',
  ],
};

function getFallback(category: string, id: string | number): string {
  const pool = FALLBACKS[category] ?? FALLBACKS.default;
  const sId = String(id);
  const idx = sId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
  return pool[idx];
}

interface MenuCardProps { item: MenuItem; }

const MenuCard = forwardRef<HTMLDivElement, MenuCardProps>(({ item }, ref) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find(i => i.id === item.id);
  const [imgSrc, setImgSrc] = useState(item.image || getFallback(item.category, item.id));
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
  };

  const handleUpdate = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    updateQuantity(item.id, delta);
  };

  const isBest = item.isBestSeller;

  return (
    <>
      <div
        ref={ref}
        onClick={() => setShowModal(true)}
        className={`flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-lg cursor-pointer active:scale-[0.98] h-[130px] md:h-[140px] ${isBest ? 'scale-[1.02]' : ''}`}
        style={{
          backgroundColor: C.white,
          border: isBest ? `1px solid ${C.terra}60` : `1px solid ${C.border}`,
          boxShadow: isBest ? `0 8px 32px ${C.terra}15` : `0 4px 20px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          className="w-[90px] h-[90px] rounded-[16px] overflow-hidden shrink-0 relative"
          style={{ backgroundColor: C.bg }}
        >
          {isBest && (
            <div className="absolute top-0 left-0 z-10 p-1.5 rounded-br-lg" style={{ backgroundColor: C.terra }}>
              <Star className="w-3 h-3 text-[#05161A] fill-[#05161A]" />
            </div>
          )}
          <img
            src={imgSrc}
            alt={item.name}
            className="w-full h-full object-cover"
            style={{ transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onError={() => {
              const fb = getFallback(item.category, item.id);
              if (imgSrc !== fb) setImgSrc(fb);
            }}
          />
        </div>

        <div className="flex-grow flex flex-col justify-center min-w-0 h-full py-1 md:py-2">
          <div className="relative">
            <div className="h-4 md:h-5 flex items-center">
              {isBest ? (
                <div className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30">
                  <Star className="w-2 md:w-2.5 h-2 md:h-2.5 text-teal-400 fill-teal-400" />
                  <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-teal-400">
                    Artisan Pick
                  </span>
                </div>
              ) : (
                <div className="h-1" />
              )}
            </div>
            <h3
              className="font-black text-sm md:text-lg tracking-tighter leading-none mt-1 truncate"
              style={{ color: '#fff', fontFamily: "'Outfit', sans-serif" }}
            >
              {item.name}
            </h3>
            <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-1.5">
               <p className="text-[8px] md:text-[9px] font-black tracking-widest uppercase opacity-30" style={{ color: C.brown }}>
                {item.category}
              </p>
              {item.flavor && (
                <span className="text-[7px] md:text-[8px] px-1.5 md:px-2 py-0.5 rounded-full font-black uppercase tracking-widest" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: C.brown, border: '1px solid rgba(255,255,255,0.1)' }}>
                  {item.flavor}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-3">
              <p className="text-xs md:text-sm font-black text-white/90">
                <span className="opacity-40 text-[8px] md:text-[10px] mr-0.5 md:mr-1">IDR</span>
                {item.price.toLocaleString('id-ID')}
              </p>
              <div className="flex items-center gap-0.5 md:gap-1 opacity-40 hover:opacity-100 transition-opacity">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className="w-2 md:w-2.5 h-2 md:h-2.5 text-yellow-500 cursor-pointer" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGID ACTION ZONE ── */}
        <div className="flex flex-col justify-center items-center shrink-0 w-[90px] md:w-[120px] border-l border-white/5 ml-1 md:ml-2 pl-1 md:pl-0">
          {cartItem ? (
            <div
              className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-xl md:rounded-2xl"
              style={{ backgroundColor: C.white, border: `1px solid ${C.terra}40` }}
            >
              <button onClick={(e) => handleUpdate(e, -1)} className="p-0.5 md:p-1 hover:bg-white/5 rounded-lg transition-all">
                <Minus className="w-2.5 md:w-3 h-2.5 md:h-3 text-teal-400" />
              </button>
              <span className="text-xs font-black w-3 md:w-4 text-center text-white">
                {cartItem.quantity}
              </span>
              <button onClick={(e) => handleUpdate(e, 1)} className="p-0.5 md:p-1 hover:bg-white/5 rounded-lg transition-all">
                <Plus className="w-2.5 md:w-3 h-2.5 md:h-3 text-teal-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="group flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all hover:scale-105 active:scale-95 text-[#05161A]"
              style={{ backgroundColor: C.terra, boxShadow: `0 8px 24px ${C.terra}30` }}
            >
              <Plus className="w-3 md:w-4 h-3 md:h-4 transition-transform group-hover:rotate-90" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* ── Immersive Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="relative w-full max-w-lg rounded-t-[40px] md:rounded-[40px] overflow-hidden animate-in slide-in-from-bottom-10 duration-400"
            style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/40 text-white backdrop-blur-xl border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-72 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#072E33] to-transparent z-1" />
              <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-10 -mt-10 relative z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter text-white">
                    {item.name}
                  </h2>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-black px-3 py-1 rounded-full" 
                      style={{ backgroundColor: `${C.terra}20`, color: C.terra }}>
                      {item.category}
                    </span>
                    {item.flavor && (
                      <span className="text-[10px] tracking-[0.2em] uppercase font-black px-3 py-1 rounded-full" 
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: C.brown }}>
                        {item.flavor}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-3xl font-black" style={{ color: C.terra }}>Rp {item.price.toLocaleString('id-ID')}</p>
              </div>
              
              <div className="p-6 rounded-[24px] mb-10" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <Info className="w-4 h-4" style={{ color: C.terra }} />
                  <span className="text-[10px] uppercase font-black tracking-[0.3em]" style={{ color: C.brown }}>Description</span>
                </div>
                <p className="text-sm leading-relaxed opacity-70 text-white font-medium">
                  {item.description || 'A masterpiece of deep sea flavors, crafted for the ultimate sensory experience.'}
                </p>
              </div>
              
              <button
                onClick={(e) => { handleAdd(e); setShowModal(false); }}
                className="w-full py-5 rounded-full font-black text-xs tracking-[0.3em] uppercase text-white transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ backgroundColor: C.accent, boxShadow: `0 12px 32px ${C.accent}40` }}
              >
                Confirm to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

MenuCard.displayName = 'MenuCard';
export default MenuCard;
