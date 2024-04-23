import React, {FC, ReactNode} from 'react'
import CloseButton from '../../assets/svg/CloseButton.svg'

interface LoginProps {
  open: boolean
  onClose?: () => void
  children: ReactNode
}

const ETModal: FC<LoginProps> = ({open = false, onClose, children}) => {

  return (
    <div
      className={`w-full h-full fixed z-[99] top-0 left-0 flex items-center justify-center transition-transform duration-200 ${
        open
          ? 'flex scale-100 bg-[--over-lay]'
          : 'hidden scale-0 bg-transparent'
      }`}
    >
      <div className="w-full max-w-[362px] relative bg-white">
        <Image src={CloseButton} alt="" onClick={() => onClose && onClose()} className={"cursor-pointer absolute top-2 right-2"}/>
        {children}
      </div>
    </div>
  )
}

export default ETModal