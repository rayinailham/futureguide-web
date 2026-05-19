<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { gsap } from 'gsap'

const root = ref<HTMLElement | null>(null)
const openIndex = ref<number | null>(0)
let ctx: gsap.Context | null = null

const items = [
  {
    q: 'Apa bedanya FutureGuide dengan kuis kepribadian biasa di internet?',
    a: 'Kuis di internet biasanya hasil opini tanpa basis ilmiah. FutureGuide pakai tiga instrumen psikometri yang sudah tervalidasi lintas budaya — RIASEC, OCEAN, dan VIA-IS — totalnya 200 item. Hasilnya juga ditambatkan ke 121 jurnal akademis, jadi setiap interpretasi bisa dirujuk balik ke risetnya.',
  },
  {
    q: 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan assessment?',
    a: 'Rata-rata 35–55 menit. Tidak ada timer, jadi kamu bisa berhenti sejenak. Yang penting jawab dengan jujur — bukan jawaban yang kamu pikir "benar" atau ingin orang lain dengar.',
  },
  {
    q: 'Apakah hasilnya akurat untuk pelajar SMA atau anak SMP?',
    a: 'Instrumennya didesain untuk usia remaja akhir ke atas (14+). Untuk pelajar SMA dan mahasiswa, hasilnya sangat relevan untuk pemilihan jurusan dan eksplorasi karier. Untuk anak SMP awal, sebaiknya dipakai sebagai bahan diskusi dengan guru BK atau orang tua, bukan keputusan final.',
  },
  {
    q: 'Apakah bisa retake atau ulang assessment-nya?',
    a: 'Bisa. Setiap token = 1 sesi assessment lengkap. Banyak pengguna mengulang setelah 6–12 bulan untuk melihat bagaimana kepribadian dan minat mereka berkembang. Riset menunjukkan profil OCEAN bisa bergeser sedikit di usia 16–25 karena masa pembentukan identitas.',
  },
  {
    q: 'Data jawabanku aman? Privasi laporan bagaimana?',
    a: 'Jawaban kamu hanya digunakan untuk menghasilkan laporan kamu sendiri. Laporan tidak dibagikan ke pihak ketiga. Kamu yang memutuskan apakah mau membagikan share link laporan ke orang tua, guru BK, atau teman.',
  },
  {
    q: 'Bagaimana cara membayar dan apakah token-nya hangus?',
    a: 'Pembayaran via QRIS yang bisa pakai DANA, GoPay, OVO, ShopeePay, atau mobile banking. Token tidak ada masa kedaluwarsa — beli sekarang, pakai bulan depan juga tidak masalah.',
  },
  {
    q: 'Hasilnya bisa di-print atau di-PDF?',
    a: 'Bisa. Setiap laporan punya tombol export PDF dan share link publik. PDF cocok untuk dilampirkan ke portofolio kuliah, share link cocok untuk diskusi cepat dengan konselor atau orang tua.',
  },
]

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

async function onEnter(el: Element) {
  const target = el as HTMLElement
  // measure natural height
  target.style.height = 'auto'
  const h = target.offsetHeight
  target.style.height = '0px'
  await nextTick()
  gsap.to(target, {
    height: h,
    opacity: 1,
    duration: 0.55,
    ease: 'expo.out',
    onComplete: () => {
      target.style.height = 'auto'
    },
  })
}

function onLeave(el: Element, done: () => void) {
  const target = el as HTMLElement
  target.style.height = `${target.offsetHeight}px`
  gsap.to(target, {
    height: 0,
    opacity: 0,
    duration: 0.4,
    ease: 'expo.inOut',
    onComplete: () => done(),
  })
}

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '[data-faq-row]',
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root.value,
          start: 'top 75%',
        },
      },
    )
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" id="faq" class="relative px-6 py-24 md:py-36">
    <div class="mx-auto max-w-[1320px]">
      <div class="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
        <div class="md:col-span-7">
          <span class="pill mb-6 inline-flex">FAQ</span>
          <h2 class="display text-[clamp(2rem,5vw,4.25rem)] text-[var(--color-ink-900)]">
            Pertanyaan yang
            <span class="serif-italic text-[var(--color-blue-600)]">paling sering</span>
            ditanya.
          </h2>
        </div>
        <p class="md:col-span-5 max-w-md text-base leading-relaxed text-[var(--color-ink-600)]">
          Kalau pertanyaanmu belum ada di sini, kamu bisa email
          <a href="mailto:hello@futureguide.id" class="text-[var(--color-blue-600)] underline-offset-4 hover:underline">hello@futureguide.id</a>
          dan tim kami akan balas di hari yang sama.
        </p>
      </div>

      <div class="border-y hairline">
        <div
          v-for="(item, i) in items"
          :key="i"
          data-faq-row
          class="border-b hairline last:border-b-0"
        >
          <button
            type="button"
            @click="toggle(i)"
            class="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300 md:py-8"
            :aria-expanded="openIndex === i"
          >
            <span class="flex items-start gap-5">
              <span
                class="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-blue-600)]"
              >
                / {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span
                class="text-lg font-medium tracking-tight text-[var(--color-ink-900)] md:text-2xl"
              >
                {{ item.q }}
              </span>
            </span>

            <!-- Plus / Minus icon (morphs) -->
            <span
              class="relative mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border hairline bg-[var(--color-paper)] transition-transform duration-500"
              :class="openIndex === i ? 'rotate-180 border-[var(--color-blue-500)] bg-[color-mix(in_oklab,_var(--color-blue-500)_8%,transparent)]' : ''"
              style="transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1)"
            >
              <span class="absolute h-[1.5px] w-3 rounded-full bg-[var(--color-ink-900)]"></span>
              <span
                class="absolute h-[1.5px] w-3 rounded-full bg-[var(--color-ink-900)] transition-transform duration-500"
                :class="openIndex === i ? 'rotate-0 opacity-0' : 'rotate-90'"
                style="transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1)"
              ></span>
            </span>
          </button>

          <Transition
            :css="false"
            @enter="onEnter"
            @leave="onLeave"
          >
            <div
              v-if="openIndex === i"
              class="overflow-hidden"
              style="height: 0; opacity: 0;"
            >
              <div class="grid gap-4 pb-8 md:grid-cols-12 md:gap-8">
                <div class="md:col-span-2"></div>
                <p class="md:col-span-9 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink-600)] md:text-[17px]">
                  {{ item.a }}
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        <span class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          Update terakhir Mei 2026
        </span>
      </div>
    </div>
  </section>
</template>
