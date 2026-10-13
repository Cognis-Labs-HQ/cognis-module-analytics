# Selaraskan modul dengan templat kontributor

**Cabang Fitur:** feature-align-module-template

## Struktur standar dan integrasi milik modul

Sinkronkan panduan templat, jalur rute domain, dokumentasi integrasi terjemahan, pemeriksaan struktur, dan hash paket akhir. Pertahankan URL publik dan identitas modul. Kontribusi browser mengikuti kontrak siklus hidup host masing-masing.

## Pelaporan akun publik dan rentang tervalidasi

Laporan memakai kapabilitas akun publik Auth, bukan tabel komponen lain, dan menjalankan alur ctx milik modul. Pembacaan mempertahankan limit eksplisit, mengembalikan semua peristiwa tanpa limit, dan menolak rentang tidak valid. Perintah terpasang menggunakan `modules:analytics:*`. Gaya dan umpan balik kesalahan memakai kontrak host; kerangka dasbor yang tidak terdaftar dan titik masuk nonaktif yang kosong dihapus.

## Commit

- [18d275a](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/18d275abab31c87c35e0f44dcf87918ec6b40b8d)
