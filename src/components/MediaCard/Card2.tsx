import { FC } from 'react'
import { CardProps } from './Card1'
import { DEFAULT_MEDIA_WIDTH } from '@/components/ProductCurations/ProductCurationsCard'
import Card0 from './Card0'

const Card2: FC<CardProps> = ({
  media,
  cardHeight = DEFAULT_MEDIA_WIDTH,
  isHaveVideo = false,
  isWidthLargerThanHeight,
  setShowPrdGallery,
  onClick,
  showProdGallery,
}) => {
  return (
    <div
      className={`grid gap-1 ${
        isWidthLargerThanHeight === 'larger' ||
        isWidthLargerThanHeight === 'equal'
          ? 'grid-cols-2 media-3-ngang'
          : 'grid-cols-3 media-3-doc'
      }`}
    >
      <div
        className={`grid h-full ${
          isWidthLargerThanHeight === 'larger' ? 'col-span-2' : 'col-span-2'
        } `}
        style={{
          height: `${
            isWidthLargerThanHeight === 'larger' ||
            isWidthLargerThanHeight === 'equal'
              ? (cardHeight - 5) / 2
              : cardHeight
          }px`,
        }}
      >
        <Card0
          showProdGallery={showProdGallery}
          media={media[0]}
          height={
            isWidthLargerThanHeight === 'larger' ||
            isWidthLargerThanHeight === 'equal'
              ? (cardHeight - 5) / 2
              : cardHeight
          }
          isVideo={isHaveVideo}
          setShowPrdGallery={setShowPrdGallery}
          onClick={(url) => onClick && onClick(url)}
        />
      </div>
      <div
        className={`grid gap-1 h-full ${
          isWidthLargerThanHeight === 'smaller'
            ? 'grid-cols-1 grid-rows-2'
            : 'col-span-2 grid-cols-2'
        }`}
        style={{
          height: `${
            isWidthLargerThanHeight === 'smaller' ? cardHeight : cardHeight / 2
          }px`,
        }}
      >
        <Card0
          showProdGallery={showProdGallery}
          media={media[1]}
          height={cardHeight / 2}
          onClick={(url) => onClick && onClick(url)}
          setShowPrdGallery={setShowPrdGallery}
        />
        <Card0
          showProdGallery={showProdGallery}
          media={media[2]}
          height={cardHeight / 2}
          onClick={(url) => onClick && onClick(url)}
          setShowPrdGallery={setShowPrdGallery}
        />
      </div>
    </div>
  )
}

export default Card2