import React, { useEffect, useState } from 'react'
import { dummyConnectionsData } from '../assets/assets';
import { Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
const Messages = () => {
  const [recentMsgs, setRecentMsgs] = useState([]);
  const fetchDummyMsg = () => {
    setRecentMsgs(dummyConnectionsData);
  }
  useEffect(() => {
    fetchDummyMsg()
  }, [])

  const navigate = useNavigate();
  return (
    <div className='min-h-screen relative bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h3 className='font-bold text-3xl text-slate-700'>Messages</h3>
          <p className='text-slate-500 mt-2'>Talk to your friends and family</p>
        </div>
        {/* Conneted User */}
        <div className='flex flex-col gap-3'>
          {
            recentMsgs.map((msg) => {
              // console.log(msg)
              return (
                <div key={msg._id} className='max-w-xl flex flex-wrap bg-white shadow rounded-lg p-6 gap-5'>
                  <img src={msg.profile_picture} alt="" className='size-12 rounded-full mx-auto' />
                  <div className='flex-1'>
                    <p className='text-slate-800 font-semibold'>{msg.full_name}</p>
                    <p className='text-slate-500 text-md'>@{msg.username}</p>
                    <p className='text-gray-600 text-xs'>{msg.bio}</p>
                  </div>
                  <div className='flex flex-col gap-2 mt-4'>
                    <button onClick={() => navigate(`/messages/${msg._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer transition active:scale-95 gap-1'>
                      <MessageSquare size={16} />
                    </button>
                    <button onClick={() => navigate(`/profile/${msg._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer transition active:scale-95'>
                      <Eye size={16} />
                    </button>

                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  )
}

export default Messages
