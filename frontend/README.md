# Kedai-Code v2.0 - Artisan Digital Menu System

Sistem manajemen menu digital premium dengan arsitektur **Deep Sea Minimalist**, mengintegrasikan sistem pembayaran QR real-time dan manajemen peran multi-level yang cerdas.

---

## 🛡️ Role-Based Features & System Workflow

### 1. CUSTOMER / GUEST (Premium Experience)
*   **Artisan Menu Interface**: Eksplorasi menu dengan animasi **GSAP Stagger Entrance** (item menu muncul satu per satu dengan efek cinematic).
*   **Smart Selection**: Filter kategori dinamis (Coffee, Non-Coffee, Pastry) dan filter rasa untuk pengambilan keputusan cepat.
*   **Multi-Modal Checkout**: Dukungan metode pembayaran **CASH** dan **CARDLESS**.
*   **Digital Receipt (Struk Digital)**: Rincian transaksi transparan termasuk ID unik, daftar item, dan total harga.
*   **Real-time Resonance**: Sistem polling 5 detik yang mendeteksi validasi kasir secara instan, lengkap dengan notifikasi suara dan visual alert.

### 2. KASIR / ARCHITECT (Architect Desk)
*   **Real Camera Scanner**: Integrasi library `html5-qrcode` untuk memindai QR Code user secara langsung via kamera perangkat.
*   **Order Synchronization**: Penarikan detail transaksi instan berdasarkan ID hasil scan atau pilihan dari daftar antrean.
*   **Table Management Map**: Visualisasi denah meja (T-1 s/d T-12) dengan indikator warna (Teal: Ready, Red: Active/Occupied).
*   **Internal Command Signal**: Tombol darurat **CALL ADMIN** dan **STOCK ALERT** untuk komunikasi cepat antar-role.
*   **Lifecycle Management**: Kontrol status pesanan dari `PENDING` -> `PAID` -> `PROCESSING` -> `DONE`.

### 3. ADMIN / COMMAND CENTER (Strategic Intelligence)
*   **Performance Analytics**: Dashboard analitik pendapatan real-time dengan grafik trend harian yang dianimasikan.
*   **Citizen Index**: Manajemen user terpusat untuk promosi/demosi role (Admin, Kasir, Customer) secara instan.
*   **Stock Criticality (Inventory)**: Peringatan otomatis untuk bahan baku yang mencapai ambang batas minimum (low stock alert).
*   **Staff Sync**: Monitoring staf/kasir yang sedang bertugas secara aktif di pos komando.

---

## 🛠️ Tech Stack & Infrastructure
*   **Frontend**: Next.js 16 (App Router) + TailwindCSS + GSAP Animations.
*   **Backend**: Next.js API Routes (Serverless) + JWT Authentication.
*   **Database**: Supabase Cloud (PostgreSQL) + Prisma ORM.
*   **Security**: Server-side Middleware protection & JWT-based session management.
*   **Real-time**: High-frequency Polling System (5s interval).

## 🚀 Deployment Status
*   **Production**: Hosted on Vercel.
*   **Database**: Synced with Supabase Production (ap-northeast-1).
*   **Repository**: Fully synchronized at `Rapprince29/Kedai-Core`.

---
*Created with Precision by Antigravity AI for Kedai-Code v2.0*
