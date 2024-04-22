import React, { useState, useRef, useEffect } from 'react'
import { formatVideoDuration } from 'utils/function'
import { PauseButton, PlayButton, MuteOff, MuteOn } from 'utils/svgExport'

interface IVideoController {
  onPlay?: () => void
  onPause?: () => void
  onChangeVolume?: (value: number) => void
  onMuted?: (val: boolean) => void
  classes?: string
  isPlay: boolean
  volume: number
  duration: number
  currentTime: number
  isMuted?: boolean
  onChangeProgress?: (value: number) => void
}

const VideoController: React.FC<IVideoController> = ({
  classes = '',
  isPlay = false,
  duration = 0,
  volume = 1,
  currentTime = 0,
  onPlay,
  onPause,
  onChangeVolume,
  onMuted,
  isMuted = false,
  onChangeProgress,
}) => {
  const [isHoverMuteButton, setIsHoverMuteButton] = useState(false)
  const [isHoverVolume, setIsHoverVolume] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlay) {
      onPause && onPause()
      onChangeProgress && onChangeProgress(+e.target.value)
      onPlay && onPlay()
    } else {
      onChangeProgress && onChangeProgress(+e.target.value)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeVolume && onChangeVolume(+e.target.value)
  }

  return (
    <div
      className={`w-full opacity-95 cursor-default ${classes}`}
    >
      <div className="flex justify-around items-center space-x-2 bg-black h-12 p-2">
        <img
          src={isPlay ? PauseButton : PlayButton}
          alt=""
          className="w-6 h-6 cursor-pointer"
          onClick={
            isPlay
              ? () => {
                  onPause && onPause()
                }
              : () => {
                  onPlay && onPlay()
                }
          }
        />
        <span className="text-white text-sm">
          {formatVideoDuration(currentTime)}/{formatVideoDuration(duration)}
        </span>
        <input
          className="w-[40%] cursor-pointer"
          type="range"
          max={duration}
          min={0}
          value={currentTime}
          onChange={handleChangeProgress}
          ref={inputRef}
        />
        <div className="relative w-6 h-6 cursor-default">
          {(isHoverMuteButton || isHoverVolume) && (
            <div className="w-[500%] absolute left-0 cursor-pointer top-0 h-6 p-[0.25rem_0.25rem_0.25rem_0.5rem] -translate-y-[299%] -translate-x-[40%] -rotate-90 rounded-full bg-black flex justify-between items-center">
              <input
                type="range"
                max={1}
                min={0}
                step={0.01}
                className="z-[22] w-full h-6 cursor-pointer"
                value={volume}
                onChange={handleVolumeChange}
                onMouseEnter={() => setIsHoverVolume(true)}
                onMouseLeave={() => setIsHoverVolume(false)}
              />
            </div>
          )}
          <div
            className="bg-transparent w-6 h-4 absolute left-0 top-[-65%] z-[20] cursor-pointer"
            onMouseEnter={() => setIsHoverMuteButton(true)}
            onMouseLeave={() => setIsHoverMuteButton(false)}
          ></div>
          <img
            src={isMuted || volume === 0 ? MuteOn : MuteOff}
            alt=""
            className="w-6 h-6 cursor-pointer"
            onMouseEnter={() => setIsHoverMuteButton(true)}
            onMouseLeave={() => setIsHoverMuteButton(false)}
            onClick={() => onMuted && onMuted(!isMuted)}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoController
