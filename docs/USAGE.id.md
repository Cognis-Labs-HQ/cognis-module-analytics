# Penggunaan

Tinjau aktivitas akun dan laporan peristiwa milik modul tanpa layanan analitik pihak ketiga.

## Prasyarat

Masuk sebagai administrator setelah modul diaktifkan. Layanan basis data dan akun diperlukan agar laporan lengkap.

## Contoh

Buka Analytics di Administration, pilih rentang laporan, lalu segarkan sebelum membaca grafik berdasarkan waktu.

Buka bagian **Analytics** di Administrasi Cognis untuk melihat jumlah akun, akun aktif, aktivitas tujuh hari, dormansi 30 hari, distribusi peran, tren pendaftaran, total peristiwa, dan peristiwa terbaru. Pilih rentang 7, 30, atau 90 hari lalu segarkan tampilan untuk memperbarui laporan berbasis waktu.

Gunakan kontrak yang sama melalui CLI:

```sh
cognisctl modules:analytics:metrics
cognisctl modules:analytics:series 30
cognisctl modules:analytics:eventSummary 30
cognisctl modules:analytics:activityLog 20
```

Catat peristiwa milik modul dengan metadata JSON opsional:

```sh
cognisctl modules:analytics:activityLog:record report_exported '{"format":"csv"}'
```

Klien yang berwenang dapat memakai API HTTP secara langsung:

```http
GET /api/v1/modules/analytics/metrics?days=30
GET /api/v1/modules/analytics/series?days=30
GET /api/v1/modules/analytics/type-summary?days=30
GET /api/v1/modules/analytics/activity-log?limit=20
POST /api/v1/modules/analytics/activity-log
Content-Type: application/json

{"eventType":"report_exported","meta":{"format":"csv"}}
```

Penulisan yang berhasil mengembalikan HTTP `201` beserta ID peristiwa yang dibuat. Jangan masukkan rahasia, kredensial, isi pesan, atau data pribadi sensitif ke metadata peristiwa.

Alur memperkenalkan filter analitik dan grafik administrasi. Sesi administrator dan koneksi server diperlukan.

## Hasil yang Diharapkan

Laporan menampilkan informasi akun yang diizinkan dan peristiwa milik modul dalam rentang pilihan. Pengiriman peristiwa tidak mengirim telemetri ke penyedia analitik eksternal.

## Pemecahan Masalah

Segarkan grafik lama, pastikan akses administrator, dan periksa ketersediaan layanan jika laporan gagal. Jangan memasukkan rahasia atau pesan pribadi ke metadata peristiwa.
