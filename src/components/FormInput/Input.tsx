import React, { ChangeEvent, FC, useEffect, useState } from 'react'

export interface IInputProps {
  label: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  disabled?: boolean
  error?: boolean
  labelError?: string
  startIcon?: string
  endIcon?: string
  endAction?: () => void
  extraLabel?: string
  extraAction?: () => void
  className?: string
  hint?: string
  width?: string
  maxLength?: number
  type?: string
  isCheckMaxLength?: boolean
}

const FormInput: FC<IInputProps> = ({
  label,
  value = '',
  onChange,
  required = false,
  placeholder = '',
  disabled = false,
  error = false,
  endAction,
  endIcon,
  extraAction,
  extraLabel,
  labelError = '',
  startIcon,
  className = '',
  hint,
  width,
  maxLength,
  type = 'text',
  isCheckMaxLength = true
}) => {
  const [localError, setLocalError] = useState('')

  useEffect(() => {  
    if (!isCheckMaxLength) return  
    if (typeof value !== 'string') return    
    if (value.length > 255) {
      setLocalError('String too long (less than 255)')
    } else {
      setLocalError('')
    }
  }, [value, isCheckMaxLength])

  return (
    <div
      className={`flex flex-col items-stretch space-y-3 box-border ${className}`}
    >
      <div className="text-[14px] leading-[14px] flex items-center space-x-1">
        <label htmlFor={label}>{label}</label>
        {required && <div className="text-[--state-error]">*</div>}
      </div>
      <div className="flex flex-col items-stretch space-y-0.5">
        <div
          className={`${
            localError !== '' ||  error ? '!border-[--state-error]' : ''
          } h-[44px] border-[1px] border-[--gray-line] focus-within:border-[1px] focus-within:border-[--brand-primary] p-[0_16px] rounded-[6px] flex items-center justify-between space-x-4 ${
            disabled ? 'cursor-not-allowed bg-[--gray-bg-tag]' : 'cursor-text'
          }`}
        >
          {startIcon && (
            <img
              src={startIcon}
              alt="startIcon"
              className="h-[24px] w-[24px] object-cover"
            />
          )}
          <input
            id={label}
            className={`group border-none h-[41px] flex-1 focus:outline-none px-0 placeholder:text-[--gray] ${
              width ? width : ''
            } ${
              disabled
                ? 'cursor-not-allowed bg-[--gray-bg-tag] text-[--gray]'
                : ''
            }`}
            value={value}
            onChange={(e) => onChange && onChange(e)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            type={type}
          />
          {endIcon && (
            <img
              src={endIcon}
              alt="startIcon"
              className="h-[24px] w-[24px] object-cover cursor-pointer"
              onClick={() => endAction && endAction()}
            />
          )}
        </div>
        {(localError !== '' || (error && labelError && labelError !== '')) && (
          <div className="text-[10px] leading-[10px] text-[--state-error]">
            {localError || labelError}
          </div>
        )}
        {hint && hint !== '' && (
          <div className="text-[10px] text-[--gray] leading-[10px]">{hint}</div>
        )}
      </div>
    </div>
  )
}

export default FormInput
