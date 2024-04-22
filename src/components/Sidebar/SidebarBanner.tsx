import React, { FC } from 'react'
import { ISidebarBanner } from '.'
import CustomCarousel from 'components/CustomCarousel'
import { IOptionalSetting } from 'data/wl-types'

interface ISidebarBannerProps {
  value: ISidebarBanner[]
  options?: IOptionalSetting
}

const SidebarBanner: FC<ISidebarBannerProps> = ({ value, options }) => {
  const [open, setOpen] = React.useState<boolean>(options ? options.isShow : true)

  return open ? (
    <div className={`sidebar-right top-0 z-10 hidden mt-[24px] shrink-0 bg-white p-0 md:block w-full h-full `}>
      <CustomCarousel
        images={value}
        isAutoPlay={true}
        autoSlideDelay={5000}
        maxWidth="max-w-[360px]"
        imageWidth="w-full"
        maxHeight="max-h-[520px]"
        imageHeight="h-auto"
        isAcceptClose={options?.isAcceptClose}
        height={options?.height}
        width={options?.width}
        onClose={() => setOpen(false)}
      />
    </div> 
  ) : null
}

export default SidebarBanner
