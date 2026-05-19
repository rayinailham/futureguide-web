<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    // Headline split: each line wrapper masks
    const lines = gsap.utils.toArray<HTMLElement>('[data-line]')
    gsap.fromTo(
      lines,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.1,
        ease: 'expo.out',
        delay: 0.15,
      },
    )

    gsap.fromTo(
      '[data-eyebrow]',
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out' },
    )

    gsap.fromTo(
      '[data-sub]',
      { y: 24, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.5,
      },
    )

    gsap.fromTo(
      '[data-cta]',
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.7, stagger: 0.08 },
    )

    gsap.fromTo(
      '[data-meta]',
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.95, stagger: 0.08 },
    )

    gsap.fromTo(
      '[data-orb]',
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out', delay: 0.4 },
    )

    // Parallax for textures
    gsap.to('[data-grid-tex]', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
    gsap.to('[data-halftone-tex]', {
      yPercent: 12,
      xPercent: -6,
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
    gsap.to('[data-stripes-tex]', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, root.value)
})

onUnmounted(() => {
  ctx?.revert()
})

const stats = [
  { k: '200', v: 'pertanyaan' },
  { k: '121', v: 'jurnal peer-reviewed' },
  { k: '12', v: 'archetype PMAI' },
  { k: '24', v: 'kekuatan karakter' },
]
</script>

<template>
  <section
    ref="root"
    id="top"
    class="relative isolate overflow-hidden"
    style="min-height: 100dvh"
  >
    <!-- Layered textures (skewed grid + halftone + stripes + noise) -->
    <div data-grid-tex class="skew-grid"></div>
    <div data-halftone-tex class="halftone"></div>
    <div data-stripes-tex class="stripes"></div>
    <div class="noise"></div>

    <!-- Soft blue glow orbs -->
    <div
      data-orb
      class="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] rounded-full"
      style="
        background: radial-gradient(
          closest-side,
          color-mix(in oklab, var(--color-blue-500) 18%, transparent),
          transparent 75%
        );
        filter: blur(8px);
      "
    ></div>
    <div
      data-orb
      class="pointer-events-none absolute right-[-10%] top-[55%] h-[520px] w-[520px] rounded-full"
      style="
        background: radial-gradient(
          closest-side,
          color-mix(in oklab, var(--color-blue-300) 22%, transparent),
          transparent 75%
        );
        filter: blur(12px);
      "
    ></div>

    <!-- Content -->
    <div
      class="relative mx-auto flex max-w-[1320px] flex-col gap-8 px-6 pb-16 pt-28 md:gap-12 md:pb-20 md:pt-32"
      style="min-height: 100dvh"
    >
      <!-- Eyebrow -->
      <div data-eyebrow class="flex items-center gap-3">
        <span class="pill">
          <span class="relative flex h-1.5 w-1.5">
            <span
              class="absolute inset-0 animate-ping rounded-full bg-[var(--color-blue-500)] opacity-60"
            ></span>
            <span class="relative h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          </span>
          <span>Psikometri × RAG × 121 Jurnal</span>
        </span>
        <span class="hidden text-[11px] tracking-widest text-[var(--color-ink-500)] md:inline-block font-mono uppercase">
          Endorsed by Prof. Dede Rahmat Hidayat
        </span>
      </div>

      <!-- Headline (split lines, asymmetric editorial) -->
      <h1
        class="display max-w-[18ch] text-[clamp(3rem,9vw,7.5rem)] text-[var(--color-ink-900)]"
      >
        <span class="block overflow-hidden">
          <span data-line class="block">Pemetaan diri</span>
        </span>
        <span class="block overflow-hidden">
          <span data-line class="block">
            <span class="serif-italic text-[var(--color-blue-600)]">berbasis sains</span>,
          </span>
        </span>
        <span class="block overflow-hidden">
          <span data-line class="block">Not a guessing game!</span>
        </span>
      </h1>

      <!-- Sub + CTA, split layout -->
      <div class="grid gap-10 md:grid-cols-12">
        <p
          data-sub
          class="md:col-span-5 max-w-[42ch] text-balance text-base leading-relaxed text-[var(--color-ink-600)] md:text-lg"
        >
          Tiga instrumen psikometri tervalidasi —
          <span class="text-[var(--color-ink-900)]">RIASEC, OCEAN, VIA-IS</span>
          — yang dianalisis menggunakan sistem grounding RAG. Setiap interpretasi bisa dilacak pada riset jurnal.
          Bukan kuis kepribadian, melainkan sebuah titik awal percakapan jujur soal arah hidupmu.
        </p>

        <div class="md:col-span-7 flex flex-col gap-8 md:items-end md:justify-end">
          <div class="flex flex-col items-start gap-3 md:items-end">
            <div class="flex flex-wrap items-center gap-3">
              <a
                data-cta
                href="#pricing"
                class="btn-primary"
              >
                <span>Mulai Asesmen — Rp 200.000</span>
                <span class="btn-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path d="M7 17L17 7M17 7H9M17 7V15" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </a>
              <a data-cta href="#instruments" class="btn-ghost">
                <span>Lihat instrumennya</span>
              </a>
            </div>
            <p data-cta class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
              QRIS · ~45 menit · Token tidak hangus
            </p>
          </div>

          <!-- Stats meta -->
          <ul class="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-[color-mix(in_oklab,_var(--color-ink-900)_5%,transparent)] sm:grid-cols-4 md:max-w-xl">
            <li
              v-for="s in stats"
              :key="s.k"
              data-meta
              class="flex h-28 flex-col justify-between bg-[var(--color-paper)] p-4"
            >
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] line-clamp-2">{{ s.v }}</span>
              <span class="display text-3xl text-[var(--color-ink-900)] leading-none">{{ s.k }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer marker -->
      <div
        class="mt-auto flex flex-col items-start justify-between gap-4 border-t hairline pt-6 md:flex-row md:items-center"
      >
        <div class="flex items-center gap-3">
          <span
            class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]"
          >
            Scroll
          </span>
          <span class="h-px w-10 bg-[var(--color-ink-300)]"></span>
          <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            Tiga instrumen, satu profil
          </span>
        </div>
        <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
          <span>FG</span>
          <span class="h-px w-6 bg-[var(--color-ink-300)]"></span>
          <span>2026</span>
        </div>
      </div>
    </div>
  </section>
</template>
