import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from "@clerk/clerk-react"
// import bgImg from "../assets/bgImage.png"
const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* background image */}
      <img src={assets.bgImage} alt="" className='absolute inset-0 -z-1 h-full w-full object-cover' />
      {/* left section : Branding*/}
      <div className='flex-1 flex flex-col items-start justify-between px-6 pt-0 pb-6 md:px-10 md:pt-0 md:pb-10 lg:pl-36'>
        <img src={assets.logo1} alt="logo" className='max-h-46 object-contain' />
        <div>
          <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
            <img src={assets.group_users} alt="" className='h-8 md:h-10' />
            <div>
              <div className='flex'>
                {Array(5).fill(0).map((_, i) => (<Star key={i} className='size-4 md:size-4.5 text-transparent fill-amber-500' />))}
              </div>
              <p>Used by 12k+ developers</p>
            </div>
          </div>
          <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-linear-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>More than just friends truly connect</h1>
          <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>connect with global community on tanbuzz</p>
        </div>
        <span className='md:h-10'></span>
      </div>
      {/* right section : login form */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <SignIn />
      </div>
    </div>
  )
}

export default Login
