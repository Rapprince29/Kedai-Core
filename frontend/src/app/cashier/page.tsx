'use client';

import { useState, useEffect } from 'react';
import { 
  Scan, Search, CheckCircle2, Package, 
  RefreshCcw, Banknote, AlertCircle, PlayCircle
} from 'lucide-react';
import axios from 'axios';

const C = {
  bg:      '#05161A', 
  card:    '#072E33', 
  accent:  '#0F969C', 
  text:    '#6DA5C0', 
  border:  'rgba(15,150,156,0.15)',
};

const STATUS_MAP: any = {
  PENDING: { label: 'WAITING PAYMENT', color: '#F59E0B' },
  PAID: { label: 'PAYMENT SUCCESS', color: '#10B981' },
  PROCESSING: { label: 'CRAFTING ESSENCE', color: '#0F969C' },
  DONE: { label: 'COMPLETED', color: '#6DA5C0' }
};

export default function CashierDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orderId, setOrderId] = useState('');
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const fetchRecent = async () => {
    try {
      const res = await axios.get('/api/analytics');
      setRecentOrders(res.data.recentTransactions);
    } catch (err) {}
  };

  useEffect(() => {
    axios.get('/api/auth/me').then(res => setUser(res.data.user)).catch(() => {});
    fetchRecent();
    const interval = setInterval(fetchRecent, 10000);
    return () => clearInterval(interval);
  }, []);

  const searchOrder = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/transactions/${id || orderId}`);
      setCurrentOrder(res.data);
    } catch (err) {
      alert('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`/api/transactions/${id}`, { status: newStatus });
      searchOrder(id);
      fetchRecent();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 text-white" style={{ backgroundColor: C.bg }}>
      <div className="max-w-6xl mx-auto">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
                <Scan className="w-6 h-6 text-teal-400" />
             </div>
             <div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase">{user?.name || 'Architect'}</h1>
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 border border-white/10 opacity-60">
                   {user?.role} STATION
                </span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: SCAN & CURRENT */}
          <div className="space-y-8">
            <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
               <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-6">Synchronize Order</h3>
               <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 text-teal-400 transition-all" />
                  <input 
                    type="text" 
                    placeholder="ENTER ORDER ID OR SCAN..."
                    value={orderId}
                    onChange={(e) => {
                      setOrderId(e.target.value);
                      if (e.target.value.length > 20) searchOrder(e.target.value);
                    }}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-black uppercase tracking-widest outline-none focus:border-teal-400/30 transition-all"
                  />
               </div>
            </div>

            {currentOrder && (
              <div className="p-10 rounded-[48px] border-2 animate-in slide-in-from-bottom-4" style={{ backgroundColor: C.card, borderColor: C.border }}>
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40 px-3 py-1 rounded-lg bg-white/5 border border-white/10 mb-4 block w-fit">
                         {STATUS_MAP[currentOrder.status]?.label}
                       </span>
                       <h2 className="text-3xl font-black text-white">{currentOrder.customerName}</h2>
                       <p className="text-xs font-mono opacity-30">ID: {currentOrder.id}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Total Due</p>
                       <p className="text-3xl font-black text-teal-400">Rp {currentOrder.totalPrice.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="space-y-4 mb-10 border-y border-white/5 py-8">
                    {JSON.parse(currentOrder.items || '[]').map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                           <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-xs text-teal-400">{item.quantity}x</span>
                           <p className="text-sm font-bold">{item.name}</p>
                        </div>
                        <p className="text-sm opacity-40">Rp {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {currentOrder.status === 'PENDING' && (
                       <button 
                         onClick={() => updateStatus(currentOrder.id, 'PAID')}
                         className="col-span-2 py-5 rounded-2xl bg-teal-400 text-[#05161A] font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(15,150,156,0.3)]"
                       >
                          <Banknote className="w-5 h-5" /> PAYMENT KASIR (VALIDATE)
                       </button>
                    )}

                    {currentOrder.status === 'PAID' && (
                       <button 
                         onClick={() => updateStatus(currentOrder.id, 'PROCESSING')}
                         className="col-span-2 py-5 rounded-2xl bg-teal-400/10 border border-teal-400 text-teal-400 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
                       >
                          <PlayCircle className="w-5 h-5" /> BEGIN CRAFTING
                       </button>
                    )}

                    {currentOrder.status === 'PROCESSING' && (
                       <button 
                         onClick={() => updateStatus(currentOrder.id, 'DONE')}
                         className="col-span-2 py-5 rounded-2xl bg-white text-[#05161A] font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
                       >
                          <CheckCircle2 className="w-5 h-5" /> ORDER COMPLETED
                       </button>
                    )}
                 </div>
              </div>
            )}
          </div>

          {/* RIGHT: RECENT QUEUE */}
          <div className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 flex items-center gap-3">
                <RefreshCcw className="w-4 h-4" /> RECENT RESONANCE (QUEUE)
             </h3>
             <div className="space-y-4">
                {recentOrders.map((t) => (
                  <div 
                    key={t.id} 
                    onClick={() => searchOrder(t.id)}
                    className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between cursor-pointer hover:border-teal-400/30 transition-all group"
                  >
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all">
                          <Package className="w-5 h-5 opacity-30" />
                       </div>
                       <div>
                          <h4 className="font-bold text-white text-sm">{t.customerName}</h4>
                          <p className="text-[10px] font-mono opacity-30">#{t.id.slice(0,8)}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-teal-400 mb-1">Rp {t.totalPrice.toLocaleString()}</p>
                       <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md" style={{ backgroundColor: `${STATUS_MAP[t.status]?.color}20`, color: STATUS_MAP[t.status]?.color }}>
                          {STATUS_MAP[t.status]?.label}
                       </span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
