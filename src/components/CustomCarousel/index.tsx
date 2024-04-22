import { ITopBannerImage } from 'app/HomePage'
import React, { FC, useEffect, useState } from 'react'
import SvgIcon from 'components/SvgIcon'
import ButtonClose from 'components/TopBanner/ButtonClose'
import { ISidebarBanner } from 'components/Sidebar'
import { Link } from 'react-router-dom'
import { IImageContent } from 'components/HeaderBar'

interface ICarouselProps {
  images: ITopBannerImage[] | ISidebarBanner[] | IImageContent[]
  autoSlideDelay?: number
  isAutoPlay?: boolean
  className?: string
  isAcceptClose?: boolean
  onClose?: () => void
  containWidth?: string
  imageWidth?: string
  containHeight?: string
  imageHeight?: string
  maxWidth?: string
  maxHeight?: string
  width?: number
  height?: number
}

const CustomCarousel: FC<ICarouselProps> = ({
  images = [],
  autoSlideDelay = 10000,
  className = '',
  isAcceptClose = true,
  isAutoPlay = false,
  onClose,
  containWidth = 'w-full',
  imageWidth = 'w-auto',
  containHeight = 'min-h-[360px]',
  imageHeight = 'h-[170px]',
  maxWidth = 'max-w-[1060px]',
  width,
  height,
}) => {
  const [selectedGlrImg, setSelectedGlrImg] = useState(0)

  const handleNext = () => {
    setSelectedGlrImg(
      selectedGlrImg === images.length - 1 ? 0 : selectedGlrImg + 1
    )
  }

  const handlePrev = () => {
    setSelectedGlrImg(
      selectedGlrImg === 0 ? images.length - 1 : selectedGlrImg - 1
    )
  }

  useEffect(() => {
    if (isAutoPlay) {
      const slideInterval = setInterval(() => {
        setSelectedGlrImg((prevImage) => (prevImage + 1) % images.length)
      }, autoSlideDelay)

      return () => clearInterval(slideInterval)
    }
  }, [autoSlideDelay, images.length, isAutoPlay])

  const renderButtonNext = (isRight = false) => {
    return (
      <div
        className={`${
          !isRight ? 'rotate-180' : ''
        } cursor-pointer group/icon p-3 rounded-full hover:bg-[--carousel-hover] hidden`}
        onClick={isRight ? handleNext : handlePrev}
      >
        <SvgIcon
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="18"
              viewBox="0 0 11 18"
              fill="none"
            >
              <path
                d="M1.40002 17.4L9.80002 9L1.40002 0.600001"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#8E9DAE"
                className="group-hover/icon:stroke-[--gray-white]"
              />
            </svg>
          }
        />
      </div>
    )
  }

  return (
    <div
      className="relative w-full"
      style={
        width
          ? {
              maxWidth: width ? `${width}px` : '100%',
            }
          : {}
      }
    >
      <div
        className={`el-carousel el-carousel--horizontal gallery-carousel ${containHeight} ${containWidth}`}
        style={
          width && height
            ? {
                maxWidth: `${width}px`,
                height: `${height}px`,
              }
            : {}
        }
      >
        <div className="el-carousel__container">
          {images.map((_i, idx) => {
            return (
              <div
                key={idx}
                className={`el-carousel__item is-animating ${maxWidth} flex ${containHeight} items-center justify-center bg-[--gray2] ${className}`}
                style={{
                  transform: `translateX(${
                    (idx - selectedGlrImg) * 100
                  }%) scale(1)`,
                  ...(height ? { height: `${height}px` } : {}),
                }}
              >
                <div
                  className={`flex ${imageHeight} ${imageWidth} items-center justify-center `}
                >
                  <Link
                    to={_i.link_on_click ? `${_i.link_on_click}` : '/#'}
                    target="_blank"
                  >
                    <img
                      src={`${process.env.REACT_APP_URL_BE}${_i.image.data?.attributes.url}`}
                      alt=""
                      className={` ${imageHeight} ${imageWidth} object-contain cursor-pointer`}
                    />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {isAcceptClose && (
        <ButtonClose
          onClick={() => {
            document.body.classList.remove('overflow-hidden')
            setSelectedGlrImg(0)
            onClose && onClose()
          }}
          className="absolute top-0 right-0 border"
        />
      )}

      <div
        className={`absolute w-fit left-0 h-full top-0 ${
          images.length > 1 ? 'flex' : 'hidden'
        } flex-col justify-center`}
      >
        {renderButtonNext()}
      </div>
      <div
        className={`absolute w-fit right-0 h-full top-0 ${
          images.length > 1 ? 'flex' : 'hidden'
        } flex-col justify-center`}
      >
        {renderButtonNext(true)}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center items-center  absolute bottom-0  w-full">
          <div className="p-1 bg-transparent hover:bg-[--carousel-hover] flex items-center rounded-full">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 mx-1 rounded-full cursor-pointer ${
                  index === selectedGlrImg
                    ? 'bg-[--gray-line]'
                    : 'bg-[--gray-text]'
                }`}
                onClick={() => setSelectedGlrImg(index)}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomCarousel
