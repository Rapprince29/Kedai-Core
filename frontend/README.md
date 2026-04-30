# Kedai-Code v2.0 - Artisan Digital Menu System

Sistem manajemen menu digital premium dengan arsitektur **Deep Sea Minimalist**, mengintegrasikan sistem pembayaran QR real-time dan manajemen peran multi-level.

## 🛡️ System Workflow & Role Logic

### 1. CUSTOMER / GUEST (Pelanggan)
*   **Menu Exploration**: Menjelajahi menu dengan filter kategori dinamis (Coffee, Non-Coffee, Pastry) dan filter rasa (Manis, Pahit, Segar, Gurih).
*   **Artisan Cart**: Menambahkan menu ke keranjang dengan visualisasi premium.
*   **Multi-Modal Checkout**:
    *   **CASH**: User memilih bayar di kasir, mendapatkan QR Code unik (ID Pesanan).
    *   **CARDLESS**: User membayar via digital, mendapatkan QR Code untuk verifikasi kasir.
*   **Real-time Resonance**: Mendapatkan notifikasi suara dan perubahan status otomatis setiap 5 detik tanpa perlu refresh halaman.

### 2. KASIR / ARCHITECT (Kasir)
*   **Architect Desk Dashboard**: Akses khusus di `/cashier` untuk mengelola antrean pesanan.
*   **Order Synchronization**: Menscan QR Code user (atau input ID) untuk memunculkan detail pesanan secara instan.
*   **Payment Validation**:
    *   Menekan tombol **"PAYMENT KASIR (VALIDATE)"** setelah menerima uang tunai atau memverifikasi bukti digital.
    *   Mengubah status transaksi dari `PENDING` menjadi `PAID`.
*   **Crafting Flow**:
    *   **Begin Crafting**: Mengubah status menjadi `PROCESSING`. Memicu notifikasi "Pesanan sedang dibuat" di HP user.
    *   **Order Completed**: Mengubah status menjadi `DONE`. Menyelesaikan siklus pesanan.

### 3. ADMIN / COMMAND CENTER (Pemilik)
*   **Command Center Dashboard**: Visualisasi pendapatan real-time (Hari ini vs Kemarin) dan tren penjualan.
*   **Citizen Index (User Management)**:
    *   Mengelola identitas semua user yang terdaftar.
    *   **Role Promotion**: Mengubah role user secara instan antara `CUSTOMER`, `KASIR`, atau `ADMIN`.
*   **Menu Management**: Mengelola best seller, kategori, dan ketersediaan stok menu.

---

## 🛠️ Tech Stack
*   **Frontend**: Next.js 16 (App Router) + TailwindCSS + GSAP Animations
*   **Backend**: Next.js API Routes + JWT Authentication
*   **Database**: Supabase (PostgreSQL) + Prisma ORM
*   **Real-time**: Custom Polling Logic (5s Interval) + Audio Notifications

## 🚀 Deployment Notes
*   **Database Sync**: Selalu jalankan `npx prisma db push` jika melakukan perubahan skema.
*   **Middleware**: Rute `/admin` dan `/cashier` dilindungi secara ketat; hanya user terautentikasi dengan role yang sesuai yang dapat mengakses.
*   **Security**: Rahasia JWT disimpan di environment variable `JWT_SECRET`.

---
*Created with Precision by Antigravity AI for Kedai-Code v2.0*
