# Menyelaraskan Analytics dengan Struktur Modul Eksternal Terkini

**Cabang Fitur:** work

## Pemuatan hanya melalui bootstrap

Titik masuk API manifes yang usang telah dihapus agar Cognis memuat modul Analytics aktif hanya melalui `entrypoints.bootstrap` dan `bootstrapModule(ctx)`. Titik masuk khusus untuk keadaan nonaktif tetap tersedia bagi siklus hidup modul.

## Pelaporan kegagalan yang lebih aman

Analytics kini mencatat kegagalan penulisan aktivitas melalui pencatat log host dengan metadata komponen dan operasi yang aman sebelum mengembalikan galat API generik.

## Verifikasi kontrak dan dokumentasi

Pengujian kontrak struktural dan seluruh standar terlokalisasi telah diperbarui. Versi 2.1.5 juga menyertakan hash integritas paket yang dibuat ulang.

## Commit

- [f111f3c](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/f111f3c2c724f56b6bb7035bed174f9130a8b2db)
