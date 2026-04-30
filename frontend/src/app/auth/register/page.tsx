'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ChevronRight, Waves, Zap } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const C = {
  bg:      '#05161A', // Deep Sea Background
  card:    '#072E33', // Deep Teal Card
  accent:  '#0F969C', // Teal Accent
  text:    '#6DA5C0', // Sky Blue Text
  border:  'rgba(15,150,156,0.15)'
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', formData);
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-white" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-md p-12 rounded-[56px] border transition-all" 
        style={{ backgroundColor: C.card, borderColor: C.border, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
        
        <div className="w-20 h-20 rounded-[32px] bg-teal-400/10 flex items-center justify-center mx-auto mb-8">
           <Waves className="w-10 h-10 text-teal-400" />
        </div>

        <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">JOIN THE CORE</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-10">Artisan Membership v2.0</p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
             <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity text-teal-400" />
                <input
                  type="text"
                  placeholder="FULL NAME"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/20 border-2 rounded-2xl py-4 px-14 text-sm font-bold outline-none transition-all placeholder:opacity-20"
                  style={{ borderColor: C.border }}
                  required
                />
             </div>
             <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity text-teal-400" />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/20 border-2 rounded-2xl py-4 px-14 text-sm font-bold outline-none transition-all placeholder:opacity-20"
                  style={{ borderColor: C.border }}
                  required
                />
             </div>
             <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity text-teal-400" />
                <input
                  type="password"
                  placeholder="SECURE PASSWORD"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black/20 border-2 rounded-2xl py-4 px-14 text-sm font-bold outline-none transition-all placeholder:opacity-20"
                  style={{ borderColor: C.border }}
                  required
                />
             </div>
          </div>

          {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase text-[#05161A] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            style={{ backgroundColor: C.accent, boxShadow: `0 12px 32px ${C.accent}40` }}
          >
            {loading ? <Zap className="w-5 h-5 animate-spin" /> : <>Initialize Identity <ChevronRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
              Already a member? <Link href="/auth/login" className="text-teal-400 hover:underline">Access Depth</Link>
           </p>
        </div>
      </div>
    </div>
  );
}
