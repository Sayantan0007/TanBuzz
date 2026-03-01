import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, Sparkle, TextIcon, UploadIcon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const StoryModal = ({ setShowModal, fetchStoriesData }) => {
  const bgColors = [
    "from-indigo-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-pink-500 to-red-600",
    "from-yellow-400 to-orange-500",
  ];
  const [mode, setMode] = useState("text"); //text,image,video
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { getToken } = useAuth();
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; //50MB
  const MAX_VIDEO_DURATION = 60; //60 seconds

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    // console.log(file)
    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error("Video size should be less than 50MB");
          setMedia(null);
          setPreviewUrl(null);
          return;
        }
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error("Video duration should be less than 60 seconds");
            setMedia(null);
            setPreviewUrl(null);
            return;
          } else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setText("");
            setMode("media");
          }
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setText("");
        setMode("media");
      }
    }
  };
  const handleCreateStories = async () => {
    const token = await getToken();
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";
    if (media_type == "text" && !text) {
      throw new Error("Please provide some image or content");
    }
    let formdata = new FormData();
    formdata.append("content", text);
    formdata.append("media_type", media_type);
    formdata.append("story", media);
    formdata.append("background_color", background);
    try {
      const { data } = await api.post("/api/story/add", formdata, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(data);
      if (data.success) {
        setShowModal(false);
        toast.success(data.message);
        fetchStoriesData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>
        <div
          className={`h-96 flex items-center justify-center relative rounded-lg bg-linear-to-b ${background}`}
        >
          {mode === "text" && (
            <textarea
              className="w-full h-full bg-transparent text-white p-6 resize-none text-lg font-medium focus:outline-none "
              placeholder="Share your thoughts..."
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}
          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full"
              />
            ) : (
              <video
                src={previewUrl}
                className="object-contain max-h-full"
              ></video>
            ))}
        </div>
        <div className="flex mt-4 gap-2">
          {bgColors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full ring cursor-pointer bg-linear-to-b ${color}`}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>
        <div className="flex mt-4 gap-2">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex flex-1 items-center justify-center p-2 gap-4 rounded cursor-pointer ${mode === "text" ? "bg-white text-black" : "bg-zinc-500"}`}
          >
            <TextIcon size={18} />
            Text
          </button>
          <label
            className={`flex flex-1 items-center justify-center gap-4 rounded cursor-pointer ${mode === "media" ? "bg-white text-black" : "bg-zinc-800"}`}
          >
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaUpload}
            />
            <UploadIcon size={18} />
            Photo/Video
          </label>
        </div>
        <button
          onClick={() =>
            toast.promise(handleCreateStories(), {
              loading: "Uploading...",
            })
          }
          className="flex items-center mt-4 p-5 justify-center text-center w-full h-8 gap-2 rounded-lg cursor-pointer bg-linear-to-br  from-cyan-500 to-purple-500 hover:scale-105 transition duration-300 hover:bg-linear-to-tr hover:from-indigo-600 hover:to-purple-600"
        >
          <Sparkle /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModal;
