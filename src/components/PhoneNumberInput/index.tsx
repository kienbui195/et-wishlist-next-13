import { IDropdownItem } from '@/data/wl-types'
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import Dropdown from '../../assets/svg/DropdownIcon.svg'
import s from './style.module.css'
import Image from 'next/image'

interface IPhoneNumberInputProps {
  label: string
  value?: any
  onChangeDropdown?: (value: IDropdownItem) => void
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  error?: boolean
  labelError?: string
  className?: string
  hint?: string
  list: IDropdownItem[]
  valueSelected?: IDropdownItem
  dropdownIcon?: string
  prefixValue?: string | number
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
}

const PhoneNumberInput: FC<IPhoneNumberInputProps> = ({
  label,
  value,
  onChangeDropdown,
  onChangeInput,
  required = false,
  placeholder = 'Country Code',
  error = false,
  labelError,
  className = '',
  hint,
  list = [],
  valueSelected = {
    id: '',
    name: '',
  },
  dropdownIcon,
  prefixValue = '',
  onBlur,
}) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(
    valueSelected ? valueSelected.name : ''
  )

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
            onChangeDropdown && onChangeDropdown({ id, name })
            setSelected(name)
          }
        }}
        className={`bg-white p-[12px] cursor-pointer select-none text-[16px] leading-[18.75px] text-[--gray-text] ${
          valueSelected.name === name ? 'font-[700]' : 'font-[400]'
        }  whitespace-nowrap ${isEmpty ? '' : 'hover:bg-[--gray-bg-tag]'}`}
        key={id + name}
      >
        {name}
      </div>
    )
  }

  const handleClickOutSideDropdown = (e: any) => {
    if (dropdownRef.current && inputRef.current) {
      const dropdownBox = dropdownRef.current.getBoundingClientRect()
      const inputBox = inputRef.current.getBoundingClientRect()
      if (
        e.x < dropdownBox.x ||
        e.x >
          (inputBox.width < dropdownBox.width
            ? dropdownBox.x + dropdownBox.width
            : inputBox.x + inputBox.width) ||
        e.y < inputBox.y ||
        e.y > dropdownBox.y + dropdownBox.height
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
    if (valueSelected) {
      setSelected(valueSelected.name)
    }
  }, [valueSelected])

  return (
    <div
      className={`flex flex-col items-stretch space-y-3 box-border ${className}`}
    >
      <div className="text-[14px] leading-[14px] flex items-center space-x-1">
        <label htmlFor={label}>{label}</label>
        {required && <div className="text-[--state-error]">*</div>}
      </div>
      <div className={`flex flex-col space-y-0.5 `}>
        <div
          className={`flex justify-between items-center border-[1px] border-[--gray-line] rounded-[4px] ${
            error ? '!border-[--state-error]' : ''
          }`}
        >
          <div className="relative">
            <div
              className={`outline-none px-[10px] py-[9px] bg-white cursor-pointer h-[44px] flex items-center`}
              onClick={() => setOpen(!open)}
              ref={inputRef}
            >
              <div className="flex justify-between items-center space-x-3 w-full">
                <div className="font-[400] text-[15px] leading-[15px] text-[--gray-text] select-none flex-1">
                  {selected || placeholder}
                </div>
                <Image
                  src={dropdownIcon || Dropdown}
                  className={`h-[24px] w-[24px] object-contain transform duration-300 ${
                    open ? 'rotate-180' : ''
                  }`}
                  alt=""
                  onClick={() => setOpen(!open)}
                />
              </div>
            </div>
            <div
              ref={dropdownRef}
              className={`w-fit bg-white rounded-[4px] border-[1px] border-[--gray-line] flex-col items-stretch max-h-[242px] overflow-x-hidden absolute z-30 left-0 top-[50px] shadow-[_-12px_17px_24px_0px_#4B4B7140] ${
                open
                  ? `transform h-[${
                      list.length > 0 ? 'fit-content' : '44px'
                    }] duration-300 flex`
                  : 'transform duration-300 h-0 hidden'
              } 
         ${list.length * 44 >= 242 ? 'overflow-y-auto' : 'overflow-y-hidden'}  
         ${s.scrollBar}`}
            >
              {list.map((item) => renderDropdownRow(item.id, item.name))}
              {list.length < 1 &&
                renderDropdownRow('-1', 'Items not found', true)}
            </div>
          </div>
          <div
            className={`flex flex-col items-stretch space-y-3 box-border flex-1`}
          >
            <div className="flex flex-col items-stretch space-y-0.5">
              <div
                className={`${
                  error ? '!border-[--state-error]' : ''
                } h-[44px] p-[0_8px] flex items-center space-x-2 whitespace-nowrap`}
              >
                {prefixValue !== '' && <div>{prefixValue}</div>}
                <input
                  id={label}
                  className={`group border-none h-[42px] px-0 focus:outline-none w-full`}
                  value={value}
                  onChange={(e) => onChangeInput && onChangeInput(e)}
                  onBlur={(e) => {
                    onBlur && onBlur(e)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {error && labelError && labelError !== '' && (
          <div className="text-[10px] leading-[10px] text-[--state-error]">
            {labelError}
          </div>
        )}
        {hint && hint !== '' && (
          <div className="text-[10px] text-[--gray2] leading-[10px]">
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}

export default PhoneNumberInput
