<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const sectionRef = ref<HTMLElement | null>(null)

// Calculator state
const isCalculatorOpen = ref(false)
const modalRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)

const amount = ref<number>(100000)
const durationMonths = ref<number>(12)
const annualRate = ref<number>(15) // % per year

const projectedReturn = computed(() => {
  const principal = amount.value || 0
  const rate = annualRate.value || 0
  const months = durationMonths.value || 0
  // Simple interest projection based on months
  const returnAmount = principal * (rate / 100) * (months / 12)
  return returnAmount
})

const totalValue = computed(() => amount.value + projectedReturn.value)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val)
}

const openCalculator = () => {
  isCalculatorOpen.value = true
}

const closeCalculator = () => {
  if (!modalRef.value || !backdropRef.value) {
    isCalculatorOpen.value = false
    return
  }
  gsap.to(modalRef.value, {
    opacity: 0,
    y: 20,
    scale: 0.95,
    duration: 0.25,
    ease: 'power2.in'
  })
  gsap.to(backdropRef.value, {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      isCalculatorOpen.value = false
    }
  })
}

watch(isCalculatorOpen, async (open) => {
  if (open) {
    await nextTick()
    if (modalRef.value && backdropRef.value) {
      gsap.set(modalRef.value, { opacity: 0, y: 20, scale: 0.95 })
      gsap.set(backdropRef.value, { opacity: 0 })
      gsap.to(backdropRef.value, { opacity: 1, duration: 0.2, ease: 'power2.out' })
      gsap.to(modalRef.value, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out'
      })
    }
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isCalculatorOpen.value) closeCalculator()
}

onMounted(() => {
  gsap.fromTo('.roi-element',
    { opacity: 0, y: 40 },
    {
      opacity: 1, 
      y: 0, 
      duration: 1, 
      stagger: 0.2, 
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%'
      }
    }
  )
  window.addEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section ref="sectionRef" class="relative py-24 bg-[#12151C] overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=1920&q=80" 
        alt="Team Meeting" 
        class="w-full h-full object-cover opacity-30"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#12151C]/90 via-[#12151C]/70 to-[#1A1D24]"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
      
      <!-- Testimonial -->
      <div class="roi-element mb-16 max-w-3xl">
        <p class="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed italic mb-6">
          "I've tried other platforms before, but none compare to the results and security I've experienced here. Their investment strategies are smart, modern, and reliable."
        </p>
        <p class="text-white font-bold text-lg">
          — Boyd Franklin, <span class="text-gray-400 font-normal">Tech Investor</span>
        </p>
      </div>

      <!-- Divider -->
      <div class="roi-element w-24 h-px bg-gray-700 mb-16"></div>

      <!-- ROI Calculator CTA -->
      <h2 class="roi-element text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
        ROI Calculator
      </h2>
      <p class="roi-element text-gray-400 text-lg mb-8">
        Instantly estimate your potential returns with EversteadInvest.
      </p>
      
      <button 
        @click="openCalculator"
        class="roi-element flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] px-8 py-4 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
      >
        <Icon icon="lucide:calculator" class="w-5 h-5 text-[#0B0F19]" />
        Calculate ROI
      </button>

    </div>

    <!-- Calculator Modal -->
    <Teleport to="body">
      <div 
        v-if="isCalculatorOpen"
        ref="backdropRef"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        @click.self="closeCalculator"
      >
        <div 
          ref="modalRef"
          class="relative w-full max-w-md bg-[#1A1D24] border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <button 
            @click="closeCalculator"
            class="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            aria-label="Close calculator"
          >
            <Icon icon="lucide:x" class="w-6 h-6" />
          </button>

          <h3 class="text-2xl font-bold text-white mb-1">ROI Calculator</h3>
          <p class="text-gray-400 text-sm mb-6">Estimate your projected returns</p>

          <div class="space-y-5">
            <!-- Amount -->
            <div>
              <label class="block text-sm text-gray-300 mb-2">Investment Amount</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input 
                  v-model.number="amount"
                  type="number"
                  min="0"
                  class="w-full bg-[#12151C] border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="100000"
                />
              </div>
            </div>

            <!-- Duration -->
            <div>
              <label class="block text-sm text-gray-300 mb-2">
                Duration: <span class="text-white font-semibold">{{ durationMonths }} months</span>
              </label>
              <input 
                v-model.number="durationMonths"
                type="range"
                min="1"
                max="60"
                class="w-full accent-emerald-500"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 mo</span>
                <span>60 mo</span>
              </div>
            </div>

            <!-- Rate -->
            <div>
              <label class="block text-sm text-gray-300 mb-2">
                Annual ROI Rate: <span class="text-white font-semibold">{{ annualRate }}%</span>
              </label>
              <input 
                v-model.number="annualRate"
                type="range"
                min="1"
                max="50"
                class="w-full accent-emerald-500"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div class="mt-7 pt-6 border-t border-white/10 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Projected Return</span>
              <span class="text-emerald-400 font-bold text-lg">
                +{{ formatCurrency(projectedReturn) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Total Value</span>
              <span class="text-white font-bold text-xl">
                {{ formatCurrency(totalValue) }}
              </span>
            </div>
          </div>

          <button 
            class="w-full mt-7 bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] py-3 rounded-lg font-bold transition-colors"
          >
            Start Investing Now
          </button>
        </div>
      </div>
    </Teleport>
  </section>
</template>
