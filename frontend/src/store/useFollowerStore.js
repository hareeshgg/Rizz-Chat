import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useFollowerStore = create((set, get) => ({
    users: [],
    selectedUser: null,
    isUsersLoading: false,

    getUsers: async (username = "") => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get(`/users?query=${username}`);
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error searching users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    toggleFollow: async (userId) => {
        try {
            const res = await axiosInstance.post(`/users/toggle/${userId}`);

            // Update search results list locally
            const updatedUsers = get().users.map(u => {
                if (u.id === userId) {
                    return { ...u, isFollowing: res.data.isFollowing };
                }
                return u;
            });
            set({ users: updatedUsers });
            toast.success(res.data.message);

            // Dynamically import and refresh useChatStore users to keep the sidebar updated
            const chatStoreModule = await import("./useChatStore");
            if (chatStoreModule && chatStoreModule.useChatStore) {
                chatStoreModule.useChatStore.getState().getUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating follow status");
        }
    },

    //   sendMessages: async (messageData) => {
    //     const { selectedUser, messages } = get();
    //     try {
    //       const res = await axiosInstance.post(`/messages/send/${selectedUser.id}`, messageData);
    //       set({ messages: [...messages, res.data] });
    //     } catch (error) {
    //       toast.error(error.response.data.message)
    //     }
    //   },

    //   subscribeToMessages: () => {
    //     const { selectedUser } = get()
    //     if (!selectedUser) return;

    //     const socket = useAuthStore.getState().socket;
    //     if (!socket) return;

    //     socket.on("newMessage", (newMessage) => {
    //       if (newMessage.userId !== selectedUser.id) return;

    //       set({
    //         messages: [...get().messages, newMessage]
    //       })
    //     })
    //   },

    //   unsubscribeFromMessages: () => {
    //     const socket = useAuthStore.getState().socket;
    //     if (!socket) return;
    //     socket.off("newMessage");
    //   },

    //   setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
