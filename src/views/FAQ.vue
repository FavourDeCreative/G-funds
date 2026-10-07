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
      class="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-12 text-center lg:pt-24"
    >
      <span
        class="inline-block rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1.5 text-sm font-medium text-neutral-400"
      >
        FAQ
      </span>
      <h1
        class="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl"
      >
        Questions, answered
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
        Everything you need to know before you start investing. Can't find what
        you're looking for? Reach out to our support team.
      </p>
    </div>

    <!-- Accordion list -->
    <div class="relative z-10 mx-auto max-w-3xl px-6 pb-24">
      <div
        class="divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900/60"
      >
        <div v-for="(item, index) in faqs" :key="item.question">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            :aria-expanded="openIndex === index"
            @click="toggle(index)"
          >
            <span class="font-medium text-white">{{ item.question }}</span>
            <svg
              class="h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform duration-200"
              :class="{ 'rotate-45': openIndex === index }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <div
            v-show="openIndex === index"
            class="px-6 pb-5 text-sm leading-relaxed text-neutral-400"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Navbar from "../components/layout/Navbar.vue";

const openIndex = ref<number | null>(0);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const faqs = [
  {
    question: "What is Global-Funds?",
    answer:
      "Global-Funds is an investment platform that lets you put your money into professionally managed funds, track performance in real time, and withdraw whenever you need to — no matter where in the world you are.",
  },
  {
    question: "How much do I need to start investing?",
    answer:
      "There is no high barrier to entry. You can start with whatever amount you are comfortable with and grow your investment over time.",
  },
  {
    question: "Is my money safe?",
    answer:
      "Yes. Funds and personal data are protected with bank-grade encryption, and all funds are managed through verified, regulated custodians.",
  },
  {
    question: "How do withdrawals work?",
    answer:
      "You can request a withdrawal at any time from your dashboard. Processing times vary by payment method, but most withdrawals are completed within a few business days.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. All fees are disclosed upfront on each fund before you invest, so you always know exactly what you are paying.",
  },
  {
    question: "Which countries can use Global-Funds?",
    answer:
      "Global-Funds is built to serve investors worldwide. Availability of specific payment methods may vary by region.",
  },
];
</script>
