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
}

export const archetypes: Archetype[] = [
  {
    id: 1,
    name: 'The Innocent',
    tagline: 'Hope · Optimism · Trust',
    description:
      'Mencari keamanan emosional dan dunia yang lebih sederhana. Termotivasi oleh harapan dan kepercayaan pada kebaikan.',
    motif: '◷',
  },
  {
    id: 2,
    name: 'The Orphan',
    tagline: 'Realism · Empathy · Survival',
    description:
      'Memahami dunia melalui pengalaman langsung. Membangun solidaritas dari realisme yang membumi.',
    motif: '◐',
  },
  {
    id: 3,
    name: 'The Warrior',
    tagline: 'Discipline · Courage · Drive',
    description:
      'Bertarung untuk apa yang penting. Disiplin, fokus, dan tidak mudah menyerah saat menghadapi tantangan.',
    motif: '◣',
  },
  {
    id: 4,
    name: 'The Caregiver',
    tagline: 'Compassion · Service · Care',
    description:
      'Menemukan makna dengan merawat orang lain. Sumber stabilitas bagi komunitas di sekitarnya.',
    motif: '○',
  },
  {
    id: 5,
    name: 'The Seeker',
    tagline: 'Autonomy · Curiosity · Quest',
    description:
      'Tidak betah di zona nyaman. Mencari kebenaran dan jati diri lewat perjalanan, bukan jalur yang sudah dipetakan.',
    motif: '◇',
  },
  {
    id: 6,
    name: 'The Lover',
    tagline: 'Connection · Passion · Beauty',
    description:
      'Menempatkan hubungan, estetika, dan pengalaman sensoris sebagai bahasa utama untuk memahami hidup.',
    motif: '❀',
  },
  {
    id: 7,
    name: 'The Destroyer',
    tagline: 'Release · Catharsis · Renewal',
    description:
      'Membongkar yang tidak lagi melayani. Hadir di titik balik untuk membuat ruang bagi sesuatu yang baru.',
    motif: '✕',
  },
  {
    id: 8,
    name: 'The Creator',
    tagline: 'Vision · Craft · Originality',
    description:
      'Mewujudkan ide menjadi bentuk. Disiplin estetik dan dorongan untuk meninggalkan jejak yang otentik.',
    motif: '◎',
  },
  {
    id: 9,
    name: 'The Magician',
    tagline: 'Insight · Transformation · Catalyst',
    description:
      'Mengubah situasi melalui pemahaman pola. Mempertemukan ide-ide yang tampak terpisah menjadi sintesis baru.',
    motif: '✦',
  },
  {
    id: 10,
    name: 'The Ruler',
    tagline: 'Order · Responsibility · Legacy',
    description:
      'Mengambil tanggung jawab untuk membangun struktur dan stabilitas. Berpikir dalam horizon jangka panjang.',
    motif: '◰',
  },
  {
    id: 11,
    name: 'The Sage',
    tagline: 'Truth · Analysis · Wisdom',
    description:
      'Mendekati dunia melalui pertanyaan tajam dan refleksi panjang. Otoritasnya adalah kejernihan berpikir.',
    motif: '◉',
  },
  {
    id: 12,
    name: 'The Fool',
    tagline: 'Play · Presence · Joy',
    description:
      'Mengingatkan bahwa hidup butuh ringan. Membuka ruang main, ironi, dan kehadiran penuh di momen sekarang.',
    motif: '◍',
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
