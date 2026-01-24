import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets';
import { Image, X } from 'lucide-react';
import { toast } from 'react-hot-toast'

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;
  const handlePost = async() => {

  }
  return (
    <div className='min-h-screen bg-linear-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h3 className='font-bold text-3xl text-slate-900'>Create Post</h3>
          <p className='text-slate-600 mt-2'>Share your thougts with the world</p>
        </div>
        {/* Form */}
        <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-2xl shadow-2xl space-y-4'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} alt="" className='rounded-full h-12 w-12 shadow' />
            <div>
              <h2 className='font-semibold'> {user.full_name} </h2>
              <p className='text-slate-600 text-sm'>@{user.username}</p>
            </div>
          </div>
          {/* Text Area */}
          <textarea name="" id="" className='w-full resize-none placeholder-gray-400 outline-none text-sm mt-4 max-h-20' placeholder='Whats happening?' onChange={(e) => setContent(e.target.value)} value={content}></textarea>
          {/* Images */}
          {
            image.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
              {
                image.map((img, i) => {
                  return (
                    <div key={i} className='relative group'>
                      <img src={URL.createObjectURL(img)} alt="" className='h-20 rounded-md' />
                      <div onClick={() => setImage(image.filter((_, index) => index !== i))} className='absolute hidden group-hover:flex justify-center items-center inset-0 bg-black/40 rounded-md cursor pointer' >
                        <X className='w-6 h-6 text-white' />
                      </div>
                    </div>
                  )
                })
              }
            </div>
          }
          {/* Bottom Bar */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
            <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
              <Image className='size-6' />
            </label>
            <input type="file" id='images' accept='image/*' hidden multiple onChange={(e) => setImage([...image, ...e.target.files])} />

            <button onClick={()=> toast.promise(
              handlePost(),
              {
                loading: "Uploading...",
                success: <p>Post Uploaded</p>,
                error: <p>Post Not Added</p>,
              }
            )} className='text-sm bg-linear-to-r from-indigo-500 to-purple-600 py-2 px-8 rounded-md mt-6 text-white active:scale-95 hover:from-indigo-600 hover:to-purple-700 transition font-medium cursor-pointer'>
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CreatePost
