<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'

const imageContainer = ref<HTMLElement | null>(null)

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

onMounted(() => {
  // Animate the image side
  gsap.fromTo(imageContainer.value, 
    { opacity: 0, x: -50 }, 
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
  )

  // Stagger animate the form elements
  gsap.fromTo('.gsap-item',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2
    }
  )
})
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] flex">
    
    <!-- Left Side: Image/Branding (Hidden on mobile) -->
    <div 
      ref="imageContainer"
      class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0 bg-emerald-500/10 z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-[#0B0F19] z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80" 
        alt="Trading Dashboard" 
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div class="relative z-20 text-center max-w-lg px-8">
        <h2 class="text-4xl font-bold text-white mb-6">Welcome Back to Global
        Funds</h2>
        <p class="text-gray-400 text-lg leading-relaxed">
          Access your portfolio, track your investments, and discover new strategies powered by our advanced AI analytics.
        </p>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-20">
      
      <!-- Back to Home Link
      <router-link 
        to="/" 
        class="absolute top-8 right-8 flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-emerald-400 transition-colors"
      >
        <Icon icon="lucide:arrow-left" class="w-4 h-4" />
        Back to Home
      </router-link> -->

      <div ref="formContainer" class="w-full max-w-md bg-[#12151C] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <!-- Logo Area -->
        <div class="gsap-item flex justify-center mb-8">
          <img src="/img/logo.png" alt="EversteadInvest" class="h-12 w-auto" />
        </div>

        <div class="gsap-item text-center mb-8">
          <h3 class="text-2xl font-bold text-white mb-2">Sign In</h3>
          <p class="text-gray-400 text-sm">Enter your details to access your account</p>
        </div>

        <form @submit.prevent class="space-y-5">
          
          <!-- Email Input -->
          <div class="gsap-item">
            <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Icon icon="lucide:mail" class="w-5 h-5" />
              </span>
              <input 
                v-model="email"
                type="email" 
                required
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="gsap-item">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-300">Password</label>
              <a href="#" class="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">Forgot password?</a>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Icon icon="lucide:lock" class="w-5 h-5" />
              </span>
              <input 
                v-model="password"
                type="password" 
                required
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Remember Me -->
          <div class="gsap-item flex items-center">
            <input 
              v-model="rememberMe"
              type="checkbox" 
              id="remember" 
              class="w-4 h-4 rounded border-gray-700 text-emerald-500 bg-[#0B0F19] focus:ring-emerald-500 focus:ring-offset-[#12151C]"
            />
            <label for="remember" class="ml-2 text-sm text-gray-400 cursor-pointer">Remember me for 30 days</label>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="gsap-item w-full bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] mt-4"
          >
            Sign In
          </button>

        </form>

        <p class="gsap-item text-center text-sm text-gray-400 mt-8">
          Don't have an account? 
          <router-link to="/register" class="font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
            Create one
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>
