import React, { FC, useState } from 'react'
import { IWlClip } from '..'
import VerifiedBadgeSvg from 'assets/svg/VerifiedBadge.svg'
import BrandDotSvg from 'assets/svg/BrandDot.svg'
import Dropdown from 'components/CustomDropdown'

interface ClipCardProps {
  data: IWlClip
  onClick: (id: number) => void
  handleDelete: (id: number) => void
}

const ClipCard: FC<ClipCardProps> = ({ data, onClick, handleDelete }) => {
  const [isHover, setIsHover] = useState<boolean>(false)

  return (
    <div id={`wl-clip-${data.id}`} className="flex w-[167px] flex-col">
      <div
        className="relative h-[296px] w-full rounded-md"
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
      >
        <video
          src={process.env.REACT_APP_URL_BE + data.clip.url}
          className="h-full w-full rounded-md object-cover md:rounded-10"
        />
        {isHover && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-slate-1150/75">
            <button
              className="h-[30px] rounded-md bg-slate-1150 px-3.5 text-sm font-semibold text-white"
              onClick={() => {
                data.id && onClick(data.id)
              }}
            >
              Edit clip
            </button>
          </div>
        )}
      </div>
      <div className="mt-[15px] h-[34px] overflow-hidden text-ellipsis text-xs font-medium leading-snug text-slate-1150">
        {data.desc}
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        {data.product && <div className="flex h-6 max-w-[90px] items-center rounded-full border border-gray-1350 bg-white px-2.5 shadow-dashboardButtons">
          <span className="block truncate text-10 font-bold leading-6 text-slate-1150">
            {data.product.name}
          </span>
          <img src={VerifiedBadgeSvg} alt="" className="ml-[3px] h-2 w-2" />
        </div>}
        <Dropdown
          dropdownIcon={BrandDotSvg}
          className='w-4'
          list={[
            {
              id: 1,
              name: 'Delete Clip',
              onClick: () => {
                data.id && handleDelete(data.id)
              },
            },
          ]}
        />
      </div>
    </div>
  )
}

export default ClipCard
