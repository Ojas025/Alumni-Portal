import { clearSocket } from "@/store/socketSlice";
import { RootState } from "@/store/Store";
import { clearUser } from "@/store/userSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

export const useLogout = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector((state: RootState) => state.socket);
    const navigate = useNavigate();

    const logout = async () => {
        try {

            const accessToken = localStorage.getItem("accessToken");

            const response = await axios.post("http://localhost:3000/api/logout", {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200){
                // Clear user from store
                dispatch(clearUser());

                // Clear tokens from localStorage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
  
                    socket?.disconnect();
                    dispatch(clearSocket());

                // Navigate to the login/signup page
                navigate("/");
            }
            else{
                console.log("Failed to log out");
            }
        }
        catch(error) {
            console.error("Error while logging out", error)
        }
    }; 

    return { logout };
}
