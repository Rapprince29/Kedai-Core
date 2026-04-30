'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { CheckCircle2, ArrowLeft, ChefHat, Timer, PartyPopper, Loader2, Zap, Waves } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import { gsap } from 'gsap';
import axios from 'axios';

const C = {
  bg:      '#05161A', // Deep Sea Background
  card:    '#072E33', // Deep Teal Card
  accent:  '#0F969C', // Teal Accent
  soft:    '#0C7075', // Dark Teal
  text:    '#6DA5C0', // Sky Blue Text
  muted:   '#294D61', // Muted Blue
  border:  'rgba(15,150,156,0.1)'
};

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
          customerName: 'Artisan Guest',
          items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }))
        });
        setOrderId(res.data.id);
        sk.emit('joinOrder', res.data.id);
        setTimeout(() => setIsProcessing(false), 2000);
      } catch (err) {
        console.error('Failed to create transaction:', err);
        const id = `KC-${Math.floor(1000 + Math.random() * 9000)}`;
        setOrderId(id);
        setIsProcessing(false);
      }
    };

    createTransaction();

    sk.on('orderStatusChanged', (data: { status: string }) => {
      if (data.status === 'CONFIRMED') setStatus('CONFIRMED');
    });

    return () => { sk.off('orderStatusChanged'); };
  }, []);

  useEffect(() => {
    if (status !== 'CONFIRMED' || !confirmedRef.current) return;
    gsap.fromTo(confirmedRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }
    );
  }, [status]);

  const subtotal = getTotalPrice();
  const total    = subtotal * 1.1;

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 text-center text-white" style={{ backgroundColor: C.bg }}>
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] flex items-center justify-center relative" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="absolute inset-0 rounded-[40px] animate-ping opacity-10 bg-teal-400" />
            <Loader2 className="w-12 h-12 animate-spin text-teal-400" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">SYNCING WITH CORE</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Establishing secure artisan link</p>
        </div>
      </div>
    );
  }

  if (status === 'CONFIRMED') {
    return (
      <div ref={confirmedRef} className="min-h-screen flex flex-col text-white" style={{ backgroundColor: C.bg }}>
        <div className="w-full py-24 flex flex-col items-center text-center px-10 relative overflow-hidden"
          style={{ background: `radial-gradient(circle at top, ${C.soft}44, ${C.bg})` }}>
          
          <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 relative z-10"
            style={{ backgroundColor: C.accent, boxShadow: `0 20px 60px ${C.accent}40` }}>
            <ChefHat className="w-12 h-12 text-[#05161A]" />
          </div>

          <h1 className="text-5xl font-black tracking-tighter mb-4 z-10 uppercase">CONFIRMED</h1>
          <p className="text-sm z-10 max-w-xs leading-relaxed opacity-60 font-medium">
            Your selected flavors are being processed in our deep sea artisan kitchen.
          </p>

          <div className="mt-12 flex items-center gap-4 px-6 py-3 rounded-2xl z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
            <Timer className="w-4 h-4 text-teal-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">
              ETA: 15–20 MINUTES
            </span>
          </div>
        </div>

        <div className="flex-grow px-10 py-10 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Selection Summary</p>
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 rounded-3xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">{item.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{item.quantity} Unit · Rp {item.price.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-black" style={{ color: C.text }}>
                Rp {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="p-10 rounded-t-[48px]" style={{ backgroundColor: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="space-y-4 mb-10">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
              <span>ARTISAN ID</span>
              <span>{orderId.slice(0, 12)}</span>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Final Essence Fee</p>
                <p className="text-4xl font-black text-teal-400">Rp {total.toLocaleString()}</p>
              </div>
              <button onClick={() => { clearCart(); router.push('/'); }}
                className="px-10 py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 text-[#05161A]"
                style={{ backgroundColor: C.accent, boxShadow: `0 16px 48px ${C.accent}40` }}>
                DISMISS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 flex flex-col items-center text-white" style={{ backgroundColor: C.bg }}>
      <div className="w-full flex justify-start mb-10">
        <button onClick={() => router.back()} className="p-3 rounded-2xl transition-all active:scale-95"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-md rounded-[56px] p-12 flex flex-col items-center text-center relative overflow-hidden"
        style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
        
        <div className="w-20 h-20 rounded-[32px] bg-teal-400/10 flex items-center justify-center mb-8">
           <Zap className="w-10 h-10 text-teal-400" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-3 uppercase">SYNC COMPLETE</h2>
        <p className="text-xs opacity-40 font-medium mb-12">Present this code to the artisan concierge</p>

        <div className="bg-white p-8 rounded-[40px] mb-12 shadow-2xl relative">
          <QRCodeSVG
            value={JSON.stringify({ id: orderId, total })}
            size={200} level="H"
          />
          <div className="absolute -inset-2 border-2 border-dashed border-teal-500/20 rounded-[48px] animate-pulse" />
        </div>

        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl mb-12"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
          <div className="w-2 h-2 rounded-full animate-ping bg-teal-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">WAITING FOR HANDSHAKE</span>
        </div>

        <div className="w-full pt-10 border-t border-white/5 flex justify-between items-end">
           <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Total Fee</p>
              <p className="text-2xl font-black text-teal-400">Rp {total.toLocaleString()}</p>
           </div>
           <p className="text-[10px] font-black opacity-20 uppercase tracking-widest">ID: {orderId.slice(0, 6)}</p>
        </div>
      </div>

      <button onClick={() => getSocket().emit('confirmOrder', orderId)}
        className="mt-16 px-8 py-4 rounded-2xl text-[10px] uppercase font-black tracking-[0.5em] transition-all opacity-10 hover:opacity-100 flex items-center gap-3"
        style={{ border: `1px solid ${C.border}` }}>
        <Waves className="w-4 h-4" />
        SIMULATE HANDSHAKE
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: '#05161A' }}>
        <Waves className="w-10 h-10 animate-pulse text-teal-500 opacity-20" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
