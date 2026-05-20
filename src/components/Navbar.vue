<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getLenis } from '../composables/useLenis'

const isOpen = ref(false)
const isScrolled = ref(false)

const links = [
  { href: '#instruments', label: 'Instrumen' },
  { href: '#archetypes', label: 'Archetype' },
  { href: '#results', label: 'Hasil' },
  { href: '#pricing', label: 'Token' },
  { href: '#faq', label: 'FAQ' },
]

let onScroll: (() => void) | null = null

onMounted(() => {
  onScroll = () => {
    isScrolled.value = window.scrollY > 24
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
})

function go(e: MouseEvent, href: string) {
  e.preventDefault()
  const el = document.querySelector(href)
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -48 })
  } else {
    ;(el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  isOpen.value = false
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-[padding] duration-700"
    :class="isScrolled ? 'pt-3' : 'pt-6'"
    style="transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1)"
  >
    <nav
      class="relative flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,_var(--color-ink-900)_8%,transparent)] bg-[color-mix(in_oklab,_var(--color-paper)_85%,transparent)] px-2 py-2 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_30px_-12px_rgba(11,12,15,0.12)] transition-all duration-700"
      style="transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1)"
    >
      <!-- Brand -->
      <a
        href="#top"
        @click="(e: MouseEvent) => go(e, '#top')"
        class="group flex items-center gap-2 rounded-full px-3 py-1.5"
      >
        <img src="/logo-fg.png" alt="FutureGuide" class="h-6 w-6 object-contain" />
        <span class="font-medium tracking-tight text-[15px]">FutureGuide</span>
      </a>

      <!-- Desktop links -->
      <ul class="ml-2 hidden items-center gap-1 md:flex">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            @click="(e: MouseEvent) => go(e, link.href)"
            class="rounded-full px-4 py-2 text-sm text-[var(--color-ink-700)] transition-colors duration-300 hover:bg-[color-mix(in_oklab,_var(--color-ink-900)_5%,transparent)] hover:text-[var(--color-ink-900)]"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <!-- CTA -->
      <a
        href="https://app.futureguide.id/auth"
        class="btn-primary group ml-1 hidden md:inline-flex"
      >
        <span>Mulai Assessment</span>
        <span class="btn-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M7 17L17 7M17 7H9M17 7V15" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </a>

      <!-- Mobile hamburger -->
      <button
        @click="isOpen = !isOpen"
        class="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_oklab,_var(--color-ink-900)_8%,transparent)] bg-[color-mix(in_oklab,_var(--color-ink-900)_3%,transparent)] md:hidden"
        aria-label="Buka menu"
      >
        <span
          class="absolute h-[1.5px] w-4 rounded-full bg-[var(--color-ink-900)] transition-all duration-500"
          :class="isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'"
          style="transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1)"
        ></span>
        <span
          class="absolute h-[1.5px] w-4 rounded-full bg-[var(--color-ink-900)] transition-all duration-500"
          :class="isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'"
          style="transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1)"
        ></span>
      </button>
    </nav>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 top-[72px] z-40 bg-[color-mix(in_oklab,_var(--color-paper)_92%,transparent)] backdrop-blur-2xl md:hidden"
      >
        <ul class="flex flex-col gap-1 px-6 pt-8">
          <li
            v-for="(link, i) in links"
            :key="link.href"
            class="border-b hairline"
            :style="`transition-delay: ${i * 60}ms`"
          >
            <a
              :href="link.href"
              @click="(e: MouseEvent) => go(e, link.href)"
              class="flex items-center justify-between py-5 text-2xl tracking-tight text-[var(--color-ink-900)]"
            >
              {{ link.label }}
              <span class="text-[var(--color-ink-400)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </a>
          </li>
        </ul>
        <div class="px-6 pt-8">
          <a
            href="https://app.futureguide.id/auth"
            class="btn-primary w-full justify-between"
          >
            <span>Mulai Assessment</span>
            <span class="btn-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>
