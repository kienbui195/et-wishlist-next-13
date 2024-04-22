import { ITopBannerText } from 'app/HomePage'
import CustomButton from 'components/Header/CustomButton'
import React, { FC, useEffect, useRef, useState } from 'react'
import ButtonClose from './ButtonClose'
import { IOptionalSetting } from 'data/wl-types'

interface IBannerTextProps {
  value: ITopBannerText
  options?: IOptionalSetting
}

const BannerText: FC<IBannerTextProps> = ({ value = null, options }) => {
  const [open, setOpen] = useState<boolean>(
    options ? options.isShow : true
  )
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && value) {
      contentRef.current.innerHTML = value?.content + ''
    }
  }, [contentRef, value])

  return (
    <div
      className={`w-full h-fit select-none  text-ellipsis ${
        open ? 'mt-[20px]' : ''
      }`}
    >
      {open && (
        <div
          className={`relative whitespace-normal`}
        >
          <div
            className={`flex justify-between whitespace-normal space-x-6 items-center p-8 border`}
            style={{
              background: value?.background || 'white',
              height: options?.height ? `${options.height}px` : 'fit',
              maxWidth: `${options?.width || 1060}px`,
            }}
          >
            <div
              className={`overflow-hidden text-ellipsis w-full`}
              ref={contentRef}
            ></div>
            <CustomButton
              onClick={() => {
                value?.link_on_click &&
                  window.open(value?.link_on_click, '_blank')
              }}
              style={{
                background:
                  value && value.button_background
                    ? value.button_background
                    : 'white',
                color:
                  value && value.button_color ? value.button_color : 'black',
              }}
              className={`border hover:opacity-80`}
              label={value?.button_label || 'Click Here'}
            />
          </div>
          {options?.isAcceptClose && (
            <div className="absolute top-0 right-0">
              <ButtonClose onClick={() => setOpen(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BannerText
