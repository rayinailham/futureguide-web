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
  <section ref="root" id="results" class="relative px-6 py-24 md:py-36">
    <div class="mx-auto max-w-[1320px]">
      <!-- Section header -->
      <div class="mb-14 grid gap-8 md:grid-cols-12">
        <div class="md:col-span-7">
          <span class="pill mb-6 inline-flex">Hasil & Basis Ilmiah</span>
          <h2 class="display text-[clamp(2rem,5vw,4.25rem)] text-[var(--color-ink-900)]">
            Laporan yang
            <span class="serif-italic text-[var(--color-blue-600)]">bisa ditelusuri</span>,
            bukan opini AI.
          </h2>
        </div>
        <p class="md:col-span-5 self-end max-w-md text-base leading-relaxed text-[var(--color-ink-600)]">
          Setiap interpretasi ditambatkan ke jurnal akademis spesifik melalui
          sistem RAG. Saat sistem RAG menunjukkan "kamu condong Investigative", ia harus bisa
          menunjukkan riset yang mendukungnya.
        </p>
      </div>

      <!-- 6 result blocks as a clean editorial list (no card overuse) -->
      <div data-results-list class="border-y hairline">
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
      <div data-rag-grid class="mt-20 grid gap-5 md:grid-cols-12">
        <article data-rag-card class="bezel md:col-span-5">
          <div class="bezel-inner relative h-full overflow-hidden p-8 md:p-10">
            <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
              Retrieval-Augmented Generation
            </span>
            <h3 class="display mt-4 text-3xl text-[var(--color-ink-900)] md:text-4xl">
              <span class="text-[var(--color-blue-600)]">121</span> jurnal
              peer-reviewed
            </h3>
            <p class="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-ink-600)]">
              Mesin analisis menarik konteks dari 121 studi tentang RIASEC, OCEAN,
              VIA-IS, serta hubungan lintas ketiganya — bukan dari pengetahuan generik.
            </p>

            <div class="mt-7 flex flex-col gap-2">
              <div class="flex items-center justify-between rounded-xl border hairline px-4 py-2.5">
                <span class="font-mono text-[11px] text-[var(--color-ink-500)]">Faber & Mayer 2009</span>
                <span class="font-mono text-[10px] text-[var(--color-blue-600)]">retrieved</span>
              </div>
              <div class="flex items-center justify-between rounded-xl border hairline px-4 py-2.5">
                <span class="font-mono text-[11px] text-[var(--color-ink-500)]">Holland 1997</span>
                <span class="font-mono text-[10px] text-[var(--color-blue-600)]">retrieved</span>
              </div>
              <div class="flex items-center justify-between rounded-xl border hairline px-4 py-2.5">
                <span class="font-mono text-[11px] text-[var(--color-ink-500)]">Peterson & Seligman 2004</span>
                <span class="font-mono text-[10px] text-[var(--color-blue-600)]">retrieved</span>
              </div>
            </div>
          </div>
        </article>

        <article data-rag-card class="bezel md:col-span-7">
          <div class="bezel-inner relative h-full overflow-hidden p-8 md:p-10">
            <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
              Chat AI Pasca-Assessment
            </span>
            <h3 class="display mt-4 max-w-md text-3xl text-[var(--color-ink-900)] md:text-4xl">
              Diskusi yang tahu konteks
              <span class="serif-italic text-[var(--color-blue-600)]">profilmu</span>.
            </h3>

            <!-- Mini chat preview -->
            <div class="mt-7 grid gap-3 md:max-w-xl">
              <div
                class="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-[var(--color-ink-900)] px-4 py-3 text-sm text-[var(--color-paper)]"
              >
                Kalau aku Investigative + Openness tinggi, prospek di research role
                gimana?
              </div>
              <div
                class="max-w-[92%] rounded-2xl rounded-bl-sm border hairline bg-[color-mix(in_oklab,_var(--color-blue-500)_3%,transparent)] px-4 py-3 text-sm text-[var(--color-ink-800)]"
              >
                <span class="font-medium text-[var(--color-ink-900)]">FutureGuide AI · </span>
                Profil ini cocok untuk peran research analyst & R&D engineer.
                Berdasarkan studi McCrae & Costa 1997, Openness tinggi memprediksi
                ketahanan pada pekerjaan eksploratif yang ambigu.
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <span class="rounded-full border hairline px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-500)]">
                    ref: McCrae 1997
                  </span>
                  <span class="rounded-full border hairline px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-500)]">
                    ref: Holland 1997
                  </span>
                </div>
              </div>
            </div>

            <p class="mt-7 max-w-md text-xs leading-relaxed text-[var(--color-ink-500)]">
              SSE streaming · 1 sesi chat per assessment · grounded ke 121 jurnal
              dan hasil pribadimu.
            </p>
          </div>
        </article>

        <!-- Flow + tech -->
        <article data-rag-card class="bezel md:col-span-7">
          <div class="bezel-inner relative h-full overflow-hidden p-8 md:p-10">
            <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
              Cara Kerjanya
            </span>
            <h3 class="display mt-4 text-3xl text-[var(--color-ink-900)] md:text-4xl">
              Dari daftar sampai ngobrol dengan AI, semuanya
              <span class="serif-italic text-[var(--color-blue-600)]">dalam satu sore</span>.
            </h3>

            <ol data-flow class="mt-7 space-y-3">
              <li
                v-for="(item, i) in flow"
                :key="item.step"
                data-flow-step
                class="flex items-center gap-4 rounded-xl border hairline bg-[var(--color-paper)] px-4 py-3"
              >
                <span
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-blue-500)] font-mono text-[11px] font-medium text-white"
                >
                  {{ String(i + 1).padStart(2, '0') }}
                </span>
                <span class="text-sm text-[var(--color-ink-800)] md:text-base">{{ item.step }}</span>
                <span class="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-400)]">
                  {{ item.tag }}
                </span>
              </li>
            </ol>
          </div>
        </article>

        <article data-rag-card class="bezel md:col-span-5">
          <div class="bezel-inner relative h-full overflow-hidden p-8 md:p-10">
            <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
              Fun Facts
            </span>
            <h3 class="display mt-4 text-3xl text-[var(--color-ink-900)] md:text-4xl">
              Yang
              <span class="serif-italic text-[var(--color-blue-600)]">jarang diceritakan</span>
              tentang pemetaan karier.
            </h3>

            <ul class="mt-7 space-y-4">
              <li
                v-for="(item, i) in funFacts"
                :key="i"
                class="group relative border-t hairline pt-4 first:border-t-0 first:pt-0"
              >
                <div class="mb-2 flex items-center gap-3">
                  <span
                    class="flex h-6 items-center rounded-full border hairline bg-[color-mix(in_oklab,_var(--color-blue-500)_8%,transparent)] px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-blue-700)]"
                  >
                    {{ item.tag }}
                  </span>
                  <span class="font-mono text-[10px] text-[var(--color-ink-400)]">
                    0{{ i + 1 }} / 0{{ funFacts.length }}
                  </span>
                </div>
                <p class="text-sm leading-relaxed text-[var(--color-ink-700)]">
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
