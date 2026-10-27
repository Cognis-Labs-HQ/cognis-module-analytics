# Antrean dan Persetujuan

**Cabang Fitur:** feature-offline-delivery

## Pembersihan Aktivitas Akun

Hook `analytics:deleteAccountActivity` yang terikat siklus hidup memperluas `deprovision-user` pada `cleanup-dependencies`. Setelah penghapusan akun tersimpan, hook menunggu kesiapan skema dan hanya menghapus peristiwa yang ringkasan akunnya cocok dengan identitas yang dihapus, menggunakan derivasi SHA-256 yang sama dengan pencatatan terautentikasi. Akun lain dan peristiwa administrator anonim tetap utuh. Penonaktifan, pengarsipan, dan permintaan penghapusan yang ditolak mempertahankan aktivitas. Kegagalan dicatat dan diteruskan; host melepas hook saat konteks modul ditutup sebelum pengaktifan ulang.

## Antrean dan Persetujuan

Analytics mencatat aktivitas terautentikasi melalui `POST /api/v1/modules/analytics/activity` dan alur browser `analytics:recordActivity`. Kunci idempotensi per akun mencegah duplikasi dan mempertahankan waktu asli. Navigasi serta tindakan Study hanya menyertakan metadata skalar aman (`component`, `action`, `result`, `count`, `durationMs`); data lain ditolak sebelum disimpan. Laporan memakai hash akun. Penonaktifan penyedia melepas pengirim dan listener.

Host menyediakan `offline:outbox`, `offline:state`, dan `offline:accessPolicy` melalui ctx. Komponen mendaftarkan pengirim selama masa hidup penyedia dan ID operasi stabil melalui `offline:enqueue`; `offline:flush` mengotorisasi dan mengirim. Antrean permanen per akun dibatasi 1.000 catatan dan 1 MB selama tujuh hari, tanpa token. ID serta waktu asli dipertahankan; kegagalan sementara dicoba ulang, catatan yang dikonfirmasi atau ditolak permanen dihapus. Penolakan menampilkan peringatan terlokalisasi. Keluar menghapus antrean akun; pergantian akun tidak mengirim data akun lain. Menonaktifkan Mode Offline menghentikan catatan baru. Antrean lama tetap dapat dikirim saat online.

## Peringatan antrean latar

Analytics mendaftarkan pemilik pengirimannya dengan `protectOnClose: false` pada antrean host. Rekaman navigasi dan aktivitas tetap tersimpan secara persisten dan dikirim setelah pemulihan terotorisasi, termasuk pemeriksaan koneksi manual, tetapi tidak lagi memicu peringatan penutupan browser. Edit pengguna tetap memakai perlindungan bawaan host. Fitur ini memerlukan kontrak klasifikasi peringatan host yang diperbarui.

## Commit

- [16f40d7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/16f40d7bbb2a045da8b745f656150bcdc31c3489)
- [c6b5760](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6b57608b93128f46fe849c7a385805ab8ab0e55)
- [956bf8d](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/956bf8de31d3c13e885cbd6a28611ba0b78c5175)
