<script setup lang="ts">
import { RouterView } from 'vue-router'
import Loader from './components/Loader.vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <Loader />
  <Navbar />
  <RouterView />
  <Footer />
</template>
