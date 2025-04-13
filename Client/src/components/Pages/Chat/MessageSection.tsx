import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Chat, IMessage } from "./Chat";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router";
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";
import { Spinner } from "@/components/ui/Spinner";
import { RootState } from "@/store/Store";
import { useSelector } from "react-redux";

interface messageProps {
    setMessages: Dispatch<SetStateAction<IMessage[]>>;
    activeChat: Chat | null;
    messages: IMessage[];
    sendMessage: ({ content, chat }: { content: string, chat: string }) => void;
}

export const MessageSection = ({ setMessages, activeChat, messages, sendMessage }: messageProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification(); 
  const user = useSelector((state: RootState) => state.user.user);
  const otherUser = activeChat?.participants.find(p => p._id !== user?._id);
  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);
  const isOnline = onlineUsers.some(onlineUser => onlineUser.user === otherUser?._id);

    useEffect(() => {
      
      const fetchMessages = async (chatId: string) => {
        if (!activeChat) return;

        try {
          setLoading(true);
          const result = await axios.get(
            `http://localhost:3000/api/message/${chatId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
            }
          );
    
          const messages = result?.data.data;  
          console.log(result.data)
          setMessages(messages);
          console.log(messages);
  
    
        } catch (error) {
          console.error("Error fetching or creating chat", error);
          notify({ id: 'chat-toast', type: 'error', content: 'Error fetching or creating chat' });
        }
        finally {
          setLoading(false);
        }
      };

      fetchMessages(activeChat?._id as string);

    }, [setMessages, activeChat]);

       

  return (
        <div className="flex flex-col flex-1 h-full">
          {
            loading ? <Spinner /> :
            <>
              <div className="pb-4 border-b border-gray-200 dark:border-neutral-800 text-center font-semibold text-gray-900 dark:text-white px-6 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <FaUserCircle className="w-8 h-8" />
                <div className="text-start">
                  <Link to={'/profile/userId'} className="text-md">
                    {otherUser?.firstName + ' ' + otherUser?.lastName }
                  </Link>
                  <p className="text-xs dark:text-gray-500 text-gray-400">{isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 max-h-[calc(95vh-210px)]">
              {messages?.map((message) => (
                <Message key={message?._id} message={message} />
              ))}
            </div>

            <MessageInput setNewMessage={setNewMessage} newMessage={newMessage} sendMessage={sendMessage} activeChat={activeChat} />
            </>
            
          }            
        </div>
  )
}
