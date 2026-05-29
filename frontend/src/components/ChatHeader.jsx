import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-100">
      <div className="flex items-center justify-between">
        {/* Profile pic and user info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="rounded-full size-10 relative">
              <img
                src={selectedUser.profilePic || "/profile.jpg"}
                alt={selectedUser.name}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers?.includes(selectedUser.id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-square btn-ghost"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
