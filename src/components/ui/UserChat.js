import React from 'react'

const UserChat = ({data,className}) => {
  return (
    <div className={`flex  justify-end my-8  text-white ${className}`}>
        <div className=' py-3 px-4 rounded-xl bg-slate-600 max-w-[500px]'>
        {data}
        </div>
        
    </div>
  )
}

export default UserChat
