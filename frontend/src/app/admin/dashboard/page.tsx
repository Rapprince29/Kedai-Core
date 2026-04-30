'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingCart, DollarSign, 
  Package, AlertTriangle, ChevronRight 
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/analytics/dashboard`);
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: ['weekly-trend'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/analytics/weekly-trend`);
      return res.data;
    },
  });

  if (statsLoading || trendLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115] text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Memuat Data Analitik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Dashboard Pro
          </h1>
          <p className="text-gray-400 mt-2">Kedai-Core Operasional Real-time</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Terakhir diperbarui</p>
          <p className="text-amber-400 font-mono">{new Date().toLocaleTimeString()}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Pendapatan" 
          value={`Rp ${stats?.totalRevenue?.toLocaleString()}`} 
          icon={<DollarSign className="text-emerald-400" />}
          trend="+12.5%"
          color="emerald"
        />
        <StatCard 
          title="Pendapatan Hari Ini" 
          value={`Rp ${stats?.todayRevenue?.toLocaleString()}`} 
          icon={<TrendingUp className="text-amber-400" />}
          trend="+5.2%"
          color="amber"
        />
        <StatCard 
          title="Total Transaksi" 
          value={stats?.totalTransactions} 
          icon={<ShoppingCart className="text-blue-400" />}
          trend="+8"
          color="blue"
        />
        <StatCard 
          title="Produk Terlaris" 
          value={stats?.topProducts?.[0]?.name || '-'} 
          icon={<Package className="text-purple-400" />}
          trend="Top Pick"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 bg-[#1a1d23] rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Tren Penjualan Mingguan
            </h2>
            <select className="bg-[#0f1115] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400 outline-none focus:border-amber-500 transition-colors">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#4b5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { weekday: 'short' })}
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `Rp ${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#f59e0b" 
                  strokeWidth={4} 
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products List */}
        <div className="bg-[#1a1d23] rounded-3xl p-8 border border-white/5 shadow-2xl">
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            Produk Terlaris
          </h2>
          <div className="space-y-6">
            {stats?.topProducts?.map((product: any, index: number) => (
              <div key={product.id} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-amber-500 font-bold border border-white/5">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:text-amber-400 transition-colors">{product.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{product.totalSold}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Terjual</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 text-sm font-medium transition-all flex items-center justify-center gap-2 group">
            Lihat Semua Produk
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-3xl p-6 backdrop-blur-sm shadow-xl`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-black/20 rounded-2xl">
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-black/20 ${color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`}>
          {trend}
        </span>
      </div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1 text-white tracking-tight">{value}</p>
    </div>
  );
}
