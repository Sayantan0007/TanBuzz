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
    if (!isSignedIn) {
      return;
    }

    let isMounted = true;

    (async () => {
      const token = await getToken();
      if (!token || !isMounted) {
        return;
      }

      dispatch(fetchUserData(token));
      dispatch(fetchConnections(token));
    })();

    return () => {
      isMounted = false;
    };
  }, [dispatch, getToken, isSignedIn]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let eventSource;
    let isCancelled = false;

    (async () => {
      try {
        const token = await getToken();
        if (!token || isCancelled) {
          return;
        }

        const { data } = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/message/sse-token`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ).then((response) => response.json().then((body) => ({ data: body })));

        if (!data?.success || isCancelled) {
          return;
        }

        eventSource = new EventSource(
          `${import.meta.env.VITE_BASE_URL}/api/message/sse?token=${data.token}`,
        );

        eventSource.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (pathnameRef.current === `/messages/${message.from_user_id._id}`) {
            dispatch(addMessage(message));
            return;
          }

          toast.custom((t) => <Notification t={t} message={message} />, {
            position: "bottom-right",
            duration: 6000,
          });
        };
      } catch (error) {
        console.error("SSE connection failed", error);
      }
    })();

    return () => {
      isCancelled = true;
      eventSource?.close();
    };
  }, [dispatch, getToken, user]);
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
