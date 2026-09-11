# Memulihkan Pengaktifan Modul Analytics

**Cabang Fitur:** work

## Kepatuhan batas siklus hidup

Fixture rute tidak valid yang dikemas telah dihapus karena mengarah ke ruang nama modul lain dan menyebabkan validasi batas sumber runtime Cognis menolak Analytics saat pengaktifan. Sumber runtime Analytics kini tetap berada dalam ruang nama API milik modul.

## Cakupan regresi dan metadata rilis

Pengujian regresi batas untuk URL API runtime telah ditambahkan, kontrak siklus hidup tervalidasi didokumentasikan dalam semua bahasa yang didukung, dan versi rilis diselaraskan ke 2.1.3.

## Siklus hidup nonaktif yang terisolasi

Analytics kini mendeklarasikan titik masuk API khusus untuk keadaan nonaktif, selaras dengan struktur siklus hidup modul eksternal lainnya. Karena Analytics tidak memiliki konfigurasi pra-pengaktifan, titik masuk ini sengaja tidak mendaftarkan rute atau kapabilitas dan tidak menjalankan pekerjaan runtime. Cakupan otomatis memverifikasi kontrak pasif ini.

## Commit

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)

- [8da06b8](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/8da06b87b83b2335c17cdcd5c351f95d564dd6e0)
