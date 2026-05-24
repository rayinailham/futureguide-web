<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import RadarChart from './RadarChart.vue'
import { instruments } from '../data/content'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let mqlSm: MediaQueryList | null = null
let mqlMd: MediaQueryList | null = null

const radarSize = ref(200)

const sampleValues: Record<string, number[]> = {
  riasec: [0.78, 0.92, 0.55, 0.4, 0.62, 0.35],
  ocean: [0.72, 0.86, 0.58, 0.66, 0.42],
  via: [0.82, 0.6, 0.74, 0.55, 0.68, 0.88],
}

const labelByIndex = [
  { eyebrow: 'Instrumen 01 — Holland', tag: 'Career Interest' },
  { eyebrow: 'Instrumen 02 — Big Five', tag: 'Personality' },
  { eyebrow: 'Instrumen 03 — Strengths', tag: 'Character' },
]

function computeRadarSize() {
  if (typeof window === 'undefined') return
  const w = window.innerWidth
  // Card width scales: ~240 → ~300 → 280
  if (w < 380) radarSize.value = 150
  else if (w < 640) radarSize.value = 170
  else if (w < 1024) radarSize.value = 190
  else radarSize.value = 200
}

function getResponsiveStack() {
  if (typeof window === 'undefined') return { spread: 56, rotation: 7 }
  const w = window.innerWidth
  if (w < 380) return { spread: 28, rotation: 4 }
  if (w < 640) return { spread: 38, rotation: 5 }
  if (w < 1024) return { spread: 48, rotation: 6 }
  return { spread: 56, rotation: 7 }
}

function shouldDeferForIntro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const ts = Number(localStorage.getItem('fg-intro-seen-at'))
    const valid = ts && !Number.isNaN(ts) && Date.now() - ts < 3 * 24 * 60 * 60 * 1000
    if (valid) return false
  } catch {
    /* fall through */
  }
  const hasHash = window.location.hash && window.location.hash !== '#top'
  return !hasHash
}

onMounted(() => {
  computeRadarSize()
  if (typeof window !== 'undefined') {
    mqlSm = window.matchMedia('(min-width: 640px)')
    mqlMd = window.matchMedia('(min-width: 1024px)')
    const onChange = () => computeRadarSize()
    mqlSm.addEventListener('change', onChange)
    mqlMd.addEventListener('change', onChange)
    window.addEventListener('resize', onChange)
    ;(root.value as any).__cleanup = () => {
      mqlSm?.removeEventListener('change', onChange)
      mqlMd?.removeEventListener('change', onChange)
      window.removeEventListener('resize', onChange)
    }
  }

  if (!root.value) return

  // Pre-hide cards so they don't pop in before the curtain opens
  const cards = Array.from(root.value.querySelectorAll<HTMLElement>('[data-stack-card]'))
  if (shouldDeferForIntro()) {
    gsap.set(cards, { opacity: 0 })
  }

  const runEntry = () => {
    if (!root.value) return
    ctx = gsap.context(() => {
      const { spread, rotation } = getResponsiveStack()
      const cardEls = gsap.utils.toArray<HTMLElement>('[data-stack-card]')
      cardEls.forEach((card, i) => {
        const x = i === 0 ? 0 : i === 1 ? -spread : spread
        const rot = i === 0 ? 0 : i === 1 ? -rotation : rotation
        gsap.fromTo(
          card,
          { x: 0, y: 32, rotate: 0, opacity: 0, scale: 0.92 },
          {
            x,
            y: 0,
            rotate: rot,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: 'expo.out',
            delay: 0.55 + i * 0.12,
          },
        )
      })
    }, root.value)
  }

  if (shouldDeferForIntro()) {
    const onIntroFinished = () => {
      window.removeEventListener('fg:intro-finished', onIntroFinished)
      runEntry()
    }
    window.addEventListener('fg:intro-finished', onIntroFinished)
    window.setTimeout(() => {
      window.removeEventListener('fg:intro-finished', onIntroFinished)
      if (!ctx) runEntry()
    }, 6000)
  } else {
    runEntry()
  }
})

onUnmounted(() => {
  ctx?.revert()
  ;(root.value as any)?.__cleanup?.()
})
</script>

<template>
  <div
    ref="root"
    class="stack-root relative mx-auto flex w-full items-center justify-center"
    aria-hidden="true"
  >
    <div class="stack-frame relative">
      <div
        v-for="(inst, i) in instruments"
        :key="inst.id"
        data-stack-card
        class="absolute inset-0 bezel"
        :style="{ zIndex: i === 0 ? 10 : 0, willChange: 'transform' }"
      >
        <div class="bezel-inner relative flex h-full flex-col gap-2.5 overflow-hidden p-4 sm:gap-3 sm:p-5">
          <!-- soft accent glow -->
          <div
            class="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full"
            style="
              background: radial-gradient(
                closest-side,
                color-mix(in oklab, var(--color-blue-500) 14%, transparent),
                transparent 70%
              );
            "
          ></div>

          <!-- header -->
          <div class="relative flex items-start justify-between gap-3">
            <div class="flex flex-col gap-1 min-w-0">
              <span
                class="font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--color-ink-500)] sm:text-[9px] sm:tracking-[0.18em] truncate"
              >
                {{ labelByIndex[i].eyebrow }}
              </span>
              <h4 class="display text-2xl text-[var(--color-ink-900)] sm:text-3xl">
                {{ inst.name }}
              </h4>
              <span class="text-[10px] text-[var(--color-ink-600)] truncate">
                {{ labelByIndex[i].tag }}
              </span>
            </div>
            <div
              class="shrink-0 flex flex-col items-end gap-0.5 rounded-lg border hairline bg-[color-mix(in_oklab,_var(--color-ink-900)_4%,transparent)] px-2 py-1.5"
            >
              <span
                class="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
              >items</span>
              <span class="display text-base text-[var(--color-blue-600)]">{{ inst.items }}</span>
            </div>
          </div>

          <!-- radar -->
          <div class="relative flex flex-1 items-center justify-center">
            <RadarChart
              :facets="inst.facets"
              :values="sampleValues[inst.id]"
              :size="radarSize"
            />
          </div>

          <!-- footer label -->
          <div class="relative flex items-center justify-between border-t hairline pt-2">
            <span
              class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
            >
              Sample profile
            </span>
            <span class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-400)]">
              0{{ i + 1 }} / 03
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stack-root {
  height: clamp(300px, 60vw, 420px);
  max-height: 480px;
}
.stack-frame {
  width: clamp(220px, 70vw, 280px);
  height: clamp(280px, 78vw, 360px);
  max-width: 100%;
}

@media (min-width: 640px) {
  .stack-root {
    height: 380px;
  }
  .stack-frame {
    width: 260px;
    height: 320px;
  }
}

@media (min-width: 1024px) {
  .stack-root {
    height: 420px;
  }
  .stack-frame {
    width: 280px;
    height: 360px;
  }
}
</style>
