import { FC } from 'react'
import Card0 from './Card0'
import { CardProps } from './Card1'
import { DEFAULT_MEDIA_WIDTH } from 'components/ProductCurations/ProductCurationsCard'

const Card3: FC<CardProps> = ({
  media,
  cardHeight = DEFAULT_MEDIA_WIDTH,
  isHaveVideo = false,
  isWidthLargerThanHeight,
  onClick,
  setShowPrdGallery,
  showProdGallery,
}) => {
  if (isWidthLargerThanHeight === 'equal') {
    return (
      <div
        className="media-4-vuong grid gap-1 grid-cols-2"
        style={{ height: `${cardHeight}px` }}
      >
        {media.map((_i, idx) => (
          <Card0
            showProdGallery={showProdGallery}
            key={idx}
            isVideo={isHaveVideo && idx === 0}
            media={_i}
            height={cardHeight / 2}
            onClick={(url) => onClick && onClick(url)}
            setShowPrdGallery={setShowPrdGallery}
          />
        ))}
      </div>
    )
  } else {
    return (
      <div className={`media-4-doc grid gap-1`}>
        {isWidthLargerThanHeight === 'smaller' ? (
          <div className="grid grid-cols-3 gap-1">
            <div
              className="grid col-span-2 row-span-3 gap-1"
              style={{ height: `${cardHeight}px` }}
            >
              <Card0
                showProdGallery={showProdGallery}
                media={media[0]}
                isVideo={isHaveVideo}
                height={cardHeight}
                onClick={(url) => onClick && onClick(url)}
                showFull={true}
                setShowPrdGallery={setShowPrdGallery}
              />
            </div>
            <div
              className="grid gap-1 row-span-3 grid-rows-3"
              style={{ height: `${cardHeight}px` }}
            >
              {media.slice(1).map((_i, idx) => {
                return (
                  <Card0
                    showProdGallery={showProdGallery}
                    media={_i}
                    height={cardHeight / 3}
                    key={idx}
                    onClick={(url) => onClick && onClick(url)}
                    setShowPrdGallery={setShowPrdGallery}
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <div className="media-4-ngang grid grid-cols-3 gap-1">
            <div
              className="grid col-span-3 gap-1"
              style={{
                maxHeight: `${(cardHeight * 2) / 3}px`,
                height: `${
                  media[0].attributes.height > (cardHeight * 2) / 3
                    ? media[0].attributes.height
                    : (cardHeight * 2) / 3
                }px`,
              }}
            >
              <Card0
                showProdGallery={showProdGallery}
                media={media[0]}
                height={(cardHeight * 2) / 3}
                isVideo={isHaveVideo}
                onClick={(url) => onClick && onClick(url)}
                showFull={true}
                setShowPrdGallery={setShowPrdGallery}
              />
            </div>
            <div
              className="grid grid-cols-3 col-span-3 gap-1"
              style={{
                maxHeight: `${(cardHeight * 1) / 3}px`,
                height: `${
                  media[1].attributes.height > (cardHeight * 1) / 3
                    ? media[1].attributes.height
                    : (cardHeight * 1) / 3
                }px`,
              }}
            >
              {media.slice(1).map((_i, idx) => {
                return (
                  <Card0
                    showProdGallery={showProdGallery}
                    media={_i}
                    height={(cardHeight * 1) / 3}
                    key={idx}
                    onClick={(url) => onClick && onClick(url)}
                    setShowPrdGallery={setShowPrdGallery}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Card3