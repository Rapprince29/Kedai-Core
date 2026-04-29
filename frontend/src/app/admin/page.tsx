'use client';

import { useState, useEffect } from 'react';
import { useMenuStore } from '@/store/menuStore';
import { MenuItem } from '@/store/cartStore';
import {
  Plus, Pencil, Trash2, X, Check, ShieldAlert,
  UtensilsCrossed, ChevronLeft, ImageIcon
} from 'lucide-react';
import Link from 'next/link';

const C = {
  bg:      '#F2F0EB',
  card:    '#FFFFFF',
  card2:   '#E8DFD0',
  primary: '#A0522D',
  accent:  '#6B4226',
  text:    '#1C1007',
  muted:   '#8C7B6B',
  green:   '#3a7d44',
  red:     '#dc2626',
  border:  'rgba(107,66,38,0.10)',
};

const CATEGORIES = ['Mie', 'Dimsum', 'Minuman'];

const EMPTY_FORM = { name: '', price: '', category: 'Mie', image: '' };

// ─── Simple PIN guard ─────────────────────────────────────────────────────────
const ADMIN_PIN = '1234'; // TODO: ganti dengan env var / auth asli

export default function AdminPage() {
  const { items, addItem, updateItem, deleteItem, isDefault } = useMenuStore();

  const [authed,    setAuthed]    = useState(false);
  const [pin,       setPin]       = useState('');
  const [pinError,  setPinError]  = useState(false);

  const [modal,     setModal]     = useState<'add' | 'edit' | 'delete' | null>(null);
  const [target,    setTarget]    = useState<MenuItem | null>(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [toast,     setToast]     = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ─── PIN LOGIN ──────────────────────────────────────────────────────────────
  if (!authed) {
    const handlePinSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (pin === ADMIN_PIN) setAuthed(true);
      else { setPinError(true); setPin(''); }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: C.bg }}>
        <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6"
          style={{ backgroundColor: C.card, boxShadow: '0 4px 20px rgba(107,66,38,0.08)' }}>
          <ShieldAlert className="w-8 h-8" style={{ color: C.primary }} />
        </div>
        <h1 className="text-2xl font-bold italic mb-1" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>Admin Panel</h1>
        <p className="text-sm mb-8" style={{ color: C.muted }}>Masukkan PIN untuk lanjut</p>

        <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-0">
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(false); }}
            placeholder="• • • •"
            className="w-40 text-center text-3xl tracking-[0.5em] py-4 rounded-2xl outline-none"
            style={{
              border: `2px solid ${pinError ? C.red : C.border}`,
              color: C.text,
              backgroundColor: C.card,
              boxShadow: '0 4px 20px rgba(107,66,38,0.08)',
            }}
            autoFocus
          />
          {pinError && (
            <p className="text-xs mt-3 font-bold" style={{ color: C.red }}>PIN salah, coba lagi</p>
          )}
          <button
            type="submit"
            className="mt-5 px-8 py-3 rounded-full font-semibold text-white transition-all hover:brightness-90 active:scale-95"
            style={{ backgroundColor: C.primary, boxShadow: `0 8px 24px ${C.primary}35` }}
          >
            Masuk
          </button>
        </form>
        <Link href="/" className="mt-6 text-xs" style={{ color: `${C.muted}80` }}>
          ← Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // ─── OPEN MODAL ─────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setTarget(null);
    setModal('add');
  };

  const openEdit = (item: MenuItem) => {
    setTarget(item);
    setForm({ name: item.name, price: String(item.price), category: item.category, image: item.image });
    setModal('edit');
  };

  const openDelete = (item: MenuItem) => { setTarget(item); setModal('delete'); };

  const closeModal = () => { setModal(null); setTarget(null); };

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.image.trim()) return;
    const data = { name: form.name.trim(), price: Number(form.price), category: form.category, image: form.image.trim() };
    if (modal === 'add') {
      addItem(data);
      showToast('✅ Menu berhasil ditambahkan!');
    } else if (modal === 'edit' && target) {
      updateItem(target.id, data);
      showToast('✏️ Menu berhasil diperbarui!');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!target) return;
    deleteItem(target.id);
    showToast('🗑️ Menu berhasil dihapus!');
    closeModal();
  };

  // ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: C.bg }}>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full text-sm font-bold shadow-2xl transition-all"
          style={{ backgroundColor: C.card, color: C.text, border: `1px solid ${C.border}` }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md px-5 py-4 flex justify-between items-center"
        style={{ backgroundColor: `${C.bg}E0`, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full" style={{ backgroundColor: C.card }}>
            <ChevronLeft className="w-5 h-5" style={{ color: C.accent }} />
          </Link>
          <div>
            <h1 className="text-xl font-bold italic" style={{ color: C.primary, fontFamily: "'Cormorant Garamond', serif" }}>Admin Panel</h1>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: C.muted }}>
              {items.length} item terdaftar
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black text-white"
          style={{ backgroundColor: C.primary, boxShadow: `0 6px 20px ${C.primary}40` }}
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </header>

      {/* Category Sections */}
      {CATEGORIES.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        return (
          <div key={cat} className="px-5 pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
              {cat} ({catItems.length})
            </p>
            <div className="flex flex-col gap-3">
              {catItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: C.card2 }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <ImageIcon className="w-6 h-6 m-auto mt-5" style={{ color: C.accent }} />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold italic truncate" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: C.primary }}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    {!isDefault(item.id) && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{ backgroundColor: `${C.primary}20`, color: C.primary }}>
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-xl transition-all hover:brightness-125"
                      style={{ backgroundColor: C.card2 }}
                    >
                      <Pencil className="w-4 h-4" style={{ color: C.accent }} />
                    </button>
                    <button
                      onClick={() => openDelete(item)}
                      className="p-2 rounded-xl transition-all hover:brightness-125"
                      style={{ backgroundColor: `${C.red}15` }}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: C.red }} />
                    </button>
                  </div>
                </div>
              ))}
              {catItems.length === 0 && (
                <p className="text-sm py-4 text-center" style={{ color: `${C.muted}80` }}>
                  Belum ada menu kategori {cat}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* ── MODAL ADD / EDIT ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={closeModal}>
          <div
            className="w-full max-w-lg rounded-t-[32px] p-6 pb-10"
            style={{ backgroundColor: C.card }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold italic" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>
                {modal === 'add' ? '+ Tambah Menu' : '✏ Edit Menu'}
              </h2>
              <button onClick={closeModal}><X className="w-5 h-5" style={{ color: C.muted }} /></button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Nama */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-1 block" style={{ color: C.muted }}>
                  Nama Menu
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="contoh: Mie Pedas Level 10"
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                  style={{ backgroundColor: C.bg, color: C.text, border: `1px solid ${C.border}` }}
                />
              </div>

              {/* Harga */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-1 block" style={{ color: C.muted }}>
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="contoh: 15000"
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                  style={{ backgroundColor: C.bg, color: C.text, border: `1px solid ${C.border}` }}
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-1 block" style={{ color: C.muted }}>
                  Kategori
                </label>
                <div className="flex gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                      style={
                        form.category === cat
                          ? { backgroundColor: C.primary, color: '#fff' }
                          : { backgroundColor: C.bg, color: C.accent, border: `1px solid ${C.border}` }
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Gambar */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-1 block" style={{ color: C.muted }}>
                  URL Gambar
                </label>
                <input
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                  style={{ backgroundColor: C.bg, color: C.text, border: `1px solid ${C.border}` }}
                />
                {form.image && (
                  <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-xl mt-2"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!form.name || !form.price || !form.image}
              className="mt-6 w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ backgroundColor: C.primary }}
            >
              <Check className="w-5 h-5" />
              {modal === 'add' ? 'Tambahkan Menu' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DELETE ── */}
      {modal === 'delete' && target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={closeModal}>
          <div
            className="w-full max-w-sm rounded-[32px] p-8 text-center"
            style={{ backgroundColor: C.card }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${C.red}15` }}>
              <Trash2 className="w-8 h-8" style={{ color: C.red }} />
            </div>
            <h2 className="text-xl font-bold italic mb-2" style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>Hapus Menu?</h2>
            <p className="text-sm mb-6" style={{ color: C.muted }}>
              <span style={{ color: C.text, fontWeight: 700 }}>{target.name}</span> akan dihapus dari daftar menu.
            </p>
            <div className="flex gap-3">
              <button onClick={closeModal}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ backgroundColor: C.bg, color: C.accent }}>
                Batal
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
                style={{ backgroundColor: C.red }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
