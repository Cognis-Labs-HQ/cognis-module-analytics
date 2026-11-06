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

## Tentukan isyarat Berikutnya per langkah

Setiap langkah tutorial kini menetapkan `highlightNext` secara eksplisit: penjelasan yang memerlukan Berikutnya atau Selesai mengaktifkannya, sedangkan latihan berbasis interaksi atau penantian menonaktifkannya. Pengurangan gerakan mempertahankan garis tepi statis.

Setiap komponen antarmuka wajib dicakup tutorial. Panduan kontribusi mengharuskan alur tugas yang berfokus pada pengguna dan peninjauan tutorial setiap kali fitur atau perilaku antarmuka berubah.

## Wilayah tutorial yang terlihat

Wilayah tutorial dan isyarat Berikutnya ditetapkan secara eksplisit.

## Antrean menu mengambang bersama

Menu mengikuti antrean host bersama dan masa hidup komponen.

## Kontrol pemulihan yang didokumentasikan

Tampilan target hilang menyediakan Berikutnya dan Mulai Ulang Tutorial; pemutaran ulang juga menyediakan Batal.

## Commit

- [c94a229](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c94a229fbd1e0f68a8bee382180dd7734aa8e6a2)
- [2f45c6b](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/2f45c6b185472dae1846ee7c66cf2ec832c17028)
- [1d84d69](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/1d84d69054daa49d6f6bf9c95d02f0005654b412)
- [5fff2b0](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/5fff2b07337f60998f18f2cd8629e943271db7fd)
- [c4d5e25](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c4d5e251629e45a50090f40e3d003243cd744449)
- [ed63571](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/ed6357135a3def805ecd524df994a8897de4e27a)
