import { Send } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center flex flex-col items-center space-y-2">
        {/* Centered Circular Icon */}
        <div className="w-24 h-24 rounded-full border-2 border-base-content flex items-center justify-center mb-2">
          <Send className="w-10 h-10 mt-1 mr-1" />
        </div>

        <h2 className="text-xl font-bold tracking-wide">Your messages</h2>
        <p className="text-sm text-base-content/60">
          Send a message to start a chat.
        </p>


      </div>
      <button className="btn btn-primary rounded-xl px-5 text-sm font-semibold mt-4">
        Send message
      </button>
    </div>
  );
};

export default NoChatSelected;
