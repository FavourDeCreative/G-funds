<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const textContent = ref<HTMLElement | null>(null)
const imageContainer = ref<HTMLElement | null>(null)
const statBadge = ref<HTMLElement | null>(null)

const features = [
  {
    icon: 'lucide:brain-circuit',
    title: 'AI-Driven Market Strategies',
    description: 'Our intelligent algorithms systematically pinpoint profitable opportunities, execute automated trades, and optimize returns.'
  },
  {
    icon: 'lucide:shield-check',
    title: 'Uncompromising Security',
    description: 'Safeguarded by enterprise-grade encryption and on-chain verification, your holdings remain completely protected.'
  }
]

onMounted(() => {
  // Text Content Animation (Sliding in from the left)
  gsap.fromTo(textContent.value,
    { opacity: 0, x: -40 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: textContent.value,
        start: 'top 80%',
      }
    }
  )

  // Features List Staggered Animation
  gsap.fromTo('.feature-item',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: textContent.value,
        start: 'top 75%',
      }
    }
  )

  // Image Container Animation (Sliding in from the right)
  gsap.fromTo(imageContainer.value,
    { opacity: 0, x: 40 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: imageContainer.value,
        start: 'top 80%',
      }
    }
  )

  // Stat Badge Pop-in Animation
  gsap.fromTo(statBadge.value,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay: 0.6,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: imageContainer.value,
        start: 'top 80%',
      }
    }
  )
})
</script>

<template>
  <section class="py-20 bg-[#0B0F19] text-white relative z-20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div ref="textContent" class="flex flex-col space-y-6">
          <span class="text-emerald-400 font-semibold text-sm tracking-wider uppercase">
            Our Advantage
          </span>
          
          <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Unlocking Intelligent Crypto Growth Powered by Advanced AI
          </h2>
          
          <p class="text-gray-400 text-base md:text-lg leading-relaxed font-normal">
            We fuse cutting-edge analytics, robust blockchain security, and artificial intelligence to produce reliable, data-backed portfolio results. We strive to streamline digital asset management while continually driving sustained value for our investors.
          </p>

          <div class="space-y-6 pt-2">
            <div 
              v-for="(feature, index) in features" 
              :key="index"
              class="feature-item flex items-start gap-4"
            >
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                <Icon :icon="feature.icon" class="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-1">
                  {{ feature.title }}
                </h3>
                <p class="text-gray-400 text-sm md:text-base leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-8 lg:mt-0">
          <div ref="imageContainer" class="relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000" 
              alt="Executive working on investment analysis" 
              class="w-full h-[450px] md:h-[550px] object-cover"
            />
            
            <div ref="statBadge" class="absolute bottom-0 left-0 bg-emerald-500 text-[#0B0F19] px-8 py-6 rounded-tr-3xl shadow-lg">
              <span class="text-4xl font-extrabold block">14+</span>
              <span class="text-xs font-bold uppercase tracking-wider opacity-90">Years Experience</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
