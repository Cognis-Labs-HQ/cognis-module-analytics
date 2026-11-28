# Referensi Teknis

Antarmuka publik, konfigurasi, dan siklus hidup Analitik.

## Antarmuka

Modul Analytics memberi administrator Cognis wawasan yang sadar privasi tentang kesehatan akun, adopsi, pendaftaran, dan peristiwa milik modul tanpa mengirim telemetri ke layanan analitik pihak ketiga. Modul membaca data akun melalui kapabilitas basis data host dan hanya menyimpan peristiwa yang dikirim ke API log aktivitas miliknya sendiri.

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

## Konfigurasi

Analytics tidak mendeklarasikan formulir preferensi modul. Rentang laporan dan batas daftar eksplisit adalah masukan permintaan, bukan konfigurasi tersimpan. Metrik akun memakai `auth:accountStore`; peristiwa milik modul memakai `db:executor`.

## Perilaku

Panel laporan memakai hook Composer host `data-composer-layout="compact"` untuk konten sempit. Ringkasan peristiwa yang ringkas menempatkan setiap bilah di bawah label dan jumlah; total serta filter dapat berpindah baris. Tabel peristiwa mempertahankan proporsi kolom tetap dan membungkus stempel waktu pada tampilan ringkas. Aturan ini berlaku pada konten laporan milik modul dan mempertahankan pengaturan tema serta ukuran teks host.

### Instalasi dan siklus hidup

Instal modul melalui Cognis Module Marketplace atau tempatkan repositori lengkap di direktori modul eksternal yang dikonfigurasi. Manifes mendeklarasikan `bootstrap.js` sebagai satu-satunya titik masuk modul aktif. Cognis memvalidasi setiap sumber runtime sebelum memuatnya, lalu `bootstrapModule(ctx)` mendaftarkan bagian admin dan rute API melalui konteks host tercakup. Semua URL API runtime tetap berada di bawah `/api/v1/modules/analytics`, dan ukuran font antarmuka memakai unit relatif terhadap preferensi, sehingga memenuhi kontrak batas host selama pengaktifan dan pemutakhiran. Analytics tidak memerlukan konfigurasi sebelum pengaktifan; modul yang dinonaktifkan tidak menyediakan API atau UI runtime dan tidak menjalankan bootstrap aktif. Modul memerlukan kapabilitas host `db:executor` dan `auth:accountStore`. Skema peristiwa milik modul dipastikan saat startup; kegagalan inisialisasi dicatat dengan metadata komponen dan operasi yang aman.

