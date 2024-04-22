import React, { useEffect, useRef, useState } from 'react'
import CrossIcon from 'assets/svg/Cross.svg'
import Slider from 'react-slick'
import './PrdGalleryHomePage.css'
import {
  IProductState,
  prdDetailState,
} from 'components/PrdDetailCommon/prdDetailInterface'
import { ShowPrdGalleryModal } from '.'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { setMutedVideo } from 'features/global/mutedVideoSlice'
import useInView from 'hooks/useInView'
import {
  convertNumbThousand,
  formatDataNumber,
  getCurrencyCode,
} from 'utils/function'
import {
  MoreIcon,
  SingleDot,
  CurationVoted,
  CurationShare,
  CurationBookmarked,
  CurationBookmark,
  CurationCart,
  DefaultAvatar,
  DefaultThumbnail,
  HotDeal,
} from 'utils/svgExport'
import { Link } from 'react-router-dom'
import { TCurrency } from 'data/wl-types'
import IconButtonVoteAnimation from 'components/IconButtonVoteAnimation'
import useMediaQuery from '../../../hooks/useMediaQuery'

interface PrdGalleryHomePageProps {
  media:
    | {
        attributes: {
          url: string
          height: number
          width: number
        }
      }[]
    | []
  isHaveVideo: boolean
  setShowPrdGallery: React.Dispatch<React.SetStateAction<ShowPrdGalleryModal>>
  showPrdGallery: ShowPrdGalleryModal
  handleBookmark: (productId: number, type: 'bookmark' | 'unbookmark') => void
  bookmark: {
    isBookmarked: boolean | undefined
    loading: boolean
  }
  slug: string
  prdDetail: IProductState
  shopVariantCurrency: TCurrency | undefined
  voteInfo: {
    isVoted: boolean
    count: number
    votedId: number
  }
  handleVoteAction: () => void
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>
  pricePrd: number
  shareNumber: number | null
  disabled: boolean
  showSharedModal: boolean
  // prdDetail: prdDetailState
}

interface ListMediaProps {
  videoLink: string
  listImage: string[]
}

interface SettingSliderProps {
  dots: boolean
  infinite: boolean
  speed: number
  slidesToShow: number
  slidesToScroll: number
  initialSlide: number
}

