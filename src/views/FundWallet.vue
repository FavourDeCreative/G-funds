<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { useRoute } from 'vue-router'
import api from '../api/client'

const route = useRoute()

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface InvestmentPlan {
  id: string
  name: string
  icon: string
  min: number
  max: number | null // null = Unlimited
  profit: string
  duration: string
  ref: string
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
 * Mirrors the plans defined in InvestmentPlans.vue (same ids, names,
 * profit %, duration, referral %). Minimum/maximum are parsed to
 * numbers here so the form can validate against them — "Unlimited"
 * becomes null (no upper bound).
 */
const investmentPlans = ref<InvestmentPlan[]>([
  { id: 'starting', name: 'Starting Plan', icon: 'lucide:leaf', min: 80, max: 4000, profit: '15%', duration: '24 hours', ref: '10%' },
  { id: 'emy', name: 'Emy Plan', icon: 'lucide:trending-up', min: 550, max: 9990, profit: '20%', duration: '36 hours', ref: '10%' },
  { id: 'bonus', name: 'Bonus Plan', icon: 'lucide:gift', min: 1200, max: 7000, profit: '45%', duration: '40 hours', ref: '10%' },
  { id: 'superlative', name: 'Superlative Plan', icon: 'lucide:award', min: 1500, max: 9500, profit: '25%', duration: '36 hours', ref: '10%' },
  { id: 'loan', name: 'Loan Plan', icon: 'lucide:landmark', min: 2200, max: null, profit: '40%', duration: '20 hours', ref: '10%' },
  { id: 'weekend', name: 'Weekend Plan', icon: 'lucide:calendar', min: 1000, max: 30000, profit: '50%', duration: '9 hours', ref: '10%' },
  { id: 'gold', name: 'Gold Plan', icon: 'lucide:coins', min: 4500, max: null, profit: '55%', duration: '2 days', ref: '10%' },
  { id: 'xmas', name: 'Xmas Bonus', icon: 'lucide:snowflake', min: 750, max: 15000, profit: '45%', duration: '1 day', ref: '10%' },
  { id: 'upgrade', name: 'Upgrade Plan', icon: 'lucide:arrow-up-circle', min: 950, max: null, profit: '25%', duration: 'Custom', ref: '10%' },
])

/*
 * Still hardcoded until a backend endpoint for deposit wallets
 * exists — replace with api.get('/wallets') once available.
 */
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

const selectedPlan = computed(() =>
  investmentPlans.value.find((p) => p.id === selectedPlanId.value) ?? null
)

const selectedWallet = computed(() =>
  walletOptions.value.find((w) => w.id === selectedWalletId.value) ?? null
)

const planRangeLabel = computed(() => {
  if (!selectedPlan.value) return ''

  const min = `$${selectedPlan.value.min.toLocaleString()}`
  const max = selectedPlan.value.max
    ? `$${selectedPlan.value.max.toLocaleString()}`
    : 'Unlimited'

  return `${min} - ${max}`
})

/*
|--------------------------------------------------------------------------
| LIFECYCLE
|--------------------------------------------------------------------------
*/

onMounted(() => {
  // Preselect the plan passed via ?plan=<id> from InvestmentPlans.vue.
  // Falls back to the first plan if the query param is missing or
  // doesn't match a known plan.
  const requestedPlanId = route.query.plan as string | undefined
  const matchedPlan = investmentPlans.value.find((p) => p.id === requestedPlanId)

  const initialPlan = matchedPlan ?? investmentPlans.value[0]

  if (initialPlan) {
    selectedPlanId.value = initialPlan.id
    amount.value = String(initialPlan.min)
  }

  if (walletOptions.value.length > 0) {
    selectedWalletId.value = walletOptions.value[0].id
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
| PLAN SELECTION
|--------------------------------------------------------------------------
*/

// When the plan changes, prefill the amount with that plan's minimum
// so the user isn't left guessing what's acceptable.
const onPlanChange = () => {
  if (selectedPlan.value) {
    amount.value = String(selectedPlan.value.min)
  }
}

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

  if (!selectedPlan.value) {
    errorMessage.value = 'Please select an investment plan.'
    return
  }

  if (!selectedWallet.value) {
    errorMessage.value = 'Please select a wallet.'
    return
  }

  const numericAmount = Number(amount.value)

  if (!amount.value || numericAmount <= 0) {
    errorMessage.value = 'Please enter a valid amount.'
    return
  }

  if (numericAmount < selectedPlan.value.min) {
    errorMessage.value = `Minimum for ${selectedPlan.value.name} is $${selectedPlan.value.min.toLocaleString()}.`
    return
  }

  if (selectedPlan.value.max !== null && numericAmount > selectedPlan.value.max) {
    errorMessage.value = `Maximum for ${selectedPlan.value.name} is $${selectedPlan.value.max.toLocaleString()}.`
    return
  }

  loading.value = true

  try {
    // Matches your real backend contract:
    // POST /api/v1/transactions — { type, amount, metadata }
    await api.post('/transactions', {
      type: 'DEPOSIT',
      amount: numericAmount,
      metadata: {
        planId: selectedPlan.value.id,
        planName: selectedPlan.value.name,
        coinName: selectedWallet.value.coinName,
        network: selectedWallet.value.network,
        walletAddress: selectedWallet.value.address,
        paymentDate: paymentDate.value,
      },
    })

    successMessage.value =
      'Your deposit has been submitted. Funds will reflect after verification.'

    amount.value = String(selectedPlan.value.min)
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

      <!-- Fund Wallet Heading -->
      <div class="form-item text-center mb-8">
        <div class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Icon icon="lucide:wallet" class="w-4 h-4" />
          Fund Wallet
        </div>

        <h1 class="text-2xl md:text-3xl font-bold text-white">
          Top Up Your Account
        </h1>
      </div>

      <!-- Form Card -->
      <div class="bg-[#12151C] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">

        <!-- Info Banner -->
        <div class="form-item flex items-start gap-3 mb-6 p-3 rounded-lg bg-[#0B0F19] border border-gray-800">
          <Icon icon="lucide:info" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
          <p class="text-sm text-gray-400">
            Funds added to your wallet will be available shortly after
            verification.
          </p>
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="form-item mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2"
        >
          <Icon icon="lucide:circle-alert" class="w-4 h-4 flex-shrink-0" />
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
              @change="onPlanChange"
              class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option
                v-for="plan in investmentPlans"
                :key="plan.id"
                :value="plan.id"
              >
                {{ plan.name }} - {{ plan.profit }} ROI for {{ plan.duration }}
              </option>
            </select>

            <!-- Min/Max info for the selected plan -->
            <div
              v-if="selectedPlan"
              class="flex items-center justify-between mt-2 px-1 text-xs text-gray-500"
            >
              <span class="flex items-center gap-1.5">
                <Icon :icon="selectedPlan.icon" class="w-3.5 h-3.5 text-emerald-500" />
                Range: {{ planRangeLabel }}
              </span>
              <span class="text-emerald-400">Referral {{ selectedPlan.ref }}</span>
            </div>
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
              :min="selectedPlan?.min ?? 0"
              :max="selectedPlan?.max ?? undefined"
              step="0.01"
              placeholder="0.00"
              class="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
            />

            <p v-if="selectedPlan" class="mt-2 px-1 text-xs text-gray-500">
              Minimum investment for {{ selectedPlan.name }}:
              <span class="text-gray-300 font-medium">
                ${{ selectedPlan.min.toLocaleString() }}
              </span>
            </p>
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