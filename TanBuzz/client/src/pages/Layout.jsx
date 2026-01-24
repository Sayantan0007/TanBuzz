import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = dummyUserData
  return (
    <>
      {
        user ? (
          <div className='w-full h-screen flex' >
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className='flex-1 bg-slate-50'>
              <Outlet />
            </div>
            {
              isSidebarOpen ?
                (<X className='absolute top-3 right-3 p-2 z-100 rounded-md shadow h-10 w-10 bg-white text-gray-600 sm:hidden' onClick={() => setIsSidebarOpen(false)} />)
                :
                (<Menu className='absolute top-3 right-3 p-2 z-100 rounded-md shadow h-10 w-10 bg-white text-gray-600 sm:hidden' onClick={() => setIsSidebarOpen(true)} />)
            }
          </div >
        ) : (
          <Loading />
        )
      }
    </>
  )
}

export default Layout
