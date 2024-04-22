import React, { FC } from 'react'
import { ITopBannerImage, ITopBannerText } from '../../app/HomePage'
import Component from '../index'
import { IOptionalSetting } from 'data/wl-types'

export interface ITopBannerComponent {
  id: number
  __component: string
  content: ITopBannerText | ITopBannerImage[]
  options?: IOptionalSetting 
}
interface ITopBannerProps {
  value: ITopBannerComponent[]
}

const TopBanner: FC<ITopBannerProps> = ({ value }) => {

  return (
    <div className="flex flex-col w-full">
      {value.map((item: ITopBannerComponent, idx: number) => (
        <div key={idx}>{Component(item)}</div>
      ))}
    </div>
  )
}

export default TopBanner
