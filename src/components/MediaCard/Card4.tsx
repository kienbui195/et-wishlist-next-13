import { FC } from 'react'
import { CardProps } from './Card1'
import { DEFAULT_MEDIA_WIDTH } from 'components/ProductCurations/ProductCurationsCard'
import Card0 from './Card0'

const Card4: FC<CardProps> = ({
  media,
  cardHeight = DEFAULT_MEDIA_WIDTH,
  isHaveVideo = false,
  isWidthLargerThanHeight,
  onClick,
  setShowPrdGallery,
  showProdGallery,
                              }) => (
  <div className={`grid gap-1`}>
    <div
      className="grid grid-cols-2 gap-1"
      style={{
        maxHeight: `${(cardHeight * 2) / 3}px`,
        height: `${
          media[0].attributes.height > (cardHeight * 2) / 3
            ? media[0].attributes.height
            : (cardHeight * 2) / 3
        }px`,
      }}
    >
      {media.slice(0, 2).map((_i, idx) => {
        return (
          <Card0
            showProdGallery={showProdGallery}
            media={_i}
            isVideo={isHaveVideo && idx === 0}
            height={(cardHeight * 2) / 3}
            key={idx}
            onClick={(url) => onClick && onClick(url)}
            setShowPrdGallery={setShowPrdGallery}
          />
        )
      })}
    </div>
    <div
      className="media-5 grid grid-cols-3 gap-1"
      style={{
        maxHeight: `${(cardHeight) / 3}px`,
        height: `${
          media[2].attributes.height > (cardHeight) / 3
            ? media[2].attributes.height
            : (cardHeight) / 3
        }px`,
      }}
    >
      {media.slice(2, 5).map((_i, _idx) => {
        return (
          <div key={_idx * _idx} className={_idx === 2 ? 'relative' : ''}>
            <Card0
              showProdGallery={showProdGallery}
              media={_i}
              height={(cardHeight) / 3}
              onClick={(url) => onClick && onClick(url)}
              setShowPrdGallery={setShowPrdGallery}
            />
            {media.length > 5 && _idx === 2 && (
              <>
                <div className="absolute flex w-full h-full top-0 left-0 z-10 bg-black opacity-40"></div>
                <div
                  className="absolute flex w-full h-full select-none top-0 left-0 z-10 cursor-pointer items-center justify-center text-[33px] text-white font-bold"
                  onClick={() => {
                    onClick && onClick(media[4].attributes.url)
                    document.body.classList.add('overflow-hidden')
                    setShowPrdGallery({
                      openGallery: true,
                      linkMedia: media[4].attributes.url,
                    })
                  }}
                >{`+${media.length - 5}`}</div>
              </>
            )}
          </div>
        )
      })}
    </div>
  </div>
)

export default Card4
