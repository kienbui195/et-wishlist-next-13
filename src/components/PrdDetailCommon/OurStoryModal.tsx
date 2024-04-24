import React, { FC, useEffect, useRef } from "react";
import "./ProductDetail.css";
import CrossIcon from "../../assets/svg/Cross.svg";
import MuteOff from "../../assets/svg/MuteOff.svg";
import MuteOn from "../../assets/svg/MuteOn.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setMutedVideo } from "@/lib/features/global/mutedVideoSlice";
import Image from "next/image";
import { DefaultAvatar } from "@/utils/svgExport";

interface IOurStoryModal {
  onClick?: () => void;
  avatarUrl: string;
  founderName: string;
  storyHeadline: string;
  storyDesc: string;
  storyClipUrl?: string;
}

const OurStoryModal: FC<IOurStoryModal> = ({
  onClick,
  avatarUrl = "",
  founderName = "",
  storyHeadline = "",
  storyDesc = "",
  storyClipUrl = "",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const mutedVideo = useSelector((state: RootState) => state.mutedVideo);
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleActionMuteInMobile = (status: boolean) => {
    dispatch(setMutedVideo(status));
    if (videoRef.current) {
      videoRef.current.muted = status;
    }
  };

  useEffect(() => {
    if (!videoRef.current)  return

    const handleVolumeChange = (e: any) => {
      if (e.target.volume === 0 || e.target.muted) {
        dispatch(setMutedVideo(true));
      } else {
        dispatch(setMutedVideo(false));
      }
    };

    if (videoRef.current) {
      const video = videoRef.current;
      video.addEventListener("volumechange", handleVolumeChange);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => videoRef.current?.removeEventListener("volumechange", handleVolumeChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current?.volume, mutedVideo]);

  useEffect(() => {
    if (storyDesc && contentRef.current) {
      contentRef.current.innerHTML = storyDesc.replaceAll("\n", "<br/>") + "";
    }
  }, [contentRef, storyDesc]);

  return (
    <div id="el-id-8149-5" className="el-dialog__body">
      <Image
        src={CrossIcon}
        alt=""
        width="14"
        height="14"
        className="absolute right-5 top-5 z-10 h-3.5 cursor-pointer"
        onClick={() => {
          onClick && onClick();
        }}
      />
      <div className="flex md:flex-row flex-col flex-wrap md:flex-nowrap justify-between">
        <div className="w-full md:w-[470px] md:max-w-[470px] md:flex-1">
          <div className="text-lg font-semibold font-[RobotoBold] leading-none text-[--gray-text] md:mt-2">
            Our Story
          </div>
          <div className="mt-[26px] flex items-center border-y border-gray-1350 py-[25px]">
            <Image
              src={avatarUrl !== "" ? `${process.env.NEXT_PUBLIC_BE_URL}${avatarUrl}` : DefaultAvatar}
              alt=""
              className="mr-5 h-[60px] w-[60px] shrink-0 rounded-full object-cover"
              width={0}
              height={0}
              sizes="100vw"

            />
            <div className="editor-block mt-1 overflow-hidden whitespace-pre-wrap text-base font-normal leading-normal text-gray-2350 md:text-sm md:leading-normal text-[--text-gray]">
              {founderName}
            </div>
          </div>
          <div className="mt-[31px] overflow-hidden text-xl font-semibold font-[RobotoBold] leading-tight tracking-tight text-[--gray-text]">
            {storyHeadline}
          </div>
          <div className="mt-[17px] overflow-hidden text-base font-normal leading-normal text-[--gray-text] md:mb-0">
            <div ref={contentRef} className="inline"></div>
          </div>
        </div>
        {storyClipUrl && storyClipUrl !== "" && (
          <div className="relative flex aspect-[9/16] shrink-0 items-center md:w-full w-[50%] overflow-hidden rounded-[10px] bg-black md:ml-[100px] md:max-h-[532px] md:max-w-[300px] mt-4">
            <video
              loop
              playsInline
              controls
              muted={mutedVideo}
              autoPlay
              className="inset-0 h-full object-contain"
              ref={videoRef}
            >
              <source src={`${process.env.NEXT_PUBLIC_BE_URL}${storyClipUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute right-2.5 top-3.5">
              <Image
                src={mutedVideo ? MuteOn : MuteOff}
                alt=""
                width="22"
                height="22"
                className={`w-[22px] drop-shadow-mute`}
                onClick={() => handleActionMuteInMobile(!mutedVideo)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurStoryModal;
