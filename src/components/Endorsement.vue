<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '[data-quote-line]',
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root.value,
          start: 'top 70%',
        },
      },
    )

    gsap.fromTo(
      '[data-card-fade]',
      { y: 40, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.value,
          start: 'top 60%',
        },
      },
    )
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="relative px-5 py-16 sm:px-6 sm:py-24 md:py-36 overflow-hidden">
    <!-- Texture: contour rings + dot grid -->
    <div data-tex-drift class="contour tex-drift hidden sm:block" aria-hidden="true"></div>
    <div data-tex-drift class="dot-grid tex-drift hidden sm:block" aria-hidden="true"></div>

    <div class="mx-auto max-w-[1320px] relative">
      <!-- Giant decorative quote glyph -->
      <span class="quote-glyph hidden md:block" aria-hidden="true">&ldquo;</span>

      <span class="section-marker">01 / Endorsement</span>

      <div class="mb-10 flex items-center justify-between md:mb-14 relative">
        <span class="pill">Endorsement Akademis</span>
        <span class="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)] md:inline">
          UNJ — Bimbingan & Konseling
        </span>
      </div>

      <div class="grid gap-8 sm:gap-12 md:grid-cols-12 md:gap-16 relative">
        <!-- Quote -->
        <div class="md:col-span-8">
          <h2
            class="display text-[clamp(1.25rem,5vw,2.8rem)] text-[var(--color-ink-900)]"
          >
            <span class="block overflow-hidden">
              <span data-quote-line class="block">"Ini bukan kuis biasa, tapi merupakan sebuah</span>
            </span>
            <span class="block overflow-hidden">
              <span data-quote-line class="block">
                <span class="serif-italic text-[var(--color-blue-600)]">Instrumen psikometri</span>
              </span>
            </span>
            <span class="block overflow-hidden">
              <span data-quote-line class="block">terstandarisasi yang dianalisis</span>
            </span>
            <span class="block overflow-hidden">
              <span data-quote-line class="block">oleh sistem RAG berbasis riset."</span>
            </span>
          </h2>
        </div>

        <!-- Endorser card -->
        <div class="md:col-span-4 md:pt-4">
          <div data-card-fade class="bezel">
            <div class="bezel-inner p-5 sm:p-6">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl sm:h-14 sm:w-14">
                  <img
                    src="/prof-dede.jpg"
                    alt="Prof. Dede Rahmat Hidayat"
                    class="h-full w-full object-cover object-top"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-medium tracking-tight text-[var(--color-ink-900)] sm:text-base">
                    Prof. Dede Rahmat Hidayat
                  </span>
                  <span class="text-xs text-[var(--color-ink-500)]">M.Psi., Ph.D.</span>
                </div>
              </div>

              <div class="mt-4 grid gap-2.5 border-t hairline pt-4 sm:mt-5 sm:gap-3 sm:pt-5">
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Posisi</span>
                  <span class="text-right text-xs text-[var(--color-ink-800)] sm:text-sm">Guru Besar BK, UNJ</span>
                </div>
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Dikukuhkan</span>
                  <span class="text-right text-xs text-[var(--color-ink-800)] sm:text-sm">20 Desember 2022</span>
                </div>
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Spesialisasi</span>
                  <span class="text-right text-xs text-[var(--color-ink-800)] sm:text-sm">Career Development & Counseling</span>
                </div>
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Peran</span>
                  <span class="text-right text-xs text-[var(--color-ink-800)] sm:text-sm">Asesor LAMDIK</span>
                </div>
              </div>
            </div>
          </div>

          <p data-card-fade class="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-ink-600)] sm:mt-5">
            Pakar nasional career guidance dan psychological well-being. Penulis buku
            referensi utama psikologi & BK di Indonesia.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
