import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { formatMessageTime } from "../lib/utils";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { useRef } from "react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();

  const { authUser } = useAuthStore();
  const messageEnd = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages()
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if( messageEnd.current && messages)
    messageEnd.current.scrollIntoView({behavior: "smooth"});
  }, [messages])

  if (isMessagesLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-1 flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`
          }
          ref={messageEnd}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/profile.jpg"
                      : selectedUser.profilePic || "/profile.jpg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img 
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <span>{message.text}</span>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
