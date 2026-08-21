<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!container.value) return

  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
  script.async = true
  script.type = 'text/javascript'
  script.innerHTML = JSON.stringify({
    symbols: [
      { proName: 'FOREXCOM:NSXUSD', title: 'US 100 Cash CFD' },
      { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
      { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
      { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
      { proName: 'BINANCE:SOLUSD', title: 'Solana' }
    ],
    showSymbolLogo: true,
    isTransparent: true,
    colorTheme: 'dark',
    locale: 'en'
  })

  container.value.appendChild(script)
})
</script>

<template>
  <div class="w-full bg-[#0B0F19] border-y border-gray-800/60 py-1 relative z-30">
    <div ref="container" class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
    </div>
  </div>
</template>
