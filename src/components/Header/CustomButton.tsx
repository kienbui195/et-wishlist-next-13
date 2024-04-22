import React, {FC, ReactNode} from 'react';

interface ButtonProps {
  label: string | ReactNode,
  onClick?: () => void,
  className?: string
  style?: {}
}

const CustomButton: FC<ButtonProps> = ({
       label = 'Button',
       onClick = () => {},
       className = '',
       style= {}
}) => {
  return (
    <div
      style={style}
      className={`flex justify-center font-[RobotoBold] box-border items-center py-1.5 px-4 text-menu-15 sm:whitespace-nowrap cursor-pointer select-none ${className}`}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {label}
    </div>
  )
}

export default CustomButton