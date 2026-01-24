import { Search, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets';
import Loading from '../components/Loading';
import UserCard from '../components/UserCard';


const Discover = () => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    // console.log(e);
    if (e.key === "Enter" || e.type === "click") {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false)
      }, 1000)
    }
  }
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h3 className='font-bold text-3xl text-slate-700'>Discover People</h3>
          <p className='text-slate-500 mt-2'>Connect with amazing people and grow your network</p>
        </div>
        {/* Search bar */}
        <div className='bg-white/80 rounded-md shadow-md border border-slate-200/60 mb-8'>
          <div className='p-6'>
            <div className='relative'>
              <SearchIcon onClick={handleSearch} className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer' />
              <input type="text" className='border border-gray-300 rounded-sm w-full p-1 max-sm:text-sm pl-10 max-sm:pl-12 py-2  outline-none' placeholder='Search people by name, username, bio or location...' onChange={(e) => setInput(e.target.value)} onKeyUp={handleSearch} />
            </div>
          </div>
        </div>
        
        <div className='flex flex-wrap gap-6'>
          {users.map((user, ind) => {
            return (
              <UserCard user={user} key={ind} />
            )
          })}
        </div>
        {loading && <Loading height='60vh'/>}
      </div>
    </div>
  )
}


export default Discover
