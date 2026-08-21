# Cognis Analytics

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Wawasan penggunaan dan pelaporan administratif yang menjaga privasi untuk Cognis. Pantau tren pendaftaran, aktivasi, kesehatan akun, distribusi peran, dan peristiwa milik modul tanpa menambahkan layanan analitik pihak ketiga.

Repositori ini merupakan modul ekstensi Cognis yang mandiri. Pasang melalui Marketplace Modul atau tempatkan di direktori modul eksternal yang telah dikonfigurasi. Lihat [`docs/standard.id.md`](docs/standard.id.md) untuk konfigurasi, kapabilitas, rute, dan panduan operasional; referensi setara dalam bahasa Jerman, Inggris, dan Jepang tersedia di sebelahnya.

## Cakupan analitik

- Jumlah akun, status aktif dan nonaktif, aktivitas tujuh hari, serta dormansi 30 hari
- Deret waktu pendaftaran dalam rentang 7, 30, atau 90 hari yang dapat dikonfigurasi
- Perekaman peristiwa khusus yang menjaga privasi dengan batas permintaan 16 KiB
- Ringkasan volume peristiwa, aktor unik, dan jenis peristiwa
- Dasbor admin dan akses CLI yang dilindungi oleh otorisasi host

## Mulai di sini

```sh
npm install
npm test
npm run check:manifest
```

Manifest memublikasikan bundel bahasa milik modul melalui `ui.stringsBaseUrl`, sehingga Cognis dapat melokalkan metadata marketplace sebelum antarmuka analitik dimuat.
