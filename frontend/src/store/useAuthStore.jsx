import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingOut: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true })
    try {
      const response = await axiosInstance.get('/api/auth/checkAuth')
      set({ authUser: response.data })
      const { authUser, socket } = get()
      if (authUser && !socket?.connect) {
        get().connectSocket()
      }
    } catch (error) {
      console.log(`Error checking auth: ${error.message}`)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/api/auth/signup', data)
      set({ authUser: res.data })
      toast.success('Account created successfully')
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  logout: async () => {
    set({ isLoggingOut: true })
    try {
      await axiosInstance.post('/api/auth/logout')
      set({ authUser: null })
      toast.success('Account logout successfully')
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingOut: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post('/api/auth/login', data)
      set({ authUser: res.data })
      toast.success('Logged in successfully')

      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put('/api/auth/profile', data)
      set({ authUser: res.data })
      toast.success('Profile updated successfully')
    } catch (error) {
      console.log('error in update profile:', error)
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },
  connectSocket: async () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected) return

    const socket = io(import.meta.env.VITE_API_URL, {
      query: {
        userId: authUser._id,
      },
    })
    socket.connect()

    set({ socket: socket })

    socket.on('getOnlineUsers', (userIds) => {
      const onlines = userIds.filter((id) => id !== authUser._id)
      set({ onlineUsers: onlines })
      // const { onlineUsers } = get()
      // console.log(onlineUsers)
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect()
  },
}))
