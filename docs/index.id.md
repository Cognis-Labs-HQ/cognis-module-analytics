# Modul Analytics

Modul Analytics memberi administrator Cognis wawasan yang sadar privasi tentang kesehatan akun, adopsi, pendaftaran, dan peristiwa milik modul tanpa mengirim telemetri ke layanan analitik pihak ketiga. Modul membaca data akun melalui kapabilitas basis data host dan hanya menyimpan peristiwa yang dikirim ke API log aktivitas miliknya sendiri.

## Contoh penggunaan

Buka bagian **Analytics** di Administrasi Cognis untuk melihat jumlah akun, akun aktif, aktivitas tujuh hari, dormansi 30 hari, distribusi peran, tren pendaftaran, total peristiwa, dan peristiwa terbaru. Pilih rentang 7, 30, atau 90 hari lalu segarkan tampilan untuk memperbarui laporan berbasis waktu.

Gunakan kontrak yang sama melalui CLI:

```sh
cognisctl modules:analytics:metrics
cognisctl modules:analytics:series 30
cognisctl modules:analytics:eventSummary 30
cognisctl modules:analytics:activityLog 20
```

Catat peristiwa milik modul dengan metadata JSON opsional:

```sh
cognisctl modules:analytics:activityLog:record report_exported '{"format":"csv"}'
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

Instal modul melalui Cognis Module Marketplace atau tempatkan repositori lengkap di direktori modul eksternal yang dikonfigurasi. Manifes mendeklarasikan `bootstrap.js` sebagai satu-satunya titik masuk modul aktif. Cognis memvalidasi setiap sumber runtime sebelum memuatnya, lalu `bootstrapModule(ctx)` mendaftarkan bagian admin dan rute API melalui konteks host tercakup. Semua URL API runtime tetap berada di bawah `/api/v1/modules/analytics`, dan ukuran font antarmuka memakai unit relatif terhadap preferensi, sehingga memenuhi kontrak batas host selama pengaktifan dan pemutakhiran. Analytics tidak memerlukan konfigurasi sebelum pengaktifan; modul yang dinonaktifkan tidak menyediakan API atau UI runtime dan tidak menjalankan bootstrap aktif. Modul memerlukan kapabilitas host `db:executor` dan `auth:accountStore`. Skema peristiwa milik modul dipastikan saat startup; kegagalan inisialisasi dicatat dengan metadata komponen dan operasi yang aman.

Saat mendistribusikan modul, pertahankan `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, migrasi basis data, sumber daya bahasa, dokumentasi, aset, dan hash manifes sebagai satu kesatuan. UUID modul bersifat permanen.

Ilustrasi Marketplace menggunakan berkas yang dideklarasikan oleh `assets.icon` dan `assets.banner` di `manifest.json`; kedua berkas disertakan dalam inventaris paket yang terverifikasi.

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

- `GET /api/v1/modules/analytics/metrics?days=<n>`: Rentang hari default adalah 30 dan harus berupa bilangan bulat dari 1 hingga 365; nilai tidak valid menghasilkan 400, bukan dibatasi diam-diam.
- `GET /api/v1/modules/analytics/series?days=<n>` mengembalikan satu titik `{ date, count }` per tanggal UTC dalam rentang dengan aturan `days` yang sama.
- `GET /api/v1/modules/analytics/type-summary?days=<n>` mengembalikan `{ total, uniqueActors, byType }`. Jalur `event-summary` adalah rute kompatibilitas yang setara; UI browser memakai `type-summary` untuk menghindari filter privasi yang memblokir URL berisi `event`.
- `GET /api/v1/modules/analytics/activity-log?limit=<n>`: Tanpa limit, semua peristiwa yang cocok dikembalikan. Limit eksplisit harus berupa bilangan bulat positif yang aman dan diterapkan tepat; nilai tidak valid menghasilkan 400.
- `POST /api/v1/modules/analytics/activity-log` menerima `{ eventType, meta }`. Body JSON UTF-8 dibatasi 16 KiB, `eventType` dipangkas dan dibatasi 64 karakter, dan `meta` hanya disimpan jika berupa objek non-array.

