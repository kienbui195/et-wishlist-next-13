import { FC, useEffect, useState } from 'react'
import { IImageContent } from '.'
import CustomCarousel from 'components/CustomCarousel'
import { IOptionalSetting } from 'data/wl-types'

export interface IMultiContentProps {
  value: IImageContent[]
  options?: IOptionalSetting
}

const MultiContent: FC<IMultiContentProps> = ({ value = [], options }) => {
  const [currentContent, setCurrentContent] = useState<IImageContent | null>(
    null
  )

  useEffect(() => {
    if (value.length > 0) {
      setCurrentContent(value[0])
    }
  }, [value])

  return (options && options.isShow) || !options ? (
    <div
      className={`h-[50px] sm:h-[40px] flex justify-center items-center`}
      style={{
        background: currentContent?.background || 'black',
      }}
    >
      <div className="et-container md:et-container-sm w-full">
        <CustomCarousel
          images={value}
          isAcceptClose={false}
          autoSlideDelay={5000}
          isAutoPlay={true}
          imageHeight="h-[50px] sm:h-[40px]"
          containHeight="min-h-[50px] sm:min-h-[40px]"
          imageWidth="w-auto"
          className="!bg-transparent"
          width={options?.width}
          height={options?.height}
        />
      </div>
    </div>
  ) : null
}

export default MultiContent
