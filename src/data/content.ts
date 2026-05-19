export interface Instrument {
  id: string
  name: string
  fullName: string
  items: number
  description: string
  facets: string[]
  accent: string
}

export const instruments: Instrument[] = [
  {
    id: 'riasec',
    name: 'RIASEC',
    fullName: 'Holland Career Interest',
    items: 60,
    description:
      'Memetakan tipe minat karier ke dalam enam dimensi yang saling berhubungan, dari yang paling konkret sampai yang paling konseptual.',
    facets: [
      'Realistic',
      'Investigative',
      'Artistic',
      'Social',
      'Enterprising',
      'Conventional',
    ],
    accent: '60',
  },
  {
    id: 'ocean',
    name: 'OCEAN',
    fullName: 'Big Five Personality',
    items: 44,
    description:
      'Lima dimensi kepribadian yang divalidasi lintas budaya — kerangka standar emas untuk memahami pola pikir, emosi, dan perilaku.',
    facets: [
      'Openness',
      'Conscientiousness',
      'Extraversion',
      'Agreeableness',
      'Neuroticism',
    ],
    accent: '44',
  },
  {
    id: 'via',
    name: 'VIA-IS',
    fullName: 'Values in Action — Inventory of Strengths',
    items: 96,
    description:
      'Mengukur 24 kekuatan karakter yang disusun di atas enam kebajikan universal — dari kebijaksanaan, keberanian, hingga transendensi.',
    facets: [
      'Wisdom',
      'Courage',
      'Humanity',
      'Justice',
      'Temperance',
      'Transcendence',
    ],
    accent: '96',
  },
]

export interface Archetype {
  id: number
  name: string
  tagline: string
  description: string
  motif: string
  exemplar: string
  exemplarNote: string
}

export const archetypes: Archetype[] = [
  {
    id: 1,
    name: 'The Innocent',
    tagline: 'Hope · Optimism · Trust',
    description:
      'Masih percaya bahwa kerja keras pasti terbayar dan orang-orang pada dasarnya baik. Bukan naif — tapi memilih untuk tidak kehilangan harapan meski dunia mulai membuktikan sebaliknya.',
    motif: '◷',
    exemplar: 'Fred Rogers',
    exemplarNote: 'Lebih dari 30 tahun mengajarkan kebaikan ke jutaan anak — tanpa sinis sedikit pun.',
  },
  {
    id: 2,
    name: 'The Orphan',
    tagline: 'Realism · Empathy · Survival',
    description:
      'Sudah cukup kena realita untuk tahu bahwa dunia tidak selalu adil. Dari situ tumbuh empati yang dalam dan kemampuan bertahan yang tidak bisa diajarkan di kelas.',
    motif: '◐',
    exemplar: 'Charlie Chaplin',
    exemplarNote: 'Besar di workhouse London, jadi orang paling terkenal di dunia lewat empati untuk si kecil.',
  },
  {
    id: 3,
    name: 'The Warrior',
    tagline: 'Discipline · Courage · Drive',
    description:
      'Tipe yang masih buka buku jam 11 malam bukan karena disuruh, tapi karena ada target yang harus dicapai. Disiplin bukan beban — itu cara kamu membuktikan sesuatu ke diri sendiri.',
    motif: '◣',
    exemplar: 'Khalid ibn Walid',
    exemplarNote: 'Panglima yang tidak pernah kalah dalam 100+ pertempuran — disiplin dan keberanian tanpa kompromi.',
  },
  {
    id: 4,
    name: 'The Caregiver',
    tagline: 'Compassion · Service · Care',
    description:
      'Teman yang selalu ada saat orang lain butuh didengar. Kamu menemukan makna bukan dari pencapaian pribadi, tapi dari melihat orang-orang di sekitarmu tumbuh karena kamu ada.',
    motif: '○',
    exemplar: 'Albert Schweitzer',
    exemplarNote: 'Meninggalkan karier gemilang di Eropa untuk jadi dokter di Afrika — "reverence for life."',
  },
  {
    id: 5,
    name: 'The Seeker',
    tagline: 'Autonomy · Curiosity · Quest',
    description:
      'Tidak bisa duduk diam dengan jawaban yang sudah ada. Selalu ada pertanyaan berikutnya, jalur lain yang belum dijelajahi, identitas yang belum selesai dibentuk.',
    motif: '◇',
    exemplar: 'David Attenborough',
    exemplarNote: 'Tujuh dekade menjelajah setiap sudut bumi untuk memahami kehidupan di dalamnya.',
  },
  {
    id: 6,
    name: 'The Lover',
    tagline: 'Connection · Passion · Beauty',
    description:
      'Merasakan segalanya lebih dalam dari orang lain — musik, hubungan, momen. Buat kamu, hidup yang bermakna bukan soal pencapaian, tapi soal intensitas koneksi yang kamu rasakan.',
    motif: '❀',
    exemplar: 'Jalaluddin Rumi',
    exemplarNote: 'Penyair sufi abad ke-13 yang puisinya tentang cinta masih dibaca lintas peradaban.',
  },
  {
    id: 7,
    name: 'The Destroyer',
    tagline: 'Release · Catharsis · Renewal',
    description:
      'Tidak takut mempertanyakan sistem yang sudah ada — termasuk ekspektasi orang tua, jalur karier "aman", atau versi dirimu yang sudah tidak relevan. Kehancuran yang kamu bawa selalu membuka ruang untuk sesuatu yang lebih jujur.',
    motif: '✕',
    exemplar: 'Nelson Mandela',
    exemplarNote: '27 tahun penjara, lalu meruntuhkan apartheid dan membangun ulang sebuah bangsa.',
  },
  {
    id: 8,
    name: 'The Creator',
    tagline: 'Vision · Craft · Originality',
    description:
      'Ada sesuatu di dalam kepala yang harus diwujudkan — entah itu tulisan, desain, kode, atau musik. Kamu tidak puas hanya mengonsumsi; kamu perlu meninggalkan sesuatu yang benar-benar milikmu.',
    motif: '◎',
    exemplar: 'Hayao Miyazaki',
    exemplarNote: 'Studio Ghibli digambar tangan frame demi frame — visi yang menolak kompromi.',
  },
  {
    id: 9,
    name: 'The Magician',
    tagline: 'Insight · Transformation · Catalyst',
    description:
      'Kamu melihat pola di tempat orang lain hanya melihat kekacauan. Satu percakapan denganmu bisa mengubah cara seseorang melihat sesuatu — bukan karena kamu menggurui, tapi karena kamu menghubungkan titik-titik yang tidak terlihat orang lain.',
    motif: '✦',
    exemplar: 'Leonardo da Vinci',
    exemplarNote: 'Polymath yang menjembatani seni, anatomi, dan rekayasa lima abad sebelum waktunya.',
  },
  {
    id: 10,
    name: 'The Ruler',
    tagline: 'Order · Responsibility · Legacy',
    description:
      'Secara alami kamu yang pegang kendali — bukan karena ingin berkuasa, tapi karena tidak tahan melihat sesuatu berjalan tanpa arah. Kamu sudah memikirkan dampak jangka panjang saat orang lain masih fokus hari ini.',
    motif: '◰',
    exemplar: 'Alexander the Great',
    exemplarNote: 'Menguasai hampir seluruh dunia yang dikenal sebelum usia 32 — visi jangka panjang yang tidak ada tandingannya.',
  },
  {
    id: 11,
    name: 'The Sage',
    tagline: 'Truth · Analysis · Wisdom',
    description:
      'Tidak bisa menerima sesuatu begitu saja — harus dipahami sampai ke akarnya. Kamu lebih percaya pada data dan argumen yang solid daripada opini mayoritas, dan itu yang membuat analisismu tajam.',
    motif: '◉',
    exemplar: 'Marie Curie',
    exemplarNote: 'Satu-satunya orang yang memenangkan Nobel di dua bidang sains yang berbeda.',
  },
  {
    id: 12,
    name: 'The Fool',
    tagline: 'Play · Presence · Joy',
    description:
      'Di tengah semua tekanan akademik dan ekspektasi, kamu yang mengingatkan bahwa tidak semua hal harus serius. Kamu hadir penuh di momen sekarang — dan itu justru yang membuat orang tertarik padamu.',
    motif: '◍',
    exemplar: 'Diogenes of Sinope',
    exemplarNote: 'Hidup di dalam tong, punya nol harta — tapi dilaporkan jadi orang paling bahagia di Athena.',
  },
]

