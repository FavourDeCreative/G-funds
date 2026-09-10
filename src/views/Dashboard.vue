<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const router = useRouter()

const user = ref<User | null>(null)
const loading = ref(true)
const mobileMenuOpen = ref(false)
const loggingOut = ref(false)

const portfolioValue = ref(0)
const totalInvested = ref(0)
const totalProfit = ref(0)

const checkUser = async () => {
  try {
    const {
      data: { user: currentUser }
    } = await supabase.auth.getUser()

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

const logout = async () => {
  loggingOut.value = true

  try {
    await supabase.auth.signOut()
    await router.replace('/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    loggingOut.value = false
  }
}

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

onMounted(async () => {
  await checkUser()

  if (user.value) {
    animateDashboard()
  }
})
</script>

<template>
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

  <div
    v-else
    class="min-h-screen bg-[#0B0F19] text-white"
  >

    <!-- Mobile Header -->
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
          :icon="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'"
          class="w-5 h-5"
        />
      </button>

    </header>

    <!-- Mobile Menu -->
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

    <div class="flex min-h-screen">

      <!-- Desktop Sidebar -->
      <aside
        class="hidden lg:flex lg:w-64 xl:w-72 bg-[#12151C] border-r border-gray-800 flex-col fixed left-0 top-0 bottom-0"
      >

        <!-- Logo -->
        <div class="h-20 flex items-center px-7 border-b border-gray-800">

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

          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#0B0F19] hover:text-white transition"
          >
            <Icon
              icon="lucide:briefcase-business"
              class="w-5 h-5"
            />

            My Investments
          </button>

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

          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#0B0F19] hover:text-white transition"
          >
            <Icon
              icon="lucide:user-round"
              class="w-5 h-5"
            />

            Profile
          </button>

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

              <p class="text-sm font-semibold text-white truncate">
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
              :icon="loggingOut ? 'lucide:loader-2' : 'lucide:log-out'"
              :class="[
                'w-4 h-4',
                loggingOut ? 'animate-spin' : ''
              ]"
            />

            {{ loggingOut ? 'Signing out...' : 'Sign Out' }}

          </button>

        </div>

      </aside>

      <!-- Main -->
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

              <span class="text-sm text-gray-300 max-w-[180px] truncate">
                {{ user?.email }}
              </span>

            </div>

          </div>

        </header>

        <!-- Content -->
        <div class="p-5 md:p-8">

          <!-- Page heading -->
          <div class="dashboard-item mb-8">

            <p class="text-sm text-gray-500 mb-1">
              Your financial overview
            </p>

            <h2 class="text-2xl md:text-3xl font-bold text-white">
              Welcome back<span class="text-emerald-500">.</span>
            </h2>

          </div>

          <!-- Balance Cards -->
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

              <div class="flex items-center justify-between mb-5">

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
                ${{ portfolioValue.toLocaleString() }}
              </h3>

              <div class="flex items-center gap-1 mt-3 text-xs text-emerald-500">

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

              <div class="flex items-center justify-between mb-5">

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
                ${{ totalInvested.toLocaleString() }}
              </h3>

              <p class="text-xs text-gray-500 mt-3">
                Across your investments
              </p>

            </div>

            <!-- Profit -->
            <div
              class="dashboard-item bg-[#12151C] border border-gray-800 rounded-2xl p-6"
            >

              <div class="flex items-center justify-between mb-5">

                <div
                  class="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center"
                >
                  <Icon
                    icon="lucide:chart-no-axes-combined"
                    class="w-5 h-5 text-purple-400"
                  />
                </div>

                <span class="text-xs text-gray-500">
                  Performance
                </span>

              </div>

              <p class="text-sm text-gray-500 mb-1">
                Total Profit
              </p>

              <h3 class="text-3xl font-bold text-emerald-500">
                +${{ totalProfit.toLocaleString() }}
              </h3>

              <p class="text-xs text-gray-500 mt-3">
                Investment returns
              </p>

            </div>

          </div>

          <!-- Main Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

            <!-- Portfolio Chart -->
            <div
              class="dashboard-item xl:col-span-2 bg-[#12151C] border border-gray-800 rounded-2xl p-6"
            >

              <div class="flex items-center justify-between mb-6">

                <div>

                  <h3 class="font-bold text-white">
                    Portfolio Performance
                  </h3>

                  <p class="text-xs text-gray-500 mt-1">
                    Your investment growth
                  </p>

                </div>

                <select
                  class="bg-[#0B0F19] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400 outline-none focus:border-emerald-500"
                >
                  <option>7 Days</option>
                  <option>30 Days</option>
                  <option>3 Months</option>
                  <option>1 Year</option>
                </select>

              </div>

              <!-- Placeholder Chart -->
              <div
                class="h-64 rounded-xl bg-[#0B0F19] border border-gray-800 flex flex-col items-center justify-center"
              >

                <Icon
                  icon="lucide:chart-line"
                  class="w-10 h-10 text-gray-700 mb-3"
                />

                <p class="text-sm text-gray-500">
                  Portfolio performance chart
                </p>

                <p class="text-xs text-gray-600 mt-1">
                  Chart data will appear here
                </p>

              </div>

            </div>

            <!-- Quick Actions -->
            <div
              class="dashboard-item bg-[#12151C] border border-gray-800 rounded-2xl p-6"
            >

              <h3 class="font-bold text-white mb-1">
                Quick Actions
              </h3>

              <p class="text-xs text-gray-500 mb-5">
                Manage your investments
              </p>

              <div class="space-y-3">

                <button
                  class="w-full flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition text-left"
                >

                  <div
                    class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"
                  >
                    <Icon
                      icon="lucide:plus"
                      class="w-5 h-5 text-emerald-500"
                    />
                  </div>

                  <div>

                    <p class="text-sm font-semibold text-white">
                      Start Investing
                    </p>

                    <p class="text-xs text-gray-500">
                      Explore investment plans
                    </p>

                  </div>

                </button>

                <button
                  class="w-full flex items-center gap-3 p-4 rounded-xl bg-[#0B0F19] border border-gray-800 hover:border-gray-700 transition text-left"
                >

                  <div
                    class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"
                  >
                    <Icon
                      icon="lucide:arrow-down-to-line"
                      class="w-5 h-5 text-blue-400"
                    />
                  </div>

                  <div>

                    <p class="text-sm font-semibold text-white">
                      Deposit Funds
                    </p>

                    <p class="text-xs text-gray-500">
                      Add money to your wallet
                    </p>

                  </div>

                </button>

                <button
                  class="w-full flex items-center gap-3 p-4 rounded-xl bg-[#0B0F19] border border-gray-800 hover:border-gray-700 transition text-left"
                >

                  <div
                    class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"
                  >
                    <Icon
                      icon="lucide:arrow-up-from-line"
                      class="w-5 h-5 text-purple-400"
                    />
                  </div>

                  <div>

                    <p class="text-sm font-semibold text-white">
                      Withdraw
                    </p>

                    <p class="text-xs text-gray-500">
                      Withdraw available funds
                    </p>

                  </div>

                </button>

              </div>

            </div>

          </div>

          <!-- Bottom Grid -->
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
          >

            <!-- Recent Activity -->
            <div
              class="dashboard-item bg-[#12151C] border border-gray-800 rounded-2xl p-6"
            >

              <div class="flex items-center justify-between mb-5">

                <div>

                  <h3 class="font-bold text-white">
                    Recent Activity
                  </h3>

                  <p class="text-xs text-gray-500 mt-1">
                    Your latest account activity
                  </p>

                </div>

                <button
                  class="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  View all
                </button>

              </div>

              <div class="flex flex-col items-center justify-center py-10">

                <div
                  class="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-3"
                >
                  <Icon
                    icon="lucide:activity"
                    class="w-5 h-5 text-gray-600"
                  />
                </div>

                <p class="text-sm text-gray-500">
                  No recent activity
                </p>

                <p class="text-xs text-gray-600 mt-1">
                  Your transactions will appear here.
                </p>

              </div>

            </div>

            <!-- Market -->
            <div
              class="dashboard-item bg-[#12151C] border border-gray-800 rounded-2xl p-6"
            >

              <div class="flex items-center justify-between mb-5">

                <div>

                  <h3 class="font-bold text-white">
                    Market Snapshot
                  </h3>

                  <p class="text-xs text-gray-500 mt-1">
                    Today's market overview
                  </p>

                </div>

                <router-link
            