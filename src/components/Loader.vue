<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const loaderWrapper = ref<HTMLElement | null>(null)
const logoElement = ref<HTMLElement | null>(null)
const progressCircle = ref<SVGCircleElement | null>(null)

onMounted(() => {
  // 1. Initial Pulse Animation for the Logo
  const pulseTl = gsap.timeline({ repeat: -1, yoyo: true })
  pulseTl.to(logoElement.value, {
    scale: 1.05,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.inOut'
  })

  // 2. Spinning/Filling Progress Ring Animation
  gsap.to(progressCircle.value, {
    strokeDashoffset: 0,
    rotation: 360,
    transformOrigin: "center center",
    duration: 1.5,
    ease: "power3.inOut",
    repeat: -1
  })

  // 3. Hide Loader Function
  const hideLoader = () => {
    // Stop the repeating animations
    pulseTl.kill()
    
    // Slide up and fade out the entire wrapper
    gsap.to(loaderWrapper.value, {
      yPercent: -100,
      opacity: 0,
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.5, // Brief delay so the user actually sees the logo
      onComplete: () => {
        if (loaderWrapper.value) {
          loaderWrapper.value.style.display = 'none'
        }
      }
    })
  }

  // 4. Trigger hide when the window is fully loaded
  if (document.readyState === 'complete') {
    hideLoader()
  } else {
    window.addEventListener('load', hideLoader)
  }
})
</script>

<template>
  <div 
    ref="loaderWrapper" 
    class="fixed inset-0 z-[9999] bg-[#0B0F19] flex flex-col items-center justify-center overflow-hidden"
  >
    <div class="relative flex items-center justify-center">
      <!-- Emerald Green SVG Progress Ring -->
      <svg class="absolute w-40 h-40 -rotate-90" viewBox="0 0 100 100">
        <circle 
          cx="50" cy="50" r="48" 
          fill="none" 
          stroke="#1A1D24" 
          stroke-width="2" 
        />
        <circle 
          ref="progressCircle"
          cx="50" cy="50" r="48" 
          fill="none" 
          stroke="#10b981" 
          stroke-width="2" 
          stroke-dasharray="301.59" 
          stroke-dashoffset="301.59"
          class="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        />
      </svg>

      <!-- Logo imported from public/img -->
      <!-- Note: Files in public/ are referenced starting with '/' -->
      <img 
        ref="logoElement"
        src="/img/logo.png" 
        alt="EversteadInvest Loading..." 
        class="w-24 h-auto opacity-70 z-10"
      />
    </div>
  </div>
</template>
