<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useLenis } from './composables/useLenis'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Endorsement from './components/Endorsement.vue'
import Instruments from './components/Instruments.vue'
import Archetypes from './components/Archetypes.vue'
import Results from './components/Results.vue'
import Pricing from './components/Pricing.vue'
import Faq from './components/Faq.vue'
import CTA from './components/CTA.vue'
import Footer from './components/Footer.vue'

useLenis()

const progress = ref(0)
let onScroll: (() => void) | null = null

onMounted(() => {
  onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  // Scroll-reveal observer for any [data-reveal] outside GSAP-managed sections
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
})

onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <!-- Custom progress scrollbar -->
  <div class="scroll-progress" aria-hidden="true">
    <span :style="`width: ${progress * 100}%`"></span>
  </div>

  <Navbar />

  <main class="relative">
    <Hero />
    <Endorsement />
    <Instruments />
    <Archetypes />
    <Results />
    <Pricing />
    <Faq />
    <CTA />
  </main>

  <Footer />
</template>
