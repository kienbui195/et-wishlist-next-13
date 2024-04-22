import React, { FC } from 'react'

interface IDashboardButtonProps {
  label: string
  onClick?: () => void
  type?: 'primary' | 'white'
  className?: string
  disabled?: boolean
  buttonType?: 'button' | 'submit' | 'reset' | undefined
}

const DashboardButton: FC<IDashboardButtonProps> = ({
  label,
  onClick,
  type = 'primary',
  className = '',
  disabled = false,
  buttonType = 'button'
}) => {
  let cssButton = ''

  switch (type) {
    case 'white':
      cssButton = 'bg-white text-black'
      break
    default:
      cssButton = 'bg-[--brand-primary] text-white'
  }

  return (
    <button
      disabled={disabled}
      className={`ml-2.5 h-7 whitespace-nowrap rounded shadow-brandButton px-2 text-13 ${disabled ? 'cursor-not-allowed !bg-[--gray]' : ''} font-medium ${cssButton} ${className}`}
      onClick={() => {
        onClick && onClick()
      }}
      type={buttonType}
    >
      {label}
    </button>
  )
}

export default DashboardButton
