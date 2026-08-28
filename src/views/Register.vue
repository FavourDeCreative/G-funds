<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'

const formContainer = ref<HTMLElement | null>(null)
const imageContainer = ref<HTMLElement | null>(null)

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const referralCode = ref('')
const acceptTerms = ref(false)

onMounted(() => {
  // Animate the image side
  gsap.fromTo(imageContainer.value, 
    { opacity: 0, x: 50 }, 
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
  )

  // Stagger animate the form elements
  gsap.fromTo('.gsap-item',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.2
    }
  )
})
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] flex flex-row-reverse">
    
    <!-- Right Side: Image/Branding (Hidden on mobile) -->
    <div 
      ref="imageContainer"
      class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0 bg-emerald-500/10 z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-l from-[#0B0F19] via-transparent to-[#0B0F19] z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=1920&q=80" 
        alt="Investment Growth" 
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div class="relative z-20 text-center max-w-lg px-8">
        <h2 class="text-4xl font-bold text-white mb-6">Start Your Financial Journey</h2>
        <p class="text-gray-400 text-lg leading-relaxed">
          Join thousands of investors securing their future. Register today to access our strategic plans and daily compounding interest.
        </p>
      </div>
    </div>

    <!-- Left Side: Registration Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-20 overflow-y-auto">
      
      <!-- Back to Home Link
      <router-link 
        to="/" 
        class="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-emerald-400 transition-colors"
      >
        <Icon icon="lucide:arrow-left" class="w-4 h-4" />
        Back to Home
      </router-link> -->

      <div ref="formContainer" class="w-full max-w-md bg-[#12151C] border border-gray-800 rounded-2xl p-8 shadow-2xl my-12 lg:my-0">
        
        <!-- Logo Area -->
        <div class="gsap-item flex justify-center mb-6">
          <img src="/img/logo.png" alt="EversteadInvest" class="h-10 w-auto" />
        </div>

        <div class="gsap-item text-center mb-8">
          <h3 class="text-2xl font-bold text-white mb-2">Create an Account</h3>
          <p class="text-gray-400 text-sm">Fill in the details below to get started</p>
        </div>

        <form @submit.prevent class="space-y-4">
          
          <!-- Full Name -->
          <div class="gsap-item">
            <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Icon icon="lucide:user" class="w-5 h-5" />
              </span>
              <input 
                v-model="fullName"
                type="text" 
                required
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="John Doe"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="gsap-item">
            <label class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
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

          <!-- Password Grid (Side by side on desktop) -->
          <div class="gsap-item grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Icon icon="lucide:lock" class="w-4 h-4" />
                </span>
                <input 
                  v-model="password"
                  type="password" 
                  required
                  class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Confirm</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Icon icon="lucide:check-circle" class="w-4 h-4" />
                </span>
                <input 
                  v-model="confirmPassword"
                  type="password" 
                  required
                  class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <!-- Referral Code (Optional) -->
          <div class="gsap-item">
            <label class="block text-sm font-medium text-gray-300 mb-1">Referral Code <span class="text-gray-500">(Optional)</span></label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Icon icon="lucide:users" class="w-5 h-5" />
              </span>
              <input 
                v-model="referralCode"
                type="text" 
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="REF-12345"
              />
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="gsap-item flex items-start mt-2">
            <input 
              v-model="acceptTerms"
              type="checkbox" 
              required
              id="terms" 
              class="w-4 h-4 mt-0.5 rounded border-gray-700 text-emerald-500 bg-[#0B0F19] focus:ring-emerald-500 focus:ring-offset-[#12151C]"
            />
            <label for="terms" class="ml-2 text-sm text-gray-400 cursor-pointer">
              I agree to the <a href="#" class="text-emerald-500 hover:underline">Terms of Service</a> and <a href="#" class="text-emerald-500 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="gsap-item w-full bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] mt-6"
          >
            Create Account
          </button>

        </form>

        <p class="gsap-item text-center text-sm text-gray-400 mt-6">
          Already have an account? 
          <router-link to="/login" class="font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
            Sign in
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>
