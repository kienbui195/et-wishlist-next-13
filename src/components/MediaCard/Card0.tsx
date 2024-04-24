import { RootState } from "@/lib/store";
import { DEFAULT_MEDIA_WIDTH, ShowPrdGalleryModal } from "@/components/ProductCurations/ProductCurationsCard";
import VideoController from "@/components/VideoController";
import { setMutedVideo } from "@/lib/features/global/mutedVideoSlice";
import { setVolume } from "@/lib/features/global/volumeVideoSlice";
import useMediaQuery from "@/hooks/useMediaQuery";
import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobileOrTabletDevice } from "@/utils/function";
import { MuteOff, MuteOn, PlayButton } from "@/utils/svgExport";
import Image from "next/image";

export interface CardInitProps {
  media: {
    attributes: {
      url: string;
      height: number;
      width: number;
    };
  };
  isVideo?: boolean;
  height?: number;
  onClick?: (url: string) => void;
  showFull?: boolean;
  setShowPrdGallery: React.Dispatch<React.SetStateAction<ShowPrdGalleryModal>>;
  showProdGallery: boolean;
}

const Card0: FC<CardInitProps> = ({
  media,
  isVideo = false,
  height = DEFAULT_MEDIA_WIDTH,
  onClick,
  showFull = false,
  setShowPrdGallery,
  showProdGallery,
}) => {
  const playVideoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const mutedVideo = useSelector((state: RootState) => state.mutedVideo);
  const [isVideoPlay, setIsVideoPlay] = useState(playVideoRef.current?.paused);
  const mediaQuery = useMediaQuery();
  const isFireFoxBrowser = useRef(navigator.userAgent.indexOf("Firefox") !== -1);
  // const [isHover, setIsHover] = useState(false)
  // const [isHoverVideoPlay, setIsHoverVideoPlay] = useState(false)
  // const [videoCtrFirefox, setVideoCtrFirefox] = useState({
  //   isPlay: !playVideoRef.current?.paused || false,
  //   volume: mutedVideo ? 0 : 1,
  //   duration: 0,
  //   currentTime: 0,
  // })
  // const currentTime = useRef<number>(0)
  // const volume = useSelector((state: RootState) => state.volumeVideo)

  // useEffect(() => {
  //   const ref = playVideoRef.current
  //   if (!isFireFoxBrowser.current || !ref || mediaQuery < 845) return
  //   setVideoCtrFirefox({
  //     ...videoCtrFirefox,
  //     duration: ref.duration,
  //     isPlay: !ref.paused,
  //   })

  //   if (!ref.paused) {
  //     // setVideoCtrFirefox({ ...videoCtrFirefox, currentTime: ref.currentTime })
  //     currentTime['current'] = ref.currentTime
  //   }
  // }, [mediaQuery])

  const handleVolumeChangeVideo = () => {
    if (playVideoRef.current) {
      // if (isFireFoxBrowser.current) {
      //   playVideoRef.current.volume = volume
      // } else {
      //   if (playVideoRef.current.volume === 0 || playVideoRef.current.muted) {
      //     dispatch(setMutedVideo(true))
      //   } else {
      //     dispatch(setMutedVideo(false))
      //   }
      // }

      if (playVideoRef.current.volume === 0 || playVideoRef.current.muted) {
        dispatch(setMutedVideo(true));
      } else {
        dispatch(setMutedVideo(false));
      }
    }
  };

  useEffect(() => {
    const refs = playVideoRef.current;
    if (!refs) return;

    if (showProdGallery) {
      refs.controls = false;
      refs.pause();
    } else {
      refs.controls =
        // mediaQuery > 845 || isMobileOrTabletDevice() || isFireFoxBrowser.current
        mediaQuery > 845 && !isMobileOrTabletDevice() && !isFireFoxBrowser.current;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProdGallery]);

  useEffect(() => {
    const handlePlayVideo = () => {
      if (playVideoRef.current) {
        setIsVideoPlay(!playVideoRef.current.paused);
      }
    };

    document.addEventListener("scroll", handlePlayVideo);
    handlePlayVideo();
    return () => {
      document.removeEventListener("scroll", handlePlayVideo);
    };
  }, []);

  return !isVideo ? (
    <Image
      unoptimized={true}
      sizes="100vw"
      width={0}
      height={0}
      src={`${process.env.NEXT_PUBLIC_BE_URL}${media.attributes.url}`}
      alt=""
      className={`cursor-pointer w-full h-full ${showFull ? "object-contain bg-current" : "object-cover"}`}
      style={{
        maxHeight: `${height}px`,
        height: `${height}px`,
      }}
      onClick={() => {
        onClick && onClick(media.attributes.url);
        document.body.classList.add("overflow-hidden");
        setShowPrdGallery({
          openGallery: true,
          linkMedia: media.attributes.url,
        });
      }}
    />
  ) : (
    <div className="h-full flex justify-center bg-current relative">
      <video
        onClick={() => {
          if (!playVideoRef.current) return;
          document.body.classList.add("overflow-hidden");
          showProdGallery && playVideoRef.current.pause();
          setIsVideoPlay(false);
          setShowPrdGallery({
            openGallery: true,
            linkMedia: media.attributes.url,
          });
        }}
        ref={playVideoRef}
        loop
        playsInline
        // autoPlay
        controls={mediaQuery > 845 && !isMobileOrTabletDevice() && !isFireFoxBrowser.current}
        onVolumeChange={handleVolumeChangeVideo}
        muted={mutedVideo}
        className="inset-0 h-full object-contain videoProductionCuration"
        style={{
          maxHeight: `${height}px`,
          height: `${height}px`,
        }}
        onPlay={() => {
          setIsVideoPlay(true);
        }}
        onPause={() => {
          setIsVideoPlay(false);
        }}
      >
        <source
          src={
            isVideo
              ? `${process.env.NEXT_PUBLIC_API_URL}/loadClip/${
                  media.attributes?.url.split("/")[media.attributes?.url.split("/").length - 1]
                }`
              : ""
          }
        />
        Your browser does not support the video tag.
      </video>

      {/* {mediaQuery > 845 &&
        isFireFoxBrowser.current &&
        (isHover || isHoverVideoPlay) && (
          <div
            className="absolute bottom-0 left-0 z-[21] right-0"
            onMouseEnter={() => setIsHoverVideoPlay(true)}
            onMouseLeave={() => setIsHoverVideoPlay(false)}
          >
            <VideoController
              isPlay={!playVideoRef.current?.paused}
              classes=""
              volume={volume}
              duration={videoCtrFirefox.duration}
              currentTime={currentTime['current']}
              // currentTime={videoCtrFirefox.currentTime}
              onPlay={() => {
                playVideoRef.current?.play()
                setVideoCtrFirefox({ ...videoCtrFirefox, isPlay: true })
              }}
              onPause={() => {
                playVideoRef.current?.pause()
                setVideoCtrFirefox({ ...videoCtrFirefox, isPlay: false })
              }}
              onChangeVolume={(val) => {
                dispatch(setVolume(val))
                if (playVideoRef.current) {
                  playVideoRef.current.volume = val
                }
              }}
              onMuted={(val) => {
                if (val) {
                  dispatch(setMutedVideo(true))
                } else {
                  dispatch(setMutedVideo(false))
                  dispatch(setVolume(1))
                  if (playVideoRef.current) {
                    playVideoRef.current.volume = 1
                  }
                }
              }}
              isMuted={mutedVideo}
              onChangeProgress={(val) => {
                if (playVideoRef.current) {
                  // setVideoCtrFirefox({
                  //   ...videoCtrFirefox,
                  //   currentTime: val,
                  // })
                  currentTime['current'] = val
                  playVideoRef.current.currentTime = val
                }
              }}
            />
          </div>
        )} */}

      {isFireFoxBrowser.current && (
        <div
          // onMouseEnter={() => setIsHover(true)}
          // onMouseLeave={() => setIsHover(false)}
          className="absolute top-0 left-0 bottom-0 right-0 z-10"
          onClick={() => {
            document.body.classList.add("overflow-hidden");
            playVideoRef.current?.pause();
            setIsVideoPlay(false);
            setShowPrdGallery({
              openGallery: true,
              linkMedia: media.attributes.url,
            });
          }}
        ></div>
      )}
      {!isVideoPlay && (
        <Image
          alt=""
          src={PlayButton}
          // className="h-[12%] w-[12%] absolute bottom-0 z-20 left-1/2 transform -translate-x-1/2"
          className="h-[24%] w-[24%] absolute top-1/2 z-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onClick={() => {
            if (playVideoRef.current) {
              playVideoRef.current.play();
              setIsVideoPlay(true);
            }
          }}
        />
      )}
      {/* {isVideoPlay && isHover && (
        <Image
          alt=""
          src={PauseButton}
          className="h-[12%] w-[12%] absolute bottom-0 z-20 left-1/2 transform -translate-x-1/2"
          onClick={() => {
            if (playVideoRef.current) {
              playVideoRef.current.pause()
              setIsVideoPlay(false)
            }
          }}
        />
      )} */}
      {(isMobileOrTabletDevice() || mediaQuery < 846 || isFireFoxBrowser.current) && (
        <React.Fragment>
          {mutedVideo ? (
            <Image
              onClick={() => {
                dispatch(setMutedVideo(false));
                if (isFireFoxBrowser.current) {
                  if (playVideoRef.current) {
                    playVideoRef.current.volume = 1;
                  }
                }
              }}
              alt=""
              className="h-6 w-6 absolute z-20 right-[13px] top-[9px] cursor-pointer"
              src={MuteOn}
            />
          ) : (
            <Image
              onClick={() => dispatch(setMutedVideo(true))}
              alt=""
              className="h-6 w-6 absolute z-20 right-[13px] top-[9px] cursor-pointer"
              src={MuteOff}
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Card0;
