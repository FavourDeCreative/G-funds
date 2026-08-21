<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionHeader = ref<HTMLElement | null>(null)
const plansGrid = ref<HTMLElement | null>(null)
const marketWidgetContainer = ref<HTMLElement | null>(null)

const plans = [
  {
    name: 'Starting Plan',
    icon: 'lucide:leaf',
    min: '$80',
    max: '$4,000',
    profit: '15%',
    duration: '24 hours',
    ref: '10%',
    isLimited: false
  },
  {
    name: 'Emy Plan',
    icon: 'lucide:trending-up',
    min: '$550',
    max: '$9,990',
    profit: '20%',
    duration: '36 hours',
    ref: '10%',
    isLimited: false
  },
  {
    name: 'Bonus Plan',
    icon: 'lucide:gift',
    min: '$1,200',
    max: '$7,000',
    profit: '45%',
    duration: '40 hours',
    ref: '10%',
    isLimited: false
  },
  {
    name: 'Superlative Plan',
    icon: 'lucide:award',
    min: '$1,500',
    max: '$9,500',
    profit: '25%',
    duration: '36 hours',
    ref: '10%',
    isLimited: false
  },
  {
    name: 'Loan Plan',
    icon: 'lucide:landmark',
    min: '$2,200',
    max: 'Unlimited',
    profit: '40%',
    duration: '20 hours',
    ref: '10%',
    isLimited: false
  },
  {
    name: 'Weekend Plan',
    icon: 'lucide:calendar',
    min: '$1,000',
    max: '$30,000',
    profit: '50%',
    duration: '9 hours',
    ref: '10%',
    isLimited: true
  },
  {
    name: 'Gold Plan',
    icon: 'lucide:coins',
    min: '$4,500',
    max: 'Unlimited',
    profit: '55%',
    duration: '2 days',
    ref: '10%',
    isLimited: false
  },
  {
    name: 'Xmas Bonus',
    icon: 'lucide:snowflake',
    min: '$750',
    max: '$15,000',
    profit: '45%',
    duration: '1 day',
    ref: '10%',
    isLimited: true
  },
  {
    name: 'Upgrade Plan',
    icon: 'lucide:arrow-up-circle',
    min: '$950',
    max: 'Unlimited',
    profit: '25%',
    duration: 'Custom',
    ref: '10%',
    isLimited: false
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

  // Pricing Cards Staggered Animation
  gsap.fromTo('.plan-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: plansGrid.value,
        start: 'top 80%',
      }
    }
  )

  // Inject TradingView Market Cap Screener Widget
  if (marketWidgetContainer.value) {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
    script.async = true
    script.type = 'text/javascript'
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '600',
      defaultColumn: 'overview',
      screener_type: 'crypto_mkt',
      displayCurrency: 'USD',
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: true
    })
    marketWidgetContainer.value.appendChild(script)
  }
})
</script>

<template>
  <section class="py-24 bg-[#0B0F19] text-white relative z-20">
    <div class="max-w-7xl mx-auto px-6">
      
      <!-- Section Header -->
      <div ref="sectionHeader" class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-3 block">
          Investment Plans
        </span>
        <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Grow Your Wealth With Our Strategic Plans
        </h2>
      </div>

      <!-- Plans Grid -->
      <div ref="plansGrid" class="flex flex-wrap justify-center gap-6 md:gap-8 mb-24">
        
        <div 
          v-for="(plan, index) in plans" 
          :key="index"
          class="plan-card w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] relative bg-[#12151C] rounded-2xl p-8 border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 group shadow-lg flex flex-col items-center"
        >
          
          <!-- Limited Time Ribbon -->
          <div v-if="plan.isLimited" class="absolute top-0 right-0 overflow-hidden w-24 h-24 rounded-tr-2xl z-10">
            <div class="absolute bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider py-1.5 w-36 text-center transform rotate-45 top-5 -right-10 shadow-md">
              Limited Time
            </div>
          </div>

          <!-- Plan Icon -->
          <div class="mb-6">
            <Icon :icon="plan.icon" class="w-10 h-10 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
          </div>

          <!-- Plan Name -->
          <h3 class="text-xl font-bold text-emerald-500 mb-8 text-center">{{ plan.name }}</h3>

          <!-- Plan Details -->
          <div class="w-full space-y-4 mb-8">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Minimum:</span>
              <span class="font-bold text-white">{{ plan.min }}</span>
            </div>
            
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Maximum:</span>
              <span class="font-bold text-white">{{ plan.max }}</span>
            </div>
            
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Profit:</span>
              <span class="font-bold text-white">{{ plan.profit }}</span>
            </div>
            
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Duration:</span>
              <span class="font-bold text-white">{{ plan.duration }}</span>
            </div>

            <!-- New Referral Row -->
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Referral:</span>
              <span class="font-bold text-emerald-400">{{ plan.ref }}</span>
            </div>
          </div>

          <!-- Invest Button -->
          <router-link 
            to="/register" 
            class="w-full max-w-[200px] mt-auto text-center py-3 rounded-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          >
            Invest Now
          </router-link>
          
        </div>

      </div>

      <!-- Live Market Cap Table Section -->
      <div class="w-full bg-[#12151C] rounded-2xl border border-gray-800 shadow-xl p-4 overflow-hidden">
        <div ref="marketWidgetContainer" class="tradingview-widget-container w-full h-[600px]">
          <div class="tradingview-widget-container__widget h-full"></div>
        </div>
      </div>

    </div>
  </section>
</template>
