'use client';

import { useCartStore } from '@/store/cartStore';
import { 
  ArrowLeft, ChevronRight, Wallet, Banknote, 
  QrCode, CheckCircle2, Loader2, Waves
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const C = {
  bg:      '#05161A', // Deep Sea Background
  card:    '#072E33', // Deep Teal Card
  accent:  '#0F969C', // Teal Accent
  text:    '#6DA5C0', // Sky Blue Text
  border:  'rgba(15,150,156,0.15)',
};

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [method, setMethod] = useState<'CASH' | 'CARDLESS' | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Method, 2: QR/Process

  const handleCheckout = async () => {
    if (!method) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/transactions', {
        items,
        totalPrice: getTotalPrice(),
        customerName: 'Yoga', // Fallback, will be replaced by JWT name in API
        method: method
      });
      setOrderId(res.data.id);
      setStep(2);
      if (method === 'CASH') {
         // Keep orderId for QR
      } else {
         // Logic for Cardless (Redirect to Midtrans/etc)
      }
    } catch (err) {
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 && !orderId) {
      window.location.href = '/menu';
    }
  }, [items, orderId]);

  if (items.length === 0 && !orderId) {
     return null;
  }

  return (
    <div className="min-h-screen p-6 text-white" style={{ backgroundColor: C.bg }}>
      {/* ── HEADER ── */}
      <div className="flex items-center gap-6 mb-12">
        <Link href="/cart" className="p-3 rounded-2xl bg-white/5 border border-white/5 text-teal-400">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">TRANSMISSION</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Finalizing Essence Flow</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 text-center">Select Payment Modality</p>
                
                <button 
                  onClick={() => setMethod('CARDLESS')}
                  className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center gap-6 ${method === 'CARDLESS' ? 'border-teal-400 bg-teal-400/5' : 'border-white/5 bg-white/5 opacity-60'}`}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-teal-400/10">
                     <Wallet className="w-7 h-7 text-teal-400" />
                  </div>
                  <div className="text-left">
                     <h4 className="font-black text-lg">CARDLESS</h4>
                     <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">OVO, GOPAY, QRIS</p>
                  </div>
                </button>

                <button 
                  onClick={() => setMethod('CASH')}
                  className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center gap-6 ${method === 'CASH' ? 'border-teal-400 bg-teal-400/5' : 'border-white/5 bg-white/5 opacity-60'}`}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-teal-400/10">
                     <Banknote className="w-7 h-7 text-teal-400" />
                  </div>
                  <div className="text-left">
                     <h4 className="font-black text-lg">CASH AT CASHIER</h4>
                     <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">PAY DIRECTLY TO THE ARCHITECT</p>
                  </div>
                </button>
             </div>

             <div className="p-8 rounded-[40px] bg-white/5 border border-white/5">
                <div className="flex justify-between mb-4">
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Total Energy</p>
                   <p className="text-2xl font-black text-teal-400">Rp {getTotalPrice().toLocaleString()}</p>
                </div>
                <button 
                  disabled={!method || loading}
                  onClick={handleCheckout}
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-20"
                  style={{ backgroundColor: C.accent, color: '#05161A' }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>TRANSMIT <ChevronRight className="w-4 h-4" /></>}
                </button>
             </div>
          </div>
        ) : (
          <div className="text-center space-y-10 animate-in zoom-in-95">
             {method === 'CASH' ? (
                <div className="space-y-8">
                   <div className="p-10 rounded-[48px] bg-white border-8 border-teal-400/20 mx-auto w-fit shadow-[0_0_80px_rgba(15,150,156,0.2)]">
                      <QRCodeSVG value={orderId || ''} size={200} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">PRESENT TO ARCHITECT</h3>
                      <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                        The cashier will scan this code to synchronize your payment and begin crafting your essence.
                      </p>
                   </div>
                   <div className="p-4 rounded-2xl bg-teal-400/10 border border-teal-400/20 w-fit mx-auto">
                      <p className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">ORDER ID: {orderId}</p>
                   </div>
                </div>
             ) : (
                <div className="space-y-8 py-20">
                   <CheckCircle2 className="w-20 h-20 text-teal-400 mx-auto animate-bounce" />
                   <h3 className="text-2xl font-black tracking-tight uppercase">CARDLESS SYNCING...</h3>
                </div>
             )}
             
             <button 
               onClick={() => { clearCart(); window.location.href = '/menu'; }}
               className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity"
             >
               Return to Menu
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
