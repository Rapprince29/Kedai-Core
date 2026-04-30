'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Package, RefreshCcw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
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

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
      <RefreshCcw className="w-8 h-8 animate-spin text-teal-500" />
    </div>
  );

  const stats = [
    { label: 'Total Revenue', value: `Rp ${data?.totalRevenue.toLocaleString()}`, icon: TrendingUp, trend: '+12.5%', color: C.accent },
    { label: 'Active Orders', value: data?.todayTransactionsCount || 0, icon: ShoppingBag, trend: '+4', color: '#6DA5C0' },
    { label: 'Inventory Alerts', value: data?.inventoryAlertsCount || 0, icon: AlertTriangle, trend: 'Low Stock', color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: C.bg }}>
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">COMMAND CENTER</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: C.text }}>Artisan Insights v2.0</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-3 rounded-2xl border transition-all active:scale-95" 
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <RefreshCcw className="w-5 h-5 text-teal-400" />
        </button>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="p-8 rounded-[32px] border transition-all hover:scale-[1.02]" style={{ backgroundColor: C.card, borderColor: C.border }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${s.color}10` }}>
                <s.icon className="w-6 h-6" style={{ color: s.color }} />
              </div>
              <span className="text-[10px] font-black tracking-widest px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: s.color }}>
                {s.trend}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">{s.label}</p>
            <h3 className="text-3xl font-black text-white">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="p-10 rounded-[40px] border" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 opacity-40">Revenue Flow (7D)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.dailyTrend}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: '16px' }}
                  itemStyle={{ color: C.accent }}
                />
                <Area type="monotone" dataKey="amount" stroke={C.accent} strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-10 rounded-[40px] border" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 opacity-40">Stock Resonance</h3>
          <div className="space-y-6">
            {data?.lowStockItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/20 border border-white/5 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-red-400">{item.stock} left</p>
                  <div className="w-24 h-1.5 bg-black/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${(item.stock / 20) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div className="p-10 rounded-[40px] border" style={{ backgroundColor: C.card, borderColor: C.border }}>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 opacity-40">Recent Echoes (Orders)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-widest opacity-30 border-b border-white/5">
                <th className="pb-4">Transaction ID</th>
                <th className="pb-4">Explorer Name</th>
                <th className="pb-4">Essence Total</th>
                <th className="pb-4">Frequency</th>
                <th className="pb-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentTransactions.map((t: any) => (
                <tr key={t.id} className="text-sm">
                  <td className="py-6 font-mono text-xs opacity-40">{t.id.slice(0, 8)}</td>
                  <td className="py-6 font-bold text-white">{t.customerName}</td>
                  <td className="py-6 text-teal-400 font-black">Rp {t.totalPrice.toLocaleString()}</td>
                  <td className="py-6 opacity-40">{new Date(t.createdAt).toLocaleTimeString()}</td>
                  <td className="py-6 text-right">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest" 
                      style={{ backgroundColor: t.status === 'DONE' ? `${C.accent}20` : 'rgba(255,255,255,0.03)', color: t.status === 'DONE' ? C.accent : C.text }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
