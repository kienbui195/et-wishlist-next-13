import React, { FC, useEffect, useRef, useState } from 'react'
import s from './style.module.css'
import { IDropdownItem } from 'data/wl-types'
import Dropdown from '../../assets/svg/DropdownIcon.svg'
import { generateUID } from 'utils/function'

export interface ISingleSelectProps {
  onChange?: (val: IDropdownItem) => void
  list: IDropdownItem[]
  label: string
  dropdownIcon?: string
  value?: string | number
  className?: string
  placeholder?: string
  required?: boolean
  startIcon?: string
  error?: boolean
  labelError?: string
  hint?: string
  textHidden?: boolean
  onClick?: () => void
  loading?: boolean
  position?: 'bottom-left' | 'bottom-right'
}

const SingleSelect: FC<ISingleSelectProps> = ({
  list = [],
  label = '',
  onChange,
  dropdownIcon,
  value = '',
  className = '',
  placeholder = '',
  required = false,
  startIcon,
  error = false,
  labelError,
  hint = '',
  textHidden = false,
  onClick,
  loading = false,
  position = 'bottom-left'
}) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(value)
  const uid = useRef(generateUID())

  const renderDropdownRow = (
    id: string | number,
    name: string,
    isEmpty: boolean = false
  ) => {
    return (
      <div
        onClick={() => {
          if (!isEmpty) {
            setOpen(false)
            onChange && onChange({ id, name })
            setSelected(name)
          }
        }}
        className={`bg-white p-[12px] cursor-pointer select-none whitespace-nowrap text-[16px] leading-[18.75px] text-[--gray-text] ${
          selected === name ? 'font-[700]' : 'font-[400]'
        }  whitespace-nowrap ${isEmpty ? '' : 'hover:bg-[--gray-bg-tag]'}`}
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

  useEffect(() => {
    setSelected(value)
  }, [value])

  return (
    <div
      className={`flex flex-col items-stretch space-y-3 box-border ${className}`}
    >
      <div className="text-[14px] leading-[14px] flex items-center space-x-1">
        <label htmlFor={uid + ''}>{label}</label>
        {required && <div className="text-[--state-error]">*</div>}
      </div>
      <div className="relative " id={uid + ''}>
        <div
          className={`outline-none border-[1px] border-[--gray-line] px-[10px] py-[9px] whitespace-nowrap bg-white rounded-[4px] cursor-pointer h-[44px] flex items-center ${
            error ? '!border-[--state-error]' : ''
          }`}
          onClick={() => {
            setOpen(!open)
            onClick && onClick()
          }}
          ref={inputRef}
        >
          <div className="flex justify-between items-center space-x-3 w-full">
            {startIcon && (
              <img
                src={startIcon}
                alt=""
                className="cursor-default w-[24px] h-[24px] object-contain"
              />
            )}
            <div
              className={`font-[400] font-[RobotoBold] text-[15px] leading-[15px] text-[--gray-text] select-none flex-1 text-ellipsis overflow-hidden`}
            >
              {!textHidden ? selected || placeholder : ''}
            </div>
            <img
              src={dropdownIcon || Dropdown}
              className={`h-[24px] w-[24px] object-contain transform duration-300 ${
                open ? 'rotate-180' : ''
              }`}
              alt=""
              onClick={() => {
                onClick && onClick()
                setOpen(!open)
              }}
            />
          </div>
        </div>
        {error && labelError && labelError !== '' && (
          <div className="text-[10px] leading-[10px] text-[--state-error] mt-[2px]">
            {labelError}
          </div>
        )}
        {hint && hint !== '' && (
          <div className="text-[10px] text-[--gray] leading-[10px] mt-[2px]">
            {hint}
          </div>
        )}
        <div
          ref={dropdownRef}
          className={`w-fit bg-white rounded-[4px] border-[1px] border-[--gray-line] ${
            open
              ? `transform h-[${
                  list.length > 0 ? 'fit-content' : '44px'
                }] duration-300 flex`
              : 'transform duration-300 h-0 hidden'
          } 
        flex-col items-stretch max-h-[242px] ${
          list.length * 44 >= 242 ? 'overflow-y-auto' : 'overflow-y-hidden'
        } overflow-x-hidden absolute z-30 ${position === 'bottom-left' ? 'left-0' : 'right-0'} top-[${
            58 + (!error && !hint ? 12 : 0 ) + (error ? 12 : 0) + (hint !== '' ? 12 : 0)
          }px] 
        shadow-[_-12px_17px_24px_0px_#4B4B7140] ${s.scrollBar}`}
        >
          {loading
            ? renderDropdownRow('-1', 'Loading...', true)
            : list.length > 0
            ? list.map((item) => (
                <div key={item.id}>{renderDropdownRow(item.id, item.name)}</div>
              ))
            : renderDropdownRow('-1', 'Item not found...', true)}
        </div>
      </div>
    </div>
  )
}

export default SingleSelect