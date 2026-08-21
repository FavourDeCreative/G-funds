<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const barsRef = ref<HTMLElement[]>([])

const stats = [
  { label: 'Average Client ROI', value: 92 },
  { label: 'Portfolio Diversification', value: 88 },
  { label: 'AI-Powered Trade Accuracy', value: 94 },
  { label: 'Investor Retention Rate', value: 97 }
]

onMounted(() => {
  // Text entrance animations
  gsap.fromTo('.perf-text', 
    { opacity: 0, y: 30 }, 
    {
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%'
      }
    }
  )

  // Progress bars filling animation
  barsRef.value.forEach((bar, index) => {
    gsap.fromTo(bar,
      { width: '0%' },
      {
        width: `${stats[index].value}%`,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%'
        }
      }
    )
  })
})
</script>

<template>
  <section ref="sectionRef" class="py-24 bg-[#0B0F19] text-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      
      <!-- Left Column: Image Area -->
      <div class="perf-text w-full rounded-2xl overflow-hidden shadow-2xl bg-white flex justify-center items-center">
        <!-- Placeholder for the graph image in your screenshot -->
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
          alt="Investment Growth Graph" 
          class="w-full h-auto object-cover"
        />
      </div>

      <!-- Right Column: Text & Progress Bars -->
      <div>
        <h4 class="perf-text text-emerald-400 font-semibold text-sm md:text-base tracking-wider uppercase mb-3 block">
          Our Performance
        </h4>
        <h2 class="perf-text text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Trusted Investment Growth Backed by Real Results
        </h2>
        <p class="perf-text text-gray-400 text-base md:text-lg mb-10 leading-relaxed">
          At EversteadInvest, we combine advanced AI analytics with proven crypto investment strategies to deliver consistent returns and sustainable growth for our investors. Every decision is driven by data, innovation, and security.
        </p>

        <!-- Progress Bars -->
        <div class="space-y-8">
          <div v-for="(stat, index) in stats" :key="index" class="perf-text">
            
            <div class="flex justify-between items-end mb-3">
              <span class="text-gray-200 font-bold text-sm md:text-base">{{ stat.label }}</span>
              <span class="text-white font-bold">{{ stat.value }}%</span>
            </div>
            
            <!-- Progress track -->
            <div class="w-full bg-gray-800/80 h-2 md:h-2.5 rounded-full overflow-hidden shadow-inner">
              <!-- Progress fill (Emerald Green) -->
              <div 
                :ref="el => { if (el) barsRef[index] = el as HTMLElement }"
                class="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              ></div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  </section>
</template>
