<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const router = useRouter()

/*
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/

const user = ref<User | null>(null)

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
  try {
    const {
      data: { user: currentUser },
      error
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Authentication error:', error)

      await router.replace('/login')
      return
    }

    if (!currentUser) {
      await router.replace('/login')
      return
    }

    user.value = currentUser

  } catch (error) {
    console.error('Authentication error:', error)

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
    const { data, error } = await supabase
      .from('wallets')
      .select(`
        balance,
        available_balance,
        invested_balance,
        profit,
        currency
      `)
      .eq('user_id', user.value.id)
      .maybeSingle()

    if (error) {
      console.error('Wallet error:', error)

      errorMessage.value =
        'Unable to load your wallet information.'

      return
    }

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

    totalInvested.value =
      Number(data.invested_balance ?? 0)

    totalProfit.value =
      Number(data.profit ?? 0)

    availableBalance.value =
      Number(data.available_balance ?? 0)

    currency.value =
      data.currency || 'USD'

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
    const { data, error } = await supabase
      .from('investments')
      .select('id')
      .eq('user_id', user.value.id)
      .eq('status', 'active')

    if (error) {
      console.error('Investment loading error:', error)
      return
    }

    activeInvestments.value = data?.length ?? 0

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
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return
    }

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


      <!-- ===================================================== -->
      <!-- DESKTOP SIDEBAR -->
      <!-- ===================================================== -->

      <aside
        class="hidden lg:flex lg:w-64 xl:w-72 bg-[#12151C] border-r border-gray-800 flex-col fixed left-0 top-0 bottom-0"
      >

        <!-- Logo -->

        <div
          class="h-20 flex items-center px-7 border-b border-gray-800"
        >

          <img
            src="/img/logo.png"
            alt="Global Funds"
            class="h-10 w-auto"
          />

        </div>


        <!-- Navigation -->

        <nav class="flex-1 p-5 space-y-2">

          <p
            class="text-[10px] uppercase tracking-widest text-gray-600 font-bold px-3 mb-4"
          >
            Overview
          </p>


          <!-- Dashboard -->

          <router-link
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium"
          >

            <Icon
              icon="lucide:layout-dashboard"
              class="w-5 h-5"
            />

            Dashboard

          </router-link>


          <!-- Market -->

          <router-link
            to="/market"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#0B0F19] hover:text-white transition"
          >

            <Icon
              icon="lucide:chart-candlestick"
              class="w-5 h-5"
            />

            Market

          </router-link>


          <!-- Investments -->

          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#0B0F19] hover:text-white transition"
          >

            <Icon
              icon="lucide:briefcase-business"
              class="w-5 h-5"
            />

            My Investments

          </button>


          <!-- Wallet -->

          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#0B0F19] hover:text-white transition"
          >

            <Icon
              icon="lucide:wallet"
              class="w-5 h-5"
            />

            Wallet

          </button>


          <p
            class="text-[10px] uppercase tracking-widest text-gray-600 font-bold px-3 mt-8 mb-4"
          >
            Account
          </p>


          <!-- Profile -->

          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#0B0F19] hover:text-white transition"
          >

            <Icon
              icon="lucide:user-round"
              class="w-5 h-5"
            />

            Profile

          </button>


          <!-- Settings -->

          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#0B0F19] hover:text-white transition"
          >

            <Icon
              icon="lucide:settings"
              class="w-5 h-5"
            />

            Settings

          </button>

        </nav>


        <!-- User -->

        <div class="p-5 border-t border-gray-800">

          <div class="flex items-center gap-3 mb-4">

            <div
              class="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            >

              <Icon
                icon="lucide:user"
                class="w-5 h-5 text-emerald-500"
              />

            </div>


            <div class="min-w-0">

              <p
                class="text-sm font-semibold text-white truncate"
              >
                {{ user?.email }}
              </p>

              <p class="text-xs text-gray-500">
                Investor
              </p>

            </div>

          </div>


          <button
            @click="logout"
            :disabled="loggingOut"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition disabled:opacity-50"
          >

            <Icon
              :icon="
                loggingOut
                  ? 'lucide:loader-2'
                  : 'lucide:log-out'
              "
              :class="[
                'w-4 h-4',
                loggingOut ? 'animate-spin' : ''
              ]"
            />

            {{
              loggingOut
                ? 'Signing out...'
                : 'Sign Out'
            }}

          </button>

        </div>

      </aside>


      <!-- ===================================================== -->
      <!-- MAIN -->
      <!-- ===================================================== -->

      <main
        class="w-full lg:ml-64 xl:ml-72"
      >


        <!-- Desktop Topbar -->

        <header
          class="hidden lg:flex h-20 bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-800 items-center justify-between px-8 sticky top-0 z-30"
        >

          <div>

            <p class="text-xs text-gray-500 mb-1">
              Welcome back
            </p>

            <h1 class="text-xl font-bold text-white">
              Dashboard
            </h1>

          </div>


          <div class="flex items-center gap-5">

            <button
              class="w-10 h-10 rounded-lg border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#12151C] transition"
            >

              <Icon
                icon="lucide:bell"
                class="w-5 h-5"
              />

            </button>


            <div class="h-8 w-px bg-gray-800"></div>


            <div class="flex items-center gap-3">

              <div
                class="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
              >

                <Icon
                  icon="lucide:user"
                  class="w-4 h-4 text-emerald-500"
                />

              </div>


              <span
                class="text-sm text-gray-300 max-w-[180px] truncate"
              >
                {{ user?.email }}
              </span>

            </div>

          </div>

        </header>


        <!-- =================================================== -->
        <!-- CONTENT -->
        <!-- =================================================== -->

        <div class="p-5 md:p-8">


          <!-- Page Heading -->

          <div class="dashboard-item mb-8">

            <p class="text-sm text-gray-500 mb-1">
              Your financial overview
            </p>

            <h2
              class="text-2xl md:text-3xl font-bold text-white"
            >

              Welcome back<span class="text-emerald-500">.</span>

            </h2>

          </div>


          <!-- ================================================= -->
          <!-- ERROR -->
          <!-- ================================================= -->

          <div
            v-if="errorMessage"
            class="dashboard-item mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-3"
          >

            <Icon
              icon="lucide:circle-alert"
              class="w-5 h-5 shrink-0"
            />

            {{ errorMessage }}

          </div>


          <!-- ================================================= -->
          <!-- BALANCE CARDS -->
          <!-- ================================================= -->

          <div
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6"
          >


            <!-- Portfolio -->

            <div
              class="dashboard-item relative overflow-hidden bg-[#12151C] border border-gray-800 rounded-2xl p-6"
            >

              <div
                class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"
              ></div>


              <div
                class="flex items-center justify-between mb-5"
              >

                <div
                  class="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center"
                >

                  <Icon
                    icon="lucide:wallet"
                    class="w-5 h-5 text-emerald-500"
                  />

                </div>


                <span class="text-xs text-gray-500">
                  Portfolio
                </span>

              </div>


              <p class="text-sm text-gray-500 mb-1">
                Total Balance
              </p>


              <h3 class="text-3xl font-bold text-white">

                <span v-if="!dataLoading">
                  {{ currencySymbol }}{{ formatMoney(portfolioValue) }}
                </span>

                <span
                  v-else
                  class="inline-block w-28 h-8 bg-gray-800 rounded animate-pulse"
                ></span>

              </h3>


              <div
                class="flex items-center gap-1 mt-3 text-xs text-emerald-500"
              >

                <Icon
                  icon="lucide:trending-up"
                  class="w-3.5 h-3.5"
                />

                <span>
                  Portfolio value
                </span>

              </div>

            </div>


            <!-- Invested -->

            <div
              class="dashboard-item bg-[#12151C] border border-gray-800 rounded-2xl p-6"
            >

              <div
                class="flex items-center justify-between mb-5"
              >

                <div
                  class="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center"
                >

                  <Icon
                    icon="lucide:landmark"
                    class="w-5 h-5 text-blue-400"
                  />

                </div>


                <span class="text-xs text-gray-500">
                  Capital
                </span>

              </div>


              <p class="text-sm text-gray-500 mb-1">
                Total Invested
              </p>


              <h3 class="text-3xl font-bold text-white">

                <span v-if="!dataLoading">
                  {{ currencySymbol }}{{ formatMoney(totalInvested) }}
                </span>

                <span
                  v-else
                  class="inline-block w-28 h-8 bg-gray-800 rounded animate-pulse"
                ></span>