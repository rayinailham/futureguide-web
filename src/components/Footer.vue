<script setup lang="ts">
const cols = [
  {
    title: 'Produk',
    links: [
      { label: 'Instrumen', href: '#instruments' },
      { label: 'Archetype PMAI', href: '#archetypes' },
      { label: 'Hasil & Laporan', href: '#results' },
      { label: 'Token & Harga', href: '#pricing' },
    ],
  },
  {
    title: 'Sains',
    links: [
      { label: '121 Jurnal Akademis', href: '#results' },
      { label: 'RIASEC', href: '#instruments' },
      { label: 'OCEAN (Big Five)', href: '#instruments' },
      { label: 'VIA-IS', href: '#instruments' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang FutureGuide', href: '#top' },
      { label: 'Endorsement Akademis', href: '#top' },
      { label: 'Kontak', href: 'mailto:hello@futureguide.id' },
      { label: 'Privacy', href: '#top' },
    ],
  },
]
</script>

<template>
  <footer class="relative px-5 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-20">
    <div class="mx-auto max-w-[1320px]">
      <!-- Massive marquee-style brand mark -->
      <div class="relative mb-10 border-y hairline py-7 sm:mb-16 sm:py-10 md:py-14">
        <div class="relative">
          <h3
            class="display text-[clamp(2.25rem,15vw,12rem)] leading-[0.85] text-[var(--color-ink-900)]"
            style="letter-spacing: -0.045em"
          >
            FutureGuide<span class="serif-italic text-[var(--color-blue-500)]">.</span>
          </h3>
          <span
            class="absolute right-0 top-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-500)] sm:top-2 sm:text-[10px] sm:tracking-[0.22em]"
          >
            est. 2025
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-12 md:gap-10">
        <div class="col-span-2 md:col-span-5">
          <div class="flex items-center gap-3">
            <span class="relative flex h-7 w-7 items-center justify-center">
              <span class="absolute inset-0 rounded-full bg-[var(--color-ink-900)]"></span>
              <span class="relative h-2.5 w-2.5 rounded-full bg-[var(--color-blue-500)]"></span>
            </span>
            <span class="font-medium tracking-tight text-base">FutureGuide</span>
          </div>
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-ink-600)] sm:mt-5">
            Asesmen psikometri terstandarisasi untuk pelajar SMA, mahasiswa,
            dan siapa pun yang ingin memahami arah karier secara ilmiah.
          </p>
          <p class="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:mt-6 sm:text-[11px] sm:tracking-[0.2em]">
            Endorsed by Prof. Dede Rahmat Hidayat, M.Psi., Ph.D. — UNJ
          </p>
        </div>

        <div
          v-for="col in cols"
          :key="col.title"
          class="md:col-span-2"
          :class="col.title === 'Perusahaan' ? 'md:col-span-3' : ''"
        >
          <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            {{ col.title }}
          </span>
          <ul class="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
            <li v-for="l in col.links" :key="l.label">
              <a
                :href="l.href"
                class="text-sm text-[var(--color-ink-700)] transition-colors duration-300 hover:text-[var(--color-ink-900)]"
              >
                {{ l.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-10 flex flex-col items-start justify-between gap-3 border-t hairline pt-5 sm:mt-14 sm:pt-6 md:flex-row md:items-center"
      >
        <span class="font-mono text-[10px] text-[var(--color-ink-500)] sm:text-[11px]">
          © 2026 FutureGuide. Hak cipta dilindungi.
        </span>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:gap-x-5 sm:text-[11px]">
          <a href="#top" class="hover:text-[var(--color-ink-900)]">Privacy</a>
          <a href="#top" class="hover:text-[var(--color-ink-900)]">Syarat</a>
          <a href="mailto:hello@futureguide.id" class="hover:text-[var(--color-ink-900)]">hello@futureguide.id</a>
        </div>
      </div>
    </div>
  </footer>
</template>
