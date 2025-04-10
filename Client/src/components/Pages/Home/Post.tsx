import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { Link } from "react-router";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/useNotification";
import axios from "axios";
import { updateUser } from "@/store/userSlice";
import { Spinner } from "@/components/ui/Spinner";
import { FaUserCircle } from "react-icons/fa";

interface PostProps {
    _id: string;
    owner: {
        firstName: string;
        lastName: string;
        profileImageURL: string;
        _id: string;
        role: string;
    };
    content: string;
    likes: number;
    deletePost: (tweetId: string) => void;
    updatePost: (content: string, tweetId: string) => void;                      
}

export const Post = ({ _id, owner, content, likes, deletePost, updatePost }: PostProps) => {
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const [editable, setEditable] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(content);
    const  { user } = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState(false);
    const { notify } = useNotification();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(`#dropdown-${_id}`)) {
                setDropdownVisibility(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleUpdate = () => {
        if (!updatedContent.trim()) {
            notify({ id: "post-toast", type: "error", content: "Post content cannot be empty" });
            return;
        }

        setEditable(false);
        updatePost(updatedContent, _id);
        setDropdownVisibility(false);
    }

    const handleDelete = () => {
        deletePost(_id);
        setDropdownVisibility(false);
    }

    const handleAddConnection = async (connecteeId: string) => {
        try {
			setLoading(true);
        	const result = await axios.put(`http://localhost:3000/api/user/connect/${connecteeId}`, {},{
          		headers: {
            		Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          	    }
            });

            const updatedUser = result.data?.data;
            
            if (updatedUser){                
                updateUser(updatedUser);
                notify({ id: "connection-toast", type: "success", content: "Connection added successfully" });             
            }
		} 
		catch (error) {
			console.error("Error fetching posts", error);

			notify({ id: "connection-toast", type: "error", content: "Could not add connection" });
		}
        finally {
            setLoading(false);
        }

    }

    const handleRemoveConnection = async (connecteeId: string) => {
        try {
			setLoading(true);
        	const result = await axios.delete(`http://localhost:3000/api/user/disconnect/${connecteeId}`, {
          		headers: {
            		Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          	    }
            });

            const updatedUser = result.data?.data;
            
            if (updatedUser){                
                updateUser(updatedUser);
                notify({ id: "connection-toast", type: "success", content: "Connection removed successfully" });             
            }
		} 
		catch (error) {
			console.error("Error fetching posts", error);

			notify({ id: "connection-toast", type: "error", content: "Could not remove connection" });
		}
        finally {
            setLoading(false);
        }

    }

    return (
        <div className="dark:bg-[hsl(0,0%,8%)] bg-white  p-5 rounded-md dark:shadow-none shadow-xl space-y-2">
            { loading && <Spinner /> }
            <div className="flex items-center space-x-4 justify-between">
                <div className="flex items-center gap-4 text-sm">
                    {
                        owner.profileImageURL ?
                        <img
                            src={owner.profileImageURL}
                            className="rounded-full w-8 h-8"
                            alt="User"
                        />
                        : <FaUserCircle className="w-8 h-8"/>
                    }
                    <div>
                        <Link to={`/profile/${owner._id}`} className="font-semibold cursor-pointer">{owner.firstName + ' ' + owner.lastName}</Link>
                        <p className="text-xs dark:text-gray-300 text-gray-500">{owner.role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {
                        owner._id !== user?._id &&
                        (
                            user?.connections.some(connection => connection._id === owner._id) ?
                            <IoPersonRemoveOutline onClick={() => handleRemoveConnection(owner._id)}/> :
                            <IoPersonAddOutline onClick={() => handleAddConnection(owner._id)}/>
                        )
                    }

                    {   owner._id === user?._id &&
                        <div className="relative">
                        <PiDotsThreeOutlineVerticalFill className="cursor-pointer relative" onClick={() => setDropdownVisibility(prev => !prev)} />
                        {
                            dropdownVisibility &&
                            <div id={`dropdown-${_id}`}
                            className={`absolute top-6 right-1 z-20 w-20 rounded-sm border border-black bg-white text-black text-xs shadow-lg dark:bg-black dark:border-white dark:text-white`}
                            >

                                <div className="text-center w-full py-0.5 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  cursor-pointer rounded-t-sm" onClick={() => setEditable(true)}>
                                    Edit
                                </div>

                                <div className="cursor-pointer py-0.5 text-center dark:hover:bg-white hover:bg-black hover:text-white dark:hover:text-black  rounded-b-sm" onClick={handleDelete}>
                                    Delete
                                </div>
                            </div>    
                        }
                    </div>
                    }
                </div>
            
            </div>

            
            {
                editable ? 
                // add textarea
                <div className="flex flex-col gap-2">
                    <textarea name="post" className="resize-none border focus:ring-0 border-blue-500 p-2 text-xs" cols={50} placeholder="Enter text here" value={updatedContent} onChange={(e) => setUpdatedContent(e.target.value)}></textarea>
                    <button className="text-xs w-20 self-end px-1 py-0.5 rounded-sm cursor-pointer dark:text-black font-semibold text-white dark:bg-white bg-black" onClick={handleUpdate}>Update</button>
                </div>
                : <p className="pl-8 text-sm dark:text-gray-200 text-gray-800 break-words">{content}</p>
            }

            <div className="flex justify-between items-center mt-2 px-2">
                <button
                    className="flex items-center gap-1 text-red-400"
                >
                    ❤️ {likes}
                </button>
            </div>
        </div>
    )
}

// {}
