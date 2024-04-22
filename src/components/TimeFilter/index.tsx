import React, { FC, ReactNode, useEffect, useState } from 'react'
import { list } from './helper'

export interface ITimeFilter {
  onChange?: (val: string) => void
}

export enum TIME_VALUE {
  'day' = 0,
  'week' = 1,
  'month' = 2,
  'year' = 3,
}

export interface IButtonFilter {
  name: TIME_VALUE
  slug: TIME_VALUE
  icon: ReactNode
  selected: boolean
}

const TimeFilter: FC<ITimeFilter> = ({ onChange }) => {
  const [selectedItem, setSelectedItem] = useState('day')

  const renderButton = (
    name: string,
    slug: string,
    icon: ReactNode = <></>,
    selected: boolean = false,
    idx: number
  ) => {
    return (
      <div
        onClick={() => {
          
          setSelectedItem(slug)
          onChange && onChange(slug)
        }}
        key={slug}
        className={`flex justify-between items-center py-[6px] px-[10px] cursor-pointer select-none space-x-2 font-[RobotoBold] icon ${idx === 0 ? 'rounded-l-[4px]' : idx === list.length - 1 ? 'rounded-r-[4px]' : ''} ${
          selected
            ? 'transition bg-[--gray-text] text-[--gray-white] duration-100'
            : 'transition bg-[--gray-white] text-[--gray-text] duration-100'
        }`}
      >
        <div>{icon}</div>
        <div className="capitalize text-[14px] font-[500] leading-[20px]">{name}</div>
      </div>
    )
  }

  useEffect(() => {
    const data = document.querySelectorAll('.icon')

    Array.from(data).map((item: any) =>
      Array.from(item.classList).includes('bg-[--gray-text]')
        ? item
            .querySelector('svg > path')
            .classList.replace('fill-[--gray-text]', 'fill-[--gray-white]')
        : item
            .querySelector('svg > path')
            .classList.replace('fill-[--gray-white]', 'fill-[--gray-text]')
    )
  }, [selectedItem])

  return (
    <div className="flex flex-wrap border-[2px] border-[--gray-text] rounded-l-[6px] rounded-r-[6px]">
      {list.map((item: any, idx: number) =>
        renderButton(
          item.name,
          item.slug,
          item.icon,
          selectedItem === item.slug,
          idx
        )
      )}
    </div>
  )
}

export default TimeFilter