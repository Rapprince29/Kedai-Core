'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, AlertTriangle, 
  RefreshCcw, Clock, CheckCircle2, Truck, PlayCircle, Package, LogOut, Shield
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
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

const STATUS_COLORS: any = {
  PENDING: '#6DA5C0',
  PROCESSING: '#0F969C',
  OUT_FOR_DELIVERY: '#F59E0B',
  DONE: '#10B981'
};

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analytics, me] = await Promise.all([
        axios.get('/api/analytics'),
        axios.get('/api/auth/me')
      ]);
      setData(analytics.data);
      setUser(me.data.user);
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`/api/transactions/${id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading && !data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
      <RefreshCcw className="w-8 h-8 animate-spin text-teal-500" />
    </div>
  );

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: C.bg }}>
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-3xl bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
              <Shield className="w-8 h-8 text-teal-400" />
           </div>
           <div>
             <h1 className="text-3xl font-black tracking-tighter text-white leading-tight">{user?.name || 'ADMIN'}</h1>
             <span className="text-[9px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 opacity-60">
                SYSTEM {user?.role} v2.0
             </span>
           </div>
        </div>
        <div className="flex gap-4 items-center">
           <Link href="/admin/users" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-teal-400/10 hover:border-teal-400/30 transition-all group">
             <Users className="w-4 h-4 text-teal-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-teal-400">Users</span>
           </Link>
           <div className="text-right mr-4">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Today's Revenue</p>
              <p className="text-2xl font-black text-teal-400">Rp {data?.todayRevenue.toLocaleString()}</p>
           </div>
           <button onClick={fetchData} className="p-4 rounded-2xl border transition-all active:scale-95 bg-white/5 border-white/5">
             <RefreshCcw className="w-5 h-5 text-teal-400" />
           </button>
           <button 
             onClick={async () => {
               if (window.confirm('Abandon Command Center?')) {
                 await axios.post('/api/auth/logout');
                 window.location.href = '/auth/login';
               }
             }}
             className="p-4 rounded-2xl border transition-all active:scale-95 bg-red-400/10 border-red-400/20" 
           >
             <LogOut className="w-5 h-5 text-red-400" />
           </button>
        </div>
      </div>

      {/* ── REVENUE COMPARISON ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
         <div className="p-8 rounded-[40px] border relative overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Today vs Yesterday</p>
               <div className="flex items-end gap-6">
                  <div>
                     <p className="text-[10px] font-bold opacity-30 uppercase">Today</p>
                     <h3 className="text-3xl font-black text-white">Rp {data?.todayRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                     <p className="text-[10px] font-bold opacity-30 uppercase">Yesterday</p>
                     <h3 className="text-xl font-black opacity-40">Rp {data?.yesterdayRevenue.toLocaleString()}</h3>
                  </div>
               </div>
            </div>
            <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-teal-400" />
         </div>

         <div className="p-8 rounded-[40px] border flex items-center justify-between" style={{ backgroundColor: C.card, borderColor: C.border }}>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Active Frequency</p>
               <h3 className="text-4xl font-black text-white">{data?.todayTransactionsCount} <span className="text-sm opacity-30 font-medium">Orders Today</span></h3>
            </div>
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-teal-400/10 border border-teal-400/20">
               <ShoppingBag className="w-8 h-8 text-teal-400" />
            </div>
         </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT: Live Orders */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-8 rounded-[40px] border h-full" style={{ backgroundColor: C.card, borderColor: C.border }}>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 opacity-40 flex items-center gap-3">
               <Clock className="w-4 h-4" /> Live Echoes (Orders)
            </h3>
            
            <div className="space-y-4">
              {data?.recentTransactions.map((t: any) => (
                <div key={t.id} className="p-6 rounded-3xl bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between gap-6 transition-all hover:border-teal-400/20">
                  <div className="flex gap-6">
                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                        <Package className="w-6 h-6 opacity-30" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="font-black text-lg text-white">{t.customerName}</h4>
                           <span className="text-[10px] font-mono opacity-30">#{t.id.slice(0,6)}</span>
                        </div>
                        <div className="flex gap-4">
                           <p className="text-xs font-black text-teal-400">Rp {t.totalPrice.toLocaleString()}</p>
                           <p className="text-xs opacity-40">{new Date(t.createdAt).toLocaleTimeString()}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <select 
                       value={t.status}
                       onChange={(e) => updateStatus(t.id, e.target.value)}
                       className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-teal-400 transition-all"
                       style={{ color: STATUS_COLORS[t.status] }}
                     >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="OUT_FOR_DELIVERY">On Delivery</option>
                        <option value="DONE">Completed</option>
                     </select>
                     
                     <div className="flex gap-1">
                        <button onClick={() => updateStatus(t.id, 'PROCESSING')} className="p-2 rounded-lg bg-white/5 hover:bg-teal-400/10 text-white/20 hover:text-teal-400 transition-all"><PlayCircle className="w-4 h-4" /></button>
                        <button onClick={() => updateStatus(t.id, 'OUT_FOR_DELIVERY')} className="p-2 rounded-lg bg-white/5 hover:bg-orange-400/10 text-white/20 hover:text-orange-400 transition-all"><Truck className="w-4 h-4" /></button>
                        <button onClick={() => updateStatus(t.id, 'DONE')} className="p-2 rounded-lg bg-white/5 hover:bg-green-400/10 text-white/20 hover:text-green-400 transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Insights */}
        <div className="space-y-8">
           {/* Revenue Chart */}
           <div className="p-8 rounded-[40px] border" style={{ backgroundColor: C.card, borderColor: C.border }}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-40">Velocity Trend</h3>
              <div className="h-48 mb-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.dailyTrend}>
                       <XAxis dataKey="date" hide />
                       <YAxis hide />
                       <Area type="monotone" dataKey="amount" stroke={C.accent} strokeWidth={3} fill={C.accent} fillOpacity={0.1} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Stock Alerts */}
           <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-8">Stock Criticality (Inventory)</h3>
              <div className="space-y-4">
                 {[
                   { name: 'House Blend Beans', stock: 12, unit: 'kg' },
                   { name: 'Oat Milk Premium', stock: 5, unit: 'L' }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-red-400/5 border border-red-400/20">
                      <div className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                         <span className="text-sm font-bold text-white">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">LOW: {item.stock}{item.unit}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Staff Sync */}
           <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-8">Staff Sync (Active Shift)</h3>
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-teal-400/10 border border-teal-400/20">
                 <div className="w-16 h-16 rounded-2xl bg-teal-400 flex items-center justify-center font-black text-2xl text-[#05161A]">Y</div>
                 <div>
                    <h4 className="text-xl font-black text-white">Yoga Ananda</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">Head Architect (Active)</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