const PrdGalleryHomePage = ({
  media,
  isHaveVideo,
  setShowPrdGallery,
  showPrdGallery,
  handleBookmark,
  bookmark,
  slug,
  prdDetail,
  shopVariantCurrency,
  voteInfo,
  handleVoteAction,
  pricePrd,
  shareNumber,
  setShowShareModal,
  disabled,
  showSharedModal,
}: // prdDetail,
PrdGalleryHomePageProps) => {
  const [listMedia, setListMedia] = useState<ListMediaProps>({
    listImage: [],
    videoLink: '',
  })
  const slickSlider = useRef<Slider>(null)
  const isMuted = useSelector((state: RootState) => state.mutedVideo)
  const videoRef = useRef<HTMLVideoElement>(null)
  const dispatch = useDispatch()
  const { isInView, ref } = useInView()
  const volume = useSelector((state: RootState) => state.volumeVideo)
  const mediaQuery = useMediaQuery()

  useEffect(() => {
    let activeMedia = 0

    const videoLink = isHaveVideo
      ? `${process.env.REACT_APP_API_URL}/loadClip/${
          media[0].attributes?.url.split('/')[
            media[0].attributes?.url.split('/').length - 1
          ]
        }`
      : ''
    let LIST_GALLERY: string[] = []
    if (videoLink) {
      for (let i = 1; i < media.length; i++) {
        LIST_GALLERY.push(
          `${process.env.REACT_APP_URL_BE}${media[i].attributes.url}`
        )
        if (media[i].attributes.url === showPrdGallery.linkMedia) {
          activeMedia = i
        }
      }
    } else {
      LIST_GALLERY = media.map((_i, idx) => {
        if (showPrdGallery.linkMedia === _i.attributes.url) {
          activeMedia = idx
        }

        return `${process.env.REACT_APP_URL_BE}${_i.attributes.url}`
      })
    }
    setListMedia({
      videoLink: videoLink,
      listImage: LIST_GALLERY,
    })

    setSettingSlider((preState) => ({
      ...preState,
      initialSlide: activeMedia,
    }))

    const handleKeyDown = (e: any) => {
      if (e.keyCode === 37) {
        ;(slickSlider.current as Slider).slickPrev()
      }
      if (e.keyCode === 39) {
        ;(slickSlider.current as Slider).slickNext()
      }
      if (e.keyCode === 27) {
        if (showSharedModal) {
          setShowShareModal(false)
        } else {
          document.body.classList.remove('overflow-hidden')
          setShowPrdGallery({
            openGallery: false,
            linkMedia: null,
          })
        }
      }
    }
    if (showPrdGallery.linkMedia) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isHaveVideo,
    media,
    setShowPrdGallery,
    setShowShareModal,
    showPrdGallery.linkMedia,
    showSharedModal,
  ])

  const [settingSlider, setSettingSlider] = useState<SettingSliderProps>({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  })

  const handleVolumeChangeVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.volume === 0 || videoRef.current.muted) {
        dispatch(setMutedVideo(true))
      } else {
        dispatch(setMutedVideo(false))
      }
    }
  }

  useEffect(() => {
    if (!videoRef.current) return
    isInView ? videoRef.current.play() : videoRef.current.pause()
  }, [isInView])

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.volume = volume
  }, [volume])

  const renderActionCard = () => {
    return (
      <section className={` overflow-hidden cursor-default ${mediaQuery > 332 ? 'p-[8px_16px_0]' : 'p-[4px_0]'}`}>
        <div className={`flex items-center my-1  ${mediaQuery > 332 ? 'space-x-16 h-[40px] justify-between' : 'space-x-4 flex-wrap space-y-2 h-auto justify-center'}`}>
          <div className="flex space-x-2 items-start h-full">
            <div className="flex space-x-2 cursor-pointer">
              <div className="w-8">
                {voteInfo.isVoted ? (
                  <div
                    className="h-[30px] flex justify-center w-[30px]"
                    // onClick={!disabled ? handleUnVote : () => {}}
                  >
                    <img src={CurationVoted} alt="" />
                  </div>
                ) : (
                  <div className="group h-[30px] w-[30px]">
                    <IconButtonVoteAnimation
                      mt="mt-[2px]"
                      mode="btw"
                      onClick={!disabled ? handleVoteAction : () => {}}
                    />
                  </div>
                )}
              </div>
              <div className="text-link-16 w-full h-6 flex justify-center items-center m-auto">
                {voteInfo.count ? convertNumbThousand(voteInfo.count) : 0}
              </div>
            </div>
            <div className="flex space-x-2 cursor-pointer ">
              <div className="w-8">
                <div className="flex justify-center items-center w-8 h-8">
                  <img
                    onClick={() => {
                      setShowShareModal(true)
                    }}
                    src={CurationShare}
                    alt=""
                  />
                </div>
              </div>
              <div className="text-link-16 w-full h-6 flex justify-center m-auto">
                {convertNumbThousand(shareNumber)}
              </div>
            </div>
          </div>
          <div className="flex space-x-3 items-start h-full ">
            <div className="flex space-x-2 items-stretch">

              <div className="text-end flex m-auto space-x-2">
                <img alt="" src={HotDeal} className="w-5 h-5 m-auto" />
                <div className="text-link-16 text-[--gray-text]">
                  {shopVariantCurrency
                    ? getCurrencyCode(shopVariantCurrency)
                    : '$'}
                  {formatDataNumber(Number(pricePrd), 2)}
                </div>
              </div>
              <div
                className="flex space-x-2 h-[30px] justify-end items-center"
                onClick={() => {
                  document.body.classList.remove('overflow-hidden')
                }}
              >
                <Link to={slug} rel="noreferrer">
                  <div className="w-[30px] h-[30px]">
                    <img src={CurationCart} alt="" className="" />
                  </div>
                </Link>
                <div
                  className="cursor-pointer h-[30px] w-[30px]"
                  onClick={
                    !bookmark.loading
                      ? !bookmark.isBookmarked
                        ? () => handleBookmark(prdDetail.id, 'bookmark')
                        : () => handleBookmark(prdDetail.id, 'unbookmark')
                      : () => {}
                  }
                >
                  <img
                    src={
                      bookmark.isBookmarked
                        ? CurationBookmarked
                        : CurationBookmark
                    }
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div
      className="el-overlay galeryImage"
      style={{ zIndex: '2009' }}
      id="galeryImageContainer"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="el-id-8149-4"
        aria-describedby="el-id-8149-5"
        className="el-overlay-dialog"
        style={{ display: 'flex' }}
      >
        {listMedia.listImage.length > 0 || listMedia.videoLink !== '' ? (
          <>
            <div
              className="l-carousel el-carousel--horizontal gallery-carousel h-screen w-full"
              id="galleryCarousel"
            >
              <div className="el-carousel__container">
                <Slider {...settingSlider} ref={slickSlider}>
                  {isHaveVideo ? (
                    <div className="!flex md:max-h-[1000px] max-h-[82vh] w-full max-w-[800px] md:max-w-[1000px] items-center justify-center flex-col h-full">
                      <video
                        ref={videoRef}
                        onVolumeChange={handleVolumeChangeVideo}
                        loop
                        playsInline
                        controls
                        muted={isMuted}
                        className="object-contain max-h-[82vh] bg-black"
                        // autoPlay
                      >
                        <source src={listMedia.videoLink} />
                        Your browser does not support the video tag.
                      </video>

                      <div ref={ref}>{renderActionCard()}</div>
                    </div>
                  ) : null}

                  {listMedia.listImage.length > 0
                    ? listMedia.listImage.map((_i, idx) => {
                        return (
                          <div
                            className="!flex max-h-[82vh] md:max-h-[1000px] w-full max-w-[800px] md:max-w-[1000px] items-center justify-center flex-col"
                            key={idx}
                          >
                            <div className="!flex h-full  max-h-[800px] max-w-[800px] md:max-h-[1000px] w-full md:max-w-[1000px] items-center justify-center">
                              <img
                                src={`${_i}`}
                                alt=""
                                className="h-auto max-h-[82vh] w-auto max-w-full rounded-10 object-contain"
                              />
                            </div>
                            <div className="mb-4">{renderActionCard()}</div>
                          </div>
                        )
                      })
                    : null}
                </Slider>
              </div>
            </div>
            <div
              className="absolute right-[30px] top-[30px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
              onClick={() => {
                document.body.classList.remove('overflow-hidden')
                setShowPrdGallery({
                  openGallery: false,
                  linkMedia: null,
                })
              }}
            >
              <img className="w-6 h-6" src={CrossIcon} alt="" />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default PrdGalleryHomePage