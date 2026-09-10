<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase.ts'

const router = useRouter()

const imageContainer = ref<HTMLElement | null>(null)

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const referralCode = ref('')
const acceptTerms = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  gsap.fromTo(
    imageContainer.value,
    {
      opacity: 0,
      x: 50
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
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.2
    }
  )
})

const registerUser = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const cleanName = fullName.value.trim()
  const cleanEmail = email.value.trim().toLowerCase()
  const cleanReferralCode = referralCode.value.trim()

  // Validate full name
  if (!cleanName) {
    errorMessage.value = 'Please enter your full name.'
    return
  }

  // Validate email
  if (!cleanEmail) {
    errorMessage.value = 'Please enter your email address.'
    return
  }

  // Validate password
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.'
    return
  }

  // Confirm password
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  // Terms
  if (!acceptTerms.value) {
    errorMessage.value =
      'You must accept the Terms of Service and Privacy Policy.'
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password.value,

      options: {
        data: {
          full_name: cleanName,
          referral_code: cleanReferralCode || null
        },

        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    })

    if (error) {
      console.error('Supabase registration error:', error)

      errorMessage.value = error.message
      return
    }

    if (!data.user) {
      errorMessage.value =
        'Unable to create your account. Please try again.'
      return
    }

    /*
     * The Supabase database trigger automatically creates:
     *
     * profiles
     * wallets
     *
     * for the newly registered user.
     *
     * We therefore do NOT manually insert either record here.
     */

    successMessage.value =
      'Account created successfully. Check your email for your verification code.'

    // Store email temporarily for VerifyEmail.vue
    sessionStorage.setItem(
      'verification_email',
      cleanEmail
    )

    // Small delay so the success message can be displayed
    await new Promise((resolve) => setTimeout(resolve, 500))

    await router.push('/verify-email')

  } catch (error) {
    console.error('Registration error:', error)

    errorMessage.value =
      'Something went wrong. Please check your internet connection and try again.'

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] flex flex-row-reverse">

    <!-- Right Side: Image / Branding -->
    <div
      ref="imageContainer"
      class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
    >

      <div
        class="absolute inset-0 bg-emerald-500/10 z-10"
      ></div>

      <div
        class="absolute inset-0 bg-gradient-to-l from-[#0B0F19] via-transparent to-[#0B0F19] z-10"
      ></div>

      <img
        src="https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=1920&q=80"
        alt="Investment Growth"
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      <div
        class="relative z-20 text-center max-w-lg px-8"
      >

        <h2
          class="text-4xl font-bold text-white mb-6"
        >
          Start Your Financial Journey
        </h2>

        <p
          class="text-gray-400 text-lg leading-relaxed"
        >
          Join Global Funds and take control of your
          investment journey with powerful tools,
          strategic investment plans, and portfolio
          analytics.
        </p>

      </div>
    </div>


    <!-- Left Side -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-20 overflow-y-auto"
    >

      <div
        class="w-full max-w-md bg-[#12151C] border border-gray-800 rounded-2xl p-8 shadow-2xl my-12 lg:my-0"
      >

        <!-- Logo -->
        <div
          class="gsap-item flex justify-center mb-6"
        >

          <img
            src="/img/logo.png"
            alt="Global Funds"
            class="h-10 w-auto"
          />

        </div>


        <!-- Heading -->
        <div
          class="gsap-item text-center mb-8"
        >

          <h3
            class="text-2xl font-bold text-white mb-2"
          >
            Create an Account
          </h3>

          <p
            class="text-gray-400 text-sm"
          >
            Fill in the details below to get started
          </p>

        </div>


        <!-- Error -->
        <div
          v-if="errorMessage"
          class="gsap-item mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-2"
        >

          <Icon
            icon="lucide:circle-alert"
            class="w-5 h-5 shrink-0 mt-0.5"
          />

          <span>
            {{ errorMessage }}
          </span>

        </div>


        <!-- Success -->
        <div
          v-if="successMessage"
          class="gsap-item mb-5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-start gap-2"
        >

          <Icon
            icon="lucide:circle-check"
            class="w-5 h-5 shrink-0 mt-0.5"
          />

          <span>
            {{ successMessage }}
          </span>

        </div>


        <!-- Form -->
        <form
          @submit.prevent="registerUser"
          class="space-y-4"
        >

          <!-- Full Name -->
          <div class="gsap-item">

            <label
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Full Name
            </label>

            <div class="relative">

              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >

                <Icon
                  icon="lucide:user"
                  class="w-5 h-5"
                />

              </span>

              <input
                v-model="fullName"
                type="text"
                required
                autocomplete="name"
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="John Doe"
              />

            </div>

          </div>


          <!-- Email -->
          <div class="gsap-item">

            <label
              class="block text-sm font-medium text-gray-300 mb-1"
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


          <!-- Password / Confirm -->
          <div
            class="gsap-item grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <!-- Password -->
            <div>

              <label
                class="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>

              <div class="relative">

                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                >

                  <Icon
                    icon="lucide:lock"
                    class="w-4 h-4"
                  />

                </span>

                <input
                  v-model="password"
                  type="password"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                />

              </div>

            </div>


            <!-- Confirm -->
            <div>

              <label
                class="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirm
              </label>

              <div class="relative">

                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                >

                  <Icon
                    icon="lucide:check-circle"
                    class="w-4 h-4"
                  />

                </span>

                <input
                  v-model="confirmPassword"
                  type="password"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                />

              </div>

            </div>

          </div>


          <!-- Referral -->
          <div class="gsap-item">

            <label
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Referral Code
              <span class="text-gray-500">
                (Optional)
              </span>
            </label>

            <div class="relative">

              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >

                <Icon
                  icon="lucide:users"
                  class="w-5 h-5"
                />

              </span>

              <input
                v-model="referralCode"
                type="text"
                autocomplete="off"
                class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                placeholder="REF-12345"
              />

            </div>

          </div>


          <!-- Terms -->
          <div
            class="gsap-item flex items-start mt-2"
          >

            <input
              v-model="acceptTerms"
              type="checkbox"
              required
              id="terms"
              class="w-4 h-4 mt-0.5 rounded border-gray-700 text-emerald-500 bg-[#0B0F19] focus:ring-emerald-500 focus:ring-offset-[#12151C]"
            />

            <label
              for="terms"
              class="ml-2 text-sm text-gray-400 cursor-pointer"
            >

              I agree to the

              <router-link
                to="/terms"
                class="text-emerald-500 hover:underline"
              >
                Terms of Service
              </router-link>

              and

              <router-link
                to="/privacy"
                class="text-emerald-500 hover:underline"
              >
                Privacy Policy
              </router-link>

            </label>

          </div>


          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="gsap-item w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] mt-6"
          >

            <span
              v-if="!loading"
              class="flex items-center justify-center gap-2"
            >

              <Icon
                icon="lucide:user-plus"
                class="w-5 h-5"
              />

              Create Account

            </span>


            <span
              v-else
              class="flex items-center justify-center gap-2"
            >

              <Icon
                icon="lucide:loader-2"
                class="w-5 h-5 animate-spin"
              />

              Creating Account...

            </span>

          </button>

        </form>


        <!-- Login -->
        <p
          class="gsap-item text-center text-sm text-gray-400 mt-6"
        >

          Already have an account?

          <router-link
            to="/login"
            class="font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Sign in
          </router-link>

        </p>

      </div>

    </div>

  </div>
</template>