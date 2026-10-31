import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Ellipsis, Search, Loader2 } from "lucide-react";
import ChatSidebarSkeleton from "./skeletons/ChatSidebarSkeleton";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();

  const [username, setUsername] = useState("");

  useEffect(() => {
    const query = username.trim();

    // Load recent conversations immediately when search is empty.
    if (!query) {
      getUsers("");
      return;
    }

    // Debounce user searches.
    const delayDebounceFn = setTimeout(() => {
      getUsers(query);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [username, getUsers]);

  // Only show the full skeleton during initial loading.
  if (isUsersLoading && !username.trim()) {
    return <ChatSidebarSkeleton />;
  }

  return (
    <aside className="w-full h-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 sm:w-auto">

      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold tracking-tight text-base-content">
            {authUser.username}
          </span>

          <button
            className="cursor-pointer"
            onClick={() => alert("Baka")}
          >
            <Ellipsis className="size-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="w-full p-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />

          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered input-primary w-full pl-11 pr-4 py-6 rounded-2xl text-base shadow-sm focus:outline-none transition-all duration-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full px-3 pb-3 flex-1">

        {/* Search Loading */}
        {isUsersLoading && username.trim() && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-base-content/60">
            <Loader2 className="size-4 animate-spin" />
            Searching users...
          </div>
        )}

        {/* Empty State */}
        {!isUsersLoading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Search className="size-8 text-base-content/30 mb-2" />

            <p className="font-medium text-base-content/70">
              {username.trim() ? "No users found" : "No recent chats"}
            </p>

            <p className="text-xs text-base-content/50 mt-1">
              {username.trim()
                ? "Try searching with another username."
                : "Start a conversation with someone!"}
            </p>
          </div>
        )}

        {/* Users */}
        {!isUsersLoading &&
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 rounded-lg flex items-center justify-start gap-3 hover:bg-base-300 transition-colors ${selectedUser?.id === user.id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
                }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/profile.jpg"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />

                {onlineUsers.includes(user.id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="font-medium truncate">
                  {user.name}
                </div>

                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user.id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
      </div>
    </aside>
  );
};

export default Sidebar;