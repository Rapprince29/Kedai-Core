'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ChevronRight, Waves, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const C = {
  bg:      '#05161A', // Deep Sea Background
  card:    '#072E33', // Deep Teal Card
  accent:  '#0F969C', // Teal Accent
  text:    '#6DA5C0', // Sky Blue Text
  border:  'rgba(15,150,156,0.15)'
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/login', formData);
      router.push('/menu');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-white" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-md p-12 rounded-[56px] border transition-all" 
        style={{ backgroundColor: C.card, borderColor: C.border, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
        
        <div className="w-20 h-20 rounded-[32px] bg-teal-400/10 flex items-center justify-center mx-auto mb-8">
           <ShieldCheck className="w-10 h-10 text-teal-400" />
        </div>

        <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">ACCESS DEPTH</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-10">Handshake Required v2.0</p>

        {registered && (
          <div className="mb-8 p-4 rounded-2xl bg-teal-400/10 border border-teal-400/20 text-center animate-bounce">
             <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">Identity Initialized! Please Login.</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
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
            {loading ? <Zap className="w-5 h-5 animate-spin" /> : <>Synchronize <ChevronRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
              New explorer? <Link href="/auth/register" className="text-teal-400 hover:underline">Join Core</Link>
           </p>
        </div>
      </div>
    </div>
  );
}
