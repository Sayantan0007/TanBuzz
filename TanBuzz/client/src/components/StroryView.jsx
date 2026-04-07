import { BadgeCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const StroryView = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (viewStory.media_type === "video") {
      return;
    }

    let timer;
    let progressInterval;
    const duration = 10000;
    let startTime = 0;
    const changeTime = 100;

    progressInterval = setInterval(() => {
      startTime += changeTime;
      setProgress((startTime / duration) * 100);
    }, changeTime);

    timer = setTimeout(() => {
      setViewStory(null);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [viewStory, setViewStory]);

  return (
    <div
      className="fixed inset-0 z-110 flex h-screen items-center justify-center bg-black p-4 text-white"
      style={{
        backgroundColor:
          viewStory.media_type === "text"
            ? viewStory.background_color
            : "#000000",
      }}
    >
      <div className="absolute top-0 left-0 h-1 w-full bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="absolute top-4 left-4 flex items-center space-x-3 rounded bg-black/50 p-2 px-4 backdrop-blur-2xl sm:p-4 sm:px-8">
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className="size-7 rounded-full border border-white object-cover sm:size-8"
        />
        <div className="flex items-center gap-1.5 font-medium text-white">
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>

      <button
        onClick={() => setViewStory(null)}
        className="absolute top-4 right-4 cursor-pointer p-2 text-3xl font-bold text-white focus:outline-none"
      >
        <X className="h-8 w-8 transition hover:scale-110" />
      </button>

      <div className="flex max-h-[90vw] max-w-[90vw] items-center justify-center">
        {viewStory.media_type === "text" ? (
          <div className="flex h-full w-full items-center justify-center p-8 text-center text-2xl text-white">
            <p>{viewStory.content}</p>
          </div>
        ) : (
          <div className="max-h-200 max-w-200">
            {viewStory.media_type === "image" ? (
              <img
                src={viewStory.media_url}
                alt=""
                className="max-h-screen max-w-full object-contain"
              />
            ) : (
              <video
                src={viewStory.media_url}
                onEnded={() => setViewStory(null)}
                className="max-h-screen max-w-full object-contain"
                controls
                autoPlay
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StroryView;
