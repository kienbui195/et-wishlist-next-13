import React, { FC, useEffect, useRef, useState } from 'react'
import VideoPlayBtn from '../../../assets/svg/VideoPlayBtn.svg'
import './CardDetail.css'
import { formatVideoDuration } from 'utils/function'

interface IVideoProps {
  title: string
  src: string
}

const Video: FC<IVideoProps> = ({ title = '', src = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const durationRef = useRef<HTMLDivElement>(null)
  let timer: ReturnType<typeof setTimeout> | null = null
  const [play, setPlay] = useState(false)

  const handleRenderDuration = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      if (
        src &&
        videoRef.current &&
        durationRef.current &&
        !Number.isNaN(videoRef.current.duration) &&
        videoRef.current.duration > 0
      ) {
        durationRef.current.innerText =
          formatVideoDuration(videoRef.current.duration) + ''
      }
    }, 500)
  }

  const handlePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
      setPlay(true)
    } else {
      videoRef.current?.pause()
      setPlay(false)
    }
  }

  useEffect(() => {
    handleRenderDuration()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, src, durationRef])

  return (
    <div className="w-full h-[162px] flex space-x-2 items-center flex-col justify-between">
      <div className="w-full h-[162px] relative videoDetail">
        <video
          onClick={handlePlay}
          muted
          className={`w-full h-full rounded-xl`}
          loop
          playsInline
          ref={videoRef}
        >
          <source
            src={src !== '' ? `${process.env.NEXT_PUBLIC_BE_URL}${src}` : ''}
            type="video/mp4"
          />
        </video>
        <div className={`absolute top-0 w-full h-full ${play ? 'hidden' : 'flex'} justify-center items-center`}>
          <Image src={VideoPlayBtn} alt="" onClick={handlePlay} />
        </div>
        <div
          className="absolute bottom-5  right-2 videoDuration "
          ref={durationRef}
        >
          00: 00
        </div>
      </div>
      <div className="w-full h-[40px] font-medium text-sm cardVideoTitle text-[--gray-text]">
        {title}
      </div>
    </div>
  )
}

export default Video
