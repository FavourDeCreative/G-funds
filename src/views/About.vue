<template>
  <section class="relative min-h-screen overflow-hidden bg-neutral-950">
    <!-- Background glow layer — swap the gradient colors for your palette -->
    <div
      class="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <div
        class="h-[140%] w-[140%] rounded-full bg-[radial-gradient(circle,theme(colors.neutral.700)_0%,transparent_60%)] opacity-30 blur-3xl"
      />
    </div>

    <Navbar />

    <!-- Page heading -->
    <div
      class="relative z-10 mx-auto max-w-5xl px-6 pt-16 pb-20 text-center lg:pt-24"
    >
      <span
        class="inline-block rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1.5 text-sm font-medium text-neutral-400"
      >
        About Us
      </span>
      <h1
        class="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
      >
        Built for people who want their money to work as hard as they do
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
        Global-Funds gives everyday investors around the world a transparent,
        secure way to grow their wealth — no jargon, no hidden fees, just clear
        returns.
      </p>
    </div>

    <!-- Stats row -->
    <div class="relative z-10 mx-auto max-w-5xl px-6 pb-20">
      <div
        class="grid grid-cols-2 gap-6 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur sm:grid-cols-4"
      >
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <p class="text-3xl font-extrabold text-white sm:text-4xl">
            {{ stat.value }}
          </p>
          <p class="mt-1 text-sm text-neutral-400">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Story + mission -->
    <div
      class="relative z-10 mx-auto grid max-w-5xl gap-12 px-6 pb-20 lg:grid-cols-2"
    >
      <div>
        <h2 class="text-2xl font-bold text-white">Our story</h2>
        <p class="mt-4 text-neutral-400">
          Global-Funds started with a simple frustration: investment platforms
          built for institutions, not individuals. We set out to build something
          different — a platform where anyone, anywhere, can put their money
          into vetted funds, track performance in real time, and withdraw
          without friction.
        </p>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-white">Our mission</h2>
        <p class="mt-4 text-neutral-400">
          To make fund investing accessible, transparent, and secure for people
          everywhere — regardless of how much they're starting with or where
          they're starting from.
        </p>
      </div>
    </div>

    <!-- Values grid -->
    <div class="relative z-10 mx-auto max-w-5xl px-6 pb-24">
      <h2 class="text-center text-2xl font-bold text-white">
        What we stand for
      </h2>
      <div class="mt-10 grid gap-6 sm:grid-cols-3">
        <div
          v-for="value in values"
          :key="value.title"
          class="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
        >
          <h3 class="font-semibold text-white">{{ value.title }}</h3>
          <p class="mt-2 text-sm text-neutral-400">{{ value.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Navbar from "../components/layout/Navbar.vue";

const stats = [
  { value: "12K+", label: "Active investors" },
  { value: "$3.1M", label: "Funds managed" },
  { value: "98%", label: "Withdrawal success rate" },
  { value: "4.8/5", label: "Average rating" },
];

const values = [
  {
    title: "Transparency",
    description:
      "Every fee, return, and risk is shown upfront — no fine print surprises.",
  },
  {
    title: "Security",
    description:
      "Funds and data are protected with bank-grade encryption and verified custodians.",
  },
  {
    title: "Accessibility",
    description:
      "Start investing with as little as you have — no minimum thresholds that shut people out.",
  },
];
</script>
