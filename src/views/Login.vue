<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const auth = useAuth()

const imageContainer = ref<HTMLElement | null>(null)

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const loading = ref(false)
const errorMessage = ref('')

// Forgot password modal
const showForgotPassword = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotError = ref('')
const forgotSuccess = ref('')

onMounted(() => {
  gsap.fromTo(
    imageContainer.value,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
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
      delay: 0.2,
    }
  )
})

/**
 * Login
 *
 * Authentication is handled through useAuth().
 * The auth store communicates with the Express backend.
 */
const loginUser = async () => {
  errorMessage.value = ''

  const cleanEmail = email.value.trim()

  if (!cleanEmail || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  loading.value = true

  try {
    await auth.login(cleanEmail, password.value)

    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
    } else {
      localStorage.removeItem('rememberMe')
    }

    await router.push('/dashboard')
  } catch (err: any) {
    errorMessage.value =
      err.response?.data?.message ||
      'Something went wrong. Please check your internet connection and try again.'
  } finally {
    loading.value = false
  }
}

/**
 * Open forgot password modal
 */
const openForgotPassword = () => {
  forgotEmail.value = email.value.trim()
  forgotError.value = ''
  forgotSuccess.value = ''

  showForgotPassword.value = true

  setTimeout(() => {
    gsap.fromTo(
      '.forgot-modal',
      {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: 'power3.out',
      }
    )
  }, 10)
}

/**
 * Close forgot password modal
 */
const closeForgotPassword = () => {
  gsap.to('.forgot-modal', {
    opacity: 0,
    scale: 0.95,
    y: 20,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      showForgotPassword.value = false
    },
  })
}

/**
 * Send password reset email
 *
 * NOTE:
 * The backend does not currently expose
 * POST /auth/forgot-password.
 *
 * This will remain ready for when the
 * password-reset backend is implemented.
 */
const sendResetEmail = async () => {
  forgotError.value = ''
  forgotSuccess.value = ''

  const cleanEmail = forgotEmail.value.trim()

  if (!cleanEmail) {
    forgotError.value = 'Please enter your email address.'
    return
  }

  forgotLoading.value = true

  try {
    // Backend endpoint will be implemented later.
    await auth.requestPasswordReset(cleanEmail)

    forgotSuccess.value =
      'Password reset instructions have been sent to your email.'
  } catch (err: any) {
    forgotError.value =
      err.response?.data?.message ||
      "Password reset isn't available yet. Please contact support."
  } finally {
    forgotLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] flex">

    <!-- Left Side: Image / Branding -->
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
        alt="Trading Dashboard"
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      <div class="relative z-20 text-center max-w-lg px-8">
        <h2 class="text-4xl font-bold text-white mb-6">
          Welcome Back to Global Funds
        </h2>

        <p class="text-gray-400 text-lg leading-relaxed">
          Access your portfolio, track your investments, and discover new
          strategies powered by our advanced AI analytics.
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
          <h3 class="text-2xl font-bold text-white mb-2">
            Sign In
          </h3>

          <p class="text-gray-400 text-sm">
            Enter your details to access your account
          </p>
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="gsap-item mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Login Form -->
        <form
          @submit.prevent="loginUser"
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

          <!-- Password -->
          <div class="gsap-item">

            <div class="flex justify-between items-center mb-2">
              <label
                class="block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <button
                type="button"
                @click="openForgotPassword"
                class="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>

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
                type="password"
                required
                autocomplete="current-password"
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Remember Me -->
          <div class="gsap-item flex items-center">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-700 text-emerald-500 bg-[#0B0F19] focus:ring-emerald-500 focus:ring-offset-[#12151C]"
            />

            <label
              for="remember"
              class="ml-2 text-sm text-gray-400 cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="gsap-item w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] mt-4"
          >
            <span
              v-if="!loading"
              class="flex items-center justify-center"
            >
              Sign In
            </span>

            <span
              v-else
              class="flex items-center justify-center gap-2"
            >
              <Icon
                icon="lucide:loader-2"
                class="w-5 h-5 animate-spin"
              />

              Signing In...
            </span>
          </button>
        </form>

        <!-- Register -->
        <p class="gsap-item text-center text-sm text-gray-400 mt-8">
          Don't have an account?

          <router-link
            to="/register"
            class="font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Create one
          </router-link>
        </p>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <Transition name="modal">
      <div
        v-if="showForgotPassword"
        class="fixed inset-0 z-[100] flex items-center justify-center p-5"
      >

        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="closeForgotPassword"
        ></div>

        <!-- Modal -->
        <div
          class="forgot-modal relative w-full max-w-md bg-[#12151C] border border-gray-800 rounded-2xl p-7 md:p-8 shadow-2xl"
        >

          <!-- Close -->
          <button
            type="button"
            @click="closeForgotPassword"
            class="absolute top-5 right-5 w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#0B0F19] transition"
          >
            <Icon
              icon="lucide:x"
              class="w-5 h-5"
            />
          </button>

          <!-- Icon -->
          <div
            class="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6"
          >
            <Icon
              icon="lucide:key-round"
              class="w-7 h-7 text-emerald-500"
            />
          </div>

          <!-- Heading -->
          <div class="mb-6 pr-8">
            <h3 class="text-2xl font-bold text-white mb-2">
              Forgot Password?
            </h3>

            <p class="text-sm text-gray-400 leading-relaxed">
              Enter your email address and we'll send you
              a secure link to create a new password.
            </p>
          </div>

          <!-- Error -->
          <div
            v-if="forgotError"
            class="mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex gap-2"
          >
            <Icon
              icon="lucide:circle-alert"
              class="w-5 h-5 flex-shrink-0"
            />

            <span>{{ forgotError }}</span>
          </div>

          <!-- Success -->
          <div
            v-if="forgotSuccess"
            class="mb-5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex gap-2"
          >
            <Icon
              icon="lucide:circle-check"
              class="w-5 h-5 flex-shrink-0"
            />

            <span>{{ forgotSuccess }}</span>
          </div>

          <!-- Reset Form -->
          <form
            v-if="!forgotSuccess"
            @submit.prevent="sendResetEmail"
            class="space-y-5"
          >

            <div>
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
                  v-model="forgotEmail"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="forgotLoading"
              class="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >

              <span
                v-if="!forgotLoading"
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

          <!-- Back -->
          <button
            v-if="forgotSuccess"
            type="button"
            @click="closeForgotPassword"
            class="w-full mt-2 border