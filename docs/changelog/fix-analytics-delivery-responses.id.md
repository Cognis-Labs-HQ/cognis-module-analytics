# Validasi Respons Pengiriman

**Cabang Fitur:** fix-analytics-delivery-responses

## Validasi Respons Pengiriman

Analytics hanya mengakui aktivitas antrean setelah menerima respons JSON berhasil tanpa pengalihan yang memuat ID peristiwa tersimpan. HTML, isi kosong atau tidak valid, serta ID yang hilang menghasilkan kesalahan pengiriman kelas 502 yang dapat dicoba ulang, mempertahankan identitas peristiwa asli untuk upaya berikutnya. JSON tidak valid dicatat dengan metadata status yang aman; isi respons tidak pernah dicatat.

## Commit

- [221efac](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/221efac097286f2fe90809303620d35bfa873fef)
