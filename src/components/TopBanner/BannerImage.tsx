import { ITopBannerImage } from 'app/HomePage'
import React, { FC, useState } from 'react'
import CustomCarousel from 'components/CustomCarousel'
import { IOptionalSetting } from 'data/wl-types'

interface IBannerImageProps {
  value: ITopBannerImage[]
  options?: IOptionalSetting
}

const BannerImage: FC<IBannerImageProps> = ({ value = [], options }) => {
  const [open, setOpen] = useState<boolean>(options ? options.isShow : true)    

  return (
    <div
      className={`select-none ${
        open ? 'border border-[--gray-line] mt-[20px]' : 'hidden'
      } `}
    >
      <CustomCarousel
        images={value}
        className=""
        onClose={() => setOpen(false)}
        isAutoPlay={true}
        autoSlideDelay={5000}
        containHeight={`h-[170px]`}
        imageHeight={`h-[170px]`}
        imageWidth={'w-auto'}
        isAcceptClose={options?.isAcceptClose}
        width={options?.width}
        height={options?.height}
      />
    </div>
  )
}

export default BannerImage
