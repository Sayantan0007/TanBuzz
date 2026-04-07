import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  Trash,
  EllipsisVertical,
  Pencil,
} from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const renderContentWithHashtags = (content = "") =>
  content.split(/(#\w+)/g).map((part, index) =>
    /^#\w+$/.test(part) ? (
      <span key={`${part}-${index}`} className="text-blue-600">
        {part}
      </span>
    ) : (
      <React.Fragment key={`text-${index}`}>{part}</React.Fragment>
    ),
  );

const PostCard = ({ post, profileId, setPosts }) => {
  const location = useLocation();
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [likes, setLikes] = useState(post.likes_count);
  const currentUserData = useSelector((state) => state.user.value);
  const { getToken } = useAuth();

  const handleLike = async () => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "api/post/like",
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success(data.message);
        setLikes((prev) => {
          if (prev.includes(currentUserData._id)) {
            return prev.filter((id) => id !== currentUserData._id);
          } else {
            return [...prev, currentUserData._id];
          }
        });
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleComment = () => {};
  const handleShare = () => {};
  const navigate = useNavigate();
  const handleDelete = async (postId) => {
    try {
      const token = await getToken();
      const { data } = await api.delete("api/post/delete", {
        data: { postId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setPosts?.((prev) => prev.filter((post) => post._id !== postId));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleEdit = () => {
    setShowOptions(false);
    setShowEditModal(true);
  };
  const handleUpdate = async () => {
    try {
      const token = await getToken();

      const { data } = await api.put(
        "api/post/update",
        {
          postId: post._id,
          content: editContent,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);

        setPosts?.((prev) =>
          prev.map((p) =>
            p._id === post._id ? { ...p, content: editContent } : p,
          ),
        );

        setShowEditModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // console.log(post);
  return (
    <div className="bg-white rounded-xl shadow space-y-4 p-4 w-full max-w-2xl relative">
      {/* user info */}
      <div
        className="inline-flex items-center gap-3 cursor-pointer "
        onClick={() => navigate(`/profile/${post.user._id}`)}
      >
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>
      {!profileId && location.pathname === "/profile" && (
        <div className="absolute right-4 cursor-pointer">
          <EllipsisVertical
            className="h-4 w-4 text-gray-600"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300  rounded-lg shadow-md text-sm">
              <div
                className="flex items-center text-gray-600 gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDelete(post._id)}
              >
                <Trash className="h-4 w-4" />
                Delete
              </div>

              <div
                className="flex items-center text-gray-600 gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleEdit(post._id)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </div>
            </div>
          )}
        </div>
      )}
      {/* Content */}
      {post.content && (
        <div className="text-gray-800 text-sm whitespace-pre-line break-words">
          {renderContentWithHashtags(post.content)}
        </div>
      )}
      {/* Images */}
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((img, ind) => {
          return (
            <img
              src={img}
              key={ind}
              alt=""
              className={`h-48 w-full object-cover rounded-lg ${post.image_urls.length === 1 && "h-auto col-span-2"}`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4 border-t border-gray-300 pt-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Heart
            className={`h-4 w-4 cursor-pointer ${likes.includes(currentUserData._id) && "text-red-500 fill-red-500"}`}
            onClick={handleLike}
          />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle
            className={`h-4 w-4 cursor-pointer`}
            onClick={handleComment}
          />
          <span>{12}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className={`h-4 w-4 cursor-pointer`} onClick={handleShare} />
          <span>{7}</span>
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[400px] space-y-3">
            <h3 className="font-semibold">Edit Post</h3>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={4}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
