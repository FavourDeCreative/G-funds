<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'

const headline = ref<HTMLElement | null>(null)
const subheadline = ref<HTMLElement | null>(null)
const ctas = ref<HTMLElement | null>(null)

const floatingAssets = [
  { name: 'Bitcoin', icon: 'cryptocurrency-color:btc', position: 'top-28 left-[8%] md:left-[18%]' },
  { name: 'Ethereum', icon: 'cryptocurrency-color:eth', position: 'top-36 right-[8%] md:right-[18%]' },
  { name: 'Solana', icon: 'cryptocurrency-color:sol', position: 'bottom-36 left-[6%] md:left-[15%]' },
  { name: 'Global ETF', icon: 'lucide:pie-chart', position: 'bottom-28 right-[10%] md:right-[22%]' },
]

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(headline.value, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
    .fromTo(subheadline.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
    .fromTo(ctas.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.8')
    .fromTo('.floating-pill', { scale: 0, opacity: 0, rotation: -15 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)' }, '-=0.5')

  gsap.to('.floating-pill', {
    y: -15,
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    stagger: { each: 0.3, from: 'random' }
  })
})
</script>

<template>
  <section 
    ref="container" 
    class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-cover bg-center bg-no-repeat bg-[url('/img/bg.jpg')]"
  >
    <div class="absolute inset-0 bg-[#0B0F19]/85 z-0"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <div 
      v-for="(asset, index) in floatingAssets" 
      :key="index"
      :class="['floating-pill absolute z-10 flex items-center gap-2 bg-[#1A1D24]/80 backdrop-blur-md border border-gray-700/50 rounded-full px-5 py-2.5 shadow-xl', asset.position]"
    >
      <Icon :icon="asset.icon" class="w-5 h-5 text-emerald-400" />
      <span class="text-gray-300 text-sm font-medium">{{ asset.name }}</span>
    </div>

    <div class="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
      <h1 
        ref="headline" 
        class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white max-w-5xl leading-[1.1] mb-6"
      >
        Step into the future of <br class="hidden md:block" />
        <span class="bg-gradient-to-r from-white via-emerald-100 to-emerald-500 bg-clip-text text-transparent">
          global investing
        </span>
      </h1>
      
      <p 
        ref="subheadline" 
        class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium"
      >
        Trade crypto, tokenized assets, and global index funds with institutional-grade security and zero hidden fees.
      </p>
      
      <div ref="ctas" class="flex flex-col sm:flex-row items-center gap-4">
        <router-link to="/register" class="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          Start Trading Now
        </router-link>
        <router-link to="/markets" class="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1D24] hover:bg-[#222630] text-white border border-gray-700/50 px-8 py-4 rounded-full font-medium transition-all">
          <Icon icon="lucide:line-chart" class="w-5 h-5" />
          View Live Markets
        </router-link>
      </div>
    </div>
  </section>
</template>
