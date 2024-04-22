import React, { FC, useEffect, useState } from 'react'

export interface IInputProps {
  label: string
  value?: string
  onChange?: (value: any) => void
  required?: boolean
  placeholder?: string
  disabled?: boolean
  error?: boolean
  labelError?: string
  className?: string
  hint?: string
  width?: string
  limitCharacter?: number
  textareaClass?: string
}

const FormTextarea: FC<IInputProps> = ({
  label = '',
  value = '',
  onChange,
  required = false,
  placeholder = '',
  disabled = false,
  error = false,
  labelError,
  className = '',
  hint = '',
  width,
  limitCharacter = 1000,
  textareaClass,
}) => {
  const [inputError, setInputError] = useState({
    isHas: false,
    message: 'The string exceeds the allowed number of characters',
  })

  useEffect(() => {
    if (value.length > limitCharacter) {
      setInputError({ ...inputError, isHas: true })
    } else {
      setInputError({ ...inputError, isHas: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, limitCharacter])

  return (
    <div
      className={`flex flex-col items-stretch space-y-3 box-border ${className}`}
    >
      <div className="text-[14px] leading-[14px] flex items-center space-x-1">
        <label htmlFor={label || placeholder}>{label}</label>
        {required && <div className="text-[--state-error]">*</div>}
      </div>
      <div className="flex flex-col items-stretch space-y-0.5 h-full">
        <div
          className={`${
            inputError.isHas || error ? '!border-[--state-error]' : ''
          } relative border-[1px] border-[--gray-line]  pl-[16px] rounded-[6px] flex items-center justify-between space-x-4 focus-within:border-[1px] focus-within:border-[--brand-primary] ${
            disabled ? 'cursor-not-allowed bg-[--gray-bg-tag]' : 'cursor-text'
          }`}
        >
          <textarea
            id={label || placeholder}
            className={`group/textarea ${textareaClass} min-h-[100px] border-none border-r-[6px] rounded-[6px] flex-1 px-0 placeholder:text-[--gray] ${
              width ? width : ''
            } ${inputError.isHas || error ? '!border-[--state-error]' : ''} ${
              disabled
                ? 'cursor-not-allowed bg-[--gray-bg-tag] text-[--gray]'
                : ''
            }`}
            value={value}
            onChange={(e) => {
              onChange && onChange(e)
              // if ((value.length + 1) <= limitCharacter) {

              // }
            }}
            placeholder={placeholder}
            disabled={disabled}
          />
          <div className={`absolute right-[15px] bottom-[15px] ${inputError.isHas ? 'text-[--state-error]'
            : 'text-[--gray]'}`}>
            {`${value.length} / ${limitCharacter}`}
            </div>
        </div>
        {(inputError.isHas || (error && labelError && labelError !== '')) && (
          <div className="text-[10px] leading-[10px] text-[--state-error]">
            {labelError || inputError.message}
          </div>
        )}
        {hint && hint !== '' && (
          <div className="text-[10px] text-[--gray] leading-[10px]">{hint}</div>
        )}
      </div>
    </div>
  )
}

export default FormTextarea
