import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets';
import { ImageIcon, Send, SendHorizonal, SendIcon, X } from 'lucide-react'

const Chatbox = () => {
  const msgs = dummyMessagesData;
  const [text, setText] = useState('');
  const [images, setImages] = useState(null);
  const [user, setUser] = useState(dummyUserData);
  const msgEndRef = useRef();

  const sendMsg = async () => {
    console.log(text);
  }
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])
  return user && (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-linear-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture} alt="" className='size-8 rounded-full' />
        <div>
          <p className='font-medium'> {user.full_name} </p>
          <p className='text-sm text-gray-500 -mt-1.5'>@{user.username} </p>
        </div>
      </div>
      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4'>
          {
            msgs.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, ind) => (
              <div key={ind} className={`flex flex-col ${msg.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${msg.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                  {
                    msg.message_type === "image" && <img src={msg.media_url} alt="" className='w-full max-w-sm rounded-lg mb-1' />
                  }

                  <p>{msg.text}</p>
                </div>
              </div>
            ))
          }
          <div ref={msgEndRef} />
        </div>
      </div>
      <div className='px-4'>
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-white shadow w-full max-w-xl mx-auto border border-gray-200 rounded-full mb-5'>
          <input type="text" className='flex-1 outline-none text-slate-700' placeholder='Type a message...' onKeyDown={e => e.key === "Enter" && sendMsg()} onChange={(e) => setText(e.target.value)} value={text} />

          <label htmlFor="image">
            {
              images ?
                <div className='relative'>
                  <img src={URL.createObjectURL(images)} alt="" className='h-10 rounded' />
                  <X onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImages(null)
                  }} className='absolute top-1 right-1 size-3  cursor-pointer text-white' />
                </div>

                :
                <ImageIcon className='size-7 cursor-pointer text-slate-500 hover:text-slate-700 transition' />
            }
            <input type="file" hidden id='image' accept='image/*' onChange={(e) => setImages(e.target.files[0])} />
          </label>
          <button onClick={sendMsg} className='bg-linear-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
            <SendHorizonal size={16} className='cursor-pointer' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatbox
