import Footer from 'components/Footer/Footer'
import Sidebar, { ISidebarComponent } from 'components/Sidebar'
import React, { useEffect, useRef, useState } from 'react'

interface StickySidebarProps {
  sidebar: ISidebarComponent[]
  product: {
    list: never[]
    loading: boolean
  }
}

const StickySidebar = ({ sidebar, product }: StickySidebarProps) => {
  const [playingVideo, setPlayingVideo] = useState<any>()
  const [stickyBanner, setSetstickyBanner] = useState(100)
  const prePosWindow = useRef(0)
  const prePosScroll = useRef(0)
  // const [autoPlayVideo, setAutoPlayVideo] = useState(false)
  useEffect(() => {
    prePosWindow.current = window.pageYOffset

    const handleScroll = () => {
      const TOPBANNER_STICKY = 100
      const sidebarHomepage = document.getElementById('sidebarHomepage')
      const sidebarHeight = sidebarHomepage ? sidebarHomepage.clientHeight : 0
      if (window.innerHeight < sidebarHeight) {
        const stickyTopSidebarHomepage =
          sidebarHomepage && sidebarHomepage?.getBoundingClientRect().top <= 100
            ? sidebarHomepage?.getBoundingClientRect().top
            : TOPBANNER_STICKY

        const currentScrollPos = window.pageYOffset
        if (currentScrollPos > prePosWindow.current) {
          if (
            Math.abs(
              stickyTopSidebarHomepage -
                window.scrollY +
                prePosScroll.current -
                10
            ) <=
            sidebarHeight - window.innerHeight
          ) {
            setSetstickyBanner(
              stickyTopSidebarHomepage -
                window.scrollY +
                prePosScroll.current +
                10
            )
          } else {
            setSetstickyBanner(-sidebarHeight + window.innerHeight - 10)
          }
        } else {
          prePosScroll.current = window.scrollY
          setSetstickyBanner(
            stickyTopSidebarHomepage < TOPBANNER_STICKY
              ? stickyTopSidebarHomepage + 10
              : TOPBANNER_STICKY
          )
        }

        prePosWindow.current = window.pageYOffset
      }

      const listVideoEl = document.querySelectorAll('.videoProductionCuration')
      // if (!autoPlayVideo) {
      //   listVideoEl.forEach((elm) => {
      //     if (elm instanceof HTMLVideoElement) {
      //       elm
      //         .play()
      //         .then(() => {
      //           // Video đã bắt đầu phát, giờ chúng ta có thể dừng lại
      //           elm.pause()
      //         })
      //         .catch((error) => {
      //           console.error('Error occurred while playing the video:', error)
      //         })
      //     }
      //   })
      //   setAutoPlayVideo(true)
      // }

      let videoNearest: any
      const caculateViewVideo = Array.from(listVideoEl)
        .map((_i: any, idx) => {
          const displayPercentage = 0.8
          const boundingClientRect = _i.getBoundingClientRect()
          const midY = boundingClientRect.top + boundingClientRect.height / 2
          const windowHeight =
            window.innerHeight || document.documentElement.clientHeight
          const distanceCenterView = Math.abs(midY - windowHeight / 2)

          const elementHeight =
            boundingClientRect.bottom - boundingClientRect.top
          const thresholdHeight = elementHeight * displayPercentage
          const inView =
            boundingClientRect.top -
              -(1 - displayPercentage) *
                (boundingClientRect.bottom - boundingClientRect.top) >
              0 && boundingClientRect.top + thresholdHeight <= windowHeight
          return (
            inView && {
              video: _i,
              distance: distanceCenterView,
            }
          )
        })
        .filter((_i) => _i)
      if (caculateViewVideo.length > 1) {
        let minDistance = Infinity
        caculateViewVideo.forEach((_i: any) => {
          if (_i.distance < minDistance) {
            videoNearest = _i.video
            minDistance = _i.distance
          }
        })
      }
      if (caculateViewVideo.length === 1) {
        videoNearest = (caculateViewVideo[0] as any).video
      }
      if (videoNearest) {
        setPlayingVideo(videoNearest)
        pauseAllVideos()
        const isPlaying =
          videoNearest.currentTime > 0 &&
          !videoNearest.paused &&
          !videoNearest.ended &&
          videoNearest.readyState > videoNearest.HAVE_CURRENT_DATA
        if (
          !isPlaying &&
          videoNearest.readyState >= videoNearest.HAVE_CURRENT_DATA
        ) {
          videoNearest.play().catch((error: any) => console.error(error))
        }
      }
      if (!videoNearest) {
        pauseAllVideos()
        setPlayingVideo(null)
      }
    }
    if (!playingVideo) {
      handleScroll()
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [product, playingVideo])

  const pauseAllVideos = () => {
    const listVideoEl = document.querySelectorAll('.videoProductionCuration')
    // Pause all other videos on the page
    listVideoEl.forEach((v: any) => {
      v.pause()
    })
  }

  return (
    <div className="flex flex-col justify-start space-y-6 mt-[32px] max-w-[360px] w-full transition ease-in-out delay-1000">
      <div
        className="sticky top-20 flex flex-col space-y-6"
        id="sidebarHomepage"
        style={{
          top: `${stickyBanner}px`,
        }}
      >
        <Sidebar value={sidebar} />
        <Footer />
      </div>
    </div>
  )
}

export default StickySidebar
