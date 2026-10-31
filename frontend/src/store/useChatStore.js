import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  hasLoadedUsers: false,

  getUsers: async (query = "") => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users", {
        params: {
          search: query.trim(),
        },
      });
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ users: [] });
      toast.error(
        error.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser.id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.userId !== selectedUser.id) return;

      set({
        messages: [...get().messages, newMessage]
      })
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
