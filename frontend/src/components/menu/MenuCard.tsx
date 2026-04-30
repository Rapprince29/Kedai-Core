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
        className={`flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer active:scale-[0.98] ${isBest ? 'scale-[1.02]' : ''}`}
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

        <div className="flex-grow flex flex-col justify-center min-w-0">
          <div className="relative">
            {isBest && (
              <span className="text-[8px] font-black uppercase tracking-[0.3em] mb-1 block" style={{ color: C.terra }}>
                Artisan Pick
              </span>
            )}
            <h3
              className="font-bold text-base tracking-tight leading-snug truncate"
              style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
               <p className="text-[9px] font-bold tracking-widest uppercase opacity-40" style={{ color: C.brown }}>
                {item.category}
              </p>
              {item.flavor && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter" 
                  style={{ backgroundColor: `${C.terra}20`, color: C.terra }}>
                  {item.flavor}
                </span>
              )}
            </div>
            <p className="text-sm font-black mt-2" style={{ color: C.terra }}>
              Rp {item.price.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end shrink-0 min-w-[100px]">
          {cartItem ? (
            <div
              className="flex items-center gap-3 px-2 py-1.5 rounded-full"
              style={{ backgroundColor: C.accent, border: `1px solid ${C.terra}30` }}
            >
              <button onClick={(e) => handleUpdate(e, -1)} className="transition-transform active:scale-75">
                <Minus className="w-3 h-3 text-white" />
              </button>
              <span className="text-xs font-black w-4 text-center text-white">
                {cartItem.quantity}
              </span>
              <button onClick={(e) => handleUpdate(e, 1)} className="transition-transform active:scale-75">
                <Plus className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 text-white whitespace-nowrap"
              style={{ backgroundColor: C.accent, boxShadow: `0 4px 16px ${C.accent}40` }}
            >
              <Plus className="w-3 h-3" />
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
