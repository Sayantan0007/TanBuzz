import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  let hashTagReplace = post.content.replace(/(#\w+)/g, '<span class="text-blue-600">$1</span>')
  const [likes, setLikes] = useState(post.likes_count);
  const userData = dummyUserData;
  let likesArr = () => {
    likes.push(userData._id);
    return likes;
  }
  const handleLike = () => {

    setLikes(likesArr);
    console.log(likes);
  }
  const handleComment = () => {

  }
  const handleShare = () => {

  }
  const navigate = useNavigate();
  // console.log(post);
  return (
    <div className='bg-white rounded-xl shadow space-y-4 p-4 w-full max-w-2xl'>
      {/* user info */}
      <div className='inline-flex items-center gap-3 cursor-pointer' onClick={() => navigate(`/profile/${post.user._id}`)}>
        <img src={post.user.profile_picture} alt="" className='w-10 h-10 rounded-full shadow' />
        <div>
          <div className='flex items-center space-x-1'>
            <span>{post.user.full_name}</span>
            <BadgeCheck className='h-4 w-4 text-blue-500' />
          </div>
          <div className='text-gray-500 text-sm'>@{post.user.username} • {moment(post.createdAt).fromNow()}</div>
        </div>
      </div>
      {/* Content */}
      {
        post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{ __html: hashTagReplace }} />
      }
      {/* Images */}
      <div className='grid grid-cols-2 gap-2'>
        {

          post.image_urls.map((img, ind) => {
            return (
              <img src={img} key={ind} alt="" className={`h-48 w-full object-cover rounded-lg ${post.image_urls.length === 1 && 'h-auto col-span-2'}`} />
            )
          })
        }
      </div>
      <div className='flex items-center gap-4 border-t border-gray-300 pt-2 text-sm text-gray-600'>
        <div className='flex items-center gap-1'>
          <Heart className={`h-4 w-4 cursor-pointer ${likes.includes(userData._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike} />
          <span >{likes.length}</span>
        </div>
        <div className='flex items-center gap-1'>
          <MessageCircle className={`h-4 w-4 cursor-pointer`} onClick={handleComment} />
          <span >{12}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Share2 className={`h-4 w-4 cursor-pointer`} onClick={handleShare} />
          <span >{7}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
