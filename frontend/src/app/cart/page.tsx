'use client';

import { useCartStore } from '@/store/cartStore';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ChevronRight, AlertCircle, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import Image from 'next/image';

const C = {
  bg:      '#05161A', // Deep Sea Background
  white:   '#072E33', // Deep Teal Card
  brown:   '#6DA5C0', // Sky Blue Highlights
  terra:   '#0F969C', // Teal Accent
  accent:  '#0C7075', // Dark Teal CTA
  muted:   '#294D61', // Muted Blue
  border:  'rgba(15,150,156,0.15)', // Teal border
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [showConfirm, setShowConfirm] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-white" style={{ backgroundColor: C.bg }}>
        <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 relative" style={{ backgroundColor: C.white }}>
           <div className="absolute inset-0 rounded-[32px] animate-ping opacity-10" style={{ backgroundColor: C.terra }} />
           <ShoppingBag className="w-10 h-10" style={{ color: C.terra }} />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-4">YOUR DEPTH IS EMPTY</h2>
        <p className="text-center opacity-40 text-sm max-w-[240px] mb-10 leading-relaxed font-medium">
          Start exploring our artisan flavors to fill your collection.
        </p>
        <Link href="/menu"
          className="px-10 py-5 rounded-full font-black text-xs tracking-[0.3em] uppercase transition-all hover:scale-105 active:scale-95 text-white"
          style={{ backgroundColor: C.terra, color: '#05161A', boxShadow: `0 20px 40px ${C.terra}20` }}>
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 text-white" style={{ backgroundColor: C.bg }}>
      {/* ── HEADER ── */}
      <header className="p-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-3xl" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-4">
          <Link href="/menu" className="p-2.5 rounded-2xl" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black tracking-tighter">YOUR SELECTION</h1>
        </div>
        <button onClick={() => setShowConfirm(true)} className="p-2.5 rounded-2xl transition-all hover:bg-red-500/10 group">
          <Trash2 className="w-5 h-5 text-red-400/40 group-hover:text-red-400 transition-colors" />
        </button>
      </header>

      {/* ── CART LIST ── */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-end mb-2 px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Selected Essence</p>
          <span className="text-[10px] font-black text-teal-400">{items.length} Varieties</span>
        </div>

        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-3xl flex gap-4 transition-all" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base tracking-tight">{item.name}</h3>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-0.5" style={{ color: C.brown }}>{item.category}</p>
              </div>
              <p className="text-sm font-black" style={{ color: C.terra }}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
            </div>
            <div className="flex flex-col items-center justify-between bg-black/20 rounded-2xl p-1 border border-white/5">
              <button onClick={() => updateQuantity(item.id, 1)} className="p-2 transition-all active:scale-75"><Plus className="w-3.5 h-3.5" /></button>
              <span className="text-xs font-black">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, -1)} className="p-2 transition-all active:scale-75"><Minus className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* ── ORDER SUMMARY ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className="p-6 rounded-[32px] space-y-4" style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, boxShadow: '0 -20px 60px rgba(0,0,0,0.4)' }}>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            <span>Subtotal</span>
            <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-end">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Depth</p>
                <p className="text-3xl font-black" style={{ color: C.terra }}>Rp {getTotalPrice().toLocaleString('id-ID')}</p>
             </div>
             <Link href="/checkout" className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all hover:scale-105 active:scale-95 text-white" style={{ backgroundColor: C.terra, color: '#05161A' }}>
               Confirm Depth
               <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>

      {/* ── ERROR PREVENTION MODAL (Heuristic: Error Prevention) ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-sm p-8 rounded-[40px] text-center space-y-6 animate-in zoom-in-95 duration-300" style={{ backgroundColor: C.white, border: `1px solid rgba(239,68,68,0.2)` }}>
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto">
                 <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                 <h3 className="text-2xl font-black tracking-tight mb-2">CLEAR ALL?</h3>
                 <p className="text-sm opacity-50 font-medium leading-relaxed">This action will remove all selected flavors from your depth collection.</p>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowConfirm(false)} className="flex-grow py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                    Cancel
                 </button>
                 <button onClick={() => { clearCart(); setShowConfirm(false); }} className="flex-grow py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all">
                    Yes, Clear
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
