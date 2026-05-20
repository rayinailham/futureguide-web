<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { pricing } from '../data/content'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '[data-price-card]',
      { y: 40, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
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
  <section ref="root" id="pricing" class="relative px-5 py-16 sm:px-6 sm:py-20 md:py-36">
    <div class="mx-auto max-w-[1320px]">
      <div class="mb-10 grid gap-5 sm:gap-8 md:mb-14 md:grid-cols-12 md:items-end">
        <div class="md:col-span-7">
          <span class="pill mb-4 inline-flex md:mb-6">Token Assessment</span>
          <h2 class="display text-[clamp(1.75rem,7vw,4.25rem)] text-[var(--color-ink-900)]">
            Bayar sekali, simpan tokennya.
            <span class="serif-italic text-[var(--color-blue-600)]"> Pakai kapan siap.</span>
          </h2>
        </div>
        <p class="md:col-span-5 max-w-md text-sm leading-relaxed text-[var(--color-ink-600)] md:text-base">
          1 token = 1 sesi assessment penuh. Token tidak hangus dan bisa dibagi
          ke kakak, adik, atau teman lewat akun yang sama.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
        <article
          v-for="p in pricing"
          :key="p.name"
          data-price-card
          class="bezel"
          :class="p.highlight ? 'md:-translate-y-3' : ''"
        >
          <div
            class="bezel-inner relative flex h-full flex-col overflow-hidden p-4 sm:p-6 md:p-8"
            :class="p.highlight ? 'ring-1 ring-[var(--color-blue-500)]' : ''"
          >
            <!-- Highlight stripe -->
            <div
              v-if="p.highlight"
              class="pointer-events-none absolute inset-x-0 top-0 h-12"
              style="background: linear-gradient(to bottom, color-mix(in oklab, var(--color-blue-500) 9%, transparent), transparent);"
            ></div>

            <div class="relative flex items-center justify-between gap-2">
              <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:text-[10px] sm:tracking-[0.22em]">
                {{ p.name }}
              </span>
              <span
                v-if="p.highlight"
                class="shrink-0 rounded-full bg-[var(--color-blue-500)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white sm:px-2.5 sm:text-[10px] sm:tracking-[0.18em]"
              >
                {{ p.name === 'Pro' ? 'Best' : 'Populer' }}
              </span>
            </div>

            <div class="mt-4 flex items-baseline gap-1.5 sm:mt-6 sm:gap-2">
              <span class="display text-4xl text-[var(--color-ink-900)] sm:text-5xl md:text-6xl">{{ p.tokens }}</span>
              <span class="text-xs text-[var(--color-ink-500)] sm:text-sm">token</span>
            </div>

            <div class="mt-3 flex flex-col gap-0.5 sm:mt-4 sm:gap-1">
              <span class="text-base font-medium tracking-tight text-[var(--color-ink-900)] sm:text-xl">{{ p.price }}</span>
              <span class="font-mono text-[10px] text-[var(--color-ink-500)] sm:text-[11px]">{{ p.perToken }}</span>
            </div>

            <p class="mt-3 text-xs leading-relaxed text-[var(--color-ink-600)] sm:mt-4 sm:text-sm">
              {{ p.note }}
            </p>

            <a
              href="https://app.futureguide.id/auth"
              class="mt-5 flex items-center justify-between rounded-full border hairline px-3 py-2 text-xs transition-colors duration-300 hover:border-[var(--color-ink-900)] hover:bg-[var(--color-ink-900)] hover:text-[var(--color-paper)] sm:mt-7 sm:px-4 sm:py-2.5 sm:text-sm"
              :class="p.highlight ? 'bg-[var(--color-ink-900)] text-[var(--color-paper)] border-transparent' : 'text-[var(--color-ink-900)]'"
            >
              <span>Pilih paket</span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </article>
      </div>

      <!-- Trust line -->
      <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:mt-10 sm:gap-x-8 sm:gap-y-3 sm:text-[11px]">
        <span class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          QRIS via Pakasir
        </span>
        <span class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          Token tidak hangus
        </span>
        <span class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          Export PDF
        </span>
      </div>
    </div>
  </section>
</template>
