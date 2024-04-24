"use client";

import React, { FC, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { variants } from "@/utils/animationVariants";
import VotedIcon from "../../../assets/svg/arrow_up_vote.svg";
import "./CardDetail.css";
import ArrowRight from "../../../assets/svg/arrow_right.svg";
import { ICuration } from "@/components/PrdDetailCommon/prdDetailInterface";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DefaultThumbnail2 } from "@/utils/svgExport";

export interface CardSliderProps {
  className?: string;
  heading: string;
  posts: ICuration[];
  perView?: 2 | 3 | 4;
  prefixHref?: string;
}

const CardSlider: FC<CardSliderProps> = ({ heading, className = "", posts, perView = 4, prefixHref = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();

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
    <div className={`nc-CardSlider w-full ${className}`}>
      <div className="flex w-full cursor-pointer items-center justify-between font-[RobotoBold] text-[20px] font-bold leading-[30px] md:text-[20px] tracking-[0.48px] text-[--gray-text]">
        {heading}
      </div>

      <div className="group/images nc-MySlider w-full pt-5 flex space-x-4 overflow-x-scroll md:overflow-hidden relative">
        <MotionConfig
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <div className={`relative flow-root`} {...handlers}>
            <div className="flow-root overflow-hidden rounded-xl">
              <motion.ul initial={false} className="relative whitespace-nowrap flex space-x-4 h-[280px]">
                <AnimatePresence initial={false} custom={direction}>
                  {posts.map((_i, indx) => {
                    return (
                      <motion.li
                        className="relative w-[220px] h-[270px] rounded-xl space-x-2.5 p-2.5 border-[0.5px] border-[--gray-line cardWrapper min-w-[220px] hover:cursor-pointer"
                        custom={direction}
                        initial={{
                          x: `${(currentIndex - 1) * -100}%`,
                        }}
                        animate={{
                          x: `${currentIndex * -100}%`,
                        }}
                        variants={variants(200, 1)}
                        key={indx}
                        style={{
                          width: `calc(1/${perView} * 100%)`,
                        }}
                        onClick={() => router.push(`/${prefixHref}/${_i.attributes.slug}`)}
                      >
                        <div>
                          <div className="relative pb-[10px]">
                            <Image
                              src={
                                _i.attributes.thumbnail?.data
                                  ? `${process.env.NEXT_PUBLIC_BE_URL}${_i.attributes.thumbnail?.data?.attributes.url}`
                                  : DefaultThumbnail2
                              }
                              className="w-[200px] h-[200px] object-cover"
                              alt=""
                              width={0}
                              height={0}
                              sizes="100vw"
                            />
                            <div className="absolute bottom-[18px] left-[6px] flex items-center justify-start space-x-1">
                              <div className="flex space-x-1 items-center justify-start wrapperVoted">
                                <Image src={VotedIcon} alt="" />
                                <span>{_i.attributes.votes || 0}</span>
                              </div>
                            </div>
                          </div>
                          <div className="R-home-content text-ellipsis line-clamp-2 cardDetailTitle text-[--gray-text]">
                            {_i.attributes.name}
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </div>
          </div>
          {currentIndex ? (
            <button
              className="absolute top-[28px] left-0 w-[56px] h-[259px] items-center justify-center bgBtnSlider hidden group-hover/images:flex"
              onClick={() => changeItemId(currentIndex - 1)}
            >
              <Image src={ArrowRight} alt="" className="transition-all rotate-180" />
            </button>
          ) : null}

          {posts.length > currentIndex + perView ? (
            <button
              className="absolute top-[28px] right-0 w-[56px] h-[259px] items-center justify-center bgBtnSlider hidden group-hover/images:flex"
              onClick={() => changeItemId(currentIndex + 1)}
            >
              <Image src={ArrowRight} alt="" className="transition-all" />
            </button>
          ) : null}
        </MotionConfig>
      </div>
    </div>
  );
};

export default CardSlider;
