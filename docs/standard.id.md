# Modul Analytics

Modul Analytics memberi administrator Cognis wawasan yang sadar privasi tentang kesehatan akun, adopsi, pendaftaran, dan peristiwa milik modul tanpa mengirim telemetri ke layanan analitik pihak ketiga. Modul membaca data akun melalui kapabilitas basis data host dan hanya menyimpan peristiwa yang dikirim ke API log aktivitas miliknya sendiri.

## Contoh penggunaan

Buka bagian **Analytics** di Administrasi Cognis untuk melihat jumlah akun, akun aktif, aktivitas tujuh hari, dormansi 30 hari, distribusi peran, tren pendaftaran, total peristiwa, dan peristiwa terbaru. Pilih rentang 7, 30, atau 90 hari lalu segarkan tampilan untuk memperbarui laporan berbasis waktu.

Gunakan kontrak yang sama melalui CLI:

```sh
cognisctl analytics:metrics
cognisctl analytics:series 30
cognisctl analytics:event-summary 30
cognisctl analytics:activity-log 20
```

Catat peristiwa milik modul dengan metadata JSON opsional:

```sh
cognisctl analytics:activity-log:record report_exported '{"format":"csv"}'
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

## Spesifikasi teknis

### Instalasi dan siklus hidup

Instal modul melalui Cognis Module Marketplace atau tempatkan repositori lengkap di direktori modul eksternal yang dikonfigurasi. Cognis memvalidasi setiap sumber runtime sebelum memuat `bootstrap.js`, yang mendaftarkan bagian admin dan rute API melalui `ctx`. Semua URL API runtime tetap berada di bawah `/api/v1/modules/analytics`, dan ukuran font antarmuka memakai unit relatif terhadap preferensi, sehingga memenuhi kontrak batas host selama pengaktifan dan pemutakhiran. Saat dinonaktifkan, Cognis memuat titik masuk khusus `api/disabled.js`, yang sengaja tidak mendaftarkan rute atau kapabilitas karena Analytics tidak memiliki konfigurasi pra-pengaktifan. Modul memerlukan kapabilitas host `db:executor`. Skema peristiwa milik modul dipastikan saat startup; kegagalan inisialisasi dicatat dengan metadata komponen dan operasi yang aman.

Saat mendistribusikan modul, pertahankan `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, migrasi basis data, sumber daya bahasa, dokumentasi, aset, dan hash manifes sebagai satu kesatuan. UUID modul bersifat permanen.

### Antarmuka administrasi

Bagian admin dibatasi untuk peran `admin`. Bagian ini melaporkan:

- akun total, aktif, baru aktif, baru terdaftar, dan dorman;
- tingkat aktivasi serta jumlah berdasarkan peran akun;
- seri pendaftaran harian untuk rentang yang dipilih;
- total peristiwa modul, aktor tidak-null unik, dan jumlah berdasarkan jenis peristiwa; serta
- peristiwa modul terbaru, diurutkan dari yang paling baru.

Teks UI berasal dari sumber daya XML modul dalam bahasa Jerman, Inggris, Indonesia, dan Jepang. Pemformatan stempel waktu diteruskan ke formatter host jika tersedia, atau menggunakan `Intl.DateTimeFormat` browser sebagai fallback.

### API HTTP

Semua rute memerlukan peran `admin`.

- `GET /api/v1/modules/analytics/metrics?days=<n>` mengembalikan metrik kesehatan akun. `days` bernilai default `30`, harus positif, dan dibatasi hingga `365`.
- `GET /api/v1/modules/analytics/series?days=<n>` mengembalikan satu titik `{ date, count }` per tanggal UTC dalam rentang dengan aturan `days` yang sama.
- `GET /api/v1/modules/analytics/type-summary?days=<n>` mengembalikan `{ total, uniqueActors, byType }`. Jalur `event-summary` adalah rute kompatibilitas yang setara; UI browser memakai `type-summary` untuk menghindari filter privasi yang memblokir URL berisi `event`.
- `GET /api/v1/modules/analytics/activity-log?limit=<n>` mengembalikan peristiwa terbaru tanpa metadata tersimpan. `limit` bernilai default `50`, harus positif, dan dibatasi hingga `200`.
- `POST /api/v1/modules/analytics/activity-log` menerima `{ eventType, meta }`. Body JSON UTF-8 dibatasi 16 KiB, `eventType` dipangkas dan dibatasi 64 karakter, dan `meta` hanya disimpan jika berupa objek non-array.

### Respons dan kegagalan

Pembacaan berhasil mengembalikan HTTP `200` dengan properti `data`. Jika penyimpanan peristiwa tidak tersedia, ringkasan peristiwa dan log aktivitas mengembalikan hasil kosong yang aman; metrik dan seri mengembalikan `503`. JSON tidak valid atau jenis peristiwa yang hilang mengembalikan `400`, body terlalu besar mengembalikan `413`, dan penulisan tanpa penyimpanan mengembalikan `503`. Kegagalan kueri atau penulisan menghasilkan kesalahan generik yang aman tanpa detail internal. Kegagalan kueri dan skema dicatat melalui logger host.

### Persistensi dan privasi

Metrik akun membaca tabel `accounts` milik host melalui `db:executor`; modul tidak menyalin catatan akun. Peristiwa kustom disimpan di tabel milik modul `sample_analytics_events` dengan ID, jenis peristiwa, ID akun opsional, metadata terserialisasi, dan waktu pembuatan. Peristiwa yang dibuat API saat ini memakai ID akun null. Respons peristiwa terbaru tidak menyertakan metadata, sedangkan ringkasan mengagregasi jenis peristiwa dan aktor tidak-null.

Modul tidak menghubungi penyedia analitik eksternal. Operator bertanggung jawab menetapkan nama peristiwa yang tepat, meminimalkan metadata, menerapkan aturan retensi pada tabel modul, dan membatasi akses administratif.

### Kontrak CLI

`analytics:metrics`, `analytics:series [days]`, `analytics:event-summary [days]`, dan `analytics:activity-log [limit]` memanggil rute modul terautentikasi yang sesuai. `analytics:activity-log:record <event-type> [meta-json]` mengurai metadata opsional sebagai JSON sebelum mengirim POST. CLI melaporkan JSON tidak valid dan argumen wajib yang hilang.

### Verifikasi operasional

Setelah mengubah berkas apa pun yang dipaketkan, jalankan:

```sh
npm install
npm test
npm run lint
npm run manifest:hashes
npm run check:manifest
git diff --check
```

`npm run manifest:hashes` membangun ulang `manifest.files` dengan digest SHA-256 dan memformat manifes memakai konfigurasi Prettier repositori. `npm run check:manifest` memverifikasi versi, entrypoint, rute, path paket, dan digest berkas.

Saat Cognis menghapus instalasi modul, memilih penghapusan konten akan menghapus semua peristiwa analitik milik modul. Jika penghapusan konten tidak dipilih, peristiwa tersebut dipertahankan. Tindakan pembersihan dicatat melalui pencatat log host tanpa muatan peristiwa.
