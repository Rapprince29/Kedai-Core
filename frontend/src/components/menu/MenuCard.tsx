'use client';

import { MenuItem, useCartStore } from '@/store/cartStore';
import { Plus, Minus } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

const C = {
  bg:      '#F2F0EB',
  white:   '#FFFFFF',
  brown:   '#1C1007',
  terra:   '#A0522D',
  accent:  '#6B4226',
  muted:   '#8C7B6B',
  warm:    '#E8DFD0',
  border:  'rgba(107,66,38,0.10)',
};

// ── Fallback images per category from Unsplash ────────────────────────────────
const FALLBACKS: Record<string, string[]> = {
  Mie: [
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=75&fit=crop',
  ],
  Dimsum: [
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1541696490-8744a5db7fbb?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=75&fit=crop',
  ],
  Minuman: [
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=75&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=75&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3df1?w=400&q=75&fit=crop',
  ],
};

function getFallback(category: string, id: string): string {
  const pool = FALLBACKS[category] ?? FALLBACKS.default;
  // Pick deterministically from pool based on item id
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
  return pool[idx];
}

// ── Component ─────────────────────────────────────────────────────────────────
interface MenuCardProps { item: MenuItem; }

const MenuCard = forwardRef<HTMLDivElement, MenuCardProps>(({ item }, ref) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find(i => i.id === item.id);
  const [imgSrc, setImgSrc] = useState(item.image || getFallback(item.category, item.id));

  return (
    <div
      ref={ref}
      className="flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:shadow-md cursor-default"
      style={{
        backgroundColor: C.white,
        border: `1px solid ${C.border}`,
        boxShadow: `0 2px 16px rgba(107,66,38,0.06)`,
      }}
    >
      {/* ── Image ── */}
      <div
        className="w-[90px] h-[90px] rounded-[16px] overflow-hidden shrink-0 relative"
        style={{ backgroundColor: C.warm }}
      >
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.35s ease' }}
          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.07)'; }}
          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.0)'; }}
          onError={() => {
            // Fallback: swap to a category-appropriate image
            const fb = getFallback(item.category, item.id);
            if (imgSrc !== fb) setImgSrc(fb);
          }}
        />
      </div>

      {/* ── Info ── */}
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

        {/* ── Controls ── */}
        <div className="flex justify-end mt-2">
          {cartItem ? (
            <div
              className="flex items-center gap-4 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: C.bg, border: `1.5px solid ${C.terra}40` }}
            >
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="transition-transform active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" style={{ color: C.accent }} />
              </button>
              <span className="text-sm font-black w-4 text-center" style={{ color: C.brown }}>
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="transition-transform active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" style={{ color: C.accent }} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(item)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-white"
              style={{ backgroundColor: C.terra, boxShadow: `0 4px 16px ${C.terra}35` }}
            >
              <Plus className="w-3.5 h-3.5" />
              Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

MenuCard.displayName = 'MenuCard';
export default MenuCard;
