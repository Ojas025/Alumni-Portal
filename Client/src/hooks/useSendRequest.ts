import axios from "axios";
import { useNotification } from "./useNotification";

export const useSendRequest = () => {
    const { notify } = useNotification();

    const sendRequest = async (receiverId: string, type: 'connection' | 'mentoring') => {
                try {
                    const result = await axios.post(
                        `http://localhost:3000/api/invitation`,
                        { receiverId, type },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                            }
                        }
                    );

                    if (result.status === 200){
                        notify({ id: "connection-toast", type: "success", content: "Connection request sent" });  
                    }
                    
                } catch (error) {
                    console.error("Error sending connection request", error); 
                    notify({ id: "connection-toast", type: "error", content: "Could not send connection request" });  
                }
    };
    return { sendRequest };
}
