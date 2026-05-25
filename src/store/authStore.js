import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),

  login: (credentials) => {
    const user = { email: credentials.email, name: 'User' }
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
    return true
  },

  logout: () => {
    localStorage.removeItem('user')
    set({ user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
