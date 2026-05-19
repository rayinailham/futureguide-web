<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '[data-cta-line]',
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root.value,
          start: 'top 75%',
        },
      },
    )

    gsap.fromTo(
      '[data-cta-tail]',
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
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
  <section ref="root" class="relative overflow-hidden px-6 py-28 md:py-40">
    <!-- Subtle texture: soft halftone fading from right -->
    <div
      class="pointer-events-none absolute inset-0"
      style="
        background-image: radial-gradient(
          circle at center,
          color-mix(in oklab, var(--color-blue-500) 22%, transparent) 1px,
          transparent 1.4px
        );
        background-size: 18px 18px;
        opacity: 0.18;
        mask-image: radial-gradient(ellipse 50% 70% at 80% 50%, #000 0%, transparent 70%);
        -webkit-mask-image: radial-gradient(ellipse 50% 70% at 80% 50%, #000 0%, transparent 70%);
      "
    ></div>

    <div class="relative mx-auto max-w-[1320px]">
      <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
        C.G. Jung · 1916
      </span>

      <h2
        class="display mt-6 max-w-[22ch] text-[clamp(2.5rem,8vw,7rem)] text-[var(--color-ink-900)]"
        style="letter-spacing: -0.025em"
      >
        <span class="block overflow-hidden">
          <span data-cta-line class="block">&ldquo;Who looks outside,</span>
        </span>
        <span class="block overflow-hidden">
          <span data-cta-line class="block">
            <span class="serif-italic">dreams;</span> who looks inside,
          </span>
        </span>
        <span class="block overflow-hidden">
          <span data-cta-line class="block">
            <span class="serif-italic text-[var(--color-blue-600)]">awakes.</span>&rdquo;
          </span>
        </span>
      </h2>

      <p
        data-cta-tail
        class="mt-8 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[var(--color-ink-500)]"
      >
        Letter to Miss Fanny Bowditch, 22 October 1916 ·
        <span class="text-[var(--color-ink-700)]">C.G. Jung Letters, Vol. 1: 1906&ndash;1950</span>,
        ed. Gerhard Adler &amp; Aniela Jaffé · Princeton University Press, 1973, p. 33
      </p>

      <div data-cta-tail class="mt-14 grid gap-10 md:grid-cols-12 md:items-end">
        <p class="md:col-span-6 max-w-md text-base leading-relaxed text-[var(--color-ink-600)] md:text-lg">
          200 pertanyaan, dalam satu sore. Hasilnya: laporan yang bisa kamu rujuk
          setiap kali kamu merasa kehilangan arah &mdash; pilih jurusan,
          terima tawaran kerja, atau ganti arah karier.
        </p>
        <div class="md:col-span-6 flex flex-col gap-3 md:items-end">
          <div class="flex flex-wrap items-center gap-3 md:justify-end">
            <a href="#pricing" class="btn-primary">
              <span>Mulai dari Rp 200.000</span>
              <span class="btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </a>
            <a href="#instruments" class="btn-ghost">
              <span>Pelajari instrumennya dulu</span>
            </a>
          </div>
          <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            QRIS · Token tidak hangus · Export PDF
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
