<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { archetypes } from '../data/content'

const emit = defineEmits<{ (e: 'finished'): void }>()

const root = ref<HTMLElement | null>(null)
const motifEl = ref<HTMLElement | null>(null)
const nameEl = ref<HTMLElement | null>(null)
const taglineEl = ref<HTMLElement | null>(null)
const indexEl = ref<HTMLElement | null>(null)
const progressBarEl = ref<HTMLElement | null>(null)
const topPanel = ref<HTMLElement | null>(null)
const bottomPanel = ref<HTMLElement | null>(null)
const ringEl = ref<HTMLElement | null>(null)

const currentIdx = ref(0)
const current = ref(archetypes[0])

let masterTl: gsap.core.Timeline | null = null
let cycleInterval: number | null = null
let finished = false
const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function setBodyLock(lock: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = lock ? 'hidden' : ''
  document.body.style.overflow = lock ? 'hidden' : ''
}

function finish() {
  if (finished) return
  finished = true
  if (cycleInterval !== null) {
    window.clearInterval(cycleInterval)
    cycleInterval = null
  }
  masterTl?.kill()

  const out = gsap.timeline({
    onComplete: () => {
      setBodyLock(false)
      emit('finished')
    },
  })

  // Final lock on the chosen archetype, then split open
  if (motifEl.value) {
    out.to(
      motifEl.value,
      { scale: 1.6, opacity: 0, duration: 0.7, ease: 'expo.in' },
      0,
    )
  }
  if (ringEl.value) {
    out.to(
      ringEl.value,
      { scale: 1.4, opacity: 0, duration: 0.6, ease: 'expo.in' },
      0,
    )
  }
  if (nameEl.value && taglineEl.value && indexEl.value) {
    out.to(
      [nameEl.value, taglineEl.value, indexEl.value, progressBarEl.value],
      { opacity: 0, y: -8, duration: 0.4, ease: 'power2.in' },
      0,
    )
  }
  if (topPanel.value && bottomPanel.value) {
    out.to(
      topPanel.value,
      { yPercent: -101, duration: 1.05, ease: 'expo.inOut' },
      0.15,
    )
    out.to(
      bottomPanel.value,
      { yPercent: 101, duration: 1.05, ease: 'expo.inOut' },
      0.15,
    )
  }
  if (root.value) {
    out.to(root.value, { opacity: 0, duration: 0.2, ease: 'power2.out' }, '>-0.1')
  }
}

function setArchetype(i: number) {
  currentIdx.value = i
  current.value = archetypes[i]
}

onMounted(() => {
  setBodyLock(true)

  // Reduced motion: skip the show entirely after a brief beat
  if (reduced) {
    window.setTimeout(finish, 350)
    return
  }

  const motif = motifEl.value
  const name = nameEl.value
  const tagline = taglineEl.value
  const index = indexEl.value
  const progress = progressBarEl.value
  const ring = ringEl.value

  if (!motif || !name || !tagline || !index || !progress || !ring) return

  masterTl = gsap.timeline()

  // Fade in stage
  masterTl.fromTo(
    [motif, ring],
    { scale: 0.85, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' },
    0,
  )
  masterTl.fromTo(
    [name, tagline, index, progress],
    { y: 14, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05 },
    0.05,
  )

  // Progress fill across full cycle (12 × 140ms = 1680ms)
  const total = archetypes.length
  const tick = 140
  masterTl.fromTo(
    progress.querySelector('span'),
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: (total * tick) / 1000,
      ease: 'none',
      transformOrigin: 'left center',
    },
    0.2,
  )

  // Cycle through archetypes — each new motif blips in with quick scale/opacity
  let i = 0
  const cycleOnce = () => {
    setArchetype(i % total)
    gsap.fromTo(
      motif,
      { scale: 0.7, opacity: 0, rotate: -8 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.18, ease: 'expo.out' },
    )
    gsap.fromTo(
      [name, tagline],
      { y: 6, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.18, ease: 'expo.out', stagger: 0.02 },
    )
    i++
    if (i >= total) {
      if (cycleInterval !== null) {
        window.clearInterval(cycleInterval)
        cycleInterval = null
      }
      // Hold the last archetype briefly, then finish
      window.setTimeout(finish, 520)
    }
  }

  // Kick off after fade-in
  window.setTimeout(() => {
    cycleOnce()
    cycleInterval = window.setInterval(cycleOnce, tick)
  }, 220)

  // Skip on Esc / click anywhere
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') finish()
  }
  window.addEventListener('keydown', onKey)
  ;(root.value as HTMLElement).addEventListener('click', finish)
  ;(root.value as any).__cleanup = () => {
    window.removeEventListener('keydown', onKey)
  }
})

