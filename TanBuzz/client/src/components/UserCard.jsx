import React from "react";
import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import { fetchConnections } from "../features/connections/connectionSlice";
import toast from "react-hot-toast";
import { fetchUserData } from "../features/users/userSlice";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleConnectionRequest = async (id) => {
    if (currentUser.connections.includes(id)) {
        navigate(`/messages/${id}`);
        return;
    }
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/connect",
        { id: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleFollow = async (id) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/follow",
        { id: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      //   console.log(data);
      if (data.success) {
        dispatch(fetchConnections(token));
        dispatch(fetchUserData(token));
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // console.log(us er)
  return (
    <div
      key={user._id}
      className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md"
    >
      <div className="text-center">
        <img
          src={user.profile_picture}
          alt=""
          className="rounded-full w-16 shadow-md mx-auto"
        />
        <p className="mt-4 font-semibold">{user.full_name}</p>
        {user.username && (
          <p className="text-gray-500 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-gray-600 mt-2 text-center text-sm px-4">
            {user.bio}
          </p>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
        <div className="flex items-center justify-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <MapPin className="h-4 w-4" />
          {user.location}
        </div>
        <div className="flex items-center justify-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <span>{user.followers.length}</span> Followers
        </div>
      </div>
      <div className="flex mt-4 gap-2">
        {/* Follow Button */}
        <button
          disabled={currentUser?.following.includes(user._id)}
          onClick={() => handleFollow(user._id)}
          className="w-full flex items-center justify-center py-2 rounded-md gap-2 bg-linear-to-r from-indigo-500 to bg-purple-600 hover:from-indigo-600 hover:to-pink-700 active:scale-95 transition text-white cursor-pointer"
        >
          <UserPlus className="h-5 w-5" />
          {currentUser?.following.includes(user._id) ? (
            <p>Following</p>
          ) : (
            <p>Follow</p>
          )}
        </button>
        {/* Connection Request Button / Message Button */}
        <button
          onClick={()=> handleConnectionRequest(user._id)}
          className="w-16 flex items-center justify-center border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition"
        >
          {currentUser?.connections.includes(user._id) ? (
            <MessageCircle className="h-5 w-5 group-hover:scale-105 transition" />
          ) : (
            <Plus className="h-5 w-5 group-hover:scale-105 transition" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
