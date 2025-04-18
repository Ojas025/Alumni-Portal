import { Route, Routes } from "react-router";
import "./App.css";
import { Home } from "./components/Pages/Home/Home";
import { Login } from "./components/Pages/Login/Login";
import { Layout } from "./components/Utils/Layout";
import { Profile } from "./components/Pages/Profile/Profile";
import { Articles } from "./components/Pages/Articles/Articles";
import { Events } from "./components/Pages/Events/Events";
import { Jobs } from "./components/Pages/Jobs/Jobs";
import { Gallery } from "./components/Pages/Gallery/Gallery";
import { Mentor } from "./components/Pages/MentorFinder/Mentor";
import { AlumniDirectory } from "./components/Pages/AlumniDirectory/AlumniDirectory";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/userSlice";
import { WelcomePage } from "./components/Pages/Home/WelcomPage";
import { Chat } from "./components/Pages/Chat/Chat";
import { Resources } from "./components/Pages/Resources/Resources";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "./store/Store";
import { initializeSocket } from "./socket";
import { addOnlineUser, removeOnlineUser, setSocket } from "./store/socketSlice";
import { mountSocketListeners } from "./socket/listeners";
import { ChatEventsEnum } from "./socket/chatEvents";
import { Feedback } from "./components/Pages/Feedback/Feedback";
import { AlumniMap } from "./components/Pages/AlumniMap.tsx/AlumniMap";
import { AdminDashboard } from "./components/Pages/AdminDashboard/AdminDashboard";
// import { Spinner } from "./components/ui/Spinner";

function App() {
  const dispatch = useDispatch();
  const {user } = useSelector((state: RootState) => state.user);
  const s = useSelector((state: RootState) => state.socket.socket);

  useEffect(() => {
    const handleFetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
  
        if (!accessToken) {
          // User not logged in
          console.log("No access token found. User not logged in");
          return;
        }
  
        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
  
        if (response.data && response.data.data) {
          dispatch(setUser(response.data.data));
          console.log("User profile fetched.");
        } else {
          console.log("Could not fetch user profile.");
        }
      } catch (error) {
        console.error("Error in fetching user profile", error);
      }
    };

    handleFetchUser();    
  }, [dispatch]);

  useEffect(() => {
    if (user) {

      if (s) return;

      const socket = initializeSocket();

      if (!socket.connected) {
        socket.connect();
        mountSocketListeners(socket);
        dispatch(setSocket(socket));
      }
    }
  }, [user, dispatch, s]);

  useEffect(() => {
    if (!s) return;

    const handleUserStatus = ({ user, socket, status }: { user: string, socket: string, status: string }) => {
      if (status === 'online'){
        console.log('online');
        dispatch(addOnlineUser({ user: user, socket: socket }));
      }
      else{
        console.log('offline');
        dispatch(removeOnlineUser({ user: user, socket: socket }));
      }
    }

    s.on(ChatEventsEnum.USER_STATUS, handleUserStatus);

    return () => { s.off(ChatEventsEnum.USER_STATUS, handleUserStatus) };
  }, [s, dispatch]);


  return (
    <>

        {/* <Suspense fallback={<Spinner />}> */}
      <Routes>
        <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
p            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/events" element={<Events />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/find-mentor" element={<Mentor />} />
            <Route path="/alumni-directory" element={<AlumniDirectory />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/alumni-near-me" element={<AlumniMap />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
      </Routes>
      {/* </Suspense>       */}


      <ToastContainer position="bottom-left" autoClose={3000} />
    </>
  );
}

export default App;
