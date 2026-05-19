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
  <section ref="root" id="pricing" class="relative px-6 py-24 md:py-36">
    <div class="mx-auto max-w-[1320px]">
      <div class="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
        <div class="md:col-span-7">
          <span class="pill mb-6 inline-flex">Token Assessment</span>
          <h2 class="display text-[clamp(2rem,5vw,4.25rem)] text-[var(--color-ink-900)]">
            Bayar sekali, simpan tokennya.
            <span class="serif-italic text-[var(--color-blue-600)]"> Pakai kapan siap.</span>
          </h2>
        </div>
        <p class="md:col-span-5 max-w-md text-base leading-relaxed text-[var(--color-ink-600)]">
          1 token = 1 sesi assessment penuh. Token tidak hangus dan bisa dibagi
          ke kakak, adik, atau teman lewat akun yang sama.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-4 md:gap-5">
        <article
          v-for="p in pricing"
          :key="p.name"
          data-price-card
          class="bezel"
          :class="p.highlight ? 'md:-translate-y-3' : ''"
        >
          <div
            class="bezel-inner relative flex h-full flex-col overflow-hidden p-7 md:p-8"
            :class="p.highlight ? 'ring-1 ring-[var(--color-blue-500)]' : ''"
          >
            <!-- Highlight stripe -->
            <div
              v-if="p.highlight"
              class="pointer-events-none absolute inset-x-0 top-0 h-12"
              style="background: linear-gradient(to bottom, color-mix(in oklab, var(--color-blue-500) 9%, transparent), transparent);"
            ></div>

            <div class="relative flex items-center justify-between">
              <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                {{ p.name }}
              </span>
              <span
                v-if="p.highlight"
                class="rounded-full bg-[var(--color-blue-500)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white"
              >
                {{ p.name === 'Pro' ? 'Best Value' : 'Populer' }}
              </span>
            </div>

            <div class="mt-6 flex items-baseline gap-2">
              <span class="display text-5xl text-[var(--color-ink-900)] md:text-6xl">{{ p.tokens }}</span>
              <span class="text-sm text-[var(--color-ink-500)]">token</span>
            </div>

            <div class="mt-4 flex flex-col gap-1">
              <span class="text-xl font-medium tracking-tight text-[var(--color-ink-900)]">{{ p.price }}</span>
              <span class="font-mono text-[11px] text-[var(--color-ink-500)]">{{ p.perToken }}</span>
            </div>

            <p class="mt-4 text-sm leading-relaxed text-[var(--color-ink-600)]">
              {{ p.note }}
            </p>

            <a
              href="#"
              class="mt-7 flex items-center justify-between rounded-full border hairline px-4 py-2.5 text-sm transition-colors duration-300 hover:border-[var(--color-ink-900)] hover:bg-[var(--color-ink-900)] hover:text-[var(--color-paper)]"
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
      <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        <span class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          Pembayaran QRIS via Pakasir
        </span>
        <span class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          Token tidak ada masa berlaku
        </span>
        <span class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-500)]"></span>
          Hasil bisa di-export PDF
        </span>
      </div>
    </div>
  </section>
</template>
