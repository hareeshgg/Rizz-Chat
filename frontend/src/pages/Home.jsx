import React from "react";
import { useChatStore } from "../store/useChatStore";

import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";

const Home = () => {
  const { selectedUser } = useChatStore();

  return (
    <>
      <div className="hidden bg-base-200 min-h-[calc(100vh-4.10rem)] sm:flex flex-col">
        {/* Navbar is rendered above this component and has a height of h-16 (4rem) */}
        <div className="flex flex-1 items-center justify-center">
          <div className="m-4 bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6.2rem)] flex items-center justify-center">
            <div className="flex rounded-lg overflow-hidden w-full h-full">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>

      <div className={`flex sm:hidden bg-base-200 min-h-[calc(100vh-4.10rem)] w-full`}>
        <div className="w-full h-[calc(100vh-4.10rem)]">
          {!selectedUser ? (
            <Sidebar />
          ) : (
            <ChatContainer />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
