import { ArrowLeft, BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const StroryView = ({ viewStory, setViewStory }) => {
    const [progress, setProgress] = useState(0)
    useEffect(() => {
        let timer, progressInterval;
        if (viewStory.media_type !== "video") {
            setProgress(0);
            const duration = 10000;
            let strtTime = 0;
            const chgTime = 100;
            progressInterval = setInterval(() => {
                strtTime += chgTime;
                setProgress((strtTime / duration) * 100);
            }, chgTime)
            timer = setTimeout(() => {
                setViewStory(null);
            }, duration);
        }
        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);

        }
    }, [viewStory, setViewStory])
    // console.log(progress)
    // console.log(viewStory);
    return (
        <div className='fixed inset-0 z-110 h-screen bg-black  flex items-center justify-center text-white p-4 ' style={{ backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000' }}>

            {/* Progress Bar */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
                <div className='h-full bg-white transition-all duration-100 linear' style={{ width: `${progress}%` }}></div>
            </div>

            {/* User Info - Top Left */}
            <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50'>
                <img src={viewStory.user?.profile_picture} alt="" className='size-7 sm:size:8 rounded-full object-cover border border-white' />
                <div className='text-white font-medium flex items-center gap-1.5'>
                    <span>{viewStory.user?.full_name}</span>
                    <BadgeCheck size={18} />
                </div>
            </div>

            {/* Close Button */}
            <button onClick={() => setViewStory(null)} className='text-white p-2 cursor-pointer absolute top-4 right-4 text-3xl font-bold focus:outline-none'>
                <X className='h-8 w-8 hover:scale-110 transition' />
            </button>

            {/* content wrapper */}
            <div className='max-w-[90vw] max-h-[90vw] flex items-center justify-center'>
                {
                    viewStory.media_type === "text" ?
                        (
                            <div className={`h-full w-full  flex items-center justify-center text-center text-white text-2xl p-8`} > <p>{viewStory.content}</p> </div>
                        )
                        :
                        (<div className='max-w-200 max-h-200'>{
                            viewStory.media_type === "image" ?
                                (
                                    <img src={viewStory.media_url} className='max-w-full max-h-screen object-contain' />

                                )
                                :
                                (
                                    <video src={viewStory.media_url} onEnded={() => setViewStory(null)} className='max-w-full max-h-screen object-contain' controls autoPlay />
                                )
                        }</div>)
                }
            </div>

        </div>
    )
}

export default StroryView
