import { onMounted, onUnmounted, ref } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function useLenis() {
  const lenis = ref<Lenis | null>(null)
  let rafId = 0

  onMounted(() => {
    if (lenisInstance) {
      lenis.value = lenisInstance
      return
    }

    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      lerp: 0.085,
    })

    lenisInstance.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenisInstance?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Sync ScrollTrigger to Lenis
    gsap.ticker.lagSmoothing(0)

    lenis.value = lenisInstance
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    lenisInstance?.destroy()
    lenisInstance = null
  })

  return { lenis }
}
