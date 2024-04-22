import * as React from 'react'

interface IIconButtonProps {
  label?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  onClick?: () => void
  className?: string
  whenHiddenLabel?: 'none' | 'sm' | 'md' | 'lg'
}

const IconTextButton: React.FC<IIconButtonProps> = ({
  label = '',
  startIcon,
  endIcon,
  onClick,
  className = '',
  whenHiddenLabel = 'md',
}) => {
  const compRef = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState(0)

  React.useEffect(() => {
    if (compRef.current) {
      const data = compRef.current.getBoundingClientRect().height * 1.8
      setSize(data)
    }
  }, [compRef])

  let classesTooltips = '',
    classesIcon = ''
  switch (whenHiddenLabel) {
    case 'none': 
      classesIcon = 'flex'
      classesTooltips = 'group-hover:hidden hidden'
      break
    case 'sm':
      classesIcon = 'sm:flex hidden'
      classesTooltips = 'group-hover:sm:hidden sm:hidden'
      break
    case 'lg':
      classesIcon = 'lg:flex hidden'
      classesTooltips = 'group-hover:lg:hidden lg:hidden'
      break
    case 'md':
      classesIcon = 'md:flex hidden'
      classesTooltips = 'group-hover:md:hidden md:hidden'
      break
    default:
      classesIcon = 'md:flex hidden'
      classesTooltips = 'group-hover:md:hidden md:hidden'
      break
  }

  return (
    <div
      className={`group relative flex cursor-pointer items-center gap-2 ${className}`}
      onClick={() => onClick && onClick()}
      ref={compRef}
    >
      <div>{startIcon}</div>
      <div className={classesIcon}>{label}</div>
      <div className={classesIcon}>{endIcon}</div>
      <div
        style={{
          top: `-${size !== 0 ? size : 30}px`,
          right: 0,
        }}
        className={`whitespace-nowrap z-[60] hidden group-hover:absolute  group-hover:flex ${classesTooltips}
          group-hover:p-2 group-hover:bg-white
          group-hover:shadow-lg group-hover:rounded-md`}
      >
        {label}
      </div>
    </div>
  )
}

export default IconTextButton
