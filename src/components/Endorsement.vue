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
  <section ref="root" class="relative px-6 py-24 md:py-36">
    <div class="mx-auto max-w-[1320px]">
      <div class="mb-14 flex items-center justify-between">
        <span class="pill">Endorsement Akademis</span>
        <span class="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)] md:inline">
          UNJ — Bimbingan & Konseling
        </span>
      </div>

      <div class="grid gap-12 md:grid-cols-12 md:gap-16">
        <!-- Quote -->
        <div class="md:col-span-8">
          <h2
            class="display text-[clamp(1.4rem,3.2vw,2.8rem)] text-[var(--color-ink-900)]"
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
            <div class="bezel-inner p-6">
              <div class="flex items-center gap-4">
                <div class="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                  <img
                    src="/prof-dede.jpg"
                    alt="Prof. Dede Rahmat Hidayat"
                    class="h-full w-full object-cover object-top"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-base font-medium tracking-tight text-[var(--color-ink-900)]">
                    Prof. Dede Rahmat Hidayat
                  </span>
                  <span class="text-xs text-[var(--color-ink-500)]">M.Psi., Ph.D.</span>
                </div>
              </div>

              <div class="mt-5 grid gap-3 border-t hairline pt-5">
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Posisi</span>
                  <span class="text-right text-sm text-[var(--color-ink-800)]">Guru Besar BK, UNJ</span>
                </div>
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Dikukuhkan</span>
                  <span class="text-right text-sm text-[var(--color-ink-800)]">20 Desember 2022</span>
                </div>
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Spesialisasi</span>
                  <span class="text-right text-sm text-[var(--color-ink-800)]">Career Development & Counseling</span>
                </div>
                <div class="flex items-start justify-between gap-3">
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">Peran</span>
                  <span class="text-right text-sm text-[var(--color-ink-800)]">Asesor LAMDIK</span>
                </div>
              </div>
            </div>
          </div>

          <p data-card-fade class="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-ink-600)]">
            Pakar nasional career guidance dan psychological well-being. Penulis buku
            referensi utama psikologi & BK di Indonesia.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
