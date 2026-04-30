'use client';

import { CartItem as CartItemType, useCartStore } from '@/store/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react';

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

interface CartItemProps { item: CartItemType; }

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div
      className="flex gap-4 items-center p-3 rounded-2xl"
      style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, boxShadow: `0 2px 12px rgba(107,66,38,0.05)` }}
    >
      <div className="w-[72px] h-[72px] rounded-[14px] overflow-hidden shrink-0" style={{ backgroundColor: C.warm }}>
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow min-w-0">
        <p
          className="font-bold text-base italic truncate leading-snug"
          style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
        >
          {item.name}
        </p>
        <p className="text-sm font-bold mt-0.5" style={{ color: C.terra }}>
          Rp {item.price.toLocaleString('id-ID')}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div
            className="flex items-center gap-3 px-2.5 py-1.5 rounded-xl"
            style={{ backgroundColor: C.bg, border: `1.5px solid ${C.terra}35` }}
          >
            <button onClick={() => updateQuantity(item.id, -1)} className="transition-transform active:scale-90">
              <Minus className="w-3.5 h-3.5" style={{ color: C.accent }} />
            </button>
            <span className="text-xs font-black" style={{ color: C.brown }}>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)} className="transition-transform active:scale-90">
              <Plus className="w-3.5 h-3.5" style={{ color: C.accent }} />
            </button>
          </div>
          <button onClick={() => removeItem(item.id)} className="text-red-400/60 hover:text-red-500 transition-colors p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        className="text-right text-sm font-black shrink-0"
        style={{ color: C.brown }}
      >
        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
      </div>
    </div>
  );
}
