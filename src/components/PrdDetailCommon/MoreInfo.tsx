import React, { FC, ReactNode, useEffect, useRef } from 'react'
import './ProductDetail.css'
import ArrowDown from '../../assets/svg/Arrow_down.svg'
import Image from 'next/image'

interface IMoreInfoProps {
  title: string
  data?: string
  children?: ReactNode
  isExpanded?: boolean
  onExpand?: () => void
}

const MoreInfo: FC<IMoreInfoProps> = ({
  title = '',
  data,
  children,
  isExpanded = false,
  onExpand,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data && contentRef.current) {
      contentRef.current.innerHTML = data.replaceAll('\n', '<br/>') + ''
    }
  }, [data, contentRef])

  return (
    <div>
      <div
        id={title}
        onClick={() => {
          onExpand && onExpand()
        }}
        className={`flex w-full h-16 cursor-pointer items-center justify-between border-b border-gray-2400 py-5 !font-[RobotoBold] text-[22px] font-bold leading-[30px]  ${
          isExpanded ? 'border-none' : ''
        }`}
      >
        <span className="text-[--gray-text]">{title}</span>
        <div>
          <Image
            src={ArrowDown}
            alt=""
            className={`transition-all ${isExpanded ? ' rotate-180' : ''}`}
          />
        </div>
      </div>
      <div
        className="overflow-hidden border-b border-gray-1550/50 pb-10 transition-all font-[RobotoRegular]"
        style={{
          display: `${isExpanded ? '' : 'none'}`,
        }}
      >
        {data ? (
          <div ref={contentRef} className="editor-block"></div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default MoreInfo
