<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import api from '../api/client'

const imageContainer = ref<HTMLElement | null>(null)

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  gsap.fromTo(
    imageContainer.value,
    {
      opacity: 0,
      x: -50
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out'
    }
  )

  gsap.fromTo(
    '.gsap-item',
    {
      opacity: 0,
      y: 20
    },
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

const resetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const cleanEmail = email.value.trim()

  if (!cleanEmail) {
    errorMessage.value = 'Please enter your email address.'
    return
  }

  loading.value = true

  try {
    await api.post('/auth/forgot-password', { email: cleanEmail })

    successMessage.value =
      'Password reset instructions have been sent to your email address.'

    email.value = ''
  } catch (err: any) {
    console.error('Password reset error:', err)

    errorMessage.value =
      err.response?.data?.message ||
      'Something went wrong. Please check your internet connection and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] flex">

    <!-- Left Side -->
    <div
      ref="imageContainer"
      class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0 bg-emerald-500/10 z-10"></div>

      <div
        class="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-[#0B0F19] z-10"
      ></div>

      <img
        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80"
        alt="Global Funds"
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      <div class="relative z-20 text-center max-w-lg px-8">

        <div class="flex justify-center mb-6">
          <div
            class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
          >
            <Icon
              icon="lucide:shield-check"
              class="w-8 h-8 text-emerald-500"
            />
          </div>
        </div>

        <h2 class="text-4xl font-bold text-white mb-6">
          Secure Account Recovery
        </h2>

        <p class="text-gray-400 text-lg leading-relaxed">
          Don't worry. We'll help you securely regain access to your
          Global Funds account.
        </p>
      </div>
    </div>

    <!-- Right Side -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-20"
    >

      <div
        class="w-full max-w-md bg-[#12151C] border border-gray-800 rounded-2xl p-8 shadow-2xl"
      >

        <!-- Logo -->
        <div class="gsap-item flex justify-center mb-8">
          <img
            src="/img/logo.png"
            alt="Global Funds"
            class="h-12 w-auto"
          />
        </div>

        <!-- Heading -->
        <div class="gsap-item text-center mb-8">

          <div
            class="mx-auto mb-5 w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center"
          >
            <Icon
              icon="lucide:key-round"
              class="w-7 h-7 text-emerald-500"
            />
          </div>

          <h3 class="text-2xl font-bold text-white mb-2">
            Forgot Password?
          </h3>

          <p class="text-gray-400 text-sm leading-relaxed">
            Enter your email address and we'll send you instructions
            to reset your password.
          </p>

        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="gsap-item mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Success -->
        <div
          v-if="successMessage"
          class="gsap-item mb-5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex gap-3"
        >
          <Icon
            icon="lucide:check-circle"
            class="w-5 h-5 flex-shrink-0"
          />

          <span>
            {{ successMessage }}
          </span>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="resetPassword"
          class="space-y-5"
        >

          <!-- Email -->
          <div class="gsap-item">

            <label
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>

            <div class="relative">

              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Icon
                  icon="lucide:mail"
                  class="w-5 h-5"
                />
              </span>

              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="john.doe@example.com"
              />

            </div>

          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="gsap-item w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          >

            <span
              v-if="!loading"
              class="flex items-center justify-center gap-2"
            >
              <Icon
                icon="lucide:send"
                class="w-5 h-5"
              />

              Send Reset Link
            </span>

            <span
              v-else
              class="flex items-center justify-center gap-2"
            >
              <Icon
                icon="lucide:loader-2"
                class="w-5 h-5 animate-spin"
              />

              Sending...
            </span>

          </button>

        </form>

        <!-- Back to Login -->
        <div class="gsap-item text-center mt-8">

          <router-link
            to="/login"
            class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-500 transition-colors"
          >
            <Icon
              icon="lucide:arrow-left"
              class="w-4 h-4"
            />

            Back to Sign In
          </router-link>

        </div>

      </div>

    </div>

  </div>
</template>