<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { resultBlocks } from '../data/content'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '[data-result-row]',
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '[data-results-list]',
          start: 'top 75%',
        },
      },
    )

    gsap.fromTo(
      '[data-rag-card]',
      { y: 30, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '[data-rag-grid]',
          start: 'top 75%',
        },
      },
    )

    gsap.fromTo(
      '[data-flow-step]',
      { x: -16, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '[data-flow]',
          start: 'top 80%',
        },
      },
    )
  }, root.value)
})

onUnmounted(() => ctx?.revert())

const flow = [
  { step: 'Daftar atau masuk pakai akun Google', tag: 'Mulai' },
  { step: 'Pilih paket token sesuai kebutuhan', tag: 'Token' },
  { step: 'Baca briefing — santai, tidak ada batas waktu', tag: 'Briefing' },
  { step: 'Jawab 200 pertanyaan dengan jujur', tag: 'Assessment' },
  { step: 'Tunggu beberapa menit sambil AI menganalisis', tag: 'Analisis' },
  { step: 'Buka laporan & ngobrol langsung dengan AI', tag: 'Hasil' },
]

const funFacts = [
  {
    fact: 'Holland (1997) menemukan bahwa kecocokan minat dengan pekerjaan memprediksi kepuasan karier hingga 5x lebih kuat daripada gaji.',
    tag: 'Career Fit',
  },
  {
    fact: 'Otak prefrontal cortex baru selesai berkembang di usia ~25 — pemetaan diri lebih dini membantu mengurangi keputusan karier impulsif.',
    tag: 'Neuro',
  },
  {
    fact: 'Studi VIA menunjukkan menggunakan top-5 character strengths setiap hari berkorelasi dengan penurunan gejala depresi.',
    tag: 'Wellbeing',
  },
  {
    fact: 'Tipe Investigative + Openness tinggi punya kecenderungan dua kali lebih tinggi pindah ke peran riset dalam 10 tahun pertama karier.',
    tag: 'Trajectory',
  },
  {
    fact: '85% pelajar Indonesia memilih jurusan kuliah tanpa pernah ikut asesmen psikometri formal — lebih banyak pakai feeling dan tren.',
    tag: 'Realita',
  },
]
</script>

