import React, { FC, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { variants } from 'utils/animationVariants'
import VotedIcon from '../../../assets/svg/arrow_up_vote.svg'
import PrdAwdWeek from '../../../assets/svg/IconAwardWeek.svg'
import PrdAwdMonth from '../../../assets/svg/IconAwardMonth.svg'
import PrdAwdYear from '../../../assets/svg/IconAwardYear.svg'
import './CardDetail.css'
import ArrowRight from '../../../assets/svg/arrow_right.svg'
import { useNavigate } from 'react-router-dom'

export interface CardSliderProps {
  className?: string
  heading: string
  subHeading?: string
  posts: PrdDetailDataType[]
  postCardName?: 'card4' | 'card7' | 'card9' | 'card10' | 'card10V2' | 'card11'
  perView?: 2 | 3 | 4
  prefixHref?: string
}

export interface PrdDetailDataType {
  votedCount: string | number | undefined
  award: number[]
  title: string
  image: string
  href: string
}

const CardSlider: FC<CardSliderProps> = ({
  heading,
  subHeading,
  className = '',
  posts,
  perView = 4,
  prefixHref = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const navigate = useNavigate()

  function changeItemId(newVal: number) {
    if (newVal > currentIndex) {
      setDirection(1)
    } else {
      setDirection(-1)
    }
    setCurrentIndex(newVal)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < posts?.length - 1) {
        changeItemId(currentIndex + 1)
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        changeItemId(currentIndex - 1)
      }
    },
    trackMouse: true,
  })

  return (
    <div className={`nc-CardSlider w-full ${className}`}>
      <div className="flex w-full cursor-pointer items-center justify-between font-[RobotoBold] text-[20px] font-bold leading-[30px] md:text-[20px] tracking-[0.48px] text-[--gray-text]">
        {heading}
      </div>

      <div className="group/images nc-MySlider w-full pt-5 flex space-x-4 overflow-x-scroll md:overflow-hidden relative">
        <MotionConfig
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <div className={`relative flow-root`} {...handlers}>
            <div className="flow-root overflow-hidden rounded-xl">
              <motion.ul
                initial={false}
                className="relative whitespace-nowrap flex space-x-4 h-[280px]"
              >
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
                        onClick={() => navigate(`/${prefixHref}/${_i.href}`)}
                      >
                        <div>
                          <div className="relative pb-[10px]">
                            <img
                              src={_i.image}
                              className="w-[200px] h-[200px] object-cover"
                              alt=""
                            />
                            <div className="absolute bottom-[18px] left-[6px] flex items-center justify-start space-x-1">
                              <div className="flex space-x-1 items-center justify-start wrapperVoted">
                                <img src={VotedIcon} alt="" />
                                <span>{_i.votedCount || 0}</span>
                              </div>
                              {_i.award.map((award: number, idx: number) => {
                                let image
                                switch (award) {
                                  case 1:
                                    image = (
                                      <img src={PrdAwdWeek} alt="" key={idx} />
                                    )
                                    break
                                  case 2:
                                    image = (
                                      <img src={PrdAwdMonth} alt="" key={idx} />
                                    )
                                    break
                                  case 3:
                                    image = (
                                      <img src={PrdAwdYear} alt="" key={idx} />
                                    )
                                    break
                                  default:
                                    break
                                }

                                return image
                              })}
                            </div>
                          </div>
                          <div className="R-home-content line-clamp-2 text-ellipsis cardDetailTitle text-[--gray-text]">
                            {_i.title}
                          </div>
                        </div>
                      </motion.li>
                    )
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
              <img
                src={ArrowRight}
                alt=""
                className="transition-all rotate-180"
              />
            </button>
          ) : null}

          {posts.length > currentIndex + perView ? (
            <button
              className="absolute top-[28px] right-0 w-[56px] h-[259px] items-center justify-center bgBtnSlider hidden group-hover/images:flex"
              onClick={() => changeItemId(currentIndex + 1)}
            >
              <img src={ArrowRight} alt="" className="transition-all" />
            </button>
          ) : null}
        </MotionConfig>
      </div>
    </div>
  )
}

export default CardSlider
