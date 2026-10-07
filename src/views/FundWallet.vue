<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import api from '../api/client'

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface InvestmentPlan {
  id: string
  name: string
  roi: number
  durationDays: number
}

interface WalletOption {
  id: string
  coinName: string
  network: string
  address: string
}

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const formContainer = ref<HTMLElement | null>(null)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const selectedPlanId = ref('')
const selectedWalletId = ref('')
const amount = ref('')
const paymentDate = ref(new Date().toISOString().split('T')[0])

/*
 * These two would normally come from your backend (plans and
 * supported deposit wallets). Hardcoded here until those endpoints
 * exist — replace with api.get('/plans') and api.get('/wallets')
 * once available.
 */

const investmentPlans = ref<InvestmentPlan[]>([
  { id: 'beginner', name: 'Beginner Plan', roi: 10, durationDays: 1 },
  { id: 'standard', name: 'Standard Plan', roi: 25, durationDays: 7 },
  { id: 'premium', name: 'Premium Plan', roi: 50, durationDays: 30 },
])

const walletOptions = ref<WalletOption[]>([
  {
    id: 'usdt-bep20',
    coinName: 'USDT BEP20',
    network: 'Binance Chain (BEP2)',
    address: '0xE6f89E13aeb510cE485B10155cE99047dB6a30A2',
  },
  {
    id: 'btc',
    coinName: 'Bitcoin',
    network: 'Bitcoin Network',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  },
  {
    id: 'usdt-trc20',
    coinName: 'USDT TRC20',
    network: 'Tron (TRC20)',
    address: 'TXYZ1234567890abcdefghijklmnopqrstuv',
  },
])

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const selectedWallet = computed(() =>
  walletOptions.value.find((w) => w.id === selectedWalletId.value) ?? null
)

/*
|--------------------------------------------------------------------------
| ANIMATION
|--------------------------------------------------------------------------
*/

onMounted(() => {
  // Default to the first wallet so the read-only fields aren't empty
  if (walletOptions.value.length > 0) {
    selectedWalletId.value = walletOptions.value[0].id
  }

  if (investmentPlans.value.length > 0) {
    selectedPlanId.value = investmentPlans.value[0].id
  }

  gsap.fromTo(
    formContainer.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  )

  gsap.fromTo(
    '.form-item',
    { opacity: 0, y: 15 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.15,
    }
  )
})

/*
|--------------------------------------------------------------------------
| CLIPBOARD
|--------------------------------------------------------------------------
*/

const copied = ref(false)

const copyAddress = async () => {
  if (!selectedWallet.value) return

  try {
    await navigator.clipboard.writeText(selectedWallet.value.address)
    copied.value = true

    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

/*
|--------------------------------------------------------------------------
| SUBMIT
|--------------------------------------------------------------------------
*/

const submitTopUp = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!selectedPlanId.value) {
    errorMessage.value = 'Please select an investment plan.'
    return
  }

  if (!selectedWalletId.value || !selectedWallet.value) {
    errorMessage.value = 'Please select a wallet.'
    return
  }

  const numericAmount = Number(amount.value)

  if (!amount.value || numericAmount <= 0) {
    errorMessage.value = 'Please enter a valid amount.'
    return
  }

  loading.value = true

  try {
    // Backend endpoint for deposits isn't built yet — this call is
    // ready for when POST /wallet/deposit exists.
    await api.post('/wallet/deposit', {
      planId: selectedPlanId.value,
      coinName: selectedWallet.value.coinName,
      network: selectedWallet.value.network,
      walletAddress: selectedWallet.value.address,
      amount: numericAmount,
      paymentDate: paymentDate.value,
    })

    successMessage.value =
      'Your deposit has been submitted. Funds will reflect after verification.'

    amount.value = ''
  } catch (err: any) {
    errorMessage.value =
      err.response?.data?.message ||
      'Something went wrong while submitting your deposit. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] text-white p-5 md:p-8">
    <div ref="formContainer" class="max-w-lg mx-auto">

      <!-- Fund Wallet Button / Heading -->
      <div class="form-item text-center mb-6">
        <button
          type="button"
          class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <Icon icon="lucide:wallet" class="w-5 h-5" />
          Fund Wallet
        </button>
      </div>

      <!-- Form Card -->
      <div class="bg-[#12151C] border border-gray-800 rounded-2xl p-6 md:p-8">

        <!-- Info Banner -->
        <p class="form-item text-sm text-gray-400 mb-6 text-center">
          Funds added to your wallet will be available shortly after
          verification.
        </p>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="form-item mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Success -->
        <div
          v-if="successMessage"
          class="form-item mb-5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex gap-2"
        >
          <Icon icon="lucide:check-circle" class="w-5 h-5 flex-shrink-0" />
          <span>{{ successMessage }}</span>
        </div>

        <form @submit.prevent="submitTopUp" class="space-y-5">

          <!-- Investment Plan -->
          <div class="form-item">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Investment Plan
            </label>

            <select
              v-model="selectedPlanId"
              class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option
                v-for="plan in investmentPlans"
                :key="plan.id"
                :value="plan.id"
              >
                {{ plan.name }} - {{ plan.roi.toFixed(2) }}% ROI for
                {{ plan.durationDays }} day{{ plan.durationDays > 1 ? 's' : '' }}
              </option>
            </select>
          </div>

          <!-- Select Wallet -->
          <div class="form-item">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Select Wallet
            </label>

            <select
              v-model="selectedWalletId"
              class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option
                v-for="wallet in walletOptions"
                :key="wallet.id"
                :value="wallet.id"
              >
                {{ wallet.coinName }}
              </option>
            </select>
          </div>

          <!-- Wallet Address (read-only, auto-filled) -->
          <div class="form-item" v-if="selectedWallet">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Wallet Address
            </label>

            <div class="relative">
              <input
                :value="selectedWallet.address"
                readonly
                class="w-full bg-[#0B0F19]/60 border border-gray-800 rounded-lg px-4 py-3 pr-12 text-gray-400 text-sm truncate cursor-default focus:outline-none"
              />

              <button
                type="button"
                @click="copyAddress"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-500 transition-colors"
              >
                <Icon
                  :icon="copied ? 'lucide:check' : 'lucide:copy'"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <!-- Coin Name (read-only, auto-filled) -->
          <div class="form-item" v-if="selectedWallet">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Coin Name
            </label>

            <input
              :value="selectedWallet.coinName"
              readonly
              class="w-full bg-[#0B0F19]/60 border border-gray-800 rounded-lg px-4 py-3 text-gray-400 cursor-default focus:outline-none"
            />
          </div>

          <!-- Select Network (read-only, auto-filled) -->
          <div class="form-item" v-if="selectedWallet">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Select Network
            </label>

            <input
              :value="selectedWallet.network"
              readonly
              class="w-full bg-[#0B0F19]/60 border border-gray-800 rounded-lg px-4 py-3 text-gray-400 cursor-default focus:outline-none"
            />
          </div>

          <!-- Amount -->
          <div class="form-item">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>

            <input
              v-model="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
            />
          </div>

          <!-- Payment Date -->
          <div class="form-item">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Payment Date
            </label>

            <input
              v-model="paymentDate"
              type="date"
              class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="form-item w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          >
            <span v-if="!loading" class="flex items-center justify-center gap-2">
              <Icon icon="lucide:arrow-up-circle" class="w-5 h-5" />
              Top Up
            </span>

            <span v-else class="flex items-center justify-center gap-2">
              <Icon icon="lucide:loader-2" class="w-5 h-5 animate-spin" />
              Submitting...
            </span>
          </button>

        </form>
      </div>
    </div>
  </div>
</template>