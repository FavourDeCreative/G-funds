<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionHeader = ref<HTMLElement | null>(null)
const servicesGrid = ref<HTMLElement | null>(null)

const services = [
  {
    number: '01',
    title: 'Crypto Portfolio Management',
    description: 'We help you build and manage a diversified crypto portfolio using data-driven insights and AI-powered analytics for maximum growth and stability.',
    icon: 'lucide:trending-up'
  },
  {
    number: '02',
    title: 'AI Investment Automation',
    description: 'Experience hands-free investing with our intelligent AI bots that monitor, predict, and execute trades across major exchanges in real time.',
    icon: 'lucide:bot'
  },
  {
    number: '03',
    title: 'Secure Asset Custody',
    description: 'Your digital assets are protected with institutional-grade encryption, multi-signature wallets, and continuous blockchain security monitoring.',
    icon: 'lucide:shield-check'
  },
  {
    number: '04',
    title: 'Investor Education',
    description: 'Gain the knowledge and confidence to make smart investment decisions through our guided training programs and expert market insights.',
    icon: 'lucide:graduation-cap'
  }
]

onMounted(() => {
  // Section Header Entrance Animation
  gsap.fromTo(sectionHeader.value, 
    { opacity: 0, y: 40 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionHeader.value,
        start: 'top 85%',
      }
    }
  )

  // Staggered Service Cards Animation
  gsap.fromTo('.service-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: servicesGrid.value,
        start: 'top 80%',
      }
    }
  )
})
</script>

<template>
  <section class="py-24 bg-[#0B0F19] text-white relative z-20">
    <div class="max-w-7xl mx-auto px-6">
      
      <div ref="sectionHeader" class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-3 block">
          Our Services
        </span>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Smart Investment Solutions for the Digital Economy
        </h2>
        <p class="text-gray-400 text-lg">
          Everything you need to automate, secure, and grow your wealth in one unified platform.
        </p>
      </div>

      <div ref="servicesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="service in services" 
          :key="service.number"
          class="service-card relative bg-[#1A1D24]/60 border border-gray-800/80 hover:border-emerald-500/50 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group"
        >
          <span class="absolute top-6 right-8 text-6xl font-extrabold text-gray-800/40 group-hover:text-emerald-500/10 transition-colors select-none">
            {{ service.number }}
          </span>

          <div class="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon :icon="service.icon" class="w-7 h-7 text-emerald-400" />
          </div>

          <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
            {{ service.title }}
          </h3>
          <p class="text-gray-400 leading-relaxed font-normal">
            {{ service.description }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>
