import axios from "axios";
import { Chat, User } from "./Chat";
import { ChatPanel } from "./ChatPanel";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { FaUserCircle } from "react-icons/fa";
import { RootState } from "@/store/Store";
import { useSelector } from "react-redux";
import { Spinner } from "@/components/ui/Spinner";
import { ChatEventsEnum } from "@/socket/chatEvents";

export interface sidebarProps {
  handleChatClick: (chat: Chat) => void;
  activeChat: Chat | null;
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>
}

export const ChatSidebar = ({ handleChatClick, activeChat, chats, setChats }: sidebarProps) => {
  const [ users, setUsers ] = useState<User[]>([]);
  const [ searchQuery, setSearchQuery ] = useState("");
  const [ dropdownVisibility, setDropdownVisibility ] = useState(true);
  const [ Loading, setLoading ] = useState(false);
  const { notify } = useNotification();
  const user = useSelector((state: RootState) => state.user.user);
  const dropdown = useRef<HTMLDivElement>(null);
  const socket = useSelector((state: RootState) => state.socket.socket); 

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdown.current && !dropdown.current.contains(e.target as Node)){
        setDropdownVisibility(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); 

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        if (!searchQuery) {
          setUsers([]);
          return;
        }

        setLoading(true);
        const result = await axios.get(
          `http://localhost:3000/api/user/users?search=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        )
        
        setUsers(result?.data.data);        
        if (users.length > 0) setDropdownVisibility(true);

      } catch (error) {
        console.error("Error fetching users", error);
        notify({ id: 'chat-user-toast', type: 'error', content: 'Error fetching users' });
      }
      finally {
        setLoading(false);
      }
    };

    fetchUsers();

  }, [searchQuery]);

  const handleFetchOrCreateChat = async (receiverId: string) => {
    try {
      setLoading(true);
      const result = await axios.post(
        `http://localhost:3000/api/chat/c/${receiverId}`, {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      const chat = result?.data.data; 
      setDropdownVisibility(false);
      setSearchQuery("");
      handleChatClick(chat);

      if (chat) {
        handleChatClick(chat);        

        setChats(prev => {
          const exists = prev.some(c => c._id === chat._id);
          return exists ? prev : [ chat, ...prev ];
        });
      }
      

    } catch (error) {
      console.error("Error fetching or creating chat", error);
      notify({ id: 'chat-toast', type: 'error', content: 'Error fetching or creating chat' });
    }
    finally {
      setLoading(false);
    }

  };

   // Fetch or create Chat
    useEffect(() => {
      if (!socket) return;
  
      const handleAddChat = (newChat: Chat) => {
        setChats((prev) => {
          const exists = chats.find((chat) => chat._id === newChat._id);
  
          if (exists) {
            handleChatClick(newChat);
            return prev;
          }
  
          return [newChat, ...prev];
        });
      };
  
      socket.on(ChatEventsEnum.NEW_CHAT_CREATED, handleAddChat);
  
      return () => {
        socket.off(ChatEventsEnum.NEW_CHAT_CREATED, handleAddChat);
      };
    }, [socket, setChats, handleChatClick, chats]);

  return (
    <div className="w-full flex flex-col items-center md:w-[40%] p-6 border-r border-gray-200 dark:border-gray-800 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
        Inbox
      </h2>

      <div className="w-full flex items-center flex-col">
        <input
          type="text"
          className="w-3/4 my-2 py-2 px-3 text-sm rounded-xs focus:outline-none bg-white text-black shadow-sm shadow-black"
          placeholder="Fetch or create new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {
          dropdownVisibility && users.length > 0 &&
          <div className="w-3/4"  ref={dropdown}>
            {
              users.map(ele => {

                if (ele._id === user?._id) return;

                return (
                <div key={ele._id} onClick={() => handleFetchOrCreateChat(ele._id)} className="dark:bg-white dark:hover:bg-gray-300 cursor-pointer py-3 px-2 w-full dark:text-gray-700 lack flex gap-4 border-b hover:bg-gray-200 border-gray-300 shadow-sm shadow-black">
                  { ele.profileImageURL ? <img src={ele.profileImageURL} className="h-6 w-6 rounded-full" /> : <FaUserCircle className="h-6 w-6" /> }

                  <p>{ ele.firstName + ' ' + ele.lastName }</p>

                </div>
                )
            })
            }
          </div>
        }
      </div>

        <div className="mt-6 w-full flex items-center flex-col gap-2">
      {
        Loading ? <Spinner /> :
      chats.map((chat) => (
        <ChatPanel
          key={chat._id}
          activeChat={activeChat}
          handleChatClick={handleChatClick}
          chat={chat}
        />
      ))}
      </div>
    </div>
  );
};
