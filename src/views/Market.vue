<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'

const tickerContainer = ref<HTMLElement | null>(null)
const screenerContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  // 1. GSAP Entrance Animations
  gsap.fromTo('.market-header', 
    { opacity: 0, y: -20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  )
  gsap.fromTo('.market-widget', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
  )

  // 2. Inject TradingView Ticker Tape
  if (tickerContainer.value) {
    const tickerScript = document.createElement('script')
    tickerScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    tickerScript.async = true
    tickerScript.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
        { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
        { proName: "BINANCE:BNBUSDT", title: "BNB" },
        { proName: "BINANCE:SOLUSDT", title: "Solana" },
        { proName: "BINANCE:XRPUSDT", title: "XRP" },
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" }
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en"
    })
    tickerContainer.value.appendChild(tickerScript)
  }

  // 3. Inject TradingView Advanced Chart
  const chartScript = document.createElement('script')
  chartScript.src = 'https://s3.tradingview.com/tv.js'
  chartScript.async = true
  chartScript.onload = () => {
    if ((window as any).TradingView) {
      new (window as any).TradingView.widget({
        autosize: true,
        symbol: "BINANCE:BTCUSDT",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "#12151C",
        gridColor: "#1F2937",
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: "tv_chart_container"
      })
    }
  }
  document.head.appendChild(chartScript)

  // 4. Inject Market Screener
  if (screenerContainer.value) {
    const screenerScript = document.createElement('script')
    screenerScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
    screenerScript.async = true
    screenerScript.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "dark",
      locale: "en",
      isTransparent: true
    })
    screenerContainer.value.appendChild(screenerScript)
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] pt-24 pb-12">
    
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-6 mb-8 market-header text-center">
      <h1 class="text-3xl md:text-5xl font-bold text-white mb-4">Live Market Data</h1>
      <p class="text-gray-400 text-lg">Analyze global market trends before executing your investment strategy.</p>
    </div>

    <!-- Ticker Tape -->
    <div class="w-full bg-[#12151C] border-y border-gray-800 mb-8 market-widget">
      <div ref="tickerContainer" class="tradingview-widget-container h-[46px]"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Main Advanced Chart -->
      <div class="lg:col-span-2 h-[600px] bg-[#12151C] border border-gray-800 rounded-2xl p-4 shadow-xl market-widget relative overflow-hidden">
        <div id="tv_chart_container" class="w-full h-full"></div>
      </div>

      <!-- Action Panel & Screener -->
      <div class="flex flex-col gap-8">
        
        <!-- Quick Invest CTA -->
        <div class="bg-[#12151C] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)] market-widget">
          <h3 class="text-xl font-bold text-white mb-2">Ready to Trade?</h3>
          <p class="text-sm text-gray-400 mb-6">Our automated plans execute trades based on real-time market data to guarantee daily returns.</p>
          
          <router-link 
            to="/register" 
            class="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0B0F19] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          >
            <Icon icon="lucide:zap" class="w-5 h-5" />
            Invest Now
          </router-link>
          
          <div class="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4">
            <span class="flex items-center gap-1"><Icon icon="lucide:shield-check" class="w-4 h-4 text-emerald-500" /> Secure</span>
            <span class="flex items-center gap-1"><Icon icon="lucide:clock" class="w-4 h-4 text-emerald-500" /> 24/7 Market</span>
          </div>
        </div>

        <!-- Mini Screener -->
        <div class="flex-grow bg-[#12151C] border border-gray-800 rounded-2xl p-4 shadow-xl market-widget h-[350px]">
          <div ref="screenerContainer" class="tradingview-widget-container h-full w-full"></div>
        </div>

      </div>
    </div>
  </div>
</template>
