import React, { useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Chatbox from "./pages/Chatbox";
import Connection from "./pages/Connection";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import CreatePost from "./pages/CreatePost";
import { useUser, useAuth } from "@clerk/clerk-react";
import Layout from "./pages/Layout";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserData } from "./features/users/userSlice";
import { fetchConnections } from "./features/connections/connectionSlice";
import { addMessage } from "./features/messages/messageSlice";
import Notification from "./components/Notification";

const App = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    const fetchData = async () => {
      if (isSignedIn) {
        const token = await getToken();
        // console.log(token);
        dispatch(fetchUserData(token));
        dispatch(fetchConnections(token));
      }
    };
    fetchData();
  }, [isSignedIn]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    try {
      if (isSignedIn) {
        const eventSource = new EventSource(
          `${import.meta.env.VITE_BASE_URL}api/message/sse/${user.id}`,
        );
        eventSource.onmessage = (event) => {
          const message = JSON.parse(event.data);
          // console.log(message);
          if (pathnameRef.current === `/messages/${message.from_user_id._id}`) {
            dispatch(addMessage(message));
          } else {
            toast.custom((t) => <Notification t={t} message={message} />, {
              position: "bottom-right",
              duration: 6000,
            });
          }
        };
        return () => {
          eventSource.close();
        };
      }
    } catch (error) {}
  }, [isSignedIn, dispatch, user]);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={isSignedIn ? <Layout /> : <Login />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Chatbox />} />
          <Route path="connections" element={<Connection />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="discover" element={<Discover />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
