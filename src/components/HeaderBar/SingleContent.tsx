import React, { FC, useEffect, useRef } from 'react'
import { IStringContent } from '.'
import { IOptionalSetting } from 'data/wl-types'

export interface ISingleContentProps {
  value: IStringContent
  options?: IOptionalSetting
}

const SingleContent: FC<ISingleContentProps> = ({ value = null, options }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && value?.content) {
      contentRef.current.innerHTML = value.content + ''
    }
  }, [contentRef, value?.content])

  return (options && options.isShow) || !options ? (
    <div
      className={`sm:h-[40px] h-[50px] flex justify-center items-center`}
      style={{
        background: value?.background || 'black',
        ...(options?.width && options.height
          ? {
              height: `${options.height}px`,
            }
          : {}),
      }}
    >
      <div
        className="sm:h-[40px] h-[50px] sm:w-[1060px] overflow-hidden lg:et-container et-container-sm"
        style={
          options?.width && options.height
            ? {
                height: `${options.height}px`,
              }
            : {}
        }
      >
        <div className="flex justify-center items-center flex-1 px-[8px] sm:whitespace-nowrap whitespace-normal text-center">
          {<div ref={contentRef}>{value?.content}</div>}
        </div>
      </div>
    </div>
  ) : null
}

export default SingleContent
