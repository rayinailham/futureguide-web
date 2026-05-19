<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import RadarChart from './RadarChart.vue'
import { instruments } from '../data/content'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

const spread = 56
const rotation = 7

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

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]')
    cards.forEach((card, i) => {
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
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div
    ref="root"
    class="relative mx-auto flex w-full items-center justify-center"
    style="height: 420px"
    aria-hidden="true"
  >
    <div class="relative" style="width: 280px; height: 360px">
      <div
        v-for="(inst, i) in instruments"
        :key="inst.id"
        data-stack-card
        class="absolute inset-0 bezel"
        :style="{ zIndex: i === 0 ? 10 : 0, willChange: 'transform' }"
      >
        <div class="bezel-inner relative flex h-full flex-col gap-3 overflow-hidden p-5">
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
            <div class="flex flex-col gap-1">
              <span
                class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
              >
                {{ labelByIndex[i].eyebrow }}
              </span>
              <h4 class="display text-3xl text-[var(--color-ink-900)]">
                {{ inst.name }}
              </h4>
              <span class="text-[10px] text-[var(--color-ink-600)]">
                {{ labelByIndex[i].tag }}
              </span>
            </div>
            <div
              class="flex flex-col items-end gap-0.5 rounded-lg border hairline bg-[color-mix(in_oklab,_var(--color-ink-900)_4%,transparent)] px-2 py-1.5"
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
              :size="200"
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
