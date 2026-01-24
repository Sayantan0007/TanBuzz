import React, { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { dummyConnectionsData, dummyPostsData, dummyUserData } from '../assets/assets';
import Loading from '../components/Loading';
import UserProfileInfo from '../components/UserProfileInfo';
import PostCard from '../components/PostCard';
import moment from 'moment';
import ProfileModal from '../components/ProfileModal';
const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('posts')
  const allUserData = dummyConnectionsData;
  let profileData = allUserData.find((user) => {
    return user._id === profileId;
  })
  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  }
  useEffect(() => {
    fetchUser();
  }, [])
  // console.log(profileData);
  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {
              user.cover_photo && (<img src={user.cover_photo} className='h-full w-full object-cover' />)
            }
          </div>
          {/* User Info */}
          <UserProfileInfo profileData={profileData ? profileData : user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
        {/* Tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {
              ["posts", "media", "likes"].map((tab) => {
                return (
                  <button onClick={() => setActiveTab(tab)} className={`flex-1 px-4 py-2 transition-colors text-sm font-medium cursor-pointer rounded-lg ${activeTab === tab ? `bg-indigo-600 text-white` : `text-gray-600 hover:text-gray-900`}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              })
            }
          </div>
          {/* posts */}
          {activeTab === "posts" && (
            <div className='mt-6 flex-col items-center gap-6'>
              {
                posts.map((post) => <PostCard post={post} key={post._id} />)
              }
            </div>
          )}
          {/* media */}
          {
            activeTab === "media" && (
              <div className='flex flex-wrap mt-6 max-w-6xl'>
                {
                  posts.filter((post) => post.image_urls.length > 0).map((post) => {
                    return (
                      <>
                        {post.image_urls.map((image, ind) => (
                          <Link target='_blank' key={ind} to={image} className='relative group'>
                            <img src={image} key={ind} alt="" className='w-64 aspect-video object-cover rounded-xl' />
                            <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300'>Posted {moment(post.createdAt).fromNow()}</p>
                          </Link>
                        ))}
                      </>
                    )
                  })
                }
              </div>
            )
          }
        </div>
      </div>
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) :
    (<Loading />)
}

export default Profile
