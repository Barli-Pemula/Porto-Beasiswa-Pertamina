# 🌱 EcoTrace - Platform Digital Pelacak Jejak Karbon Kampus

**EcoTrace** adalah aplikasi web progresif (Progressive Web App / PWA) yang memfasilitasi pelacakan, visualisasi, dan pengurangan jejak karbon personal bagi komunitas mahasiswa kampus (khususnya **IPB University**). Platform ini mengintegrasikan *eco-feedback* real-time, *social norms*, dan gamifikasi untuk mendorong perubahan perilaku terukur menuju gaya hidup rendah karbon.

---

## 🚀 Fitur Utama (Core Features)

### 1. 🚗 Carbon Logger (Pencatatan Emisi Harian)
- **4 Kategori Aktivitas**: Transportasi (Bus, Motor, Mobil, KRL, Sepeda/Jalan Kaki), Energi (AC, LED, Kipas, Laptop), Makanan (Daging Sapi, Ayam, Vegetaris, Dairy), dan Sampah (Plastik, Organik, Daur Ulang).
- **Mesin Perhitungan EPA & IPCC**: Konversi instan faktor emisi baku ke nilai kg CO₂e.
- **Form Slider & Presets**: Slider interaktif dan tombol *Quick Log 1-Klik* untuk input cepat kurang dari 30 detik.
- **Selebrasi Umpan Balik**: Tampilan konfirmasi interaktif *"Anda berhasil mencatat X kg CO₂e! 🎉"*.

### 2. 📊 Personal Dashboard
- **Mode Tampilan Ganda**:
  - **Mode Sederhana (Pemula & Ramah Keluarga)**: Kartu rangkuman ringkas yang mudah dipahami tanpa grafik rumit.
  - **Mode Detail (Grafik Lanjutan)**: Menampilkan grafik tren Recharts 30 hari dan diagram donut distribusi kategori.
- **4 Kartu Metrik Utama**: Emisi *Hari Ini*, *Minggu Ini*, *Bulan Ini*, dan *Tahun Ini* beserta persentase perbandingan tren (↑/↓ %).
- **Analogi Dampak Nyata**: Konversi otomatis ke angka nyata seperti *Pohon Terselamatkan 🌳* dan *Jam Penerangan LED Dihemat 💡*.
- **Riwayat Aktivitas Terakhir**: Tabel interaktif dengan opsi hapus/edit untuk catatan di bawah 24 jam.

### 3. 🏆 Community Dashboard (Dashboard Komunitas)
- **Papan Peringkat (3-Tab Leaderboard)**:
  - 🥇 *Emisi Terendah Mingguan*
  - 📈 *Paling Meningkat (Persentase Pengurangan)*
  - 🔥 *Teraktif (Jumlah Catatan Aktivitas)*
- **Kontrol Privasi & Anonimitas**: Opsi sakelar Mode Anonim (`Mahasiswa #1`) vs Mode Publik (Nama Asli).
- **Statistik Kolektif Kampus**: Menampilkan Total Mahasiswa (42), Rata-rata Emisi (18.4 kg), Total CO₂ Berhasil Ditekan (125.4 Ton).
- **Diagram Perbandingan Kategori**: Grafik perbandingan rata-rata emisi komunitas vs emisi pribadi.

### 4. 🎯 Eco-Challenge Hub (Sistem Tantangan)
- **Kategori Tantangan**: *Pengurangan Emisi*, *Adopsi Perilaku*, dan *Tantangan Kolektif Kampus (Campus Carbon Cup)*.
- **Detail Modal & Progres**: Menampilkan aturan tantangan, hadiah poin (Pts), tingkat kesulitan, dan indikator progres.
- **Manajemen Tantangan Saya**: Tab Tantangan Aktif dan Tantangan Selesai.

### 5. ⚙️ Halaman Pendukung & Asisten Hijau
- **👤 Profil Pengguna**: Informasi mahasiswa (Nama, Email, Angkatan 2021-2026, Departemen) dan 6 Lencana Prestasi Hijau (*Badges*).
- **⚙️ Pengaturan**: Preferensi notifikasi, pilihan unit satuan (km/mi, kg/lb), dan **Ekspor Data ke JSON**.
- **📋 Riwayat Aktivitas**: Tabel pencarian lengkap dengan filter kategori/waktu dan **Ekspor Data ke CSV**.
- **🌿 Asisten Interaktif ("Si Eco") & Guided Tour**: Asisten terapung dan panduan cara pakai 3 langkah mudah.

