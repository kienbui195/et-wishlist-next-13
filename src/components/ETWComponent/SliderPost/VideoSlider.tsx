import React, { FC, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { variants } from "@/utils/animationVariants";
import "./CardDetail.css";
import Link from "next/link";
import Video from "./VideoComponent";
import Image from "next/image";
import { ArrowRight } from "@/utils/svgExport";

export interface VideoSliderProps {
  className?: string;
  heading: string;
  subHeading?: string;
  posts: PrdDetailVideoType[];
  postCardName?: "card4" | "card7" | "card9" | "card10" | "card10V2" | "card11";
  perView?: 2 | 3 | 4;
}

export interface PrdDetailVideoType {
  title: string;
  link: string;
}

const VideoSlider: FC<VideoSliderProps> = ({ heading, subHeading, className = "", posts, perView = 4 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  function changeItemId(newVal: number) {
    if (newVal > currentIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurrentIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < posts?.length - 1) {
        changeItemId(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        changeItemId(currentIndex - 1);
      }
    },
    trackMouse: true,
  });

  return (
    <div className={`nc-VideoSlider w-full h-[315px] border-b border-gray-2400 pt-5 `}>
      <div className="flex justify-between items-center">
        <div className="flex cursor-pointer items-center justify-between text-[20px] font-bold leading-[30px] text-[--gray-text] md: md:text-[20px] tracking-[0.48px]">
          {heading}
        </div>
        <Link href="/videos" className="border-b border-black showAll cursor-pointer text-[--gray-text]">
          Show all
        </Link>
      </div>

      <div className="group/videos nc-MySlider w-full h-[230px] pt-5 flex space-x-4 overflow-x-scroll md:overflow-hidden relative" id="videosPrdDetailSlider">
        <MotionConfig
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <div className={`relative flow-root`} {...handlers}>
            <div className={`flow-root overflow-hidden`}>
              <motion.ul initial={false} className="relative whitespace-nowrap flex space-x-[18px]">
                <AnimatePresence initial={false} custom={direction}>
                  {posts.map((_i, indx) => (
                    <motion.li
                      className={`relative w-[288px] h-[210px] space-x-2.5 min-w-[220px] `}
                      custom={direction}
                      initial={{
                        x: `${(currentIndex - 1) * -110}%`,
                      }}
                      animate={{
                        x: `${currentIndex * -110}%`,
                      }}
                      variants={variants(200, 1)}
                      key={indx}
                      style={{
                        width: `calc(1/${perView} * 110%)`,
                      }}
                    >
                      <Video title={_i.title} src={_i.link} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>
          </div>
          {currentIndex ? (
            <button
              className={`absolute top-5 left-0 w-[56px] h-[244px] items-center justify-center bgBtnSlider hidden group-hover/videos:block `}
              onClick={() => changeItemId(currentIndex - 1)}
            >
              <Image src={ArrowRight} alt="" className={`transition-all rotate-180`} />
            </button>
          ) : null}

          {posts.length > currentIndex + perView ? (
            <button
              className={`absolute top-5 right-0 w-[56px] h-[244px] items-center justify-center bgBtnSlider hidden group-hover/videos:block`}
              onClick={() => changeItemId(currentIndex + 1)}
            >
              <Image src={ArrowRight} alt="" className={`transition-all`} />
            </button>
          ) : null}
        </MotionConfig>
      </div>
      <div className="w-full h-1 mt-5 mb-3 flex justify-center space-x-[7px]">
        <div className={`${posts.length > currentIndex + perView ? "bg-[--brand-primary]" : "bg-[--gray-line]"} w-[23px] h-[2px] rounded-3xl`}></div>
        <div className={`${posts.length > currentIndex + perView ? "bg-[--gray-line]" : "bg-[--brand-primary]"} w-[23px] h-[2px] rounded-3xl`}></div>
      </div>
    </div>
  );
};

export default VideoSlider;
