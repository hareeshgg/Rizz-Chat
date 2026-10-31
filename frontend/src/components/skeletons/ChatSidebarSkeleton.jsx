const ChatSidebarSkeleton = () => {
  return (
    <aside className="w-full h-full lg:w-72 border-r border-base-300 flex flex-col sm:w-auto">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="skeleton h-6 w-32 rounded-md" />
          <div className="skeleton size-5 rounded" />
        </div>
      </div>

      {/* Search + Users */}
      <div className="overflow-y-auto w-full p-3">
        <div className="skeleton h-12 w-full rounded-2xl mb-4" />

        {/* User skeletons */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-full p-3 rounded-lg flex items-center gap-3"
          >
            <div className="skeleton size-12 rounded-full shrink-0" />

            <div className="flex-1 min-w-0 space-y-2">
              <div className="skeleton h-4 w-28 rounded-md" />
              <div className="skeleton h-3 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebarSkeleton;