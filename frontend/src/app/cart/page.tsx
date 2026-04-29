'use client';

import { useCartStore } from '@/store/cartStore';
import { ChevronLeft, Trash2, CreditCard, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartItemComponent from '@/components/cart/CartItem';

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

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems } = useCartStore();
  const router = useRouter();

  if (getTotalItems() === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: C.bg }}>
        {/* Decorative coffee */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl"
            style={{ boxShadow: `0 16px 48px ${C.terra}20` }}>
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80&fit=crop"
              alt="Empty"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Trash2 className="w-8 h-8" style={{ color: C.muted }} />
          </div>
        </div>
        <h2
          className="text-3xl font-bold italic mb-2"
          style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
        >
          Keranjang Kosong
        </h2>
        <p className="text-sm mb-8 font-light" style={{ color: C.muted }}>
          Yuk, pilih menu lezat dulu!
        </p>
        <Link href="/menu"
          className="px-8 py-3 rounded-full font-semibold text-sm tracking-widest uppercase text-white"
          style={{ backgroundColor: C.terra, boxShadow: `0 12px 32px ${C.terra}35` }}>
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-64" style={{ backgroundColor: C.bg }}>

      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl px-5 py-4 flex items-center gap-4"
        style={{ backgroundColor: `${C.bg}F2`, borderBottom: `1px solid ${C.border}` }}
      >
        <Link href="/menu" className="p-2 rounded-full transition-all hover:brightness-95"
          style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}>
          <ChevronLeft className="w-6 h-6" style={{ color: C.muted }} />
        </Link>
        <div>
          <h1
            className="text-xl font-bold italic tracking-tight leading-none"
            style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
          >
            Keranjang
          </h1>
          <p className="text-[9px] tracking-widest uppercase font-semibold" style={{ color: C.muted }}>
            {getTotalItems()} Item dipilih
          </p>
        </div>
      </header>

      {/* Items */}
      <div className="p-5 flex flex-col gap-3">
        {items.map(item => (
          <CartItemComponent key={item.id} item={item} />
        ))}
      </div>

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 p-6 rounded-t-[28px]"
        style={{
          backgroundColor: C.white,
          borderTop: `1px solid ${C.border}`,
          boxShadow: '0 -24px 80px rgba(107,66,38,0.10)',
        }}
      >
        {/* Totals */}
        <div className="space-y-2.5 mb-5">
          <div className="flex justify-between text-sm">
            <span style={{ color: C.muted }}>Subtotal</span>
            <span className="font-semibold" style={{ color: C.brown }}>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: C.muted }}>Pajak (10%)</span>
            <span className="font-semibold" style={{ color: C.brown }}>Rp {(getTotalPrice() * 0.1).toLocaleString('id-ID')}</span>
          </div>
          <div
            className="flex justify-between text-xl font-bold italic pt-3"
            style={{ borderTop: `1px solid ${C.border}`, fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span style={{ color: C.brown }}>Total</span>
            <span style={{ color: C.terra }}>Rp {(getTotalPrice() * 1.1).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Payment Method */}
        <p className="text-[10px] tracking-widest uppercase font-semibold mb-3" style={{ color: C.muted }}>
          Metode Pembayaran
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/checkout?method=cardless')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all hover:brightness-95 hover:shadow-sm"
            style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}
          >
            <CreditCard className="w-6 h-6" style={{ color: C.terra }} />
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: C.brown }}>
              Cardless
            </span>
          </button>
          <button
            onClick={() => router.push('/checkout?method=cashier')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all hover:brightness-95 hover:shadow-sm"
            style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}
          >
            <Banknote className="w-6 h-6" style={{ color: C.terra }} />
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: C.brown }}>
              Ke Kasir
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
