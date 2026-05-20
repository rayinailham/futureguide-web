<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { instruments } from '../data/content'
import RadarChart from './RadarChart.vue'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '[data-tile]',
      { y: 60, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root.value,
          start: 'top 65%',
        },
      },
    )

    gsap.fromTo(
      '[data-section-head] span',
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: root.value,
          start: 'top 70%',
        },
      },
    )
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section
    ref="root"
    id="instruments"
    class="relative px-5 py-16 sm:px-6 sm:py-24 md:py-36 section-alt overflow-hidden"
  >
    <span class="section-marker">02 / Instruments</span>
    <!-- Subtle texture only at the section seam -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-32"
      style="
        background-image: linear-gradient(
          to bottom,
          color-mix(in oklab, var(--color-blue-500) 5%, transparent),
          transparent
        );
      "
    ></div>

    <!-- Texture: blueprint grid + plus marks (analytical/data feel) -->
    <div data-tex-drift class="blueprint-grid tex-drift hidden sm:block" aria-hidden="true"></div>
    <div data-tex-drift class="plus-marks tex-drift hidden md:block" aria-hidden="true"></div>

    <div class="mx-auto max-w-[1320px]">
      <div class="mb-10 flex flex-col items-start justify-between gap-5 sm:gap-6 md:mb-14 md:flex-row md:items-end">
        <div class="max-w-2xl">
          <span class="pill mb-4 inline-flex md:mb-6">Tiga Instrumen, 200 Pertanyaan</span>
          <h2
            data-section-head
            class="display text-[clamp(1.75rem,6vw,4rem)] text-[var(--color-ink-900)]"
          >
            <span class="block overflow-hidden"><span class="block">Tiga lensa berbeda,</span></span>
            <span class="block overflow-hidden">
              <span class="block">
                satu profil yang
                <span class="serif-italic text-[var(--color-blue-600)]">utuh</span>.
              </span>
            </span>
          </h2>
        </div>
        <p class="max-w-md text-sm leading-relaxed text-[var(--color-ink-600)] md:text-base">
          Sistem ketika menganalisis tidak melihat instrumen secara terpisah. Ia melakukan
          cross-reference antar ketiganya — sehingga kekuatan, minat, dan kepribadian
          saling membantu dalam mempetakan talent seorang pribadi.
        </p>
      </div>

      <!-- Asymmetric bento -->
      <div class="grid gap-3 sm:gap-4 md:grid-cols-12 md:gap-5">
        <!-- RIASEC -->
        <article
          data-tile
          class="bezel md:col-span-7 md:row-span-2"
        >
          <div class="bezel-inner relative h-full overflow-hidden p-5 sm:p-7 md:p-10">
            <!-- Tile-internal accent texture -->
            <div
              class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
              style="
                background: radial-gradient(
                  closest-side,
                  color-mix(in oklab, var(--color-blue-500) 12%, transparent),
                  transparent 70%
                );
              "
            ></div>

            <div class="relative flex h-full flex-col justify-between gap-7 md:gap-10">
              <div class="flex items-start justify-between gap-3 sm:gap-4">
                <div class="flex flex-col gap-2 sm:gap-3">
                  <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
                    Instrumen 01 — Holland
                  </span>
                  <h3 class="display text-3xl text-[var(--color-ink-900)] sm:text-5xl md:text-7xl">
                    {{ instruments[0].name }}
                  </h3>
                  <span class="text-xs text-[var(--color-ink-600)] sm:text-sm">{{ instruments[0].fullName }}</span>
                </div>
                <div
                  class="flex flex-col items-end gap-0.5 rounded-xl border hairline bg-[color-mix(in_oklab,_var(--color-ink-900)_4%,transparent)] px-2.5 py-2 sm:gap-1 sm:rounded-2xl sm:px-4 sm:py-3"
                >
                  <span class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.18em]">items</span>
                  <span class="display text-2xl text-[var(--color-blue-600)] sm:text-3xl">{{ instruments[0].items }}</span>
                </div>
              </div>

              <div class="grid items-center gap-5 sm:gap-6 md:grid-cols-12">
                <p class="md:col-span-7 text-sm leading-relaxed text-[var(--color-ink-600)] md:text-base">
                  {{ instruments[0].description }}
                </p>

                <!-- RIASEC radar preview -->
                <div class="md:col-span-5 flex flex-col items-center gap-2">
                  <RadarChart :facets="instruments[0].facets" :size="200" class="sm:hidden" />
                  <RadarChart :facets="instruments[0].facets" :size="240" class="hidden sm:block" />
                  <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
                    Sample profile · radar preview
                  </span>
                </div>
              </div>

              <ul class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-[color-mix(in_oklab,_var(--color-ink-900)_5%,transparent)] sm:grid-cols-3">
                <li
                  v-for="facet in instruments[0].facets"
                  :key="facet"
                  class="flex items-center justify-between bg-[var(--color-paper)] px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <span class="text-xs text-[var(--color-ink-800)] sm:text-sm">{{ facet }}</span>
                  <span class="font-mono text-[10px] text-[var(--color-ink-400)]">{{ facet.charAt(0) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <!-- OCEAN -->
        <article data-tile class="bezel md:col-span-5">
          <div class="bezel-inner relative overflow-hidden p-5 sm:p-7 md:p-9">
            <div class="flex items-start justify-between gap-3 sm:gap-4">
              <div class="flex flex-col gap-1.5 sm:gap-2">
                <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
                  Instrumen 02 — Big Five
                </span>
                <h3 class="display text-2xl text-[var(--color-ink-900)] sm:text-4xl md:text-5xl">
                  {{ instruments[1].name }}
                </h3>
                <span class="text-xs text-[var(--color-ink-600)] sm:text-sm">{{ instruments[1].fullName }}</span>
              </div>
              <span
                class="font-mono text-xl font-medium text-[var(--color-blue-600)] sm:text-2xl"
              >{{ instruments[1].items }}</span>
            </div>

            <p class="mt-4 text-sm leading-relaxed text-[var(--color-ink-600)] sm:mt-5">
              {{ instruments[1].description }}
            </p>

            <div class="mt-5 flex flex-wrap gap-1.5 sm:mt-6">
              <span
                v-for="facet in instruments[1].facets"
                :key="facet"
                class="rounded-full border hairline px-2.5 py-0.5 text-[11px] text-[var(--color-ink-700)] sm:px-3 sm:py-1 sm:text-xs"
              >
                {{ facet }}
              </span>
            </div>
          </div>
        </article>

        <!-- VIA-IS -->
        <article data-tile class="bezel md:col-span-5">
          <div class="bezel-inner relative overflow-hidden p-5 sm:p-7 md:p-9">
            <div class="flex items-start justify-between gap-3 sm:gap-4">
              <div class="flex flex-col gap-1.5 sm:gap-2">
                <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
                  Instrumen 03 — Character Strengths
                </span>
                <h3 class="display text-2xl text-[var(--color-ink-900)] sm:text-4xl md:text-5xl">
                  {{ instruments[2].name }}
                </h3>
                <span class="text-xs text-[var(--color-ink-600)] sm:text-sm">{{ instruments[2].fullName }}</span>
              </div>
              <span class="font-mono text-xl font-medium text-[var(--color-blue-600)] sm:text-2xl">{{ instruments[2].items }}</span>
            </div>

            <p class="mt-4 text-sm leading-relaxed text-[var(--color-ink-600)] sm:mt-5">
              {{ instruments[2].description }}
            </p>

            <ul class="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-3">
              <li
                v-for="(facet, i) in instruments[2].facets"
                :key="facet"
                class="flex flex-col gap-0.5 rounded-xl border hairline px-2.5 py-2 sm:gap-1 sm:px-3 sm:py-2"
              >
                <span class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-400)] sm:tracking-[0.18em]">0{{ i + 1 }}</span>
                <span class="text-[11px] text-[var(--color-ink-800)] sm:text-xs">{{ facet }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <!-- Cross-reference note -->
      <div
        class="mt-5 grid gap-4 rounded-2xl border hairline bg-[color-mix(in_oklab,_var(--color-blue-500)_4%,transparent)] p-5 sm:p-6 md:mt-6 md:grid-cols-12 md:items-center md:gap-8 md:p-8"
      >
        <div class="md:col-span-4 flex items-center gap-3">
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border hairline bg-[var(--color-paper)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
              <circle cx="9" cy="9" r="5" stroke="currentColor" />
              <circle cx="15" cy="15" r="5" stroke="currentColor" />
            </svg>
          </div>
          <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            Cross-Reference Engine
          </span>
        </div>
        <p class="md:col-span-8 text-sm leading-relaxed text-[var(--color-ink-700)] md:text-base">
          Skor dari ketiga instrumen tidak hanya dijumlahkan. Mesin cross-reference mencocokkan pola
          antar dimensi — misalnya bagaimana skor Openness yang tinggi berinteraksi
          dengan minat Investigative dan kekuatan Curiosity — untuk menemukan tema
          psikologis yang konsisten di semua sumber.
        </p>
      </div>
    </div>
  </section>
</template>
