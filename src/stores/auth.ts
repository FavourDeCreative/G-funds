
import { ref, computed } from 'vue'
import api from '../api/client'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'
  createdAt?: string
}

const user = ref<User | null>(null)
const loading = ref(false)
const initialized = ref(false)

/*
 * Restore the user saved from a previous login.
 */
const storedUser = localStorage.getItem('user')

if (storedUser) {
  try {
    user.value = JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('user')
  }
}

/*
 * JWT token currently stored in the browser.
 */
const token = computed(() => localStorage.getItem('token'))

/*
 * Frontend authentication state.
 */
const isAuthenticated = computed(() => {
  return !!token.value && !!user.value
})

/*
 * LOGIN
 */
const login = async (
  email: string,
  password: string,
) => {
  loading.value = true

  try {
    const { data } = await api.post('/auth/login', {
      email: email.trim(),
      password,
    })

    const loggedInUser = data.data.user
    const authToken = data.data.token

    localStorage.setItem('token', authToken)
    localStorage.setItem(
      'user',
      JSON.stringify(loggedInUser),
    )

    user.value = loggedInUser

    return loggedInUser
  } finally {
    loading.value = false
  }
}

/*
 * REGISTER
 */
const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  loading.value = true

  try {
    const { data } = await api.post('/auth/register', {
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    })

    const registeredUser = data.data.user
    const authToken = data.data.token

    localStorage.setItem('token', authToken)
    localStorage.setItem(
      'user',
      JSON.stringify(registeredUser),
    )

    user.value = registeredUser

    return registeredUser
  } finally {
    loading.value = false
  }
}

/*
 * GET CURRENT USER
 *
 * This asks the backend to verify the JWT
 * instead of blindly trusting localStorage.
 */
const fetchMe = async () => {
  const currentToken = localStorage.getItem('token')

  if (!currentToken) {
    user.value = null
    initialized.value = true
    return null
  }

  loading.value = true

  try {
    const { data } = await api.get('/auth/me')

    const currentUser = data.data.user

    user.value = currentUser

    localStorage.setItem(
      'user',
      JSON.stringify(currentUser),
    )

    return currentUser
  } catch {
    logout()
    return null
  } finally {
    loading.value = false
    initialized.value = true
  }
}

/*
 * LOGOUT
 */
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('rememberMe')

  user.value = null
}

export const useAuth = () => {
  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    login,
    register,
    fetchMe,
    logout,
  }
}
