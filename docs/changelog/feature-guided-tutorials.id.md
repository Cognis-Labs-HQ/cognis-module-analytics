# Tutorial terpandu

**Cabang Fitur:** feature-guided-tutorials

## Spesifikasi Teknis

Alur memperkenalkan filter analitik dan grafik administrasi. Sesi administrator dan koneksi server diperlukan.

Modul mendaftarkan alur dan teks terjemahannya melalui ctx. Host mengelola katalog, petunjuk, panah, sorotan, kendali papan ketik dan penunjuk, navigasi SPA dengan pemeriksaan akses, serta aksesibilitas. Menutup tutorial, berpindah halaman di luar alur, kehilangan akses atau menonaktifkan modul mengakhiri sesi. Kegagalan pemasangan penyedia membatalkan pendaftarannya.

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

## Kunjungan Awal Terikat Halaman

Host mengelola petunjuk, panah, sorotan, aksesibilitas, dan menu aksi mengambang bersama. Sesi pertama selalu menyediakan Berikutnya, tanpa Batal atau Lewati. Pemutaran ulang menyediakan Batal dengan `btn-cancel`. Penyelesaian disimpan di browser per akun. Navigasi, hilangnya akses, atau pelepasan penyedia mengakhiri sesi; pemasangan gagal membatalkan registrasi.

## Petunjuk Yang Berguna

Langkah tutorial berfokus pada kontrol dan tugas yang tersedia, tanpa pernyataan yang tidak relevan tentang izin atau tindakan yang tidak dilakukan panduan.

## Commit

- [c94a229](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c94a229fbd1e0f68a8bee382180dd7734aa8e6a2)
- [2f45c6b](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/2f45c6b185472dae1846ee7c66cf2ec832c17028)
