import { useEffect, useState } from "react";
import { MessageSection } from "./MessageSection";
import { ChatSidebar } from "./ChatSidebar";
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";
import { useAuthorize } from "@/hooks/useAuthorize";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { ChatEventsEnum } from "@/socket/chatEvents";

export interface MessageUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
}

export interface User {
  firstName: string;
  lastName: string;
  profileImageURL: string;
  _id: string;
  role: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  lastMessage: {
    _id: string;
    content: string;
    sender: {
      firstName: string;
      lastName: string;
      _id: string;
    };
    createdAt: Date;
  };
  chat: string;
}

export interface IMessage {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    profileImageURL: string;
  };
  content: string;
  createdAt: Date;
  attachmentURL?: string;
  attachmentType?: string;
  fileName: string;
  fileSize: number;
}

export const Chat = () => {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const { notify } = useNotification();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const { socket } = useSelector((state: RootState) => state.socket);
  useAuthorize();

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!loading && !user) return;

      try {
        const result = await axios.get(`http://localhost:3000/api/chat`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setChats(result.data?.data);
        notify({
          id: "chat-toast",
          type: "success",
          content: "Succefully fetched chats",
        });
      } catch (error) {
        console.error("Error fetching chats", error);
        notify({
          id: "chat-toast",
          type: "error",
          content: "Error fetching chats",
        });
      }
    };

    fetchChats();
  }, [setChats]);

  const sendMessage = async ({ content, chat, }: { content: string; chat: string; }) => {
    try {
      const result = await axios.post(
        `http://localhost:3000/api/message/${chat}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (result.data.data) {
        notify({
          id: "message-toast",
          type: "success",
          content: "Succefully sent message",
        });
        setMessages((prev) => [...prev, result.data.data.message]);
      }
    } catch (error) {
      console.error("Error fetching messages", error);
      notify({
        id: "message-toast",
        type: "error",
        content: "Error sending message",
      });
    }
  };

  const handleChatClick = (chat: Chat): void => {
    setActiveChat(chat);
  };

  // Receive Message
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on(ChatEventsEnum.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => {
      socket.off(ChatEventsEnum.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [socket]);

  // Update Chats
  useEffect(() => {
    if (!socket) return;

    const handleUpdateChats = (updatedChat: Chat) => {
      setChats((prev) => {
        const exists = chats.find((chat) => chat._id === updatedChat._id);

        if (exists) {
          return chats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          );
        }

        return [updatedChat, ...prev];
      });
    };

    socket.on(ChatEventsEnum.UPDATE_CHAT, handleUpdateChats);

    return () => {
      socket.off(ChatEventsEnum.UPDATE_CHAT, handleUpdateChats);
    };
  }, [socket, chats]);

  return (
    <div className="flex h-[95vh] w-full font-poppins bg-white dark:bg-black">
      {
        <ChatSidebar
          handleChatClick={handleChatClick}
          activeChat={activeChat}
          chats={chats}
          setChats={setChats}
        />
      }

      <div className="w-[60%] hidden md:flex flex-col p-6 bg-white dark:bg-black">
        {activeChat ? (
          <MessageSection
            setMessages={setMessages}
            activeChat={activeChat}
            messages={messages}
            sendMessage={sendMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-xl text-gray-400 dark:text-gray-500 font-medium text-center">
            Send a message to start chat
          </div>
        )}
      </div>
    </div>
  );
};
