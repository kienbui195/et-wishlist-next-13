 {prdVideo && prdVideo.length > 0 ? (
            <div
              style={{
                maxHeight: `${cardSize.cardWidth * 1.25}px`,
                height: `${cardSize.videoHeight}px`,
              }}
            >
              <div className="gfl-product-thumb-cont h-full flex justify-center bg-black relative">
                {/* <div
                  className="absolute w-full h-full top-0 left-0"
                  onClick={() => handleVideoClick()}
                ></div> */}
                <video
                  ref={playVideoRef}
                  loop
                  playsInline
                  controls
                  muted={mutedVideo}
                  className="inset-0 h-full object-contain videoProductionCuration"
                >
                  <source
                    src={
                      prdVideo.length > 0
                        ? `${process.env.NEXT_PUBLIC_API_URL}/loadClip/${
                            prdVideo[0].attributes?.url.split('/')[
                              prdVideo[0].attributes?.url.split('/').length - 1
                            ]
                          }`
                        : ''
                    `${process.env.NEXT_PUBLIC_BE_URL}${prdVideo?.attributes?.url}`
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div>
                {mutedVideo ? (
                  <Image
                    onClick={() => dispatch(setMutedVideo(false))}
                    alt=""
                    className="h-6 w-6 absolute z-10 right-[13px] top-[9px] cursor-pointer"
                    src={MuteOn}
                  />
                ) : (
                  <Image
                    onClick={() => dispatch(setMutedVideo(true))}
                    alt=""
                    className="h-6 w-6 absolute z-10 right-[13px] top-[9px] cursor-pointer"
                    src={MuteOff}
                  />
                )}
              </div>
            </div>
          ) : (
            <MediaCard
              prdMedia={prdImages}
              cardHeight={cardSize.cardHeight}
              onClick={() => navigate && navigate()}
              prdVideo={prdVideo && prdVideo.length > 0 ? prdVideo : []}
            />
          )}

const [cardSize, setCardSize] = useState({
  cardWidth: DEFAULT_MEDIA_WIDTH,
  videoHeight: DEFAULT_MEDIA_WIDTH,
  cardHeight: 678,
})

useEffect(() => {
  const video = playVideoRef.current

  const calculateSizeVideoWrapper = () => {
    const mediaWrapper = document.querySelector('.gfl-product-thumb')

    let imgHeight = window.innerHeight - 326
    if (window.innerHeight <= 992) {
      imgHeight = 678
    }
    if (window.innerHeight >= 1230) {
      imgHeight = 906
    }
    const listImg = document.querySelectorAll('.slick-list img')
    listImg.forEach((_i: any) => {
      _i.style.maxHeight = `${imgHeight}px`
    })
    const mediaWrapperWidth =
      mediaWrapper?.getBoundingClientRect().width ||
      DEFAULT_MEDIA_WIDTH
    if (playVideoRef.current && playVideoRef.current?.videoHeight) {
      const video = playVideoRef.current
      const multiplierSize = video?.videoWidth / mediaWrapperWidth
      setCardSize({
        cardWidth: mediaWrapperWidth,
        videoHeight: video?.videoHeight / multiplierSize,
        cardHeight: imgHeight,
      })
    } else {
      setCardSize({
        cardWidth: mediaWrapperWidth,
        videoHeight: mediaWrapperWidth * 1.25,
        cardHeight: imgHeight,
      })
    }
  }

  video?.addEventListener('loadedmetadata', calculateSizeVideoWrapper)
  window.addEventListener('resize', calculateSizeVideoWrapper)
  calculateSizeVideoWrapper()

  return () => {
    video?.removeEventListener('loadedmetadata', calculateSizeVideoWrapper)
    window.removeEventListener('resize', calculateSizeVideoWrapper)
  }
}, [])