import SvgIcon from 'components/SvgIcon'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface SearchComponentProps {
  onOpen?: (isOpen: boolean) => void
  onEnter?: (value: string) => void
  className?: string
}

const SearchComponent: FC<SearchComponentProps> = ({
  onOpen,
  className = '',
  onEnter,
}) => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const location = useLocation()

  const handleEnter = (e: any) => {
    if (e.keyCode === 13) {
      onEnter && onEnter(value)
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      if (open) {
        inputRef.current.focus()
      }
    }

    onOpen && onOpen(open)
  }, [inputRef, onOpen, open])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('keypress', handleEnter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => inputRef.current?.removeEventListener('keypress', handleEnter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputRef.current])  

  useEffect(() => {
    if (
      location.pathname.includes('/product-search') ||
      location.pathname.includes('/product-search/')
    ) {
      const [, , keyWord] = location.pathname.split('/')
      setValue(decodeURIComponent(keyWord))
    }
  }, [location.pathname])
  
  return (
    <div
      className="flex justify-end w-full"
      onBlur={() => {
        setOpen(false)
      }}
      onClick={() => setOpen(true)}
    >
      <div
        className={`flex items-center ${
          open ? 'bg-[#FFFFFF] px-[10px]' : ''
        } h-[44px] rounded-[24px] justify-end box-border space-x-[10px] w-full ${className}`}
      >
        <SvgIcon
          className="cursor-pointer"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
            >
              <path
                d="M17.7477 17.0473L13.4664 12.9639C13.4119 12.9125 13.3527 12.866 13.2895 12.8251C14.4662 11.3887 15.047 9.57022 14.9159 7.73259C14.7848 5.89495 13.9516 4.17335 12.5824 2.91138C11.2133 1.64942 9.40898 0.939914 7.52961 0.924478C5.65024 0.909042 3.83406 1.58881 2.44354 2.82811C1.05302 4.06741 0.19044 5.77508 0.0279687 7.6103C-0.134503 9.44552 0.415081 11.2733 1.56703 12.7288C2.71898 14.1844 4.38856 15.1606 6.24255 15.4627C8.09654 15.7648 9.99856 15.3705 11.569 14.3585C11.6275 14.4666 11.7028 14.565 11.7923 14.6503L16.0736 18.7336C16.1861 18.8433 16.3197 18.93 16.4667 18.9887C16.6137 19.0475 16.7711 19.077 16.9298 19.0757C17.0885 19.0744 17.2454 19.0423 17.3913 18.9812C17.5373 18.9201 17.6695 18.8312 17.7801 18.7197C17.8908 18.6082 17.9778 18.4763 18.0362 18.3317C18.0945 18.187 18.123 18.0324 18.12 17.8769C18.1169 17.7213 18.0825 17.5679 18.0186 17.4255C17.9547 17.2831 17.8626 17.1546 17.7477 17.0473ZM1.27474 8.23275C1.27474 7.03204 1.63801 5.8583 2.3186 4.85996C2.99918 3.86161 3.96653 3.08349 5.09831 2.624C6.23008 2.16451 7.47546 2.04429 8.67695 2.27853C9.87844 2.51278 10.9821 3.09097 11.8483 3.94C12.7145 4.78902 13.3044 5.87075 13.5434 7.04838C13.7824 8.22602 13.6598 9.44666 13.191 10.556C12.7222 11.6653 11.9283 12.6134 10.9097 13.2805C9.89113 13.9476 8.69362 14.3036 7.46859 14.3036C5.82646 14.3017 4.25214 13.6615 3.09098 12.5234C1.92983 11.3853 1.27665 9.84227 1.27474 8.23275Z"
                fill="#424242"
              />
            </svg>
          }
        />
        <div
          className={`items-center cursor-text w-full ${
            open ? 'flex' : 'hidden'
          }`}
        >
          <input
            className={`outline-none border-none max-w-[363px] w-full`}
            ref={inputRef}
            placeholder="Search more product and more"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchComponent
