# Kedai-Core Pro (v2.0)

Sistem manajemen operasional kafe yang telah ditingkatkan dengan fokus pada performa dan skalabilitas.

## 🚀 Perubahan Utama
- **Migrasi Database:** Beralih dari Supabase ke PostgreSQL Mandiri dengan **Prisma ORM**.
- **Dashboard Analitik:** Visualisasi data real-time menggunakan React Query & Recharts.
- **Manajemen Inventaris:** Sistem multi-gudang dan alert stok rendah.
- **Expense Tracking:** Modul pencatatan biaya operasional untuk laporan laba rugi akurat.

## 🛠️ Setup Instruksi

### 1. Database
Pastikan Anda memiliki instance PostgreSQL yang berjalan. Update `DATABASE_URL` di `backend/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push # Untuk sinkronisasi skema ke database
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Fitur Pro Tersedia
- **Dashboard:** `/admin/dashboard`
- **Analytics API:** `GET /analytics/dashboard`
- **Low Stock API:** `GET /products/low-stock?threshold=5`
- **Expenses API:** `POST /expenses`
