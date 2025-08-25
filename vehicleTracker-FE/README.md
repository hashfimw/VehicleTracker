# Frontend Pelacak Kendaraan

Frontend modern berbasis React untuk sistem Pelacak Kendaraan, dibangun dengan TypeScript, Vite, TailwindCSS, dan ShadCN UI.

## Fitur

- Autentikasi JWT dengan penyegaran token
- Rute yang dilindungi dan akses berbasis peran
- Dashboard pelacakan kendaraan real-time
- Pemantauan status kendaraan berdasarkan tanggal
- Pembuatan dan unduhan laporan Excel
- Desain responsif dengan komponen UI modern
- Manajemen state dengan Zustand + React Query
- Validasi form dengan React Hook Form + Zod
- Integrasi API yang type-safe

## Stack Teknologi

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + ShadCN UI
- **Manajemen State**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + validasi Zod
- **HTTP Client**: Axios dengan interceptors
- **Icons**: Lucide React

## Memulai dengan Cepat

1. **Clone dan install dependencies**:

   ```bash
   npm install
   ```

2. **Atur variabel environment**:

   ```bash
   cp .env.example .env
   # Edit .env dengan URL backend Anda
   ```

3. **Jalankan development server**:

   ```bash
   npm run dev
   ```

4. **Build untuk production**:
   ```bash
   npm run build
   ```

## Variabel Environment

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Pelacak Kendaraan
```

## Kredensial Demo

- **Admin**: admin@vehicletracker.com / password123
- **User**: user@vehicletracker.com / password123

## Deployment

### Docker

```bash
# Build image
docker build -t vehicle-tracker-frontend .

# Jalankan container
docker run -p 80:80 vehicle-tracker-frontend
```

### Docker Compose

```bash
docker-compose up --build
```

## Struktur Proyek

```
src/
├── components/          # Komponen UI yang dapat digunakan ulang
│   ├── ui/             # Komponen ShadCN UI
│   ├── layout/         # Komponen layout
│   └── common/         # Komponen umum
├── pages/              # Komponen halaman
├── hooks/              # Custom hooks
├── lib/                # Utilitas & konfigurasi
├── store/              # Zustand stores
├── types/              # Tipe TypeScript
├── services/           # Layanan API
└── App.tsx
```

## Implementasi Fitur Utama

### Alur Autentikasi

- Token JWT disimpan dalam store Zustand
- Penyegaran token otomatis pada panggilan API
- Rute yang dilindungi dengan akses berbasis peran

### Manajemen Kendaraan

- Pelacakan status kendaraan real-time
- Fungsi paginasi dan pencarian
- Riwayat status kendaraan detail berdasarkan tanggal

### Sistem Laporan

- Filter laporan interaktif
- Pembuatan laporan Excel
- Preview laporan real-time

### Desain Responsif

- Pendekatan mobile-first dengan TailwindCSS
- Komponen UI modern dari ShadCN
- Sistem desain yang konsisten

## Integrasi dengan Backend

Frontend ini dirancang untuk bekerja dengan mulus bersama API backend Pelacak Kendaraan. Ini menangani:

- Autentikasi melalui endpoint `/auth`
- Data kendaraan melalui endpoint `/vehicles`
- Manajemen pengguna melalui endpoint `/users` (khusus admin)
- Pembuatan laporan melalui endpoint `/reports`
