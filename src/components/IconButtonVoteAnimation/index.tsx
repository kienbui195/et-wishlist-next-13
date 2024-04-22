import * as React from 'react'
import { UpVotePrimary, UpVoteWhite } from 'utils/svgExport'

interface IIconButtonVoteAnimation {
  onClick?: () => void
  mode?: 'wtb' | 'btw'
  size?: {
    w: number
    h: number
  }
  mt?: string
}

const IconButtonVoteAnimation: React.FC<IIconButtonVoteAnimation> = ({
  onClick,
  mode = 'wtb',
  size = {
    w: '11.2',
    h: '13.6',
  },
  mt = 'mt-0'
}) => {
  return (
    <div
      className={`h-full w-full overflow-hidden rounded-full border-2 pt-1
    ${
      mode === 'wtb'
        ? 'border-white bg-white pt-1 group-hover:bg-[--brand-primary]'
        : 'border-[--brand-primary] bg-[--brand-primary] group-hover:bg-white'
    } `}
      onClick={() => {
        onClick && onClick()
      }}
    >
      <div className={`w-full ${mt}`}></div>
      <img
        src={mode === 'wtb' ? UpVotePrimary : UpVoteWhite}
        width={size.w}
        height={size.h}
        alt=""
        className={`m-auto transition-transform duration-300 group-hover:-translate-y-6 group-hover:opacity-0`}
      />
      <img
        src={mode === 'wtb' ? UpVoteWhite : UpVotePrimary}
        width={size.w}
        height={size.h}
        alt=""
        className={`m-auto opacity-0 transition-transform duration-300 group-hover:-translate-y-3.5 group-hover:opacity-100`}
      />
    </div>
  )
}

export default IconButtonVoteAnimation
