import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // Import router

const app = createApp(App)
app.use(router) // Must be called before mount
app.mount('#app')
