import React from 'react'

const LoadingScreen = () => {
  return (
    <div className=" w-full h-full min-h-[85vh] relative">
      <div className="flex-1 absolute top-0 left-0 bg-white w-full h-full flex justify-center items-center">
        <div className="w-[64px] h-[64px] border-x-[2px] border-t-[2px] animate-spin rounded-full border-[--brand-primary] "></div>
      </div>
    </div>
  )
}

export default LoadingScreen
