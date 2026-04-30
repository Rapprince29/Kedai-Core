'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, ShoppingCart, DollarSign, 
  Package, AlertTriangle, ChevronRight, ArrowLeft, Loader2 
} from 'lucide-react';
import Link from 'next/link';

const C = {
  bg:      '#051F20', // Primary (Background)
  card:    '#0B2B26', // Secondary
  card2:   '#163832', // Secondary dark
  primary: '#8EB69B', // Soft Elements (Accent)
  accent:  '#235347', // Accent
  text:    '#DAF1DE', // Highlights (Text)
  muted:   '#8EB69B', // Text/Soft
  border:  'rgba(142,182,155,0.15)',
  red:     '#ff6b6b',
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const res = await axios.get(`/api/analytics`);
      return res.data;
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: C.bg }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: C.primary }} />
        <p className="font-bold uppercase tracking-widest text-xs" style={{ color: C.muted }}>Syncing Artisan Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: C.bg }}>
      <header className="mb-12 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-3 rounded-full transition-all hover:scale-110" style={{ backgroundColor: C.card }}>
            <ArrowLeft className="w-5 h-5" style={{ color: C.text }} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold italic" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>
              Operational Insights
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold mt-2" style={{ color: C.muted }}>Kedai-Code Real-time Metrics</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-40" style={{ color: C.muted }}>Last Synchronized</p>
          <p className="text-lg font-bold" style={{ color: C.primary }}>{new Date().toLocaleTimeString()}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Accumulated Revenue" 
          value={`Rp ${stats?.totalRevenue?.toLocaleString('id-ID')}`} 
          icon={<DollarSign className="w-6 h-6" />}
          sub="Total collection"
        />
        <StatCard 
          title="Daily Performance" 
          value={`Rp ${stats?.todayRevenue?.toLocaleString('id-ID')}`} 
          icon={<TrendingUp className="w-6 h-6" />}
          sub={`${stats?.todayTransactionsCount} orders today`}
        />
        <StatCard 
          title="Total Transactions" 
          value={stats?.totalTransactions} 
          icon={<ShoppingCart className="w-6 h-6" />}
          sub="Successful exchanges"
        />
        <StatCard 
          title="Inventory Alerts" 
          value={stats?.inventoryAlertsCount} 
          icon={<AlertTriangle className={`w-6 h-6 ${stats?.inventoryAlertsCount > 0 ? 'animate-pulse' : ''}`} />}
          sub="Items needing refill"
          alert={stats?.inventoryAlertsCount > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 rounded-[40px] p-10 border shadow-2xl" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold italic flex items-center gap-3" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>
              Revenue Trajectory
            </h2>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailyTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(142,182,155,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke={C.muted} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { weekday: 'short' })}
                />
                <YAxis 
                  stroke={C.muted} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `Rp ${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: C.card2, border: `1px solid ${C.border}`, borderRadius: '16px', color: C.text }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke={C.primary} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-[40px] p-10 border shadow-2xl" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <h2 className="text-2xl font-bold italic mb-8 flex items-center gap-3" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>
            Stock Vigilance
          </h2>
          <div className="space-y-6">
            {stats?.lowStockItems?.length > 0 ? stats.lowStockItems.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all" style={{ backgroundColor: C.card2 }}>
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold italic truncate" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.red }}>{item.stock} left</p>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center opacity-40">
                <Package className="w-12 h-12 mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">All Stock Secure</p>
              </div>
            )}
          </div>
          <Link href="/admin" className="block w-full mt-10 py-4 rounded-2xl text-center text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-105"
            style={{ backgroundColor: C.accent, color: '#fff' }}>
            Refill Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, sub, alert }: any) {
  return (
    <div className="rounded-[32px] p-8 border shadow-xl transition-all hover:translate-y-[-4px]" 
      style={{ backgroundColor: C.card, borderColor: alert ? C.red : C.border }}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 rounded-2xl" style={{ backgroundColor: C.card2, color: alert ? C.red : C.primary }}>
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1" style={{ color: C.muted }}>{title}</p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: C.text }}>{value}</p>
      <p className="text-[10px] font-bold mt-2 opacity-60" style={{ color: C.muted }}>{sub}</p>
    </div>
  );
}
