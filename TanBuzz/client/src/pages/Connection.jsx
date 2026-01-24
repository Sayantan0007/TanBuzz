import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyConnectionsData as connections,
  dummyPendingConnectionsData as pending
} from "../assets/assets";
import { MessageSquare, UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react';
const Connection = () => {
  const navigate = useNavigate();
  let [currentTab, setCurrentTab] = useState('Followers')
  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pending, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ]
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h3 className='font-bold text-3xl text-slate-700'>Connections</h3>
          <p className='text-slate-500 mt-2'>manage your network and discover new connections</p>
        </div>
        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {
            dataArray.map((data, ind) => {
              // console.log(data);

              return (
                <div key={ind} className='bg-white h-20 w-40 rounded-md shadow flex flex-col items-center justify-center gap-1 border border-gray-200'>
                  <b className='text-slate-600'>{data.value.length}</b>
                  <p className=''>{data.label}</p>
                </div>
              )
            })
          }
        </div>
        {/* Sections */}
        <div className='bg-white inline-flex flex-wrap rounded-md shadow-md border border-gray-200 p-1 items-center '>
          {
            dataArray.map((data, ind) => {
              // console.log(data);
              const Icon = data.icon;
              return (
                <button key={ind} className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${currentTab === data.label ? `bg-gray-200 text-black font-medium` : `text-gray-500 hover:text-black`}`} onClick={() => setCurrentTab(data.label)}>
                  <Icon size={20} />
                  <span className='ml-1'>{data.label}</span>
                </button>
              )
            })
          }
        </div>

        {/* Connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {
            dataArray.find((item) => item.label === currentTab)?.value.map((user) => {
              // console.log(data);
              return (
                <div key={user._id} className='w-full max-w-88 flex gap-5 bg-white shadow rounded-md p-6'>
                  <img src={user.profile_picture} alt="profile" className='rounded-full h-12 w-12 shadow-md mx-auto' />
                  <div className='flex-1'>
                    <p className='text-slate-700 font-medium'>{user.full_name}</p>
                    <p className='text-slate-500 '>{user.username}</p>
                    <p className='text-sm text-gray-500'>{user.bio.slice(0, 40)}...</p>
                    <div className='flex max-sm:flex-col gap-2 mt-4'>
                      {
                        <button onClick={() => navigate(`/profile/${user._id}`)} className='w-full p-2 text-sm rounded bg-linear-to-br from-indigo-500 to-purple-600 text-white cursor-pointer shadow-2xl hover:from-indigo-600 hover:to-purple-700 transition active:scale-95'>
                          View Profile
                        </button>
                      }
                      {
                        currentTab === "Following" &&
                        <button className='w-full p-2 text-sm rounded bg-slate-200 hover:bg-slate-300 text-black active:scale-95 transition cursor-pointer'>
                          Unfollow
                        </button>
                      }
                      {
                        currentTab === "Pending" &&
                        <button className='w-full p-2 text-sm rounded bg-slate-200 hover:bg-slate-300 text-black active:scale-95 transition cursor-pointer'>
                          Accept
                        </button>
                      }
                      {
                        currentTab === "Connections" &&
                        <button onClick={() => navigate(`/messages/${user._id}`)} className='w-full p-2 text-sm rounded bg-slate-200 hover:bg-slate-300 text-black active:scale-95 transition cursor-pointer flex items-center justify-center gap-1'>
                          <MessageSquare className='h-4 w-4' />
                          Message
                        </button>
                      }
                    </div>
                  </div>
                </div>
              )
            }
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Connection
