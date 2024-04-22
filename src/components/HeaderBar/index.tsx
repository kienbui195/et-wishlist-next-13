
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import Component from '../index'
import { useLocation } from 'react-router-dom'
import { IOptionalSetting } from 'data/wl-types'

export interface IImageContent {
  id: number
  title: string
  link_on_click?: string
  background?: string
  image: {
    data: {
      id: number
      attributes: {
        name: string
        url: string
      }
    } | null
  }
}

export interface IStringContent {
  id: number
  background?: string
  content?: string
}

export interface IHeaderBarPage {
  id: number
  __component: string
  content: IStringContent | IImageContent[]
  options?: IOptionalSetting
}

const HeaderBar = () => {
  const headerBar = useSelector((state: RootState) => state.headerBar.headerbar)
  const location = useLocation()

  if (location.pathname.includes('brand-')) return null
  
  return <div className={`flex flex-col w-full`}>
    {headerBar.map((item: IHeaderBarPage, idx: number) => (
      <div key={idx} >
         {Component(item)}  
      </div>
    ))}
  </div>
}

export default HeaderBar