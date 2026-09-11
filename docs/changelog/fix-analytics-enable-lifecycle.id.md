# Memulihkan Pengaktifan Modul Analytics

**Cabang Fitur:** work

## Kepatuhan batas siklus hidup

Fixture rute tidak valid yang dikemas telah dihapus karena mengarah ke ruang nama modul lain dan menyebabkan validasi batas sumber runtime Cognis menolak Analytics saat pengaktifan. Sumber runtime Analytics kini tetap berada dalam ruang nama API milik modul.

## Cakupan regresi dan metadata rilis

Pengujian regresi batas untuk URL API runtime telah ditambahkan, kontrak siklus hidup tervalidasi didokumentasikan dalam semua bahasa yang didukung, dan versi rilis diselaraskan ke 2.1.2.

## Commit

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)
