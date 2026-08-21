<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <footer class="bg-[#050505] text-white pt-20 pb-8 border-t border-gray-900 relative">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
      
      <!-- About Section -->
      <div>
        <h3 class="text-sm font-bold tracking-wider uppercase mb-6">About EversteadInvest</h3>
        <p class="text-gray-400 text-sm leading-relaxed mb-6">
          EversteadInvest empowers individuals and businesses to achieve financial growth through secure, transparent, and innovative investment opportunities. Our mission is to simplify wealth creation with trust, technology, and expertise.
        </p>
        <div class="flex items-center gap-4">
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Icon icon="mdi:facebook" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Icon icon="mdi:twitter" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Icon icon="mdi:linkedin" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Icon icon="mdi:dribbble" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Icon icon="mdi:instagram" class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="text-sm font-bold tracking-wider uppercase mb-6">Quick Links</h3>
        <ul class="space-y-4 text-sm text-gray-400">
          <li><router-link to="/" class="hover:text-white transition-colors">Home</router-link></li>
          <li><router-link to="/about" class="hover:text-white transition-colors">About</router-link></li>
          <li><router-link to="/investment" class="hover:text-white transition-colors">Investment</router-link></li>
          <li><router-link to="/contact" class="hover:text-white transition-colors">Contact</router-link></li>
        </ul>
      </div>

      <!-- Contact Us -->
      <div>
        <h3 class="text-sm font-bold tracking-wider uppercase mb-6">Contact Us</h3>
        <ul class="space-y-5 text-sm text-gray-400">
          <li class="flex items-start gap-3">
            <Icon icon="lucide:mail" class="w-5 h-5 text-gray-300 shrink-0" />
            <a href="mailto:support@eversteadinvest.com" class="hover:text-white transition-colors">
              support@eversteadinvest.com
            </a>
          </li>
          <li class="flex items-start gap-3">
            <Icon icon="lucide:phone" class="w-5 h-5 text-gray-300 shrink-0" />
            <a href="tel:+18002345678" class="hover:text-white transition-colors">
              +1 (800) 234-5678
            </a>
          </li>
          <li class="flex items-start gap-3">
            <Icon icon="lucide:map-pin" class="w-5 h-5 text-gray-300 shrink-0" />
            <span>32 Cornhill, London EC3V 3S</span>
          </li>
          <li class="flex items-start gap-3">
            <Icon icon="lucide:clock" class="w-5 h-5 text-gray-300 shrink-0" />
            <span>Office Hours: Mon-Fri, 9AM - 7PM</span>
          </li>
        </ul>
      </div>

    </div>

    <!-- Copyright Bar -->
    <div class="max-w-7xl mx-auto px-6 text-center border-t border-gray-900 pt-8">
      <p class="text-xs text-gray-500">
        © 2026 EversteadInvest. All rights reserved. | Crafted with <span class="text-red-500">❤️</span> for your financial future.
      </p>
    </div>

    <!-- Floating Chat Widget Mockup -->
    <button class="fixed bottom-6 right-6 bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-500 transition-colors z-50">
      <Icon icon="lucide:message-circle" class="w-6 h-6" />
      <span class="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-[#050505] rounded-full text-[8px] flex items-center justify-center font-bold">1</span>
    </button>
  </footer>
</template>
