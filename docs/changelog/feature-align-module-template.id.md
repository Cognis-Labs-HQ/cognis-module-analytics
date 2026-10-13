# Selaraskan modul dengan templat kontributor

**Cabang Fitur:** feature-align-module-template

## Struktur standar dan integrasi milik modul

Sinkronkan panduan templat, jalur rute domain, dokumentasi integrasi terjemahan, pemeriksaan struktur, dan hash paket akhir. Pertahankan URL publik dan identitas modul. Kontribusi browser mengikuti kontrak siklus hidup host masing-masing.

## Pelaporan akun publik dan rentang tervalidasi

Laporan memakai kapabilitas akun publik Auth, bukan tabel komponen lain, dan menjalankan alur ctx milik modul. Pembacaan mempertahankan limit eksplisit, mengembalikan semua peristiwa tanpa limit, dan menolak rentang tidak valid. Perintah terpasang menggunakan `modules:analytics:*`. Gaya dan umpan balik kesalahan memakai kontrak host; kerangka dasbor yang tidak terdaftar dan titik masuk nonaktif yang kosong dihapus.

## Sesuaikan banner Marketplace

Sesuaikan ilustrasi Analytics ke tata letak hero lebar dengan margin aman untuk logo, judul dan grafik agar tidak terpotong secara vertikal pada detail modul Cognis.

## Commit

- [b98c771](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/b98c7711c22d4b2e2488ef00653b78a64d22d9ad)
