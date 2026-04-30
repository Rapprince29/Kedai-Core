'use client';

import { useState, useEffect } from 'react';
import { useMenuStore } from '@/store/menuStore';
import { MenuItem } from '@/store/cartStore';
import {
  Plus, Pencil, Trash2, X, Check, ShieldAlert,
  ChevronLeft, ImageIcon, Loader2
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
  green:   '#DAF1DE',
  red:     '#ff6b6b',
  border:  'rgba(142,182,155,0.15)',
};

const CATEGORIES = ['Coffee', 'Pastry', 'Non-Coffee'];

const EMPTY_FORM = { name: '', description: '', price: '', category: 'Coffee', image: '', stock: '0' };

const ADMIN_PIN = '1234';

export default function AdminPage() {
  const { items, fetchMenu, addItem, updateItem, deleteItem, loading } = useMenuStore();

  const [authed,    setAuthed]    = useState(false);
  const [pin,       setPin]       = useState('');
  const [pinError,  setPinError]  = useState(false);

  const [modal,     setModal]     = useState<'add' | 'edit' | 'delete' | null>(null);
  const [target,    setTarget]    = useState<MenuItem | null>(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [toast,     setToast]     = useState('');
  const [busy,      setBusy]      = useState(false);

  useEffect(() => {
    if (authed) fetchMenu();
  }, [authed, fetchMenu]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  if (!authed) {
    const handlePinSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (pin === ADMIN_PIN) setAuthed(true);
      else { setPinError(true); setPin(''); }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: C.bg }}>
        <div className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-6"
          style={{ backgroundColor: C.card, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <ShieldAlert className="w-10 h-10" style={{ color: C.primary }} />
        </div>
        <h1 className="text-3xl font-bold italic mb-1" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>Kedai-Code Admin</h1>
        <p className="text-sm mb-8" style={{ color: C.muted }}>Enter PIN to access the artisan dashboard</p>

        <form onSubmit={handlePinSubmit} className="flex flex-col items-center">
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(false); }}
            placeholder="••••"
            className="w-48 text-center text-4xl tracking-[0.6em] py-5 rounded-2xl outline-none transition-all"
            style={{
              border: `2px solid ${pinError ? C.red : C.border}`,
              color: C.text,
              backgroundColor: C.card,
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
            autoFocus
          />
          {pinError && <p className="text-xs mt-3 font-bold" style={{ color: C.red }}>Invalid PIN</p>}
          <button
            type="submit"
            className="mt-8 px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: C.accent, boxShadow: `0 12px 32px ${C.accent}40` }}
          >
            Authenticate
          </button>
        </form>
        <Link href="/" className="mt-10 text-xs tracking-widest uppercase font-bold opacity-60 hover:opacity-100 transition-opacity" style={{ color: C.muted }}>
          ← Back to Menu
        </Link>
      </div>
    );
  }

  const openAdd = () => { setForm(EMPTY_FORM); setTarget(null); setModal('add'); };
  const openEdit = (item: any) => {
    setTarget(item);
    setForm({ 
      name: item.name, 
      description: item.description || '', 
      price: String(item.price), 
      category: item.category, 
      image: item.image,
      stock: String(item.stock || 0)
    });
    setModal('edit');
  };
  const openDelete = (item: any) => { setTarget(item); setModal('delete'); };
  const closeModal = () => { if (!busy) { setModal(null); setTarget(null); } };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.image.trim()) return;
    setBusy(true);
    try {
      const data = { 
        name: form.name.trim(), 
        description: form.description.trim(),
        price: Number(form.price), 
        category: form.category, 
        image: form.image.trim(),
        stock: Number(form.stock)
      };
      if (modal === 'add') {
        await addItem(data);
        showToast('✅ Menu added successfully!');
      } else if (modal === 'edit' && target) {
        await updateItem(target.id, data);
        showToast('✏️ Menu updated!');
      }
      closeModal();
    } catch (err) {
      showToast('❌ Failed to save menu');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await deleteItem(target.id);
      showToast('🗑️ Menu deleted!');
      closeModal();
    } catch (err) {
      showToast('❌ Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: C.bg }}>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-in slide-in-from-top-4"
          style={{ backgroundColor: C.primary, color: C.bg }}>
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-50 backdrop-blur-xl px-5 py-6 flex justify-between items-center"
        style={{ backgroundColor: `${C.bg}CC`, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2.5 rounded-full transition-all hover:scale-110" style={{ backgroundColor: C.card }}>
            <ChevronLeft className="w-5 h-5" style={{ color: C.text }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold italic" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>Artisan Studio</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: C.muted }}>
              {items.length} Crafted Items
            </p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: C.accent, boxShadow: `0 8px 24px ${C.accent}40` }}>
          <Plus className="w-4 h-4" />
          Craft New
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: C.primary }} />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: C.muted }}>Loading Studio...</p>
        </div>
      ) : (
        CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat);
          return (
            <div key={cat} className="px-5 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-grow" style={{ backgroundColor: C.border }} />
                <p className="text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: C.muted }}>
                  {cat} ({catItems.length})
                </p>
                <div className="h-px flex-grow" style={{ backgroundColor: C.border }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-5 rounded-[24px] transition-all hover:shadow-xl"
                    style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0" style={{ backgroundColor: C.card2 }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <ImageIcon className="w-8 h-8 m-auto mt-6" style={{ color: C.accent }} />
                      }
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-lg font-bold italic truncate" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</p>
                      <p className="text-sm font-bold mt-1" style={{ color: C.primary }}>
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => openEdit(item)} className="p-3 rounded-xl transition-all hover:bg-white/10" style={{ backgroundColor: C.card2 }}>
                        <Pencil className="w-4 h-4" style={{ color: C.text }} />
                      </button>
                      <button onClick={() => openDelete(item)} className="p-3 rounded-xl transition-all hover:bg-red-500/20" style={{ backgroundColor: 'rgba(255,107,107,0.1)' }}>
                        <Trash2 className="w-4 h-4" style={{ color: C.red }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* ── MODAL ADD / EDIT ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}>
          <div className="w-full max-w-xl rounded-[40px] p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold italic" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>
                {modal === 'add' ? 'Craft New Menu' : 'Refine Menu Item'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/10"><X className="w-6 h-6" style={{ color: C.text }} /></button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Item Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-5 py-4 rounded-2xl outline-none text-sm transition-all focus:ring-2"
                    style={{ backgroundColor: C.card2, color: C.text, border: `1px solid ${C.border}`, '--tw-ring-color': C.primary } as any} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-5 py-4 rounded-2xl outline-none text-sm min-h-[100px]"
                    style={{ backgroundColor: C.card2, color: C.text, border: `1px solid ${C.border}` }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Price (Rp)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl outline-none text-sm"
                      style={{ backgroundColor: C.card2, color: C.text, border: `1px solid ${C.border}` }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Initial Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl outline-none text-sm"
                      style={{ backgroundColor: C.card2, color: C.text, border: `1px solid ${C.border}` }} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Category</label>
                  <div className="flex gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))}
                        className="flex-1 py-3 rounded-xl text-xs font-bold transition-all"
                        style={form.category === cat ? { backgroundColor: C.primary, color: C.bg } : { backgroundColor: C.card2, color: C.text, border: `1px solid ${C.border}` }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Image URL</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    className="w-full px-5 py-4 rounded-2xl outline-none text-sm"
                    style={{ backgroundColor: C.card2, color: C.text, border: `1px solid ${C.border}` }} />
                </div>
              </div>
            </div>

            <button onClick={handleSave} disabled={busy || !form.name || !form.price || !form.image}
              className="mt-10 w-full py-5 rounded-[24px] font-bold text-white flex items-center justify-center gap-3 disabled:opacity-40 transition-all hover:scale-[1.02]"
              style={{ backgroundColor: C.accent, boxShadow: `0 12px 32px ${C.accent}40` }}>
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {modal === 'add' ? 'Confirm Craft' : 'Save Refinements'}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DELETE ── */}
      {modal === 'delete' && target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}>
          <div className="w-full max-w-sm rounded-[40px] p-10 text-center animate-in zoom-in-95"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(255,107,107,0.1)' }}>
              <Trash2 className="w-10 h-10" style={{ color: C.red }} />
            </div>
            <h2 className="text-2xl font-bold italic mb-3" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>Archive Menu?</h2>
            <p className="text-sm mb-8" style={{ color: C.muted }}>
              The creation <span style={{ color: C.text, fontWeight: 700 }}>{target.name}</span> will be removed from the artisan collection.
            </p>
            <div className="flex gap-4">
              <button onClick={closeModal} className="flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/10" style={{ color: C.text }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={busy} className="flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-white transition-all hover:scale-105"
                style={{ backgroundColor: C.red, boxShadow: `0 8px 24px ${C.red}30` }}>
                {busy ? 'Archiving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
