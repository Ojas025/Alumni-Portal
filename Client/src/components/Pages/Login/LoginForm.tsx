import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/Spinner";
import { useNotification } from "@/hooks/useNotification";
import { setSocket } from "@/store/socketSlice";
import { initializeSocket } from "@/socket";
import { mountSocketListeners } from "@/socket/listeners";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const isFormActive = email.trim() !== "" && password.trim() !== "";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const submitForm = async () => {
    setLoading(true);

    try {
      const values = { email, password };

      const response = await axios.post(
        "http://localhost:3000/api/login",
        values,
        { withCredentials: true }
      );
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      const user = response.data.data.user;

      dispatch(setUser(user));

      if (!accessToken || !refreshToken) {
        throw new Error("Error while signing up");
      }

      // Store the tokens for authorization purposes
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const socket = initializeSocket();
      console.log("socket init");
      
      if (!socket.connected) {
        console.log(socket.connected);
        socket?.connect();
        mountSocketListeners(socket);
        dispatch(setSocket(socket));
      }

      notify({
        id: "login-toast",
        type: "success",
        content: "Logged-in successfully!",
      });

      // Navigate the user to the dashboard/home page
      navigate("/home");
    } 
    catch (error) {
      console.error("LOGIN_SUBMISSION_ERROR", error);
      notify({ id: "login-error", type: "error", content: "500: Login Error" });
    } 
    finally {      
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center text-black">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="flex justify-end mb-4">
          <a
            href="#"
            className="text-sm text-black hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={!isFormActive}
          className={`w-full py-3 rounded text-white font-medium transition-colors cursor-pointer ${
            isFormActive ? "bg-black" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={submitForm}
        >
          {loading ? <Spinner /> : "Sign In →"}
        </button>
      </form>
    </div>
  );
};
