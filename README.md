# Finance Tracker App

Aplikasi untuk melacak pemasukan dan pengeluaran keuangan pribadi.

## Fitur

- Mencatat pemasukan dan pengeluaran
- Kategorisasi transaksi
- Tampilan grafik dan ringkasan
- Format mata uang Rupiah

## Cara Menjalankan Aplikasi

### Prasyarat

- Node.js (versi 14 atau lebih baru)
- npm atau yarn
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL

### Langkah-langkah

1. **Clone repositori**

```bash
git clone https://github.com/yourusername/FinanceTrackerApp.git
cd FinanceTrackerApp
```

2. **Instal dependensi**

```bash
npm install
```

3. **Siapkan database**

- Buat database PostgreSQL baru
- Sesuaikan konfigurasi database di `.env`

4. **Jalankan server backend**

```bash
npm run server:dev
```

5. **Jalankan aplikasi mobile**

```bash
npm start
```

## Deployment

### Deploy Backend ke Render

1. **Persiapan**

- Pastikan semua perubahan sudah di-commit ke Git
- Pastikan file `render.yaml` sudah ada di root proyek
- Pastikan file `server/package.json` sudah berisi script yang diperlukan

2. **Langkah-langkah Deployment**

- Buat akun di [Render](https://render.com/)
- Hubungkan repositori GitHub Anda
- Pilih "Blueprint" dan pilih repositori Anda
- Render akan otomatis membaca file `render.yaml` dan men-deploy aplikasi dan database

3. **Setelah Deployment**

- Perbarui URL di `src/config/api.ts` dengan URL server yang baru
- Build ulang aplikasi mobile dengan profil standalone

### Build Aplikasi Mobile

```bash
# Untuk development
eas build -p android --profile development

# Untuk standalone (produksi)
eas build -p android --profile standalone
```

## Mengatasi Masalah Koneksi

Jika Anda mengalami masalah "Network request failed" saat menjalankan aplikasi, coba langkah-langkah berikut:

### 1. Periksa Alamat IP

Pastikan alamat IP di `src/config/api.ts` sesuai dengan alamat IP komputer Anda:

```typescript
// Untuk pengembangan lokal
const LOCAL_IP = '192.168.100.13';
const LOCAL_URL = `http://${LOCAL_IP}:3000/api`;
```

Untuk menemukan alamat IP Anda:

- Windows: Jalankan `ipconfig` di Command Prompt
- Mac/Linux: Jalankan `ifconfig` di Terminal

### 2. Pastikan Server Backend Berjalan

Pastikan server backend berjalan dengan perintah:

```bash
npm run server:dev
```

### 3. Periksa Firewall

Pastikan firewall tidak memblokir koneksi ke port 3000.

### 4. Periksa Konfigurasi Server

Pastikan server mendengarkan pada semua antarmuka jaringan, bukan hanya localhost.

### 5. Perangkat dan Komputer di Jaringan yang Sama

Pastikan perangkat/emulator dan komputer berada di jaringan yang sama.

## Struktur Proyek

```
FinanceTrackerApp/
├── assets/                # Gambar, font, dan aset lainnya
├── src/                   # Kode sumber aplikasi mobile
│   ├── components/        # Komponen React Native
│   │   ├── screens/       # Layar aplikasi
│   │   └── utils/         # Fungsi utilitas
│   ├── config/            # Konfigurasi aplikasi
│   └── screens/           # Layar aplikasi
├── server/                # Kode sumber backend
│   ├── src/               # Kode sumber server
│   │   ├── controllers/   # Controller API
│   │   ├── routes/        # Rute API
│   │   └── db/            # Konfigurasi database
│   └── prisma/            # Schema Prisma
├── .env.example           # Template variabel lingkungan
├── render.yaml            # Konfigurasi deployment Render
└── README.md              # Dokumentasi proyek
```

## Troubleshooting

### Emulator Android

Jika menggunakan emulator Android, gunakan alamat IP `10.0.2.2` untuk localhost:

```typescript
const LOCAL_URL = `http://10.0.2.2:3000/api`;
```

### Perangkat Fisik

Jika menggunakan perangkat fisik, gunakan alamat IP komputer Anda:

```typescript
const LOCAL_URL = `http://192.168.100.13:3000/api`;
```

### Expo Go

Jika menggunakan Expo Go, pastikan perangkat dan komputer berada di jaringan yang sama.
