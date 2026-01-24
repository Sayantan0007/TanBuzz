import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMsgs from '../components/RecentMsgs';

const Feed = () => {
  const [feedData, setFeedData] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchFeedData = async () => {
    setFeedData(dummyPostsData);
    setLoading(false);
  }
  useEffect(() => {
    fetchFeedData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* Stories and Posts list */}
      <div>
        <StoriesBar />
        {/* <PostCard feedData={feedData}/> */}
        <div className='p-4 space-y-6'>
          {feedData.map((post) => {
            return (
              <PostCard key={post._id} post={post} />
            )
          })}
        </div>
      </div>
      {/* right side content */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt="" />
          <p className='text-slate-600'>Email marketing</p>
          <p className='text-slate-400'>Supercharge your marketing with a powerful,easy-to-use platform built for result</p>
        </div>
        <RecentMsgs />
      </div>
    </div>
  )
}

export default Feed