onBeforeUnmount(() => {
  if (cycleInterval !== null) window.clearInterval(cycleInterval)
  masterTl?.kill()
  ;(root.value as any)?.__cleanup?.()
  setBodyLock(false)
})
</script>

<template>
  <div
    ref="root"
    class="intro-root"
    role="dialog"
    aria-label="Intro"
    aria-live="polite"
  >
    <!-- Two paper panels that split apart on finish -->
    <div ref="topPanel" class="intro-panel intro-panel--top">
      <div class="dot-grid intro-tex" aria-hidden="true"></div>
    </div>
    <div ref="bottomPanel" class="intro-panel intro-panel--bottom">
      <div class="crosshatch intro-tex" aria-hidden="true"></div>
    </div>

    <!-- Foreground content (sits between the two panels at center, gets faded out) -->
    <div class="intro-stage">
      <!-- Top eyebrow -->
      <div ref="indexEl" class="intro-eyebrow">
        <span class="intro-eyebrow__pulse">
          <span class="intro-eyebrow__dot"></span>
        </span>
        <span>FutureGuide · 12 Archetype PMAI</span>
        <span class="intro-eyebrow__sep">/</span>
        <span class="intro-eyebrow__count">
          {{ String(currentIdx + 1).padStart(2, '0') }} of {{ archetypes.length }}
        </span>
      </div>

      <!-- Motif + ring -->
      <div class="intro-motif-wrap">
        <div ref="ringEl" class="intro-ring" aria-hidden="true"></div>
        <span ref="motifEl" class="intro-motif">{{ current.motif }}</span>
      </div>

      <!-- Name + tagline -->
      <div class="intro-meta">
        <h2 ref="nameEl" class="intro-name display">
          <span class="serif-italic text-[var(--color-blue-600)]">{{ current.name.split(' ')[0] }}</span>
          <span>&nbsp;{{ current.name.split(' ').slice(1).join(' ') }}</span>
        </h2>
        <p ref="taglineEl" class="intro-tagline">{{ current.tagline }}</p>
      </div>

      <!-- Progress bar -->
      <div ref="progressBarEl" class="intro-progress" aria-hidden="true">
        <span></span>
      </div>

      <!-- Skip hint -->
      <div class="intro-skip">
        <span>Tap or press</span>
        <kbd>Esc</kbd>
        <span>to skip</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-root {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: auto;
  cursor: pointer;
  isolation: isolate;
}

.intro-panel {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  background-color: var(--color-paper);
  overflow: hidden;
  will-change: transform;
}
.intro-panel--top {
  top: 0;
  border-bottom: 1px solid color-mix(in oklab, var(--color-ink-900) 6%, transparent);
}
.intro-panel--bottom {
  bottom: 0;
}
.intro-tex {
  position: absolute;
  inset: -10%;
  opacity: 0.4;
}

.intro-stage {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 3.5vh, 1.75rem);
  padding: 1.25rem;
  pointer-events: none;
}

