import { FC } from 'react'
import Card0 from './Card0'
import {
  DEFAULT_MEDIA_WIDTH,
  ShowPrdGalleryModal,
} from 'components/ProductCurations/ProductCurationsCard'

export type WidthHeightRatio = 'larger' | 'smaller' | 'equal'

export interface CardProps {
  media:
    | {
        attributes: {
          url: string
          height: number
          width: number
        }
      }[]
    | []
  cardHeight: number
  isHaveVideo?: boolean
  isWidthLargerThanHeight?: WidthHeightRatio
  setShowPrdGallery: React.Dispatch<React.SetStateAction<ShowPrdGalleryModal>>
  showProdGallery: boolean
  onClick?: (url: string) => void
  defaultMediaWidth?: number
}

const Card1: FC<CardProps> = ({
  media,
  cardHeight = DEFAULT_MEDIA_WIDTH,
  isHaveVideo = false,
  isWidthLargerThanHeight,
  setShowPrdGallery,
  showProdGallery,
  onClick,
  defaultMediaWidth = DEFAULT_MEDIA_WIDTH,
}) => {
  const handleCheckHeightMedia = (idx: number) => {
    let res = {
      isMediaHeightSmallerThanCardHeight: false,
      mediaHeight: cardHeight,
    }

    if (
      media.length === 1 ||
      (media.length === 2 &&
        media[idx].attributes.width <= media[idx].attributes.height)
    ) {
      if (media[idx].attributes.width > defaultMediaWidth) {
        const ratio = media[idx].attributes.width / media[idx].attributes.height
        const mediaHeight =
          defaultMediaWidth / ratio / (media.length > 1 ? 2 : 1)
        res['isMediaHeightSmallerThanCardHeight'] = mediaHeight < cardHeight
        res['mediaHeight'] = mediaHeight
      }
    }

    return res
  }

  return (
    <div className="media-1-2">
      {media.length === 1 ? (
        <div
          className="grid grid-cols-1 bg-current"
          style={{
            height: `${
              handleCheckHeightMedia(0).isMediaHeightSmallerThanCardHeight
                ? handleCheckHeightMedia(0).mediaHeight
                : cardHeight
            }px`,
            maxHeight: `${
              handleCheckHeightMedia(0).isMediaHeightSmallerThanCardHeight
                ? handleCheckHeightMedia(0).mediaHeight
                : cardHeight
            }px`,
          }}
        >
          <Card0
            media={media[0]}
            height={
              handleCheckHeightMedia(0).isMediaHeightSmallerThanCardHeight
                ? handleCheckHeightMedia(0).mediaHeight
                : cardHeight
            }
            setShowPrdGallery={setShowPrdGallery}
            isVideo={isHaveVideo}
            showFull={true}
            onClick={(url) => onClick && onClick(url)}
            showProdGallery={showProdGallery}
          />
        </div>
      ) : (
        <div
          className={`grid gap-1 ${
            isWidthLargerThanHeight !== 'larger' ? 'grid-cols-2' : 'grid-cols-1'
          }`}
          style={{
            height: `${
              handleCheckHeightMedia(0).isMediaHeightSmallerThanCardHeight
                ? handleCheckHeightMedia(0).mediaHeight
                : cardHeight
            }px`,
            maxHeight: `${
              handleCheckHeightMedia(0).isMediaHeightSmallerThanCardHeight
                ? handleCheckHeightMedia(0).mediaHeight
                : cardHeight
            }px`,
          }}
        >
          <Card0
            media={media[0]}
            height={
              isWidthLargerThanHeight !== 'larger'
                ? handleCheckHeightMedia(0).isMediaHeightSmallerThanCardHeight
                  ? handleCheckHeightMedia(0).mediaHeight
                  : cardHeight
                : cardHeight / 2
            }
            isVideo={isHaveVideo}
            // key={idx}
            showFull={media.length === 1}
            setShowPrdGallery={setShowPrdGallery}
            onClick={(url) => onClick && onClick(url)}
            showProdGallery={showProdGallery}
          />
          <Card0
            media={media[1]}
            height={
              isWidthLargerThanHeight !== 'larger'
                ? handleCheckHeightMedia(0).isMediaHeightSmallerThanCardHeight
                  ? handleCheckHeightMedia(0).mediaHeight
                  : cardHeight
                : handleCheckHeightMedia(1).isMediaHeightSmallerThanCardHeight
                ? handleCheckHeightMedia(1).mediaHeight < cardHeight / 2
                  ? handleCheckHeightMedia(1).mediaHeight
                  : cardHeight / 2
                : cardHeight / 2
            }
            showFull={media.length === 1}
            setShowPrdGallery={setShowPrdGallery}
            onClick={(url) => onClick && onClick(url)}
            showProdGallery={showProdGallery}
          />
        </div>
      )}
    </div>
  )
}

export default Card1