Saat mendistribusikan modul, pertahankan `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, migrasi basis data, sumber daya bahasa, dokumentasi, aset, dan hash manifes sebagai satu kesatuan. UUID modul bersifat permanen.

Ilustrasi Marketplace menggunakan berkas yang dideklarasikan oleh `assets.icon` dan `assets.banner` di `manifest.json`; kedua berkas disertakan dalam inventaris paket yang terverifikasi. Banner menempatkan seluruh logo, judul dan grafik di pita tengah yang aman untuk tampilan Cognis dengan tinggi terbatas. Ikon PNG persegi merupakan cuplikan grafik dari banner.

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

### Antrean dan Persetujuan

Analytics mencatat aktivitas terautentikasi melalui `POST /api/v1/modules/analytics/activity` dan alur browser `analytics:recordActivity`. Kunci idempotensi per akun mencegah duplikasi dan mempertahankan waktu asli. Navigasi serta tindakan Study hanya menyertakan metadata skalar aman (`component`, `action`, `result`, `count`, `durationMs`); data lain ditolak sebelum disimpan. Laporan memakai hash akun. Penonaktifan penyedia melepas pengirim dan listener.

Host menyediakan `offline:outbox`, `offline:state`, dan `offline:accessPolicy` melalui ctx. Komponen mendaftarkan pengirim selama masa hidup penyedia dan ID operasi stabil melalui `offline:enqueue`; `offline:flush` mengotorisasi dan mengirim. Antrean permanen per akun dibatasi 1.000 catatan dan 1 MB selama tujuh hari, tanpa token. ID serta waktu asli dipertahankan; kegagalan sementara dicoba ulang, catatan yang dikonfirmasi atau ditolak permanen dihapus. Penolakan menampilkan peringatan terlokalisasi. Keluar menghapus antrean akun; pergantian akun tidak mengirim data akun lain. Menonaktifkan Mode Offline menghentikan catatan baru. Antrean lama tetap dapat dikirim saat online.

### Peringatan antrean latar

Analytics mendaftarkan pemilik pengirimannya dengan `protectOnClose: false` pada antrean host. Rekaman navigasi dan aktivitas tetap tersimpan secara persisten dan dikirim setelah pemulihan terotorisasi, termasuk pemeriksaan koneksi manual, tetapi tidak lagi memicu peringatan penutupan browser. Edit pengguna tetap memakai perlindungan bawaan host. Fitur ini memerlukan kontrak klasifikasi peringatan host yang diperbarui.

### Pembersihan Aktivitas Akun

Hook `analytics:deleteAccountActivity` yang terikat siklus hidup memperluas `deprovision-user` pada `cleanup-dependencies`. Setelah penghapusan akun tersimpan, hook menunggu kesiapan skema dan hanya menghapus peristiwa yang ringkasan akunnya cocok dengan identitas yang dihapus, menggunakan derivasi SHA-256 yang sama dengan pencatatan terautentikasi. Akun lain dan peristiwa administrator anonim tetap utuh. Penonaktifan, pengarsipan, dan permintaan penghapusan yang ditolak mempertahankan aktivitas. Kegagalan dicatat dan diteruskan; host melepas hook saat konteks modul ditutup sebelum pengaktifan ulang.

### Tutorial terpandu

[Tutorial terpandu](TECHNICAL.id.md)

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

Host bersama menyediakan aksi mengambang melalui antreannya. Kunjungan awal menawarkan Berikutnya/Selesai tanpa Batal atau Lewati; pemutaran ulang menawarkan Lewati sebelum tahap terlihat terakhir. Mulai Ulang Tutorial muncul setelah tahap terlihat pertama. Penyelesaian tetap berlaku setelah pembaruan konten. Flag highlightNext hanya mengaktifkan animasi berdenyut untuk penjelasan; pengurangan gerakan menonaktifkannya. Setiap tahap menyorot kontrol nyata berbeda sesuai urutan UI. Panduan tetap terikat ke tampilan aktif, menangani keadaan kosong dan opsional, serta membersihkan sumber daya saat navigasi atau pelepasan pemilik.

### Segarkan sebelum membaca grafik

Latihan rentang waktu mencakup pemilihan rentang dan menekan Segarkan. Tutorial hanya berlanjut setelah semua permintaan laporan dan penguraian respons berhasil serta laporan ditampilkan. Mengubah pilihan saja, permintaan yang gagal, atau menutup bagian tidak melanjutkan tutorial. Setelah penyegaran gagal, kontrol dapat digunakan untuk mencoba lagi; selama penyegaran berlangsung, pilihan rentang dan tombol Segarkan dinonaktifkan sementara.

## Keamanan

Pelaporan agregat memerlukan otorisasi administrator. Penerimaan aktivitas terautentikasi menentukan identitas dari klaim terverifikasi dan menerima metadata aman terbatas. Laporan memakai digest akun, bukan pengenal mentah. Retensi serta penghapusan hanya berlaku pada peristiwa modul dan mempertahankan data akun serta aplikasi lain.

## Referensi

- [manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/blob/HEAD/manifest.json)
- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/blob/HEAD/bootstrap.js)
- [Cognis](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/modules/external/TECHNICAL.en.md)

### Validasi nama

`npm test` memeriksa nama binding dengan detektor pohon sintaks lokal, termasuk bootstrap, skrip, pengujian, dan fixture. Kesalahan penguraian menggagalkan validasi. Fixture regresi mencakup deklarasi, parameter, anggota privat, penegasan tipe TypeScript, dan nama khusus tipe yang sah. Lihat [standar penamaan host](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.id.md#nama-binding) untuk kebijakan bersama. Istilah lazim seperti `args`, `db`, dan LDAP `dn` diperbolehkan sebagai nama mandiri. Nama gabungan, termasuk tipe dan metode upstream, memakai kata lengkap seperti `DatabaseExecutor`, `createDatabaseExecutor`, dan `baseDistinguishedName`; API milik komponen memakai satu nama kanonis pada deklarasi, ekspor, dan pemanggil. Alias ekspor yang hanya mengganti nama menggagalkan validasi. Token satuan ukuran (`ms`, `sec`, `px`, `rad`, `deg`) tetap disingkat dalam nama gabungan seperti `INVITE_EXPIRY_MS` dan `widthPx`; singkatan gabungan lainnya tetap diperluas.
