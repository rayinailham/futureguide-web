<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

const root = ref<HTMLElement | null>(null)
const typedText = ref('')
const showAnswer = ref(false)
let ctx: gsap.Context | null = null
let typeTl: gsap.core.Timeline | null = null

const userMsg = 'Aku Investigative + Openness tinggi, prospek di research role gimana?'

const sampleQuestions = [
  'Jurusan apa yang paling cocok dengan archetype-ku?',
  'Bagaimana cara mengembangkan top-5 character strength?',
  'Mana karier yang cocok antara data scientist & UX researcher?',
  'Apa kelemahan profilku yang perlu diwaspadai?',
  'Studi apa yang mendukung interpretasi RIASEC-ku?',
]

const features = [
  { tag: 'Konteks', label: 'Tahu hasil RIASEC + OCEAN + VIA-IS kamu' },
  { tag: 'Grounded', label: 'Setiap jawaban menyebut studi acuan' },
  { tag: 'Streaming', label: 'Respons mengalir real-time, bukan tunggu lama' },
  { tag: 'Privat', label: '1 sesi per assessment, hanya kamu yang akses' },
]

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '[data-chat-fade]',
      { y: 36, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root.value,
          start: 'top 70%',
          onEnter: () => startTyping(),
        },
      },
    )

    gsap.fromTo(
      '[data-chat-feature]',
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '[data-chat-features]',
          start: 'top 80%',
        },
      },
    )
  }, root.value)
})

function startTyping() {
  if (typeTl) return
  typeTl = gsap.timeline({ delay: 0.4 })
  typeTl.to(
    { i: 0 },
    {
      i: userMsg.length,
      duration: 1.6,
      ease: 'none',
      onUpdate() {
        const idx = Math.round(this.targets()[0].i)
        typedText.value = userMsg.slice(0, idx)
      },
      onComplete() {
        setTimeout(() => (showAnswer.value = true), 350)
      },
    },
  )
}

onUnmounted(() => {
  ctx?.revert()
  typeTl?.kill()
})
</script>

