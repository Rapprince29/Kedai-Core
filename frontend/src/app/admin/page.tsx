'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronRight, Fingerprint } from 'lucide-react';

const C = {
  bg:      '#05161A', // Deep Sea Background
  card:    '#072E33', // Deep Teal Card
  accent:  '#0F969C', // Teal Accent
  text:    '#6DA5C0', // Sky Blue Text
  border:  'rgba(15,150,156,0.15)'
};

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      router.push('/admin/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-sm p-12 rounded-[48px] text-center border transition-all" 
        style={{ backgroundColor: C.card, borderColor: error ? 'rgba(239,68,68,0.3)' : C.border, boxShadow: error ? '0 0 60px rgba(239,68,68,0.1)' : '0 40px 100px rgba(0,0,0,0.5)' }}>
        
        <div className="w-20 h-20 rounded-[32px] bg-black/20 flex items-center justify-center mx-auto mb-10 relative">
           <div className="absolute inset-0 rounded-[32px] bg-teal-400/5 animate-pulse" />
           <ShieldCheck className="w-10 h-10 text-teal-400" />
        </div>

        <h1 className="text-3xl font-black tracking-tighter text-white mb-2">SECURE ACCESS</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-12">Authorized Personnel Only</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-black/20 border-2 rounded-2xl py-5 px-6 text-center text-3xl font-black tracking-[0.8em] text-white outline-none transition-all placeholder:opacity-10"
              style={{ borderColor: error ? '#EF4444' : C.border }}
              autoFocus
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-6 opacity-20 group-focus-within:opacity-40 transition-opacity">
               <Fingerprint className="w-5 h-5 text-teal-400" />
            </div>
          </div>

          {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-400 animate-bounce">Access Denied</p>}

          <button
            type="submit"
            className="w-full py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase text-[#05161A] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            style={{ backgroundColor: C.accent, boxShadow: `0 12px 32px ${C.accent}40` }}
          >
            Authenticate
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-white/5">
           <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-20">System Key: 1234</p>
        </div>
      </div>
    </div>
  );
}
