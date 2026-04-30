'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { CheckCircle2, ArrowLeft, ChefHat, Timer, PartyPopper, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import { gsap } from 'gsap';
import axios from 'axios';

const C = {
  bg:      '#051F20', // Primary (Background)
  white:   '#0B2B26', // Secondary
  brown:   '#DAF1DE', // Highlights (Text)
  terra:   '#8EB69B', // Soft Elements
  accent:  '#235347', // Accent
  muted:   '#8EB69B', // Text/Soft
  warm:    '#163832', // Secondary dark
  border:  'rgba(142,182,155,0.15)', // Soft green border
  green:   '#DAF1DE',
};

function CoffeeBean({ size = 28, color = '#8EB69B', opacity = 1 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none" style={{ opacity }}>
      <ellipse cx="30" cy="19.5" rx="30" ry="19.5" fill={color} />
      <path d="M30 4 Q30 19.5 30 35" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
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

    const createTransaction = async () => {
      try {
        const res = await axios.post('/api/transactions', {
          totalPrice: getTotalPrice() * 1.1,
          customerName: 'Guest Customer', // Could be from a form
          items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }))
        });
        setOrderId(res.data.id);
        sk.emit('joinOrder', res.data.id);
        setTimeout(() => setIsProcessing(false), 1500);
      } catch (err) {
        console.error('Failed to create transaction:', err);
        // Fallback to random ID if API fails
        const id = `KC-${Math.floor(1000 + Math.random() * 9000)}`;
        setOrderId(id);
        setIsProcessing(false);
      }
    };

    createTransaction();

    sk.on('orderStatusChanged', (data: { status: string }) => {
      if (data.status === 'CONFIRMED') {
        setStatus('CONFIRMED');
      }
    });

    return () => { sk.off('orderStatusChanged'); };
  }, []);

  useEffect(() => {
    if (status !== 'CONFIRMED' || !confirmedRef.current) return;
    gsap.fromTo(confirmedRef.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' }
    );
  }, [status]);

  const subtotal = getTotalPrice();
  const tax      = subtotal * 0.1;
  const total    = subtotal + tax;

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center"
        style={{ backgroundColor: C.bg }}>
        <div className="relative">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden shadow-2xl relative"
            style={{ backgroundColor: C.white, border: `2px solid ${C.border}` }}>
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80&fit=crop"
              alt="Loading"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin" style={{ color: C.terra }} />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold italic mb-2" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}>Securing Your Order...</h2>
          <p className="text-sm tracking-widest uppercase font-bold" style={{ color: C.muted }}>Crafting Digital Artisan Receipt</p>
        </div>
      </div>
    );
  }

  if (status === 'CONFIRMED') {
    return (
      <div ref={confirmedRef} className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg }}>
        <div className="w-full py-16 flex flex-col items-center text-center px-6 relative overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${C.accent}44, ${C.bg})` }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 z-10 animate-bounce"
            style={{ backgroundColor: C.terra, boxShadow: `0 20px 60px ${C.terra}40` }}>
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <div className="flex items-center gap-3 mb-3 z-10">
            <PartyPopper className="w-6 h-6" style={{ color: C.brown }} />
            <h1 className="text-4xl font-bold italic" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}>Confirmed!</h1>
            <PartyPopper className="w-6 h-6 scale-x-[-1]" style={{ color: C.brown }} />
          </div>
          <p className="text-sm z-10 max-w-xs leading-relaxed" style={{ color: C.muted }}>
            Our artisans are currently preparing your selection with seasonal precision 🌿
          </p>
          <div className="mt-8 flex items-center gap-3 px-6 py-2.5 rounded-full z-10"
            style={{ backgroundColor: `${C.terra}15`, border: `1px solid ${C.border}` }}>
            <Timer className="w-4 h-4" style={{ color: C.terra }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.terra }}>
              Preparation: 15–20 Min
            </span>
          </div>
        </div>

        <div className="flex-grow px-8 py-6 flex flex-col gap-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: `${C.muted}60` }}>Order Summary</p>
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0" style={{ backgroundColor: C.warm }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-base font-bold italic" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</p>
                  <p className="text-xs font-bold opacity-60" style={{ color: C.muted }}>{item.quantity} × Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: C.brown }}>
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-t-[48px]" style={{ backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span style={{ color: C.muted }}>Transaction ID</span>
              <span style={{ color: C.terra }}>{orderId}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span style={{ color: C.muted }}>Method</span>
              <span style={{ color: C.brown }}>{method === 'cardless' ? 'Digital Wallet' : 'Cashier Pay'}</span>
            </div>
            <div className="h-px w-full my-4" style={{ backgroundColor: C.border }} />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold italic" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}>Total Paid</span>
              <span className="text-2xl font-bold" style={{ color: C.terra }}>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button onClick={() => { clearCart(); router.push('/'); }}
            className="w-full py-5 rounded-[24px] font-bold text-white text-sm tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: C.accent, boxShadow: `0 16px 48px ${C.accent}40` }}>
            Return to Forest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center" style={{ backgroundColor: C.bg }}>
      <div className="w-full flex justify-start mb-8">
        <button onClick={() => router.back()} className="p-3 rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
          <ArrowLeft className="w-5 h-5" style={{ color: C.brown }} />
        </button>
      </div>

      <div className="w-full max-w-md rounded-[48px] p-10 flex flex-col items-center text-center relative overflow-hidden"
        style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: C.terra }} />
        
        <div className="rounded-full p-5 mb-6 mt-4" style={{ backgroundColor: `${C.terra}15` }}>
          <CheckCircle2 className="w-12 h-12" style={{ color: C.terra }} />
        </div>
        <h2 className="text-3xl font-bold italic mb-2" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', serif" }}>Order Transmitted</h2>
        <p className="text-sm mb-10 opacity-70" style={{ color: C.muted }}>Present this artisan code to the concierge</p>

        <div className="bg-white p-8 rounded-[32px] mb-8 relative shadow-2xl">
          <QRCodeSVG
            value={JSON.stringify({ orderId, total, items: items.map(i => ({ name: i.name, qty: i.quantity })) })}
            size={220} level="H"
          />
          <div className="absolute inset-2 rounded-[28px] animate-pulse pointer-events-none"
            style={{ border: `3px dashed ${C.terra}25` }} />
        </div>

        <div className="flex items-center gap-3 px-6 py-3 rounded-full mb-10"
          style={{ backgroundColor: `${C.terra}10`, border: `1px solid ${C.border}` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: C.terra }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.terra }}>Awaiting Concierge Confirmation</span>
        </div>

        <div className="w-full pt-8 space-y-4" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
            <span style={{ color: C.muted }}>Artisan ID</span>
            <span style={{ color: C.terra }}>{orderId}</span>
          </div>
          <div className="flex justify-between text-xl font-bold italic pt-4"
            style={{ borderTop: `1px solid ${C.border}`, fontFamily: "'Cormorant Garamond', serif" }}>
            <span style={{ color: C.brown }}>Total Fee</span>
            <span style={{ color: C.terra }}>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <button onClick={() => getSocket().emit('confirmOrder', orderId)}
        className="mt-12 px-8 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-[0.4em] transition-all hover:bg-white/5 opacity-40 hover:opacity-100"
        style={{ border: `1px dashed ${C.border}`, color: C.muted }}>
        [ Dev ] Simulate Concierge ACC
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#051F20' }}>
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#8EB69B' }} />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
