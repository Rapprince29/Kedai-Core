'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Shield, User, ArrowLeft, 
  RefreshCcw, Search, MoreVertical, Trash2
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const C = {
  bg:      '#05161A', // Deep Sea Background
  card:    '#072E33', // Deep Teal Card
  accent:  '#0F969C', // Teal Accent
  text:    '#6DA5C0', // Sky Blue Text
  border:  'rgba(15,150,156,0.1)'
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string, nextRole: string) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: nextRole });
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: C.bg }}>
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="p-3 rounded-2xl bg-white/5 border border-white/5 text-teal-400 hover:scale-110 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-1">CITIZEN INDEX</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: C.text }}>Identity Management v2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
             <input 
               type="text"
               placeholder="SEARCH EXPLORERS..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-black uppercase tracking-widest outline-none focus:border-teal-400/30 transition-all"
             />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-3 rounded-2xl border transition-all active:scale-95 bg-white/5 border-white/5" 
          >
            <RefreshCcw className={`w-5 h-5 text-teal-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── USERS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="p-8 rounded-[40px] border transition-all hover:border-teal-400/20 group relative overflow-hidden" 
            style={{ backgroundColor: C.card, borderColor: C.border }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[24px] flex items-center justify-center relative overflow-hidden bg-black/20 border border-white/5">
                {user.role === 'ADMIN' ? (
                  <Shield className="w-8 h-8 text-teal-400" />
                ) : (
                  <User className="w-8 h-8 opacity-20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-400/10 to-transparent" />
              </div>
              <div>
                <h3 className="font-black text-white text-lg leading-tight truncate w-32">{user.name || 'ANONYMOUS'}</h3>
                <p className="text-[10px] font-mono opacity-30 truncate w-32">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Authorization</p>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-teal-400 text-[#05161A]' : 'bg-white/5 text-white/40 border border-white/5'}`}>
                  {user.role}
                </span>
              </div>
              
              <button 
                onClick={() => {
                  const roles = ['CUSTOMER', 'KASIR', 'ADMIN'];
                  const nextIndex = (roles.indexOf(user.role) + 1) % roles.length;
                  toggleRole(user.id, user.role, roles[nextIndex]);
                }}
                className="px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-teal-400/10 border border-white/10 hover:border-teal-400/30 transition-all active:scale-95 text-teal-400"
              >
                Change Role
              </button>
            </div>
            
            <p className="absolute bottom-4 right-8 text-[8px] font-mono opacity-10 uppercase tracking-widest">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="py-32 text-center opacity-20">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <p className="text-sm font-black uppercase tracking-[0.5em]">No Explorers Found</p>
        </div>
      )}
    </div>
  );
}
