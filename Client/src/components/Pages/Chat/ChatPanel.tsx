import { FaUserCircle } from "react-icons/fa";
import { Chat } from "./Chat";
import { RootState } from "@/store/Store";
import { useSelector } from "react-redux";

export interface ChatPanelProps {
    handleChatClick: (chat: Chat) => void;
    activeChat: Chat | null;
    chat: Chat;
}

export const ChatPanel = ({ handleChatClick, activeChat, chat }: ChatPanelProps) => {
    const user = useSelector((state: RootState) => state.user.user);
    const otherUser = chat.participants.find(p => p._id !== user?._id);


  return (
    <div
      onClick={() => handleChatClick(chat)}
      className={`flex items-center gap-4 p-3 w-6/7 rounded-sm cursor-pointer border transition-all ${
        activeChat?._id === chat._id
          ? "bg-neutral-200 dark:bg-neutral-700 border-neutral-500"
          : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
      }`}
    >
        {
            otherUser?.profileImageURL ?
            <img src={otherUser?.profileImageURL} className="w-12 h-12 rounded-full" />
            : <FaUserCircle className="w-8 h-8" />
        }

      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-gray-800 dark:text-white">
            {otherUser?.firstName + ' ' + otherUser?.lastName}
          </div>
          {/* <div className="text-xs text-gray-400">{new Date(chat?.lastMessage?.createdAt).toLocaleDateString().toString() ?? ""}</div> */}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {chat?.lastMessage?.content || ""}
        </div>
      </div>
    </div>
  );
};
