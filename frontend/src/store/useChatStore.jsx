import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import { toast } from 'react-hot-toast'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  isUsersLoading: [],
  isMessagesLoading: [],
  selectedUser: null,
  isShowOnline: false,
  setShowOnline: (showBoolean) => {
    set({ isShowOnline: showBoolean })
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser: selectedUser })
  },

  fetchUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const response = await axiosInstance.get('/api/messages/siderUsers')
      set({ users: response.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  fetchMessage: async (receiverId) => {
    set({ isMessagesLoading: true })
    try {
      const response = await axiosInstance.get(`/api/messages/${receiverId}`)
      set({ messages: response.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      )
      set({ messages: [...messages, res.data] })
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get()
    if (!selectedUser) return

    const socket = useAuthStore.getState().socket

    socket?.on('newMessage', (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id
      if (!isMessageSentFromSelectedUser) return

      set({
        messages: [...get().messages, newMessage],
      })
    })
  },
  unsubscribeToMessages: async () => {
    const socket = useAuthStore.getState().socket
    socket?.off('newMessage')
  },
}))
