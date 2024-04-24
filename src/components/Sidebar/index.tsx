import React, {FC} from "react";
import Component from '../index'
import {IImage, IOptionalSetting} from "@/data/wl-types";

export interface ISidebarComponent {
  id: number,
  __component: string,
  content: ISidebarBanner[] | {
    data: ISidebarTag[]
  }
}

export interface ISidebarTag {
  id: number,
  attributes: {
    name: string,
    slug: string,
    desc: string,
    votes: number,
    views: number,
    shares: number,
  }
}

export interface ISidebarBanner {
  id: number,
  link_on_click: string,
  image: {
    data: IImage | null
  }
}

interface ISidebarProps {
  value: ISidebarComponent[]
  options?: IOptionalSetting
}

const Sidebar: FC<ISidebarProps> = ({
    value
}) => {
  return (
    <div className="flex flex-col">
      {value.map((item: ISidebarComponent, idx: number) => (
        <div key={idx}>{Component(item)}</div>
      ))}
    </div>
  )
}

export default Sidebar;