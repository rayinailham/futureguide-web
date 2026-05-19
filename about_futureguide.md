# FutureGuide — Rangkuman Aplikasi

## Apa itu FutureGuide?

FutureGuide adalah platform penilaian psikologis berbasis AI yang dirancang untuk membantu pelajar dan mahasiswa memahami diri mereka secara mendalam — mulai dari kepribadian, kekuatan karakter, hingga arah karier yang paling sesuai. Hasil analisis bukan sekadar laporan statis, melainkan titik awal percakapan interaktif dengan AI yang memahami konteks psikologis pengguna.

---

## Endorsement Akademis

FutureGuide didukung oleh **Prof. Dede Rahmat Hidayat, M.Psi., Ph.D.** — Guru Besar Bimbingan dan Konseling Universitas Negeri Jakarta (UNJ), dikukuhkan 20 Desember 2022. Beliau adalah pakar nasional di bidang career development, career guidance & counseling, dan psychological well-being. Aktif sebagai asesor akreditasi nasional (LAMDIK) dan penulis buku referensi utama psikologi & BK di Indonesia.

---

## Tiga Instrumen Penilaian (200 Pertanyaan)

FutureGuide menggunakan tiga instrumen psikometri yang telah tervalidasi secara ilmiah:

| Instrumen | Jumlah Item | Apa yang diukur |
|-----------|-------------|-----------------|
| **RIASEC** | 60 item | Tipe minat karier (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) |
| **OCEAN** | 44 item | Lima dimensi kepribadian (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) |
| **VIA-IS** | 96 item | 24 kekuatan karakter (Values in Action Inventory of Strengths) |

Ketiga instrumen ini dianalisis secara cross-reference oleh AI untuk menghasilkan profil yang holistik dan saling memperkuat.

---

## Basis Ilmiah

Mesin analisis FutureGuide didukung oleh **121 jurnal ilmiah peer-reviewed** yang diintegrasikan melalui sistem RAG (Retrieval-Augmented Generation). Jurnal-jurnal ini mencakup riset tentang RIASEC, OCEAN, VIA-IS, serta hubungan lintas ketiganya.

AI tidak hanya menganalisis — ia **menambatkan setiap interpretasi pada temuan penelitian spesifik**. Contoh: saat menjelaskan profil dengan skor Openness tinggi, AI diwajibkan merujuk pada studi seperti *"Korelasi Faber & Mayer 2009 antara skor Openness tinggi dengan..."* — bukan opini generik, melainkan klaim yang bisa ditelusuri ke sumbernya.

---

## Sistem Arketip PMAI (Taksonomi Tertutup)

FutureGuide menggunakan **12 arketip resmi dari Pearson-Marr Archetype Indicator (PMAI)** sebagai kerangka identitas psikologis pengguna. AI tidak diizinkan membuat nama arketip secara bebas — ia wajib memilih dari 12 arketip yang telah terstandarisasi, antara lain: The Seeker, The Creator, The Warrior, dan lainnya.

Pemilihan arketip dilakukan secara berbasis data: AI mencocokkan profil kanonis setiap arketip dengan skor aktual pengguna dari ketiga instrumen (RIASEC + OCEAN + VIA-IS). Arketip dengan jumlah kecocokan pola tertinggi yang ditetapkan — bukan hasil interpretasi subjektif AI.

---

## Hasil Analisis

Setelah assessment selesai, pengguna mendapatkan laporan komprehensif yang mencakup:

- **Signature Title & Description** — identitas psikologis berbasis arketip PMAI, didukung referensi jurnal akademis
- **Learning Style** — preferensi belajar dan lingkungan ideal
- **Detailed Analysis** — kekuatan, kelemahan, dan dinamika tim
- **Career Pathing** — industri terbaik, prospek peran, risiko otomasi, struktur gaji
- **Student Recommendations** — ekstrakurikuler dan tindakan segera yang relevan
- **Personal Growth** — area pengembangan diri dan rekomendasi buku

Laporan dapat diekspor sebagai **PDF** dan dibagikan secara publik via share link.

---

## Chat AI Pasca-Assessment

Setelah menerima hasil, pengguna dapat berdiskusi langsung dengan AI melalui **built-in chat sidebar**. AI memahami konteks hasil assessment pengguna secara penuh — percakapan bukan generik, melainkan personal dan berbasis data psikologis pengguna itu sendiri. Didukung oleh RAG dengan referensi akademis yang relevan.

---

## Alur Penggunaan

```
Daftar / Login
    ↓
Beli Token (QRIS via Pakasir)
    ↓
Token terverifikasi → masuk halaman assessment
    ↓
Halaman Briefing → klik "Mulai Sekarang"
    ↓
Isi 200 pertanyaan (RIASEC + OCEAN + VIA-IS)
    ↓
Submit → halaman menunggu (real-time via SSE)
    ↓
Redirect ke halaman hasil analisis + chat sidebar
```

---

## Paket Token

| Paket | Token | Harga |
|-------|-------|-------|
| Starter | 1 token | Rp 200.000 |
| Basic | 3 token | Rp 500.000 |
| Value | 5 token | Rp 800.000 |
| Pro | 10 token | Rp 1.200.000 |

1 token = 1 sesi assessment lengkap.

---

## Infrastruktur Teknis (Ringkasan)

- **Auth:** Email/password + Google OAuth, JWT 15 menit, OTP verifikasi email
- **Payment:** QRIS via Pakasir, webhook terverifikasi, sistem token ledger
- **Assessment:** Atomic submission (debit token + simpan jawaban dalam 1 transaksi DB)
- **Notifikasi:** Real-time SSE untuk status analisis (processing → completed/failed)
- **Chat:** SSE streaming, RAG-grounded, 1 sesi per assessment
- **PDF Export:** Headless Chromium, in-memory, tidak disimpan di server
- **Sharing:** Public share link via token 64-char hex

---

## Target Pengguna

Pelajar SMA, mahasiswa, dan siapa pun yang ingin memahami potensi diri dan arah karier secara ilmiah — bukan berdasarkan kuis kepribadian biasa, melainkan instrumen psikometri terstandar yang dianalisis oleh AI dengan basis 121 jurnal akademis.
