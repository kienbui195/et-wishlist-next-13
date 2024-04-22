import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import s from './style.module.css'
export interface IDropdownFilterProps {
  onChange?: (val: IDropdownItem1) => void
  value: IDropdownItem1[] | []
  label: string
  icon?: ReactNode
}

export interface IDropdownItem1 {
  id: number
  name: string
  slug: string
}

const DropdownFilter: FC<IDropdownFilterProps> = ({
  value = [],
  label = '',
  onChange,
  icon = <></>
}) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)

  const renderDropdownRow = (
    id: number,
    name: string,
    slug: string,
    isEmpty: boolean = false
  ) => {
    return (
      <div
        onClick={() => {
          if (!isEmpty) {
            setOpen(false)
            onChange && onChange({ id, name, slug})
          }
        }}
        className={`bg-white p-[12px] cursor-pointer select-none max-w-[260px] sm:max-w-[768px] flex items-center text-ellipsis text-[16px] leading-[18.75px] text-[--gray-text] font-[400]  whitespace-nowrap ${
          isEmpty ? '' : 'hover:bg-[--gray-bg-tag]'
        }`}
        key={id}
      >
        {name}
      </div>
    )
  }

  const handleClickOutSideDropdown = (e: globalThis.MouseEvent) => {
    if (e.target instanceof Node && dropdownRef.current && inputRef.current) {
      if (
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutSideDropdown)

    return () =>
      window.removeEventListener('mousedown', handleClickOutSideDropdown)
  }, [dropdownRef, inputRef])

  return (
    <div className="relative">
      <div
        className="outline-none border-[1px] border-[--gray-line] px-[10px] py-[9px] bg-white rounded-[4px] cursor-pointer h-[35px]"
        onClick={() => setOpen(!open)}
        ref={inputRef}
      >
        <div className="flex justify-between items-center space-x-2">
          <div className="font-[400] text-[15px] leading-[15px] text-[--gray-text] select-none font-[RobotoBold]">
            {icon ? icon : label}
          </div>
          <div
            className={`flex justify-center cursor-pointer transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
            onClick={() => setOpen(!open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M6.40003 7.46666C6.20003 7.73333 5.80003 7.73333 5.60002 7.46667L0.600002 0.8C0.352788 0.470382 0.587979 0 1 0H11C11.412 0 11.6472 0.470381 11.4 0.799999L6.40003 7.46666Z"
                fill="#222222"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        ref={dropdownRef}
        className={`w-fit bg-white rounded-[4px] border-[1px] border-[--gray-line] ${
          open
            ? `transform h-[${
                value.length > 0 ? 'fit-content' : '44px'
              }] duration-300 flex`
            : 'transform duration-300 h-0 hidden'
        } 
        flex-col items-stretch max-h-[242px] ${
          value.length * 44 >= 242 ? 'overflow-y-auto' : 'overflow-y-hidden'
        } overflow-x-hidden text-ellipsis absolute z-30 left-0 top-[43px] 
        shadow-[_-12px_17px_24px_0px_#4B4B7140] ${s.scrollBar}`}
      >
        {value.map((item) => renderDropdownRow(item.id, item.name, item.slug))}
        {value.length < 1 && renderDropdownRow(-1, 'Items not found', "", true)}
      </div>
    </div>
  )
}

export default DropdownFilter