### Respons dan kegagalan

Pembacaan berhasil mengembalikan HTTP `200` dengan properti `data`. Jika penyimpanan peristiwa tidak tersedia, ringkasan peristiwa dan log aktivitas mengembalikan hasil kosong yang aman; metrik dan seri mengembalikan `503`. JSON tidak valid atau jenis peristiwa yang hilang mengembalikan `400`, body terlalu besar mengembalikan `413`, dan penulisan tanpa penyimpanan mengembalikan `503`. Kegagalan kueri atau penulisan menghasilkan kesalahan generik yang aman tanpa detail internal. Kegagalan kueri dan skema dicatat melalui logger host.

### Persistensi dan privasi

Metrik akun membaca kapabilitas publik `auth:accountStore`; modul tidak menyalin catatan akun. Peristiwa kustom disimpan di tabel milik modul `sample_analytics_events` dengan ID, jenis peristiwa, ID akun opsional, metadata terserialisasi, dan waktu pembuatan. Peristiwa yang dibuat API saat ini memakai ID akun null. Respons peristiwa terbaru tidak menyertakan metadata, sedangkan ringkasan mengagregasi jenis peristiwa dan aktor tidak-null.

Modul tidak menghubungi penyedia analitik eksternal. Operator bertanggung jawab menetapkan nama peristiwa yang tepat, meminimalkan metadata, menerapkan aturan retensi pada tabel modul, dan membatasi akses administratif.

### Kontrak CLI

`modules:analytics:metrics`, `modules:analytics:series [days]`, `modules:analytics:eventSummary [days]`, dan `modules:analytics:activityLog [limit]` memanggil rute modul terautentikasi yang sesuai. `modules:analytics:activityLog:record <event-type> [meta-json]` mengurai metadata opsional sebagai JSON sebelum mengirim POST. CLI melaporkan JSON tidak valid dan argumen wajib yang hilang.

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

### Alur tindakan milik modul

Metrik akun dan seri pendaftaran menggunakan `auth:accountStore.list()` dan `getInfo()`; tabel komponen lain tidak diakses. Hanya peristiwa milik modul yang menggunakan `db:executor`.

Operasi HTTP berjalan melalui alur ctx milik modul dengan tahap validasi, eksekusi, dan penyajian. Pengujian menjalankan tahap-tahap ini dan mencegah penyimpanan ketika validasi atau inisialisasi skema gagal.

### Struktur kontributor dan kepemilikan host

Mulai modul baru dari [cognis-module-template](https://github.com/Cognis-Labs-HQ/cognis-module-template); repositori ini mengikuti revisi panduan yang dicatat dalam `AGENTS.md`. `bootstrap.js` mengatur siklus hidup, `api/index.js` menghubungkan dependensi ctx, `api/routes/<domain>/index.js` menangani HTTP, dan `api/reuse/` berisi kode server yang dipakai ulang. Fitur browser berada di `ui/`, gaya di `ui/styles/`, templat bersama di `ui/templates/`, dan dokumentasi terjemahan di `docs/index.<locale>.md`. Riwayat rilis berada di `docs/changelog/` dan dikecualikan dari hash paket. Bagian opsional yang tidak didukung tidak dibuat.

Gunakan kapabilitas ctx publik dan alur yang dideklarasikan; jangan mengimpor bagian internal Cognis atau modul lain. Penyedia kapabilitas dan navigasi dasbor mengekspor `mountProvider(scopedUiCtx)` dan mengembalikan fungsi pembersihan sumber daya miliknya. Impor tidak boleh mendaftarkan perilaku modul. Host menghapus kapabilitas, kait alur, listener, dan status penyedia saat dinonaktifkan, lalu memasang kembali penyedia yang tersimpan saat diaktifkan ulang. Pabrik pengaturan, administrasi, dan penyedia deskriptor footer autentikasi mengikuti kontrak host masing-masing. Uji kontrak dengan pengganti mandiri, jalankan pemeriksaan struktur, perbarui hash setelah perubahan paket terakhir, lalu jalankan lint, pengujian, dan validasi manifes sebelum publikasi.
