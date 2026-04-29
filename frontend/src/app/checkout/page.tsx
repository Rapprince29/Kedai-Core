'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { CheckCircle2, ArrowLeft, ChefHat, Timer, PartyPopper } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import { gsap } from 'gsap';

const C = {
  bg:      '#F2F0EB',
  white:   '#FFFFFF',
  brown:   '#1C1007',
  terra:   '#A0522D',
  accent:  '#6B4226',
  muted:   '#8C7B6B',
  warm:    '#E8DFD0',
  border:  'rgba(107,66,38,0.10)',
  green:   '#3a7d44',
};

function CoffeeBean({ size = 28, color = '#A0522D', opacity = 1 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none" style={{ opacity }}>
      <ellipse cx="30" cy="19.5" rx="30" ry="19.5" fill={color} />
      <path d="M30 4 Q30 19.5 30 35" stroke="#6B4226" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

let socket: ReturnType<typeof io> | null = null;
function getSocket() {
  if (!socket) socket = io('http://localhost:3001');
  return socket;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const method       = searchParams.get('method');
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(true);
  const [orderId,      setOrderId]      = useState('');
  const [status,       setStatus]       = useState<'WAITING' | 'CONFIRMED'>('WAITING');

  const confirmedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sk = getSocket();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const timer = setTimeout(() => {
      const id = `KC-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(id);
      setIsProcessing(false);
      sk.emit('joinOrder', id);
    }, 2000);

    sk.on('orderStatusChanged', (data: { status: string }) => {
      if (data.status === 'CONFIRMED') {
        setStatus('CONFIRMED');
        if ('Notification' in window && Notification.permission === 'granted') {
          const notif = new Notification('☕ Pesanan Dikonfirmasi!', {
            body: 'Chef kami sedang menyiapkan hidanganmu. Estimasi: 15–20 menit.',
            icon: '/favicon.ico',
            tag: 'order-confirmed',
            requireInteraction: true,
          });
          notif.onclick = () => { window.focus(); notif.close(); };
        }
      }
    });

    return () => { clearTimeout(timer); sk.off('orderStatusChanged'); };
  }, []);

  useEffect(() => {
    if (status !== 'CONFIRMED' || !confirmedRef.current) return;
    gsap.fromTo(confirmedRef.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' }
    );
    gsap.fromTo('.confirm-icon',
      { rotate: -15 },
      { rotate: 15, duration: 0.1, repeat: 8, yoyo: true, ease: 'power1.inOut',
        onComplete: () => gsap.set('.confirm-icon', { rotate: 0 }) }
    );
  }, [status]);

  const subtotal = getTotalPrice();
  const tax      = subtotal * 0.1;
  const total    = subtotal + tax;

  /* ─── LOADING ─── */
  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center"
        style={{ backgroundColor: C.bg }}>
        {/* Coffee cup spinner */}
        <div className="relative">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-xl relative"
            style={{ boxShadow: `0 20px 60px ${C.terra}25` }}>
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80&fit=crop"
              alt="Loading"
              className="w-full h-full object-cover"
            />
            {/* Spin ring */}
            <div className="absolute inset-0 rounded-full border-4 animate-spin"
              style={{ borderColor: `${C.terra}20`, borderTopColor: C.terra }} />
          </div>
          {/* Floating beans while loading */}
          <div className="float-a absolute -top-3 -left-1">
            <CoffeeBean size={22} color={C.terra} opacity={0.7} />
          </div>
          <div className="float-b absolute -bottom-2 -right-2">
            <CoffeeBean size={18} color={C.accent} opacity={0.6} />
          </div>
        </div>
        <div>
          <h2
            className="text-2xl font-bold italic mb-1"
            style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
          >
            Memproses Pesanan...
          </h2>
          <p className="text-sm" style={{ color: C.muted }}>Mohon tunggu sebentar ya ☕</p>
        </div>
      </div>
    );
  }

  /* ─── CONFIRMED ─── */
  if (status === 'CONFIRMED') {
    return (
      <div ref={confirmedRef} className="min-h-screen flex flex-col"
        style={{ backgroundColor: C.bg }}>

        {/* Top Banner */}
        <div className="w-full py-10 flex flex-col items-center text-center px-6 relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${C.green}14, ${C.bg})` }}>
          {/* Background coffee image faint */}
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=40&fit=crop"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none"
          />
          <div className="confirm-icon w-24 h-24 rounded-full flex items-center justify-center mb-4 z-10"
            style={{ backgroundColor: C.green, boxShadow: `0 20px 60px ${C.green}35` }}>
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-2 z-10">
            <PartyPopper className="w-5 h-5 text-yellow-500" />
            <h1
              className="text-2xl font-bold italic"
              style={{ color: C.green, fontFamily: "'Cormorant Garamond', serif" }}
            >
              Pesanan Dikonfirmasi!
            </h1>
            <PartyPopper className="w-5 h-5 text-yellow-500 scale-x-[-1]" />
          </div>
          <p className="text-sm z-10" style={{ color: C.muted }}>
            Chef kami sedang menyiapkan hidanganmu dengan penuh cinta 🍜
          </p>
          <div className="mt-4 flex items-center gap-2 px-5 py-2 rounded-full z-10"
            style={{ backgroundColor: `${C.green}12`, border: `1px solid ${C.green}30` }}>
            <Timer className="w-4 h-4 animate-pulse" style={{ color: C.green }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.green }}>
              Estimasi: 15–20 Menit
            </span>
          </div>
        </div>

        <div className="mx-6 my-2 border-dashed border-t" style={{ borderColor: C.border }} />

        {/* Items */}
        <div className="flex-grow px-6 py-4 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: C.muted }}>
            Detail Pesanan
          </p>
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: C.warm }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold italic" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{item.quantity}× Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: C.brown }}>
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-6 border-dashed border-t" style={{ borderColor: C.border }} />

        {/* Summary */}
        <div className="px-6 py-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: C.muted }}>ID Transaksi</span>
            <span className="font-mono font-bold" style={{ color: C.terra }}>{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: C.muted }}>Metode Bayar</span>
            <span className="font-semibold uppercase text-xs" style={{ color: C.brown }}>
              {method === 'cardless' ? '💳 E-Wallet / Card' : '💵 Bayar di Kasir'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: C.muted }}>Subtotal</span>
            <span style={{ color: C.brown }}>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: C.muted }}>Pajak (10%)</span>
            <span style={{ color: C.brown }}>Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div
            className="flex justify-between text-xl font-bold italic pt-3"
            style={{ borderTop: `1px solid ${C.border}`, fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span style={{ color: C.brown }}>Total Bayar</span>
            <span style={{ color: C.green }}>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-10">
          <button
            onClick={() => { clearCart(); router.push('/'); }}
            className="w-full py-4 rounded-2xl font-semibold text-white text-base tracking-wider"
            style={{ backgroundColor: C.terra, boxShadow: `0 12px 40px ${C.terra}35` }}
          >
            Selesai & Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  /* ─── WAITING: QR CODE ─── */
  return (
    <div className="min-h-screen p-6 flex flex-col items-center" style={{ backgroundColor: C.bg }}>
      <div className="w-full flex justify-start mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-full"
          style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}>
          <ArrowLeft className="w-5 h-5" style={{ color: C.brown }} />
        </button>
      </div>

      <div className="w-full rounded-[32px] p-8 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          backgroundColor: C.white,
          border: `1px solid ${C.border}`,
          boxShadow: '0 20px 60px rgba(107,66,38,0.10)',
        }}>
        {/* Top terracotta strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[32px]" style={{ backgroundColor: C.terra }} />

        {/* Floating bean deco */}
        <div className="float-a absolute top-8 right-8 opacity-30 pointer-events-none">
          <CoffeeBean size={28} color={C.terra} />
        </div>
        <div className="float-b absolute bottom-12 left-8 opacity-20 pointer-events-none">
          <CoffeeBean size={20} color={C.accent} />
        </div>

        <div className="rounded-full p-4 mb-4 mt-3" style={{ backgroundColor: `${C.terra}12` }}>
          <CheckCircle2 className="w-10 h-10" style={{ color: C.terra }} />
        </div>
        <h2
          className="text-2xl font-bold italic mb-1"
          style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}
        >
          Pesanan Terkirim!
        </h2>
        <p className="text-sm mb-8" style={{ color: C.muted }}>
          Tunjukkan QR Code ini ke kasir
        </p>

        {/* QR */}
        <div className="bg-white p-5 rounded-2xl mb-5 relative"
          style={{ boxShadow: '0 8px 32px rgba(107,66,38,0.12)' }}>
          <QRCodeSVG
            value={JSON.stringify({ orderId, total, items: items.map(i => ({ name: i.name, qty: i.quantity })) })}
            size={200} level="H" includeMargin={false}
          />
          <div className="absolute inset-0 rounded-2xl animate-pulse pointer-events-none"
            style={{ border: `3px dashed ${C.terra}35` }} />
        </div>

        {/* Waiting badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ backgroundColor: `${C.terra}0E`, border: `1px solid ${C.terra}25` }}>
          <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: C.terra }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: C.terra }}>
            Menunggu Konfirmasi Kasir
          </span>
        </div>

        {/* Summary */}
        <div className="w-full pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: C.muted }}>ID Transaksi</span>
            <span className="font-mono font-bold" style={{ color: C.terra }}>{orderId}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: C.muted }}>Metode</span>
            <span className="font-semibold text-xs uppercase" style={{ color: C.brown }}>
              {method === 'cardless' ? 'E-Wallet / Card' : 'Bayar di Kasir'}
            </span>
          </div>
          <div
            className="flex justify-between text-xl font-bold italic pt-3"
            style={{ borderTop: `1px solid ${C.border}`, fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span style={{ color: C.brown }}>Total</span>
            <span style={{ color: C.terra }}>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* [Dev] Simulasi kasir ACC */}
      <button
        onClick={() => getSocket().emit('confirmOrder', orderId)}
        className="mt-10 px-6 py-3 rounded-xl text-[10px] uppercase font-semibold tracking-[0.2em] transition-all"
        style={{ backgroundColor: `${C.terra}08`, border: `1px dashed ${C.terra}25`, color: C.muted }}
      >
        [ Dev ] Simulasi Kasir ACC
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F2F0EB' }}>
        <div className="w-16 h-16 rounded-full border-4 animate-spin"
          style={{ borderColor: 'rgba(160,82,45,0.2)', borderTopColor: '#A0522D' }} />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