<template>
  <section
    ref="root"
    id="chat"
    class="relative px-5 py-16 sm:px-6 sm:py-24 md:py-36"
  >
    <span class="section-marker">05 / Chat AI</span>

    <div class="mx-auto max-w-[1320px]">
      <!-- Header -->
      <div class="mb-10 grid gap-5 sm:gap-8 md:mb-14 md:grid-cols-12">
        <div class="md:col-span-7">
          <span data-chat-fade class="pill mb-4 inline-flex md:mb-6">
            <span class="relative flex h-1.5 w-1.5">
              <span class="absolute inset-0 animate-ping rounded-full bg-[var(--color-blue-500)] opacity-60"></span>
              <span class="relative h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
            </span>
            <span>Chat AI Pasca-Assessment</span>
          </span>
          <h2
            data-chat-fade
            class="display text-[clamp(1.75rem,7vw,4.25rem)] text-[var(--color-ink-900)]"
          >
            Selesai assessment? Lanjut
            <span class="serif-italic text-[var(--color-blue-600)]">ngobrol</span>
            sama AI-nya.
          </h2>
        </div>
        <p
          data-chat-fade
          class="md:col-span-5 self-end max-w-md text-sm leading-relaxed text-[var(--color-ink-600)] md:text-base"
        >
          Bukan chatbot generik. AI sudah baca laporanmu — kamu bisa bertanya
          soal jurusan, karier, atau interpretasi skor, dan dia jawab pakai data
          kamu sendiri plus rujukan jurnal.
        </p>
      </div>

      <!-- Main showcase: chat preview + sidebar -->
      <div class="grid gap-4 md:grid-cols-12 md:gap-5">
        <!-- Chat preview card -->
        <article data-chat-fade class="bezel md:col-span-7">
          <div class="bezel-inner relative h-full overflow-hidden p-5 sm:p-7 md:p-9">
            <!-- Window header -->
            <div class="flex items-center justify-between border-b hairline pb-3 sm:pb-4">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-[var(--color-blue-500)]"></span>
                <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-500)] sm:text-[11px] sm:tracking-[0.22em]">
                  FutureGuide AI · sesi aktif
                </span>
              </div>
              <span class="font-mono text-[9px] text-[var(--color-blue-600)] sm:text-[10px]">
                ● live
              </span>
            </div>

            <!-- Conversation -->
            <div class="mt-5 flex flex-col gap-3 sm:mt-7 sm:gap-4">
              <!-- User bubble (typing) -->
              <div class="flex justify-end">
                <div
                  class="max-w-[88%] rounded-2xl rounded-br-sm bg-[var(--color-ink-900)] px-3.5 py-2.5 text-[13px] leading-relaxed text-[var(--color-paper)] sm:px-4 sm:py-3 sm:text-sm"
                >
                  {{ typedText }}<span
                    v-if="typedText.length < userMsg.length"
                    class="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-[var(--color-paper)]"
                  ></span>
                </div>
              </div>

              <!-- AI response -->
              <Transition
                enter-active-class="transition duration-700 ease-out"
                enter-from-class="opacity-0 translate-y-3"
                enter-to-class="opacity-100 translate-y-0"
              >
                <div v-if="showAnswer" class="flex flex-col gap-2">
                  <div
                    class="max-w-[92%] rounded-2xl rounded-bl-sm border hairline bg-[color-mix(in_oklab,_var(--color-blue-500)_4%,transparent)] px-3.5 py-3 text-[13px] leading-relaxed text-[var(--color-ink-800)] sm:px-4 sm:py-3.5 sm:text-sm"
                  >
                    <span class="font-medium text-[var(--color-ink-900)]">FutureGuide AI · </span>
                    Profil ini cocok untuk peran <strong>research analyst</strong>,
                    <strong>R&amp;D engineer</strong>, atau <strong>UX researcher</strong>.
                    McCrae &amp; Costa (1997) menemukan Openness tinggi memprediksi
                    ketahanan pada pekerjaan eksploratif yang ambigu — tepat untuk
                    riset jangka panjang.
                    <div class="mt-2.5 flex flex-wrap gap-1.5">
                      <span class="rounded-full border hairline bg-[var(--color-paper)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-600)]">
                        ref: McCrae &amp; Costa 1997
                      </span>
                      <span class="rounded-full border hairline bg-[var(--color-paper)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-600)]">
                        ref: Holland 1997
                      </span>
                    </div>
                  </div>

                  <!-- Followup chip -->
                  <div class="ml-2 flex items-center gap-2 font-mono text-[10px] text-[var(--color-ink-400)]">
                    <span class="h-1 w-1 rounded-full bg-[var(--color-blue-500)] animate-pulse"></span>
                    <span>AI menyarankan pertanyaan lanjutan…</span>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Input mockup -->
            <div class="mt-6 flex items-center gap-2 rounded-2xl border hairline bg-[var(--color-paper)] px-3 py-2.5 sm:mt-8 sm:px-4 sm:py-3">
              <span class="text-[12px] text-[var(--color-ink-400)] sm:text-sm">
                Ketik pertanyaanmu…
              </span>
              <span class="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-[var(--color-paper)] sm:h-8 sm:w-8">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </article>

        <!-- Right column: features + sample questions -->
        <div class="grid gap-4 md:col-span-5 md:gap-5">
          <!-- Features -->
          <article data-chat-fade class="bezel">
            <div data-chat-features class="bezel-inner p-5 sm:p-7">
              <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
                Yang bikin beda
              </span>

              <ul class="mt-4 grid gap-3 sm:mt-5 sm:gap-3.5">
                <li
                  v-for="f in features"
                  :key="f.tag"
                  data-chat-feature
                  class="flex items-start gap-3 border-t hairline pt-3 first:border-t-0 first:pt-0 sm:gap-4 sm:pt-4"
                >
                  <span
                    class="flex h-5 shrink-0 items-center rounded-full border hairline bg-[color-mix(in_oklab,_var(--color-blue-500)_8%,transparent)] px-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-blue-700)] sm:h-6 sm:px-2.5 sm:text-[10px] sm:tracking-[0.18em]"
                  >
                    {{ f.tag }}
                  </span>
                  <span class="text-[13px] leading-snug text-[var(--color-ink-800)] sm:text-sm">
                    {{ f.label }}
                  </span>
                </li>
              </ul>
            </div>
          </article>

          <!-- Sample questions -->
          <article data-chat-fade class="bezel">
            <div class="bezel-inner p-5 sm:p-7">
              <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
                Contoh pertanyaan
              </span>
              <p class="mt-3 text-[12px] leading-relaxed text-[var(--color-ink-500)] sm:text-[13px]">
                Bingung mau tanya apa? Beberapa contoh dari pengguna lain:
              </p>

              <ul class="mt-4 grid gap-2 sm:mt-5">
                <li
                  v-for="(q, i) in sampleQuestions"
                  :key="i"
                  class="group flex items-start gap-2.5 rounded-xl border hairline bg-[var(--color-paper)] px-3 py-2.5 text-[12px] leading-snug text-[var(--color-ink-700)] sm:gap-3 sm:px-3.5 sm:py-3 sm:text-[13px]"
                >
                  <span class="mt-0.5 font-mono text-[10px] text-[var(--color-blue-600)]">
                    {{ String(i + 1).padStart(2, '0') }}
                  </span>
                  <span>{{ q }}</span>
                </li>
              </ul>

              <p class="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-400)] sm:mt-6">
                SSE streaming · grounded ke 121 jurnal
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
