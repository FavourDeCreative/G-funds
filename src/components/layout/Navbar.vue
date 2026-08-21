<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'

const isMobileMenuOpen = ref(false)
const navHeader = ref<HTMLElement | null>(null)

const closeMenu = () => {
  isMobileMenuOpen.value = false
}

// 1. Initial Navbar Entrance Animation
onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(
    navHeader.value,
    { y: -40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 }
  ).fromTo(
    '.nav-item',
    { y: -15, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
    '-=0.6'
  )
})

// 2. Mobile Menu GSAP Transition Hooks
const beforeEnter = (el: Element) => {
  gsap.set(el, { opacity: 0, y: -20, scale: 0.95 })
}

const enter = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.4,
    ease: 'back.out(1.2)',
    onComplete: done
  })
}

const leave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    y: -15,
    scale: 0.95,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<template>
  <header ref="navHeader" class="absolute top-0 left-0 w-full z-50 pt-6 px-4 md:px-8">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- LOGO -->
      <router-link to="/" class="nav-item flex items-center gap-3 group">
        <img src="/img/logo.png" alt="Global Funds" class="w-9 h-9 object-contain transition-transform group-hover:scale-105" />
        <span class="text-2xl font-semibold tracking-tight text-white">GlobalFunds</span>
      </router-link>

      <!-- DESKTOP NAV -->
      <nav class="hidden lg:flex items-center gap-8 bg-[#1A1D24]/80 backdrop-blur-md border border-gray-700/50 rounded-full px-8 py-3.5">
        <router-link to="/" class="nav-item text-emerald-500 font-medium transition-colors">Home</router-link>
        <router-link to="/features" class="nav-item text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</router-link>
        <router-link to="/why-choose" class="nav-item text-gray-300 hover:text-white transition-colors text-sm font-medium">Why choose</router-link>
        <router-link to="/testimonials" class="nav-item text-gray-300 hover:text-white transition-colors text-sm font-medium">Testimonials</router-link>
        <router-link to="/faq" class="nav-item text-gray-300 hover:text-white transition-colors text-sm font-medium">FAQ</router-link>
      </nav>

      <!-- DESKTOP AUTH BUTTONS -->
      <div class="hidden lg:flex items-center gap-3">
        <router-link to="/login" class="nav-item text-gray-300 hover:text-white transition-colors text-sm font-medium px-4">
          Log in
        </router-link>
        <router-link to="/register" class="nav-item bg-[#222630] hover:bg-[#2A2F3B] text-white border border-gray-700/50 rounded-full px-6 py-3 text-sm font-medium transition-all">
          Get Started
        </router-link>
      </div>

      <!-- MOBILE TOGGLE BUTTON -->
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen" 
        class="nav-item lg:hidden text-gray-300 hover:text-white p-2 bg-[#1A1D24]/80 border border-gray-700/50 rounded-full relative z-[60]"
      >
        <Icon :icon="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="w-6 h-6" />
      </button>

    </div>

    <!-- ANIMATED MOBILE DROPDOWN MENU -->
    <Transition 
      @before-enter="beforeEnter" 
      @enter="enter" 
      @leave="leave" 
      :css="false"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="absolute top-24 left-4 right-4 bg-[#1A1D24] border border-gray-700/50 rounded-2xl p-6 flex flex-col gap-4 lg:hidden shadow-2xl z-50 backdrop-blur-xl"
      >
        <nav class="flex flex-col gap-4">
          <router-link to="/" @click="closeMenu" class="text-emerald-500 font-medium transition-colors">Home</router-link>
          <router-link to="/features" @click="closeMenu" class="text-gray-300 hover:text-white transition-colors font-medium">Features</router-link>
          <router-link to="/why-choose" @click="closeMenu" class="text-gray-300 hover:text-white transition-colors font-medium">Why choose</router-link>
          <router-link to="/testimonials" @click="closeMenu" class="text-gray-300 hover:text-white transition-colors font-medium">Testimonials</router-link>
          <router-link to="/faq" @click="closeMenu" class="text-gray-300 hover:text-white transition-colors font-medium">FAQ</router-link>
        </nav>
        
        <div class="h-px w-full bg-gray-700/50 my-2"></div>
        
        <div class="flex flex-col gap-3">
          <router-link to="/login" @click="closeMenu" class="text-center text-gray-300 hover:text-white transition-colors font-medium py-2">
            Log in
          </router-link>
          <router-link to="/register" @click="closeMenu" class="text-center bg-[#222630] hover:bg-[#2A2F3B] text-white border border-gray-700/50 rounded-full px-6 py-3 font-medium transition-all">
            Get Started
          </router-link>
        </div>
      </div>
    </Transition>
  </header>
</template>
