const ChatContainerSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col h-full border-b border-base-300">
      {/* Header Skeleton */}
      <div className="p-2.5 border-b border-base-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton size-10 rounded-full" />

            <div className="space-y-2">
              <div className="skeleton h-4 w-28 rounded-md" />
              <div className="skeleton h-3 w-14 rounded-md" />
            </div>
          </div>

          <div className="skeleton size-10 rounded-md" />
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 overflow-hidden p-4 space-y-6">
        {/* Incoming message */}
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="skeleton size-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 w-16 rounded-md" />
            <div className="skeleton h-12 w-48 rounded-2xl" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="skeleton size-10 rounded-full" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className="skeleton h-3 w-16 rounded-md" />
            <div className="skeleton h-12 w-64 rounded-2xl" />
          </div>
        </div>

        {/* Incoming message */}
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="skeleton size-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 w-16 rounded-md" />
            <div className="skeleton h-16 w-56 rounded-2xl" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="skeleton size-10 rounded-full" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className="skeleton h-3 w-16 rounded-md" />
            <div className="skeleton h-12 w-40 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Message Input Skeleton */}
      <div className="p-4 w-full border-t border-base-300">
        <div className="flex items-center gap-2">
          <div className="skeleton h-12 flex-1 rounded-lg" />
          <div className="skeleton size-10 rounded-full shrink-0" />
          <div className="skeleton size-10 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ChatContainerSkeleton;