---

## 🔧 Teknologi & Stack (Tech Stack)

### Frontend
- **Framework**: Next.js 15 (App Router & React Server/Client Components)
- **Bahasa**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Custom Design Tokens (Primary Green `#22c55e`, Secondary Blue `#3b82f6`, Accent Orange `#f97316`)
- **Data Visualization**: Recharts (Line Chart & Donut Pie Chart)
- **Animasi & Transisi**: Framer Motion & Tailwind Animations
- **Form & Validasi**: React Hook Form + Zod Schema Validation
- **State Management**: TanStack Query (`@tanstack/react-query`) + React Context API (`AuthContext`)
- **Ikonografi**: Lucide React

### Data & Perhitungan Backend
- **Data Persistence**: Synchronized Client Storage (`localStorage`) dengan penggabungan data *mock* yang deterministik.
- **Faktor Emisi**: Database konversi faktor emisi EPA (US Environmental Protection Agency) & IPCC AR6.

---

## 📁 Struktur Direktori Project

```text
ecotrace/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx         # Halaman Masuk
│   │   └── signup/page.tsx        # Halaman Pendaftaran Akun
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx     # Dashboard Personal (Simple & Detail Mode)
│   │   ├── logger/page.tsx        # Form Catat Emisi Harian
│   │   ├── community/page.tsx     # Papan Skor & Statistik Komunitas
│   │   ├── challenges/page.tsx    # Pusat Tantangan Eco-Challenge
│   │   ├── profile/page.tsx       # Profil & Lencana Prestasi
│   │   ├── settings/page.tsx      # Pengaturan & Ekspor JSON
│   │   └── activities/page.tsx    # Tabel Riwayat & Ekspor CSV
│   ├── globals.css                # Style Global & Tailwind v4 Config
│   ├── layout.tsx                 # Root Layout & Providers
│   └── page.tsx                   # Redirect ke Dashboard
├── components/
│   ├── navbar.tsx                 # Navigasi Utama Top Bar
│   ├── bottom-nav.tsx             # Navigasi Mobile & Tablet Bottom Tab Bar
│   ├── providers.tsx              # Wrapper React Query & Auth
│   ├── eco-guide.tsx              # Asisten Terapung Si Eco
│   ├── quick-logger-bar.tsx       # Widget Catat Cepat 1-Klik
│   └── onboarding-tour.tsx        # Modal Panduan 3 Langkah
├── hooks/
│   └── useAuth.tsx                # Context Provider & Hook Autentikasi
├── lib/
│   ├── emission-factors.ts        # Kalkulator & Database Faktor Emisi
│   ├── mock-data.ts               # Data Mock Deterministik (280+ Aktivitas, 16 Users, 8 Challenges)
│   └── storage.ts                 # Manager Penyimpanan & Agregasi Data
├── public/
│   └── manifest.json              # Web App Manifest PWA
├── package.json                   # Dependencies & Scripts
├── tsconfig.json                  # Konfigurasi TypeScript
├── next.config.ts                 # Konfigurasi Next.js
└── README.md                      # Dokumentasi Proyek
```

---

## ⚡ Panduan Menjalankan Proyek (Getting Started)

### 1. Prasyarat
- Node.js `v18.0.0` atau yang lebih baru
- NPM `v9.0.0` atau yang lebih baru

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembang (Development)
```bash
npm run dev
```
Buka browser Anda dan akses `http://localhost:3000`.

### 4. Melakukan Build Produksi (Production Build)
```bash
npm run build
```

---

## 👥 Pengguna Demo (Quick Demo Login)

Untuk keperluan pengujian, Anda dapat langsung masuk menggunakan akun demo pada halaman Login:

- **Barlian Athallah Dyu** (`barlian@apps.ipb.ac.id`) — *ILKOM 2026*
- **Sarah Dewi** (`sarah.dewi@apps.ipb.ac.id`) — *AGH 2025*

---

## 📄 Lisensi & Penulis

- **Penulis**: Barlian Athallah Dyu
- **Institusi**: IPB University — Pertamina Future Leaders Scholarship
- **Status Proyek**: Production Ready / Ready for Deployment
