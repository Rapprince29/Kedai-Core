'use client';

import { MenuItem, useCartStore } from '@/store/cartStore';
import { Plus, Minus, X, Info } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

const C = {
  bg:      '#051F20', // Primary (Background)
  white:   '#0B2B26', // Secondary
  brown:   '#DAF1DE', // Highlights (Text)
  terra:   '#8EB69B', // Soft Elements
  accent:  '#235347', // Accent
  muted:   '#8EB69B', // Text/Soft
  warm:    '#163832', // Secondary dark
  border:  'rgba(142,182,155,0.15)', // Soft green border
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

  return (
    <>
      <div
        ref={ref}
        onClick={() => setShowModal(true)}
        className="flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:shadow-md cursor-pointer active:scale-[0.98]"
        style={{
          backgroundColor: C.white,
          border: `1px solid ${C.border}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
        }}
      >
        <div
          className="w-[90px] h-[90px] rounded-[16px] overflow-hidden shrink-0 relative"
          style={{ backgroundColor: C.warm }}
        >
          <img
            src={imgSrc}
            alt={item.name}
            className="w-full h-full object-cover"
            style={{ transition: 'transform 0.35s ease' }}
            onError={() => {
              const fb = getFallback(item.category, item.id);
              if (imgSrc !== fb) setImgSrc(fb);
            }}
          />
        </div>

        <div className="flex-grow flex flex-col justify-between min-w-0">
          <div>
            <h3
              className="font-bold text-base italic leading-snug"
              style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
            >
              {item.name}
            </h3>
            <p
              className="text-[10px] font-semibold mt-0.5 tracking-widest uppercase"
              style={{ color: `${C.muted}80` }}
            >
              {item.category}
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: C.terra }}>
              Rp {item.price.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex justify-end mt-2">
            {cartItem ? (
              <div
                className="flex items-center gap-4 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: C.accent, border: `1px solid ${C.terra}40` }}
              >
                <button onClick={(e) => handleUpdate(e, -1)} className="transition-transform active:scale-90">
                  <Minus className="w-3.5 h-3.5" style={{ color: C.brown }} />
                </button>
                <span className="text-sm font-black w-4 text-center" style={{ color: C.brown }}>
                  {cartItem.quantity}
                </span>
                <button onClick={(e) => handleUpdate(e, 1)} className="transition-transform active:scale-90">
                  <Plus className="w-3.5 h-3.5" style={{ color: C.brown }} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-white"
                style={{ backgroundColor: C.accent, boxShadow: `0 4px 16px ${C.accent}40` }}
              >
                <Plus className="w-3.5 h-3.5" />
                Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Ingredient Transparency Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300"
            style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-64 w-full">
              <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold italic" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.name}
                  </h2>
                  <p className="text-xs tracking-widest uppercase font-semibold mt-1" style={{ color: C.terra }}>
                    {item.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: C.brown }}>Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl mb-6" style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4" style={{ color: C.terra }} />
                  <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: C.muted }}>Ingredients & Info</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.brown }}>
                  {item.description || 'Our artisan creation made with premium ingredients and seasonal inspiration.'}
                </p>
              </div>
              
              <button
                onClick={(e) => { handleAdd(e); setShowModal(false); }}
                className="w-full py-4 rounded-full font-bold text-sm tracking-[0.2em] uppercase text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: C.accent, boxShadow: `0 12px 32px ${C.accent}40` }}
              >
                Add to Cart
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
