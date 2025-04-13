import { Dispatch, SetStateAction } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosAttach, IoIosSend } from "react-icons/io";
import { Chat } from "./Chat";

interface messageInputProps {
    setNewMessage: Dispatch<SetStateAction<string>>;
    newMessage: string;
    sendMessage: ({ content, chat }: { content: string, chat: string }) => void;
    activeChat: Chat | null;
}

export const MessageInput = ({ setNewMessage, newMessage, sendMessage, activeChat }: messageInputProps) => {

  return (
    <div className="flex items-center border-t pt-4 border-gray-200 dark:border-neutral-800">
      <div className="space-x-2">
      <button className="text-xl cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
        <BsEmojiSmile />
      </button>
      <button className="text-xl cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <IoIosAttach />
        </button>
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && sendMessage({ content: newMessage, chat: activeChat?._id as string })){
            setNewMessage("");
            return true;
          }
        }}
        className="flex-1 mx-4 px-4 py-2 rounded-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white outline-none"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setNewMessage("");
            sendMessage({ content: newMessage, chat: activeChat?._id as string });
          }}
          className="bg-black cursor-pointer dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full font-medium hover:opacity-90 transition"
        >
          <IoIosSend />
        </button>
      </div>
    </div>
  );
};
