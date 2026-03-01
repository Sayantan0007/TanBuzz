import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const RecentMsgs = () => {
  const [msg, setMsg] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("api/message/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      //   console.log(data);
      if (data.success) {
        //Group messages by sender and get the latest message for each sender
        const grouped = data.data.reduce((acc, message) => {
          const senderId = message.from_user_id._id;
          if (!acc[senderId]) {
            acc[senderId] = message; // Store the latest message for each sender
          }
          return acc;
        }, {});
        // Sort messages by date
        const sortedMessages = Object.values(grouped).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setMsg(sortedMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      fetchRecentMessages();
      // store the interval id so we can clear it later
      const intervalId = setInterval(fetchRecentMessages, 30000); // Fetch recent messages every 30 seconds
      return () => clearInterval(intervalId);
    }
  }, [user]);
  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow-lg text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {msg.map((m, ind) => {
          // console.log(m.from_user_id);
          return (
            <Link
              key={ind}
              to={`messages/${m.from_user_id._id}`}
              className="flex items-start gap-2 py-2 hover:bg-slate-100"
            >
              <img
                src={m.from_user_id.profile_picture}
                alt="profile pic"
                className="rounded-full h-8 w-8"
              />
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="font-medium">{m.from_user_id.full_name}</p>
                  <p className="text-[10px] text-slate-400">
                    {moment(m.createdAt).fromNow()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">
                    {m.content ? m.content : "Media"}{" "}
                  </p>
                  {!m.seen && (
                    <p className="bg-indigo-500 text-white flex items-center justify-center rounded-full w-4 h-4 text-[10px]">
                      1
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMsgs;
