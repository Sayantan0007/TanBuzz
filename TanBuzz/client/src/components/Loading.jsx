import React from 'react'

const Loading = ({ height = "100vh" }) => {
    return (
        <div style={{ height }} className='flex justify-center items-center h-screen'>
            <div className='h-10 w-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
    )
}

export default Loading
