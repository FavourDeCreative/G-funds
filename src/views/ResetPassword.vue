<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/client'

const router = useRouter()
const route = useRoute()

const imageContainer = ref<HTMLElement | null>(null)

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// The reset token arrives as a query param on the link sent by email,
// e.g. /reset-password?token=abc123
const resetToken = ref('')

onMounted(() => {
  resetToken.value = (route.query.token as string) || ''

  if (!resetToken.value) {
    errorMessage.value =
      'This reset link is invalid or has expired. Please request a new one.'
  }

  gsap.fromTo(
    imageContainer.value,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out'
    }
  )

  gsap.fromTo(
    '.gsap-item',
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

const resetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!resetToken.value) {
    errorMessage.value =
      'This reset link is invalid or has expired. Please request a new one.'
    return
  }

  if (!password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in both password fields.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    await api.post('/auth/reset-password', {
      token: resetToken.value,
      password: password.value
    })

    successMessage.value =
      'Your password has been reset. Redirecting you to sign in...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    errorMessage.value =
      err.response?.data?.message ||
      'Something went wrong. Your reset link may have expired — please request a new one.'
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
          Create a New Password
        </h2>

        <p class="text-gray-400 text-lg leading-relaxed">
          Choose a strong password to keep your Global Funds account
          secure.
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
              icon="lucide:lock-keyhole"
              class="w-7 h-7 text-emerald-500"
            />
          </div>

          <h3 class="text-2xl font-bold text-white mb-2">
            Reset Password
          </h3>

          <p class="text-gray-400 text-sm leading-relaxed">
            Enter a new password for your account below.
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
          v-if="!successMessage"
          @submit.prevent="resetPassword"
          class="space-y-5"
        >

          <!-- New Password -->
          <div class="gsap-item">

            <label
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              New Password
            </label>

            <div class="relative">

              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Icon
                  icon="lucide:lock"
                  class="w-5 h-5"
                />
              </span>

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-11 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="••••••••"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Icon
                  :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                  class="w-5 h-5"
                />
              </button>

            </div>

          </div>

          <!-- Confirm Password -->
          <div class="gsap-item">

            <label
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm New Password
            </label>

            <div class="relative">

              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Icon
                  icon="lucide:lock"
                  class="w-5 h-5"
                />
              </span>

              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-11 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="••••••••"
              />

              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Icon
                  :icon="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'"
                  class="w-5 h-5"
                />
              </button>

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
                icon="lucide:shield-check"
                class="w-5 h-5"
              />

              Reset Password
            </span>

            <span
              v-else
              class="flex items-center justify-center gap-2"
            >
              <Icon
                icon="lucide:loader-2"
                class="w-5 h-5 animate-spin"
              />

              Resetting...
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