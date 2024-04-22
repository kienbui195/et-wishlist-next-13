import React from 'react'
import { CustomLink } from '../../data/types'
import { INavigation } from 'components/Header/HeaderLogged'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { Link } from 'react-router-dom'

export interface WidgetFooterMenu {
  id: string
  title: string
  menus: CustomLink[]
}

export interface IFooterProps {
  menu?: INavigation[]
  submenu?: INavigation[]
}

const Footer: React.FC = () => {
  const menu = useSelector((state: RootState) => state.footer.footer.menu)
  const submenu = useSelector((state: RootState) => state.footer.footer.submenu)

  return (
    <div className="flex flex-col space-y-4 box-border mb-5">
      <div className="flex justify-start space-x-2 box-border">
        {menu?.map((item: INavigation, idx: number) => (
          <Link key={idx} className="R-home-content text-[--gray-text] hover:underline hover:decoration-solid" to={item.slug}>
            {item.title}
          </Link>
        ))}
      </div>
      <div className='flex items-center space-x-5 box-border'>
          <span className='text-[10px] font-[400] leading-[14px] text-[#000000] flex items-center'>© 2024 Wishlist</span>
          <div className="flex space-x-2 items-center">
            {submenu?.map((item: INavigation, idx: number) => (
               <Link key={idx} className="text-[10px] text-[--gray] font-[400] leading-[14px] hover:decoration-solid hover:underline" to={item.slug}>
               {item.title}
             </Link>
            ))}
          </div>
      </div>
    </div>
  )
}

export default Footer