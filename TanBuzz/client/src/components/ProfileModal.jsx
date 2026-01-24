import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil, X } from 'lucide-react';

const ProfileModal = ({ setShowEdit }) => {
    const user = dummyUserData;
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name,
    })
    const handleSaveProfile = async (e) => {
        e.preventDefault();
    }
    return (
        <div className='fixed inset-0 z-110 h-screen overflow-y-scroll bg-black/50'>
            <div className='max-w-2xl sm:py-6 mx-auto'>
                <div className='bg-white rounded-lg shadow p-6 relative'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>
                    <X onClick={() => setShowEdit(false)} className='absolute right-4 top-4 text-gray-900 cursor-pointer' />
                    <form className='space-y-4' onSubmit={handleSaveProfile}>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
                                Profile Picture
                                <input hidden type="file" className='outline-none w-full p-3 border border-gray-200 rounded-lg' accept='image/*' id='profile_picture' onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} />
                                <div className='group/profile relative'>
                                    <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="" className='w-24 h-24 rounded-full mt-2 object-cover' />
                                    <div className='absolute hidden group-hover/profile:flex inset-0 bg-black/20 rounded-full items-center justify-center'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>
                        {/* Cover photo */}
                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1'>
                                Cover Photo
                                <input hidden type="file" accept='image/*' className='outline-none w-full p-3 border border-gray-200 rounded-lg' id='cover_photo' onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })} />
                                <div className='group/cover relative'>
                                    <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" className='w-80 h-40 rounded-lg mt-2 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover' />
                                    <div className='absolute hidden group-hover/cover:flex inset-0 bg-black/20 rounded-lg items-center justify-center'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>
                        {/* Name */}
                        <div className='flex flex-col items-start'>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                                Name
                            </label>
                            <input type="text" className='w-full border border-gray-200 outline-none rounded-lg p-3 text-gray-800' placeholder='Please Enter your name' onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} value={editForm.full_name} />
                        </div>
                        {/* User Name */}
                        <div className='flex flex-col items-start'>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                                User Name
                            </label>
                            <input type="text" className='w-full border border-gray-200 outline-none rounded-lg p-3 text-gray-800' placeholder='Please Enter your user name' onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} value={editForm.username} />
                        </div>
                        {/* Bio */}
                        <div className='flex flex-col items-start'>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                                Bio
                            </label>
                            <textarea rows={3} className='w-full border border-gray-200 outline-none rounded-lg p-3 text-gray-800 ' placeholder='Add your bio' onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} value={editForm.bio} />
                        </div>
                        {/* Location */}
                        <div className='flex flex-col items-start'>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                                Location
                            </label>
                            <input type="text" className='w-full border border-gray-200 outline-none rounded-lg p-3 text-gray-800' placeholder='Please Enter your location' onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} value={editForm.location} />
                        </div>
                        <div className='flex gap-2 justify-end pt-4'>
                            <button type="button" onClick={() => setShowEdit(false)} className='px-2 py-1 border border-gray-400 rounded-lg shadow-md cursor-pointer' value="Cancel">Cancel</button>
                            <button type="submit" className='px-2 py-1 text-white rounded-lg shadow-md bg-linear-to-r from-indigo-500  to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:scale-105 transition cursor-pointer' value="Save Changes">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default ProfileModal
