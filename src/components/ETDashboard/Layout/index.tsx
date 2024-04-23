import { ReactElement } from 'react'
import '../index.css'
import NavRow from './NavRow'
import Dashboard from 'assets/svg/DashboardIcon.svg'
import DashboardClip from 'assets/svg/DashboardClip.svg'
import DashboardProduct from 'assets/svg/DashboardProduct.svg'
import DashboardSetting from 'assets/svg/DashboardSetting.svg'
import DashboardSupport from 'assets/svg/DashboardSupport.svg'
import MiniDashboard from 'assets/svg/radix-icons_dashboard.svg'
import MiniClip from 'assets/svg/fluent_video-clip-multiple-24-filled.svg'
import MiniProduct from 'assets/svg/fluent-mdl2_product.svg'
import MiniSetting from 'assets/svg/ep_setting.svg'
import MiniSp from 'assets/svg/heroicons-outline_support.svg'
import useMediaQuery from 'hooks/useMediaQuery'
import  Link  from 'next/link'
import s from './style.module.css'
import { ETLogo } from 'utils/svgExport'

const NAV_MENU = [
  {
    label: 'dashboard',
    href: '/brand-dashboard',
    icon: Dashboard,
    mini: MiniDashboard,
  },
  {
    label: 'clips',
    href: '/brand-clips',
    icon: DashboardClip,
    mini: MiniClip,
  },
  {
    label: 'my products',
    href: '/brand-products',
    icon: DashboardProduct,
    mini: MiniProduct,
  },
  {
    label: 'settings',
    href: '/brand-settings',
    icon: DashboardSetting,
    mini: MiniSetting,
  },
  {
    label: 'support',
    href: '/#',
    icon: DashboardSupport,
    mini: MiniSp,
  },
]

const DashboardLayout = ({ children }: { children?: ReactElement }) => {
  const pathname = window.location.pathname
  const width = useMediaQuery()

  return (
    <div className={`flex ${s['brand-layout']} h-full`}>
      <div className="h-auto sm:w-[240px] w-[70px] shrink-0 bg-gray-2150 sm:px-[25px] sm:pt-[49px] p-[10px_13px_0] shadow-brandSidebar flex flex-col justify-between items-stretch">
        <div>
          <div className="sm:ml-[22px] sm:flex hidden text-10 font-bold leading-none tracking-wide text-gray-1150">
            ADMIN CONSOLE
          </div>
          <nav className="mt-2 flex flex-col sm:space-y-0 space-y-[30px]">
            {NAV_MENU.map((item, index) => {
              const { label, href, icon, mini } = item

              return (
                <NavRow
                  key={index}
                  label={label}
                  href={href}
                  icon={width <= 768 ? mini : icon}
                  selected={pathname.includes(href)}
                />
              )
            })}
          </nav>
        </div>
        <div className="mb-[27px] sm:ml-[15px] ml-0 flex items-center text-xs font-medium leading-none text-gray-950">
          <span className={width <= 768 ? 'hidden' : 'block'}>Powered by</span>
          <Link to="/#" className="sm:ml-2 ml-0">
            <Image src={ETLogo} className="w-[48px]" alt="" />
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}

export default DashboardLayout
