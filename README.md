# Sirojul Ibad portfolio

Website baru dalam Astro + TypeScript + Tailwind, memakai Direction B dan foto asli dalam frame rounded. Repository ini memuat frontend mandiri. Snapshot Laravel dan SQL dipakai sebagai sumber migrasi pada workspace audit.

## Jalankan lokal

Gunakan Node sesuai `.nvmrc`, kemudian:

```sh
npm ci
npm run dev
```

Buka http://127.0.0.1:4321/. Untuk memeriksa hasil statis:

```sh
npm run lint
npm test
npm run build
npm run verify
npm run preview
```

Tidak memerlukan database, API key, atau file SQL. `dist/` adalah hasil build statis. Dependensi dipasang dari cache publik yang tersedia saat implementasi; lockfile mencatat versi yang terpasang.

## Navigasi mobile

Pada layar hingga 700px, Work/About/Contact masuk menu hamburger. Logo dan toggle tema tetap terlihat. Menu menutup setelah memilih link, menekan Escape, mengklik area luar, atau memindahkan fokus keluar header. Escape mengembalikan fokus ke tombol menu. Perubahan breakpoint mereset menu dan mencegah fokus tertinggal pada elemen tersembunyi.

Desktop menampilkan tautan langsung. Tanpa JavaScript, tautan tetap terlihat dan tombol hamburger disembunyikan agar navigasi tetap dapat digunakan.

## Tema terang / gelap

Tombol bulan/matahari di navigasi mengganti tema pada semua halaman. Saat belum ada pilihan tersimpan, tema mengikuti perangkat dan perubahan preferensinya. Pilihan manual disimpan di localStorage dan dipakai saat membuka halaman lain. Inisialisasi berlangsung di head sebelum body ditampilkan.

Jika penyimpanan browser diblokir, toggle tetap berfungsi di halaman saat ini; pilihan tidak bertahan setelah reload/navigasi. Tanpa JavaScript, tema mengikuti perangkat dan tombol disembunyikan. Foto memakai treatment warna sesuai tema; screenshot proyek tetap dalam warna sumbernya.

## Tambah / ubah portfolio

1. Simpan gambar di `src/assets/projects/`.
2. Tambah Markdown di `src/content/projects/`, gunakan proyek yang ada sebagai contoh.
3. Isi title, slug unik, category, summary, cover relatif (`../../assets/projects/nama.jpg`), coverAlt, order, dan status. Gunakan `draft` sampai konten siap.
4. Body di bawah frontmatter adalah uraian proyek. Role/year/link opsional; jangan isi dengan asumsi.
5. Isi featuredOrder hanya untuk proyek yang muncul di Home. Homepage mengikuti urutannya.
6. Jalankan build dan review preview. Ubah status menjadi `published` setelah siap.

Kategori: Web Design, Mobile Design, Dashboard Design, Games. Draft tidak masuk listing, halaman detail, atau sitemap. Slug duplikat, cover tidak ada, kategori keliru, dan link selain HTTP/HTTPS menggagalkan build. Link kosong diabaikan. Jangan mengganti slug yang telah dibagikan tanpa redirect.

Profil, pengalaman, pendidikan, keterampilan, dan tautan ada di `src/data/profile.json`. Foto serta treatment frame/filter ada di `src/assets/sirojul.jpg` dan `src/styles/global.css`. Teks hero utama merupakan komposisi desain di `src/pages/index.astro`.

## Editor pemilik

`.pages.yml` adalah konfigurasi kandidat [Pages CMS](https://pagescms.org/docs/configuration/content/), dengan koleksi proyek dan profil. Folder ini adalah root repository frontend; CMS dapat diarahkan ke repository ini. Akun belum dihubungkan. Mapping media relatif perlu diuji lewat upload, simpan, build, preview, dan revert oleh pemilik sebelum disebut siap pakai. Jangan menjanjikan editor aktif hanya karena YAML tersedia.

## Produksi dan preview

Preview default noindex/nofollow, robots Disallow. Tidak ada domain produksi yang diasumsikan. Set `SITE_URL=https://domain-final.example` (origin tanpa path) dan `PUBLIC_INDEXABLE=true` hanya pada build produksi yang telah disetujui. Canonical/OG/sitemap memakai SITE_URL; jangan gunakan origin produksi yang salah.

Vercel: root directory folder ini, framework Astro, build `npm run build`, output `dist`. CI siap untuk repository frontend dengan folder ini sebagai root. Workflow CI tidak otomatis menghambat deployment Vercel; kaitkan required checks/deployment checks saat menyiapkan akun. GitHub, Pages CMS, Vercel, dan DNS belum dihubungkan.

## Catatan konten

22 uraian proyek sumber dipertahankan sebagai overview. Tidak ada klaim riset, hasil terukur, team atau scope yang dibuat-buat. Astraland memakai logo sementara karena cover screenshot sumber ber-watermark. Link staging MinerbaOne diarsipkan dalam manifest migrasi, tidak ditampilkan sebagai project link.

34 aset referensi sumber disimpan di `public/storage/` untuk menjaga path; tidak ditampilkan sebagai endorsement klien. File di public tetap dapat diakses jika site dipublikasikan. Review semua gambar dan izin publikasi, termasuk data dalam screenshot, sebelum deploy. Manifest sumber ada di [docs/migration-manifest.json](docs/migration-manifest.json); file itu tidak diperlukan saat build.

Belum dilakukan: review visual browser/ponsel, Lighthouse, pemeriksaan tautan eksternal langsung, uji editor pemilik, atau deployment.


Laporan pemeriksaan lokal tersedia di [docs/local-qa.md](docs/local-qa.md).