.intro-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--color-paper) 70%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-ink-900) 8%, transparent);
  font-family: var(--font-mono);
  font-size: clamp(9px, 2.4vw, 10px);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink-700);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  max-width: calc(100vw - 2.5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.intro-eyebrow__pulse {
  position: relative;
  display: inline-flex;
  width: 0.4rem;
  height: 0.4rem;
}
.intro-eyebrow__dot {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--color-blue-500);
  box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-blue-500) 60%, transparent);
  animation: intro-pulse 1.6s var(--ease-fluid) infinite;
}
.intro-eyebrow__sep {
  opacity: 0.4;
}
.intro-eyebrow__count {
  color: var(--color-ink-900);
  font-variant-numeric: tabular-nums;
}

.intro-motif-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(160px, 38vw, 320px);
  height: clamp(160px, 38vw, 320px);
  max-width: 60vmin;
  max-height: 60vmin;
}
.intro-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--color-ink-900) 10%, transparent);
}
.intro-ring::before,
.intro-ring::after {
  content: '';
  position: absolute;
  inset: -8%;
  border-radius: 999px;
  border: 1px dashed color-mix(in oklab, var(--color-blue-500) 30%, transparent);
  animation: intro-spin 14s linear infinite;
}
.intro-ring::after {
  inset: -16%;
  border-color: color-mix(in oklab, var(--color-ink-900) 7%, transparent);
  animation-direction: reverse;
  animation-duration: 22s;
}

.intro-motif {
  font-family: var(--font-serif);
  font-size: clamp(5rem, 22vmin, 11rem);
  line-height: 1;
  color: var(--color-ink-900);
  display: inline-block;
  will-change: transform, opacity;
  filter: drop-shadow(0 6px 24px color-mix(in oklab, var(--color-blue-500) 14%, transparent));
}

.intro-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
  min-height: 4.2rem;
}
.intro-name {
  font-size: clamp(1.4rem, 3.6vw, 2.4rem);
  letter-spacing: -0.03em;
  color: var(--color-ink-900);
  line-height: 1;
}
.intro-tagline {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-ink-500);
}

.intro-progress {
  position: relative;
  width: clamp(180px, 22vw, 280px);
  height: 1px;
  background: color-mix(in oklab, var(--color-ink-900) 10%, transparent);
  overflow: hidden;
}
.intro-progress > span {
  position: absolute;
  inset: 0;
  background: var(--color-blue-500);
  transform-origin: left center;
  transform: scaleX(0);
  display: block;
}

.intro-skip {
  position: absolute;
  bottom: max(env(safe-area-inset-bottom, 0px), 1.25rem);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-ink-400);
}
.intro-skip kbd {
  padding: 0.15rem 0.4rem;
  border: 1px solid color-mix(in oklab, var(--color-ink-900) 12%, transparent);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-ink-700);
  background: color-mix(in oklab, var(--color-paper) 80%, transparent);
}

@keyframes intro-pulse {
  0%   { box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-blue-500) 55%, transparent); }
  70%  { box-shadow: 0 0 0 8px color-mix(in oklab, var(--color-blue-500) 0%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-blue-500) 0%, transparent); }
}
@keyframes intro-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .intro-ring::before,
  .intro-ring::after,
  .intro-eyebrow__dot {
    animation: none;
  }
}

/* Short viewports (landscape phones) — hide skip hint to avoid collision */
@media (max-height: 500px) {
  .intro-skip {
    display: none;
  }
  .intro-stage {
    gap: 0.85rem;
    padding: 0.75rem;
  }
  .intro-motif-wrap {
    width: clamp(120px, 28vh, 200px);
    height: clamp(120px, 28vh, 200px);
  }
  .intro-motif {
    font-size: clamp(4rem, 16vh, 7rem);
  }
}

/* Very narrow phones — tighten name + tagline */
@media (max-width: 380px) {
  .intro-name {
    font-size: clamp(1.1rem, 5.5vw, 1.4rem);
  }
  .intro-tagline {
    font-size: 10px;
    letter-spacing: 0.18em;
  }
}
</style>
