<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useLenis } from './composables/useLenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Endorsement from './components/Endorsement.vue'
import Instruments from './components/Instruments.vue'
import Archetypes from './components/Archetypes.vue'
import Results from './components/Results.vue'
import ChatAI from './components/ChatAI.vue'
import Pricing from './components/Pricing.vue'
import Faq from './components/Faq.vue'
import CTA from './components/CTA.vue'
import Footer from './components/Footer.vue'

gsap.registerPlugin(ScrollTrigger)
useLenis()

const progress = ref(0)
const thumbTop = ref(0)
const trackEl = ref<HTMLElement | null>(null)
let onScroll: (() => void) | null = null
let snapTriggers: ScrollTrigger[] = []
let isDragging = false

function scrollToProgress(ratio: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: ratio * max, behavior: 'auto' })
}

function onThumbPointerDown(e: PointerEvent) {
  isDragging = true
  const target = e.currentTarget as HTMLElement
  target.setPointerCapture(e.pointerId)
}

function onThumbPointerMove(e: PointerEvent) {
  if (!isDragging || !trackEl.value) return
  const rect = trackEl.value.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
  scrollToProgress(ratio)
}

function onThumbPointerUp() {
  isDragging = false
}

function onTrackClick(e: MouseEvent) {
  if (!trackEl.value) return
  const rect = trackEl.value.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
  scrollToProgress(ratio)
}

onMounted(() => {
  const sections = gsap.utils.toArray<HTMLElement>('main > section')

  const snapIndices = [4, 5, 6, 7]
  snapIndices.forEach((i) => {
    if (!sections[i]) return
    snapTriggers.push(
      ScrollTrigger.create({
        trigger: sections[i],
        start: 'top 30%',
        end: 'top top',
        snap: {
          snapTo: 1,
          duration: { min: 0.25, max: 0.5 },
          ease: 'power2.inOut',
        },
      }),
    )
  })

  onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    thumbTop.value = progress.value * 100
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 },
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

  // Subtle parallax drift for ambient textures (respects reduced-motion)
  const mm = gsap.matchMedia()
  mm.add(
    {
      isDesktop: '(min-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const conds = ctx?.conditions ?? {}
      if (!conds.isDesktop || conds.reduceMotion) return
      gsap.utils.toArray<HTMLElement>('[data-tex-drift]').forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        gsap.to(el, {
          yPercent: 8 * dir,
          xPercent: 3 * (i % 3 === 0 ? 1 : -1),
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      })
    },
  )
})

onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
  snapTriggers.forEach((st) => st.kill())
  snapTriggers = []
})
</script>

<template>
  <!-- Custom scrollbar (right) -->
  <div
    ref="trackEl"
    class="custom-scrollbar"
    @click="onTrackClick"
  >
    <div
      class="custom-scrollbar__thumb"
      :style="{ top: `${thumbTop}%` }"
      @pointerdown="onThumbPointerDown"
      @pointermove="onThumbPointerMove"
      @pointerup="onThumbPointerUp"
      @lostpointercapture="onThumbPointerUp"
    />
  </div>

  <Navbar />

  <main class="relative">
    <Hero />
    <Endorsement />
    <Instruments />
    <Archetypes />
    <Results />
    <ChatAI />
    <Pricing />
    <Faq />
    <CTA />
  </main>

  <Footer />
</template>
