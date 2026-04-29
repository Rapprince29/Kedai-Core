'use client';

import { ChefHat, Timer } from 'lucide-react';

export default function OrderConfirmedState() {
  return (
    <div className="py-12 animate-in zoom-in duration-500">
      <div className="bg-green-500 p-6 rounded-full inline-block mb-6 shadow-2xl shadow-green-500/20">
        <ChefHat className="w-16 h-16 text-white" />
      </div>
      <h2 className="text-3xl font-black mb-2 text-green-500 italic">PESANAN DIKONFIRMASI!</h2>
      <p className="text-accent text-lg max-w-[200px] mx-auto leading-tight">
        Chef kami sedang menyiapkan hidanganmu.
      </p>
      <div className="mt-8 flex items-center justify-center gap-2 text-accent bg-white/5 py-2 px-4 rounded-full border border-white/5">
        <Timer className="w-4 h-4 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest">Estimasi: 15-20 Menit</span>
      </div>
    </div>
  );
}