export interface Pricing {
  name: string
  tokens: number
  price: string
  perToken: string
  highlight: boolean
  note: string
}

export const pricing: Pricing[] = [
  {
    name: 'Starter',
    tokens: 1,
    price: 'Rp 200.000',
    perToken: 'Rp 200.000 / token',
    highlight: true,
    note: 'Paling banyak dipilih untuk coba pertama kali.',
  },
  {
    name: 'Basic',
    tokens: 3,
    price: 'Rp 500.000',
    perToken: 'Rp 166.667 / token',
    highlight: false,
    note: 'Cocok untuk dibagi dengan kakak/adik.',
  },
  {
    name: 'Value',
    tokens: 5,
    price: 'Rp 800.000',
    perToken: 'Rp 160.000 / token',
    highlight: false,
    note: 'Untuk yang ingin retake setelah jeda beberapa bulan.',
  },
  {
    name: 'Pro',
    tokens: 10,
    price: 'Rp 1.200.000',
    perToken: 'Rp 120.000 / token',
    highlight: true,
    note: 'Best value — untuk kelas, kelompok belajar, atau keluarga.',
  },
]

export interface ResultBlock {
  title: string
  body: string
  tag: string
}

export const resultBlocks: ResultBlock[] = [
  {
    tag: '01',
    title: 'Signature Title & Description',
    body: 'Identitas psikologis berbasis archetype PMAI, ditambatkan ke jurnal akademis yang relevan dengan profilmu.',
  },
  {
    tag: '02',
    title: 'Learning Style',
    body: 'Cara belajar yang paling natural untuk otakmu, plus lingkungan yang membuatmu paling produktif.',
  },
  {
    tag: '03',
    title: 'Detailed Analysis',
    body: 'Kekuatan, titik buta, dan dinamika yang muncul saat kamu bekerja dalam tim.',
  },
  {
    tag: '04',
    title: 'Career Pathing',
    body: 'Industri yang paling cocok, prospek peran, risiko otomasi, dan struktur gaji yang realistis.',
  },
  {
    tag: '05',
    title: 'Student Recommendations',
    body: 'Ekstrakurikuler, kompetisi, dan tindakan kecil yang relevan untuk kamu kerjakan minggu ini.',
  },
  {
    tag: '06',
    title: 'Personal Growth',
    body: 'Area pengembangan diri jangka panjang dan rekomendasi buku yang ditujukan untuk profilmu.',
  },
]
