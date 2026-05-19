<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  facets: string[]
  values?: number[]
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 240,
})

// Pre-set "sample" RIASEC scores so it reads as a real result preview
const defaultValues = [0.78, 0.92, 0.55, 0.4, 0.62, 0.35]

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const radius = computed(() => props.size * 0.42)

const scores = computed(() => props.values ?? defaultValues)

function pointAt(value: number, index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const r = radius.value * value
  return {
    x: cx.value + Math.cos(angle) * r,
    y: cy.value + Math.sin(angle) * r,
  }
}

function axisPoint(index: number, total: number, scale = 1) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  return {
    x: cx.value + Math.cos(angle) * radius.value * scale,
    y: cy.value + Math.sin(angle) * radius.value * scale,
  }
}

const dataPoints = computed(() =>
  scores.value.map((v, i) => pointAt(v, i, scores.value.length)),
)

const polygon = computed(() =>
  dataPoints.value.map((p) => `${p.x},${p.y}`).join(' '),
)

const rings = [0.25, 0.5, 0.75, 1]
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="overflow-visible"
    aria-hidden="true"
  >
    <!-- Concentric rings -->
    <g>
      <circle
        v-for="r in rings"
        :key="r"
        :cx="cx"
        :cy="cy"
        :r="radius * r"
        fill="none"
        stroke="color-mix(in oklab, var(--color-ink-900) 8%, transparent)"
        stroke-width="0.75"
      />
    </g>

    <!-- Spokes -->
    <g>
      <line
        v-for="(_, i) in facets"
        :key="`spoke-${i}`"
        :x1="cx"
        :y1="cy"
        :x2="axisPoint(i, facets.length).x"
        :y2="axisPoint(i, facets.length).y"
        stroke="color-mix(in oklab, var(--color-ink-900) 9%, transparent)"
        stroke-width="0.75"
      />
    </g>

    <!-- Data area -->
    <polygon
      :points="polygon"
      :fill="`color-mix(in oklab, var(--color-blue-500) 22%, transparent)`"
      :stroke="`var(--color-blue-500)`"
      stroke-width="1.5"
      stroke-linejoin="round"
    >
      <animate
        attributeName="opacity"
        values="0.6;1;0.6"
        dur="6s"
        repeatCount="indefinite"
      />
    </polygon>

    <!-- Data dots -->
    <g>
      <circle
        v-for="(p, i) in dataPoints"
        :key="`dot-${i}`"
        :cx="p.x"
        :cy="p.y"
        r="3.2"
        fill="var(--color-blue-500)"
        stroke="var(--color-paper)"
        stroke-width="1.5"
      />
    </g>

    <!-- Labels -->
    <g>
      <text
        v-for="(label, i) in facets"
        :key="`lbl-${i}`"
        :x="axisPoint(i, facets.length, 1.18).x"
        :y="axisPoint(i, facets.length, 1.18).y"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Geist Mono, ui-monospace, monospace"
        font-size="9"
        letter-spacing="0.18em"
        fill="var(--color-ink-600)"
        style="text-transform: uppercase;"
      >
        {{ label.slice(0, 4) }}
      </text>
    </g>

    <!-- Center dot -->
    <circle :cx="cx" :cy="cy" r="2" fill="var(--color-ink-300)" />
  </svg>
</template>
