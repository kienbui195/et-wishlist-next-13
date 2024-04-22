import React, { forwardRef } from 'react'

export interface IInputProps {
  disabled?: boolean
  label: string
  value?: any
  onChange?: (value: any) => void
  startIcon?: string
  endIcon?: string
  endLabel?: string
  endAction?: () => void
  type?: string
  placeholder?: string
  optionAction?: () => void
  endLabelClassName?: string
  autoComplete?: string
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      disabled = false,
      label = '',
      value,
      onChange,
      startIcon,
      endIcon,
      endAction,
      endLabel,
      placeholder,
      optionAction,
      type = 'text',
      endLabelClassName = '',
      autoComplete = 'off',
    },
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-3">
        <div className="whitespace-nowrap R-body-small text-[--gray]">
          {label}
        </div>
        <div className="flex flex-col items-stretch space-y-2">
          <div
            className="h-[36px] rounded-[6px] border-[1px] p-[6px_8px] border-[--gray-line] flex justify-between items-center bg-[--gray-bg-hover] space-x-2"
          >
            {startIcon && startIcon !== '' && (
              <img
                src={startIcon}
                alt=""
                className="h-[24px] w-[24px] object-cover"
              />
            )}
            <input
              ref={ref}
              autoComplete={autoComplete}
              type={type}
              value={value}
              onChange={(e) =>
                !disabled && onChange && onChange(e.target.value)
              }
              className={`h-[34px] bg-[--gray-bg-hover] w-full p-0 R-body-small border-none ${
                disabled ? 'cursor-default caret-transparent' : ''
              }`}
              placeholder={placeholder}
            />

            {endIcon && endIcon !== '' && (
              <img
                src={endIcon}
                alt=""
                className="h-[24px] w-[24px] object-cover cursor-pointer"
                onClick={() => endAction && endAction()}
              />
            )}
          </div>
          <div className='flex justify-end'>
            <div
              className={`items-stretch R-body-small text-[--brand-primary] cursor-pointer ${endLabelClassName}`}
              onClick={() => optionAction && optionAction()}
            >
              {endLabel}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default Input
