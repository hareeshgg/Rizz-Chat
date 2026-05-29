import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFollowerStore } from "../store/useFollowerStore";
import { useChatStore } from "../store/useChatStore";
import { Search as SearchIcon, UserCheck, UserPlus, MessageSquare, X, Users, MessageCircle } from "lucide-react";

const Search = () => {
    const { users, getUsers, isUsersLoading, toggleFollow } = useFollowerStore();
    const { setSelectedUser } = useChatStore();
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!username.trim()) {
            // Immediately clear results when search text is empty
            useFollowerStore.setState({ users: [] });
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            getUsers(username);
        }, 300); // 300ms debounce is standard and premium

        return () => clearTimeout(delayDebounceFn);
    }, [username, getUsers]);

    const handleClear = () => {
        setUsername("");
        useFollowerStore.setState({ users: [] });
    };

    const handleStartChat = (user) => {
        setSelectedUser(user);
        navigate("/");
    };

    return (
        <div className="h-full w-full bg-base-100 overflow-y-auto flex flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-2xl flex flex-col h-full">
                {/* Header Section */}
                <div className="mb-6 flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-2">

                        Search
                    </h1>

                </div>

                {/* Search Input Card */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="size-5 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by username or name..."
                        className="input input-bordered input-primary w-full pl-11 pr-12 py-6 rounded-2xl text-base shadow-sm focus:outline-none transition-all duration-200"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (e.target.value.trim() === "") {
                                useFollowerStore.setState({ users: [] });
                            }
                        }}
                    />
                    {username && (
                        <button
                            onClick={handleClear}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-base-content transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Inline Loader Indicator */}
                    {isUsersLoading && users.length === 0 && (
                        <div className="flex flex-col gap-4 mt-2">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="flex items-center gap-4 p-4 bg-base-200/40 rounded-2xl animate-pulse">
                                    <div className="size-12 rounded-full bg-base-300" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-base-300 rounded w-1/3" />
                                        <div className="h-3 bg-base-300 rounded w-1/4" />
                                    </div>
                                    <div className="h-10 bg-base-300 rounded-xl w-20" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Search Results */}
                    {!isUsersLoading && username.trim() && users.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
                            <Users className="size-16 mb-4 opacity-20 text-primary" />
                            <h3 className="text-lg font-medium text-base-content mb-1">No users found</h3>
                            <p className="text-sm max-w-xs">We couldn't find any match for "{username}". Try checking the spelling.</p>
                        </div>
                    )}

                    {/* Empty State when no query entered */}
                    {!username.trim() && (
                        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-zinc-400">
                            <div className="size-24 rounded-full bg-base-200 flex items-center justify-center mb-6 shadow-inner animate-bounce duration-1000">
                                <SearchIcon className="size-10 text-primary opacity-60" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-2">Discover People</h3>
                            <p className="text-sm max-w-sm">
                                Enter a name or username in the box above to look up other accounts and start chatting.
                            </p>
                        </div>
                    )}

                    {/* Results list */}
                    {users.length > 0 && (
                        <div className="space-y-3 overflow-y-auto pr-1">
                            {isUsersLoading && (
                                <div className="flex items-center justify-center py-2">
                                    <span className="loading loading-spinner loading-md text-primary"></span>
                                    <span className="text-xs text-zinc-500 ml-2">Searching...</span>
                                </div>
                            )}
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-4 bg-base-200/50 hover:bg-base-200 border border-base-300/30 rounded-2xl flex items-center justify-between gap-4 transition-all duration-200 shadow-sm hover:shadow"
                                >
                                    {/* User Details */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative shrink-0">
                                            <img
                                                src={user.profilePic || "/profile.jpg"}
                                                alt={user.name}
                                                className="size-12 object-cover rounded-full border border-base-300"
                                            />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <div className="font-semibold text-base-content truncate">
                                                {user.username}
                                            </div>
                                            <div className="text-xs text-zinc-400 truncate">
                                                {user.name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Toggle Follow */}
                                        <button
                                            onClick={() => toggleFollow(user.id)}
                                            className={`btn btn-sm rounded-xl px-4 font-medium transition-all ${user.isFollowing
                                                ? "btn-outline btn-neutral"
                                                : "btn-primary text-primary-content shadow-sm hover:shadow-md"
                                                }`}
                                        >
                                            {user.isFollowing ? (
                                                <>
                                                    <UserCheck className="size-4 mr-1" />
                                                    Following
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="size-4 mr-1" />
                                                    Follow
                                                </>
                                            )}
                                        </button>

                                        {/* Message Link */}
                                        <button
                                            onClick={() => handleStartChat(user)}
                                            className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary rounded-xl p-2 transition-all tooltip"
                                            data-tip="Send Message"
                                        >
                                            <MessageCircle className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;