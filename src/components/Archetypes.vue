<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { archetypes } from '../data/content'

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const progress = ref(0)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value || !track.value || !inner.value) return

  ctx = gsap.context(() => {
    // matchMedia → only run pinned horizontal scroll on md+ (≥768px)
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const trackEl = track.value!
      const innerEl = inner.value!

      const computeDistance = () =>
        innerEl.scrollWidth - trackEl.clientWidth

      const tween = gsap.to(innerEl, {
        x: () => -computeDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.value,
          start: 'top top',
          end: () => `+=${computeDistance() + window.innerHeight * 0.6}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress.value = self.progress
          },
        },
      })

      const onResize = () => {
        tween.scrollTrigger?.refresh()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    })

    // Reveal entry for cards (both layouts)
    gsap.fromTo(
      '[data-arc-card]',
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root.value,
          start: 'top 80%',
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
    id="archetypes"
    class="relative overflow-hidden bg-[var(--color-paper)]"
  >
    <!-- Texture: crosshatch + wave bands (12-archetype constellation feel) -->
    <div data-tex-drift class="crosshatch tex-drift hidden sm:block" aria-hidden="true"></div>
    <div data-tex-drift class="wave-bands tex-drift hidden md:block" aria-hidden="true"></div>

    <!-- Mobile layout: compact grid, no pin/horizontal-scroll -->
    <div class="relative px-5 py-16 md:hidden">
      <div class="mx-auto max-w-[1320px]">
        <div class="mb-8">
          <span class="pill mb-3 inline-flex">12 Archetype PMAI</span>
          <h2
            class="display max-w-[22ch] text-[clamp(1.5rem,7vw,2.4rem)] leading-[1.15] text-[var(--color-ink-900)]"
          >
            Mesin klasifikasi yang memilih dari
            <span class="serif-italic text-[var(--color-blue-600)]">12 archetype</span> terstandar.
          </h2>
          <span class="mt-3 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-500)]">
            Pearson — Marr Archetype Indicator
          </span>
        </div>

        <!-- 2-col compact grid: motif + name + tagline only -->
        <div class="grid grid-cols-2 gap-3">
          <article
            v-for="arc in archetypes"
            :key="`m-${arc.id}`"
            data-arc-card
            class="rounded-2xl border hairline bg-[var(--color-paper)] p-4"
          >
            <div class="flex items-center justify-between">
              <span
                class="flex h-6 items-center justify-center rounded-full border hairline px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-600)]"
              >
                {{ String(arc.id).padStart(2, '0') }}
              </span>
              <span class="text-2xl text-[var(--color-blue-500)]">{{ arc.motif }}</span>
            </div>
            <h3 class="mt-3 display text-xl leading-tight text-[var(--color-ink-900)]">
              {{ arc.name }}
            </h3>
            <span class="mt-1.5 block font-mono text-[9px] uppercase leading-snug tracking-[0.14em] text-[var(--color-ink-500)]">
              {{ arc.tagline }}
            </span>
            <div class="mt-3 border-t hairline pt-2">
              <span class="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-ink-500)]">
                Exemplar
              </span>
              <span class="mt-0.5 block text-[11px] font-medium leading-snug text-[var(--color-ink-800)]">
                {{ arc.exemplar }}
              </span>
            </div>
          </article>
        </div>

        <p class="mt-6 max-w-[42ch] text-xs leading-relaxed text-[var(--color-ink-500)]">
          Setiap profil dicocokkan ke salah satu dari 12 archetype — pencocokan berbasis pola, bukan opini.
        </p>
      </div>
    </div>

    <!-- Desktop layout: pinned horizontal scroll -->
    <div class="hidden md:block" style="min-height: 100dvh">
      <div class="flex h-[100dvh] flex-col">
        <!-- Section header (sticky inside pin) -->
        <div class="shrink-0 px-6 pb-4 pt-12">
          <div class="mx-auto max-w-[1320px]">
            <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span class="pill mb-4 inline-flex">12 Archetype PMAI · Taksonomi Tertutup</span>
                <h2
                  class="display max-w-[22ch] text-[clamp(1.4rem,2.4vw,2.4rem)] leading-[1.15] text-[var(--color-ink-900)]"
                >
                  Mesin klasifikasi yang tidak mengada-ngada. Ia memilih dari
                  <span class="serif-italic text-[var(--color-blue-600)]">12 archetype</span> yang sudah terstandar.
                </h2>
              </div>
              <div class="flex flex-col items-start gap-2 md:items-end">
                <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                  Pearson — Marr Archetype Indicator
                </span>
                <div class="flex items-center gap-3">
                  <span class="font-mono text-xs text-[var(--color-ink-700)]">
                    {{ String(Math.min(12, Math.floor(progress * 11) + 1)).padStart(2, '0') }} / 12
                  </span>
                  <div class="relative h-px w-32 bg-[var(--color-ink-200)]">
                    <span
                      class="absolute left-0 top-0 h-px bg-[var(--color-blue-500)]"
                      :style="`width: ${progress * 100}%`"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hint: sits right above the cards -->
        <div class="shrink-0 px-6 pb-0">
          <div class="mx-auto flex max-w-[1320px] items-center justify-between border-t hairline pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-500)]">
            <span>Scroll untuk menggeser &rarr;</span>
            <span>12 archetype &middot; pencocokan berbasis pola, bukan opini</span>
          </div>
        </div>

        <!-- Horizontal scroll track -->
        <div ref="track" class="h-track min-h-0 flex-1 pb-4 pt-2">
          <div ref="inner" class="h-track-inner">
            <article
              v-for="arc in archetypes"
              :key="arc.id"
              data-arc-card
              class="bezel relative flex w-[400px] shrink-0 flex-col"
            >
              <div
                class="bezel-inner flex flex-col gap-3.5 p-5"
              >
                <!-- Top: index + motif -->
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="flex h-6 items-center justify-center rounded-full border hairline px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-600)]"
                    >
                      {{ String(arc.id).padStart(2, '0') }}
                    </span>
                    <span class="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                      Archetype
                    </span>
                  </div>
                  <span class="text-2xl text-[var(--color-blue-500)]">{{ arc.motif }}</span>
                </div>

                <!-- Name + tagline -->
                <div class="flex flex-col gap-1">
                  <h3 class="display text-2xl text-[var(--color-ink-900)]">
                    {{ arc.name }}
                  </h3>
                  <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                    {{ arc.tagline }}
                  </span>
                </div>

                <!-- Description -->
                <p class="line-clamp-4 text-sm leading-relaxed text-[var(--color-ink-600)]">
                  {{ arc.description }}
                </p>

                <!-- Exemplar -->
                <div class="rounded-xl border hairline bg-[color-mix(in_oklab,var(--color-ink-900)_2%,transparent)] p-3">
                  <span class="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                    Exemplar
                  </span>
                  <div class="mt-1 flex items-baseline gap-2">
                    <span class="display text-base text-[var(--color-ink-900)]">{{ arc.exemplar }}</span>
                  </div>
                  <p class="mt-1 line-clamp-2 text-[12px] leading-snug text-[var(--color-ink-600)]">
                    {{ arc.exemplarNote }}
                  </p>
                </div>

                <!-- Footer (pinned to bottom) -->
                <div class="mt-auto flex items-center justify-between border-t hairline pt-3">
                  <span class="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                    PMAI · {{ arc.id }} of 12
                  </span>
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full border hairline text-[var(--color-ink-700)]"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
