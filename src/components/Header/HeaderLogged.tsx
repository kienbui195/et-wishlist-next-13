"use client";

import useScrollDirection from "../../hooks/useScrollDirection";
import MainNav2Logged from "./MainNav2Logged";
import React from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { usePathname } from "next/navigation";

export interface HeaderProps {}

export interface ILogo {
  name: string;
  url: string;
}

export interface INavigation {
  title: string;
  slug: string;
  emoji?: string;
  isNew: boolean;
}

export interface IFooter {
  menu: INavigation[];
  submenu: INavigation[];
}

const HeaderLogged: React.FC<HeaderProps> = () => {
  const { isScrollingDown } = useScrollDirection();
  const mediaQueryWidth = useMediaQuery();
  const pathname = usePathname();

  return (
    <div
      className={`${pathname.includes('login') || pathname.includes('register') ? "hidden" : "flex"} top-0 bg-[#F6F6F6] z-40 md:h-[70px] h-[56px]  flex-col items-center justify-center w-full ${
        mediaQueryWidth > 851 ? "transition-y-[70px]" : "transition-y-[56px]"
      } ${mediaQueryWidth > 851 ? "sticky transition-all duration-500" : !isScrollingDown ? "sticky transition-all duration-500" : ""}`}
    >
      <MainNav2Logged />
    </div>
  );
};

export default HeaderLogged;
