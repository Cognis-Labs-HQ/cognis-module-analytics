# Analytics Content

Konten milik modul berada di bawah path modul dan hanya dimuat saat modul diaktifkan.

## Antarmuka pelaporan

Tampilan admin menggabungkan kesehatan akun, tren pendaftaran, distribusi peran,
komposisi peristiwa, dan tampilan audit peristiwa terbaru. Semua rute API
memerlukan peran administrator. Metadata peristiwa tetap dimiliki modul, isi
permintaan peristiwa dibatasi hingga 16 KiB, dan modul tidak mengirim telemetri
ke layanan eksternal.

Operator dapat menggunakan `analytics:metrics`, `analytics:series [days]`,
`analytics:event-summary [days]`, dan `analytics:activity-log [limit]` melalui
CLI. Produsen dapat mencatat peristiwa organisasi yang tercantum dalam daftar
izin melalui `analytics:activity-log:record <event-type> [meta-json]`; jangan
masukkan rahasia atau informasi pribadi sensitif ke dalam metadata.

## Distribusi eksternal

Analytics bersifat mandiri untuk dipisahkan ke `Cognis-Labs-HQ/cognis-module-analytics`. Manifesnya menyatakan `db:executor` dalam `requiresCapabilities`; modul tidak boleh dimulai sebelum Cognis menyediakan kapabilitas tersebut. Manifes root, paket, rute, lisensi, aset, CLI, API, UI, migrasi, dokumentasi terjemahan, dan hash integritas didistribusikan bersama.
