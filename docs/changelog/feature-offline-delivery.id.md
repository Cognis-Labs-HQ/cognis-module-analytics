# Antrean dan Persetujuan

**Cabang Fitur:** feature-offline-delivery

## Antrean dan Persetujuan

Analytics mencatat aktivitas terautentikasi melalui `POST /api/v1/modules/analytics/activity` dan alur browser `analytics:recordActivity`. Kunci idempotensi per akun mencegah duplikasi dan mempertahankan waktu asli. Navigasi serta tindakan Study hanya menyertakan metadata skalar aman (`component`, `action`, `result`, `count`, `durationMs`); data lain ditolak sebelum disimpan. Laporan memakai hash akun. Penonaktifan penyedia melepas pengirim dan listener.

Host menyediakan `offline:outbox`, `offline:state`, dan `offline:accessPolicy` melalui ctx. Komponen mendaftarkan pengirim selama masa hidup penyedia dan ID operasi stabil melalui `offline:enqueue`; `offline:flush` mengotorisasi dan mengirim. Antrean permanen per akun dibatasi 1.000 catatan dan 1 MB selama tujuh hari, tanpa token. ID serta waktu asli dipertahankan; kegagalan sementara dicoba ulang, catatan yang dikonfirmasi atau ditolak permanen dihapus. Penolakan menampilkan peringatan terlokalisasi. Keluar menghapus antrean akun; pergantian akun tidak mengirim data akun lain. Menonaktifkan Mode Offline menghentikan catatan baru. Antrean lama tetap dapat dikirim saat online.

## Commit

- [16f40d7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/16f40d7bbb2a045da8b745f656150bcdc31c3489)
