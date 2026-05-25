import { create } from 'zustand'

const useUserStore = create((set) => ({
  users: [],

  setUsers: (users) => set({ users }),

  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}))

export default useUserStore
