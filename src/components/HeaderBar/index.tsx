"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import Component from "../index";
import { IOptionalSetting } from "../../data/wl-types";
import { usePathname } from "next/navigation";

export interface IImageContent {
  id: number;
  title: string;
  link_on_click?: string;
  background?: string;
  image: {
    data: {
      id: number;
      attributes: {
        name: string;
        url: string;
      };
    } | null;
  };
}

export interface IStringContent {
  id: number;
  background?: string;
  content?: string;
}

export interface IHeaderBarPage {
  id: number;
  __component: string;
  content: IStringContent | IImageContent[];
  options?: IOptionalSetting;
}

const HeaderBar = () => {
  const pathname = usePathname();
  const headerBar = useSelector((state: RootState) => state.headerBar.headerbar);  

  if (pathname.includes("brand-") || pathname.includes('login') || pathname.includes('register')) return null;

  return (
    <div className={`flex flex-col w-full`}>
      {headerBar.map((item: IHeaderBarPage, idx: number) => (
        <div key={idx}>{Component(item)}</div>
      ))}
    </div>
  );
};

export default HeaderBar;