<template>
  <section ref="root" id="results" class="relative px-5 py-16 sm:px-6 sm:py-24 md:py-36">
    <span class="section-marker">04 / Results</span>
    <div class="mx-auto max-w-[1320px]">
      <!-- Section header -->
      <div class="mb-10 grid gap-5 sm:gap-8 md:mb-14 md:grid-cols-12">
        <div class="md:col-span-7">
          <span class="pill mb-4 inline-flex md:mb-6">Hasil & Basis Ilmiah</span>
          <h2 class="display text-[clamp(1.75rem,7vw,4.25rem)] text-[var(--color-ink-900)]">
            Laporan yang
            <span class="serif-italic text-[var(--color-blue-600)]">bisa ditelusuri</span>,
            bukan opini AI.
          </h2>
        </div>
        <p class="md:col-span-5 self-end max-w-md text-sm leading-relaxed text-[var(--color-ink-600)] md:text-base">
          Setiap interpretasi ditambatkan ke jurnal akademis spesifik melalui
          sistem RAG. Saat sistem RAG menunjukkan "kamu condong Investigative", ia harus bisa
          menunjukkan riset yang mendukungnya.
        </p>
      </div>

      <!-- 6 result blocks — 2-col compact tiles on mobile, editorial list on md+ -->
      <!-- Mobile: 2-col compact tile grid -->
      <div data-results-list class="grid grid-cols-2 gap-3 md:hidden">
        <div
          v-for="b in resultBlocks"
          :key="`m-${b.tag}`"
          data-result-row
          class="rounded-2xl border hairline bg-[var(--color-paper)] p-4"
        >
          <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-blue-600)]">
            / {{ b.tag }}
          </span>
          <h3 class="mt-2.5 text-[15px] font-medium leading-tight tracking-tight text-[var(--color-ink-900)]">
            {{ b.title }}
          </h3>
          <p class="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-600)]">
            {{ b.body }}
          </p>
        </div>
      </div>

      <!-- Desktop: editorial list -->
      <div class="hidden border-y hairline md:block">
        <div
          v-for="(b, i) in resultBlocks"
          :key="b.tag"
          data-result-row
          class="grid gap-4 border-b hairline py-6 md:grid-cols-12 md:items-center md:gap-8 md:py-8 last:border-b-0"
        >
          <span class="md:col-span-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-blue-600)]">
            / {{ b.tag }}
          </span>
          <h3 class="md:col-span-4 text-xl font-medium tracking-tight text-[var(--color-ink-900)] md:text-2xl">
            {{ b.title }}
          </h3>
          <p class="md:col-span-6 text-sm leading-relaxed text-[var(--color-ink-600)] md:text-base">
            {{ b.body }}
          </p>
          <span class="md:col-span-1 hidden font-mono text-[11px] text-[var(--color-ink-400)] md:inline-flex md:justify-end">
            0{{ i + 1 }}/06
          </span>
        </div>
      </div>

      <!-- Scientific basis: RAG + Closed taxonomy + Atomic submission -->
      <div data-rag-grid class="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-12 md:gap-5">
        <article data-rag-card class="bezel md:col-span-5">
          <div class="bezel-inner relative h-full overflow-hidden p-4 sm:p-7 md:p-10">
            <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:tracking-[0.22em] md:text-[10px]">
              RAG
            </span>
            <h3 class="display mt-2.5 text-xl text-[var(--color-ink-900)] sm:mt-4 sm:text-3xl md:text-4xl">
              <span class="text-[var(--color-blue-600)]">121</span> jurnal
              peer-reviewed
            </h3>
            <p class="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-600)] sm:mt-4 sm:text-sm md:max-w-sm">
              Mesin analisis menarik konteks dari 121 studi tentang RIASEC, OCEAN,
              VIA-IS — bukan dari pengetahuan generik.
            </p>

            <!-- Retrieved chips (full list on md+, summary on mobile) -->
            <div class="mt-4 flex flex-col gap-1.5 sm:mt-7 sm:gap-2">
              <div class="flex items-center justify-between rounded-lg border hairline px-2.5 py-1.5 sm:rounded-xl sm:px-4 sm:py-2.5">
                <span class="font-mono text-[10px] text-[var(--color-ink-500)] sm:text-[11px]">Holland 1997</span>
                <span class="font-mono text-[9px] text-[var(--color-blue-600)] sm:text-[10px]">retrieved</span>
              </div>
              <div class="hidden flex-col gap-2 sm:flex">
                <div class="flex items-center justify-between rounded-xl border hairline px-4 py-2.5">
                  <span class="font-mono text-[11px] text-[var(--color-ink-500)]">Faber & Mayer 2009</span>
                  <span class="font-mono text-[10px] text-[var(--color-blue-600)]">retrieved</span>
                </div>
                <div class="flex items-center justify-between rounded-xl border hairline px-4 py-2.5">
                  <span class="font-mono text-[11px] text-[var(--color-ink-500)]">Peterson & Seligman 2004</span>
                  <span class="font-mono text-[10px] text-[var(--color-blue-600)]">retrieved</span>
                </div>
              </div>
              <span class="font-mono text-[10px] text-[var(--color-ink-400)] sm:hidden">+ 120 lainnya</span>
            </div>
          </div>
        </article>

        <!-- Flow + tech (full-width on mobile, span both cols) -->
        <article data-rag-card class="bezel col-span-2 md:col-span-7">
          <div class="bezel-inner relative h-full overflow-hidden p-5 sm:p-7 md:p-10">
            <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
              Cara Kerjanya
            </span>
            <h3 class="display mt-3 text-2xl text-[var(--color-ink-900)] sm:mt-4 sm:text-3xl md:text-4xl">
              Dari daftar sampai ngobrol dengan AI, semuanya
              <span class="serif-italic text-[var(--color-blue-600)]">dalam satu sore</span>.
            </h3>

            <ol data-flow class="mt-5 grid gap-2 sm:mt-7 sm:flex sm:flex-col sm:space-y-3 sm:gap-0">
              <li
                v-for="(item, i) in flow"
                :key="item.step"
                data-flow-step
                class="flex items-center gap-2.5 rounded-xl border hairline bg-[var(--color-paper)] px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3"
              >
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-blue-500)] font-mono text-[10px] font-medium text-white sm:h-7 sm:w-7 sm:text-[11px]"
                >
                  {{ String(i + 1).padStart(2, '0') }}
                </span>
                <span class="text-[12px] leading-snug text-[var(--color-ink-800)] sm:text-sm md:text-base">{{ item.step }}</span>
                <span class="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-400)] sm:inline">
                  {{ item.tag }}
                </span>
              </li>
            </ol>
          </div>
        </article>

        <article data-rag-card class="bezel col-span-2 md:col-span-5">
          <div class="bezel-inner relative h-full overflow-hidden p-5 sm:p-7 md:p-10">
            <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
              Fun Facts
            </span>
            <h3 class="display mt-3 text-2xl text-[var(--color-ink-900)] sm:mt-4 sm:text-3xl md:text-4xl">
              Yang
              <span class="serif-italic text-[var(--color-blue-600)]">jarang diceritakan</span>
              tentang pemetaan karier.
            </h3>

            <ul class="mt-5 space-y-3 sm:mt-7 sm:space-y-4">
              <li
                v-for="(item, i) in funFacts"
                :key="i"
                class="group relative border-t hairline pt-3 first:border-t-0 first:pt-0 sm:pt-4"
              >
                <div class="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-3">
                  <span
                    class="flex h-5 items-center rounded-full border hairline bg-[color-mix(in_oklab,_var(--color-blue-500)_8%,transparent)] px-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-blue-700)] sm:h-6 sm:px-2.5 sm:text-[10px] sm:tracking-[0.18em]"
                  >
                    {{ item.tag }}
                  </span>
                  <span class="font-mono text-[10px] text-[var(--color-ink-400)]">
                    0{{ i + 1 }} / 0{{ funFacts.length }}
                  </span>
                </div>
                <p class="text-[13px] leading-relaxed text-[var(--color-ink-700)] sm:text-sm">
                  {{ item.fact }}
                </p>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
