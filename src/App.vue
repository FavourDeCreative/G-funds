<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import Loader from './components/Loader.vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()

// Reuses the same `requiresAuth` meta your router already uses for
// route guarding — any protected route (currently just dashboard)
// skips the public navbar.
const showNavbar = computed(() => !route.meta.requiresAuth)
</script>

<template>
  <Loader />
  <Navbar v-if="showNavbar" />
  <RouterView />
  <Footer />
</template>
