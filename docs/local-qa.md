# Hasil implementasi lokal — Direction B

Tanggal: 14 Oktober 2026. Project: [panduan website](../README.md). Ini hasil implementasi website baru, bukan perbaikan Laravel lama atau laporan deployment.

## Yang tersedia

- Astro 7.1.3 + TypeScript + Tailwind, output statis.
- Home, Work, About, 404, dan 22 detail proyek (26 halaman HTML).
- Hero foto asli Sirojul: crop 4:5, frame rounded, desaturasi lembut dan overlay biru. File sumber tidak diedit.
- Tiga selected work: MinerbaOne, Borobudur Marathon, Astraland.
- Empat kategori dengan filter button, status jumlah hasil, focus terlihat, no-JS tetap menampilkan semua proyek.
- Konten Markdown/JSON, schema, status draft, slug unik, cover lokal, CTA URL opsional.
- SEO metadata, canonical/OG ketika origin diisi, sitemap dan robots; preview noindex, halaman 404 selalu noindex.
- Konfigurasi kandidat Pages CMS dan CI untuk repository frontend terpisah.

Detail saat ini adalah **project overview** berdasarkan teks sumber. Tidak ada cerita riset, outcome, tahun proyek, team, atau pemetaan employer–project yang dibuat tanpa fakta.

## Bukti pemeriksaan

| Pemeriksaan | Hasil |
| --- | --- |
| Astro check | 0 error, 0 warning, 0 hint |
| ESLint | Lulus untuk file JS/TS/config; template Astro diperiksa lewat Astro check/build |
| Node tests | 4 lulus: input proyek, slug duplikat, filter kategori, kontak profil |
| Static build | 26 halaman HTML dan 81 varian gambar WebP |
| Verifikasi output | 358 referensi tautan/aset lokal valid, satu h1 per halaman, metadata/alt/dimensi tersedia, CTA placeholder/staging tidak ditemukan |
| Local HTTP preview | 27 route termasuk robots/sitemap merespons 200; proyek hilang, SQL, dan .env merespons 404 |
| Draft fixture | Tidak masuk listing, route, atau sitemap; fixture uji telah dihapus |
| Simulasi konfigurasi produksi | Origin qa.example menghasilkan canonical/OG dan 25 URL sitemap; robots Allow, 404 tetap noindex |
| Hasil akhir lokal | Dibangun ulang tanpa origin produksi, tetap noindex/Disallow |
| Rekonsiliasi migrasi | 22 deskripsi cocok; 34 aset referensi dan portrait identik dengan sumber; 10 hash source audit tetap sama |

Pengujian produksi memakai domain contoh qa.example dalam build lokal, bukan publikasi. Sitemap berisi 25 route indexable; 404 dikecualikan. Preview tanpa SITE_URL mempunyai sitemap kosong.

Implementasi memakai script filter kecil pada halaman Work serta script tema di head dan script navigasi di semua halaman, tanpa runtime React. Ukuran artifact tidak menjadi bukti skor Lighthouse atau Core Web Vitals.

## Konten yang membutuhkan review

Astraland memakai logo existing sementara karena screenshot website yang tersedia ber-watermark. Screenshot bersih tetap perlu dari pemilik. Logo menunjukkan identitas proyek, bukan klaim mendesain logo.

URL staging MinerbaOne disimpan di manifest dan tidak menjadi CTA. Gambar involvement dipertahankan sebagai aset, tidak ditampilkan sebagai endorsement. File dalam public/storage akan tetap bisa diakses jika website dipublikasikan; review izin dan data screenshot sebelum deploy.

Tanggal QBIT dipadatkan menjadi 2023–2024 karena sumber memberi dua rentang tanpa pemetaan role yang jelas. Ejaan Kementerian Petanian mengikuti sumber dan perlu konfirmasi. Resume, availability, role/proses/outcome proyek lain belum tersedia.

## Belum diverifikasi / dihubungkan

Browser rendering, layar kecil, interaksi keyboard/screen reader nyata, Lighthouse, dan tautan eksternal langsung belum diverifikasi. Pemeriksaan HTML/CSS dan unit filter tidak menggantikan review tersebut.

Pages CMS belum terhubung ke akun/repository. Konfigurasi mengikuti [content schema](https://pagescms.org/docs/configuration/content/) dan [media mapping](https://pagescms.org/docs/configuration/media/), tetapi upload/save/preview/revert dan path relatif masih perlu trial pemilik.

Workflow GitHub Actions belum dijalankan di GitHub. Vercel, required deployment checks, domain dan DNS belum dihubungkan. Tidak ada deploy publik atau perubahan website lama.

## Review berikutnya

Jalankan npm run dev dari website/, lalu buka http://127.0.0.1:4321/. Review hero dan halaman baru di desktop/ponsel; lengkapi screenshot Astraland, izin gambar, dan fakta selected work. Setelah konten/visual diterima, uji Pages CMS dan lanjutkan deployment sebagai pekerjaan terpisah yang telah disetujui.


Cache npm workspace sementara sekitar 3 GB masih ada di .npm-cache/. Penghapusan rekursif ditolak oleh peninjauan persetujuan otomatis karena izin sandbox tidak tersedia. Cache tidak diperlukan untuk runtime website dan tidak termasuk output build.

## Pembaruan toggle tema

Toggle light/dark tersedia di navigasi semua halaman, dengan preferensi perangkat, pilihan tersimpan, inisialisasi sebelum body, dan fallback ketika storage diblokir. Frame foto/kartu/teks menggunakan palet yang sesuai tema. Navigation mobile telah diperbarui menjadi menu hamburger pada layar ≤700px.

Tes bertambah menjadi 8: empat tes konten sebelumnya ditambah tiga tes perilaku tema lewat VM dan satu tes rasio kontras warna. Warna teks utama/sekunder/aksen terhadap canvas/surface dan teks tombol terhadap background normal/hover memenuhi ≥4,5:1 berdasarkan perhitungan token. Ini tidak menggantikan pengecekan browser/screen reader/mobile nyata.

## Pembaruan hamburger mobile

Work/About/Contact memakai disclosure hamburger pada layar ≤700px. Logo dan toggle tema berada di luar menu. Desktop memakai tautan langsung; tanpa JavaScript, tautan tetap terlihat. Menu menggunakan button dengan aria-controls/aria-expanded, target 44px, focus ring, dukungan Escape, close-on-link/outside/focus-out, dan reset breakpoint dengan pemulihan fokus. Urutan DOM menempatkan tombol sebelum tautan agar urutan Tab mobile benar.

Total 11 tes lulus, termasuk tiga tes navigasi melalui VM. Lint, Astro check (0 error/warning/hint), build 26 halaman, dan 358 referensi lokal lulus. Struktur hamburger/tautan/tema dan urutan DOM diperiksa pada seluruh 26 halaman hasil build. Interaksi dan rendering browser/mobile nyata masih belum diverifikasi.
