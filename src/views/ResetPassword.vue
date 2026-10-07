<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import api from '../api/client'

const router = useRouter()

/*
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/

interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

const user = ref<AuthUser | null>(null)

const loading = ref(true)
const dataLoading = ref(true)
const mobileMenuOpen = ref(false)
const loggingOut = ref(false)

/*
|--------------------------------------------------------------------------
| WALLET DATA
|--------------------------------------------------------------------------
*/

const portfolioValue = ref(0)
const totalInvested = ref(0)
const totalProfit = ref(0)
const availableBalance = ref(0)

const currency = ref('USD')

/*
|--------------------------------------------------------------------------
| INVESTMENT DATA
|--------------------------------------------------------------------------
*/

const activeInvestments = ref(0)

/*
|--------------------------------------------------------------------------
| ERROR
|--------------------------------------------------------------------------
*/

const errorMessage = ref('')

/*
|--------------------------------------------------------------------------
| CURRENCY FORMATTER
|--------------------------------------------------------------------------
*/

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/*
|--------------------------------------------------------------------------
| CURRENCY SYMBOL
|--------------------------------------------------------------------------
*/

const currencySymbol = computed(() => {
  if (currency.value === 'NGN') return '₦'
  if (currency.value === 'GBP') return '£'
  if (currency.value === 'EUR') return '€'

  return '$'
})

/*
|--------------------------------------------------------------------------
| CHECK AUTHENTICATION
|--------------------------------------------------------------------------
*/

const checkUser = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    await router.replace('/login')
    return
  }

  try {
    const response = await api.get('/auth/me')

    user.value = response.data?.data?.user ?? null

    if (!user.value) {
      throw new Error('User information was not returned.')
    }

  } catch (error) {
    console.error('Authentication error:', error)

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    await router.replace('/login')

  } finally {
    loading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| LOAD WALLET
|--------------------------------------------------------------------------
*/

const loadWallet = async () => {
  if (!user.value) return

  dataLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/wallet')

    const data = response.data?.data

    /*
     * If the wallet doesn't exist yet, keep the dashboard
     * at zero rather than showing an error.
     */

    if (!data) {
      portfolioValue.value = 0
      totalInvested.value = 0
      totalProfit.value = 0
      availableBalance.value = 0

      return
    }

    portfolioValue.value = Number(data.balance ?? 0)
    totalInvested.value = Number(data.investedBalance ?? 0)
    totalProfit.value = Number(data.profit ?? 0)
    availableBalance.value = Number(data.availableBalance ?? 0)
    currency.value = data.currency || 'USD'

  } catch (error) {
    console.error('Wallet loading error:', error)

    errorMessage.value =
      'Something went wrong while loading your wallet.'

  } finally {
    dataLoading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| LOAD INVESTMENTS
|--------------------------------------------------------------------------
*/

const loadInvestments = async () => {
  if (!user.value) return

  try {
    const response = await api.get('/investments', {
      params: { status: 'active' }
    })

    activeInvestments.value = response.data?.data?.length ?? 0

  } catch (error) {
    console.error('Investment loading error:', error)
  }
}

/*
|--------------------------------------------------------------------------
| LOAD DASHBOARD DATA
|--------------------------------------------------------------------------
*/

const loadDashboardData = async () => {
  await Promise.all([
    loadWallet(),
    loadInvestments()
  ])
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

const logout = async () => {
  loggingOut.value = true

  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    user.value = null

    await router.replace('/login')

  } catch (error) {
    console.error('Logout error:', error)

  } finally {
    loggingOut.value = false
  }
}

/*
|--------------------------------------------------------------------------
| DASHBOARD ANIMATION
|--------------------------------------------------------------------------
*/

const animateDashboard = () => {
  gsap.fromTo(
    '.dashboard-item',
    {
      opacity: 0,
      y: 20
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out'
    }
  )
}

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await checkUser()

  if (!user.value) return

  await loadDashboardData()

  animateDashboard()
})
</script>


<template>

  <!-- ========================================================= -->
  <!-- LOADING -->
  <!-- ========================================================= -->

  <div
    v-if="loading"
    class="min-h-screen bg-[#0B0F19] flex items-center justify-center"
  >

    <div class="text-center">

      <Icon
        icon="lucide:loader-2"
        class="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4"
      />

      <p class="text-gray-400 text-sm">
        Loading your dashboard...
      </p>

    </div>

  </div>


  <!-- ========================================================= -->
  <!-- DASHBOARD -->
  <!-- ========================================================= -->

  <div
    v-else
    class="min-h-screen bg-[#0B0F19] text-white"
  >


    <!-- ======================================================= -->
    <!-- MOBILE HEADER -->
    <!-- ======================================================= -->

    <header
      class="lg:hidden h-16 bg-[#12151C] border-b border-gray-800 flex items-center justify-between px-5 sticky top-0 z-50"
    >

      <img
        src="/img/logo.png"
        alt="Global Funds"
        class="h-9 w-auto"
      />

      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="w-10 h-10 rounded-lg bg-[#0B0F19] border border-gray-800 flex items-center justify-center text-gray-300"
      >

        <Icon
          :icon="
            mobileMenuOpen
              ? 'lucide:x'
              : 'lucide:menu'
          "
          class="w-5 h-5"
        />

      </button>

    </header>


    <!-- ======================================================= -->
    <!-- MOBILE MENU -->
    <!-- ======================================================= -->

    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 top-16 bg-[#0B0F19] z-40 p-5"
    >

      <nav class="space-y-2">

        <router-link
          to="/dashboard"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/10 text-emerald-500"
        >

          <Icon
            icon="lucide:layout-dashboard"
            class="w-5 h-5"
          />

          Dashboard

        </router-link>


        <router-link
          to="/market"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#12151C] hover:text-white transition"
        >

          <Icon
            icon="lucide:chart-candlestick"
            class="w-5 h-5"
          />

          Market

        </router-link>


        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
        >

          <Icon
            icon="lucide:log-out"
            class="w-5 h-5"
          />

          Sign Out

        </button>

      </nav>

    </div>


    <!-- ======================================================= -->
    <!-- MAIN LAYOUT -->
    <!-- ======================================================= -->

    <div class="flex min-h-screen">


      <!-- ============================================