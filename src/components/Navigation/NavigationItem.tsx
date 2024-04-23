"use client";

import React, { FC, useEffect, useRef } from "react";
import { INavigation } from "../../components/Header/HeaderLogged";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface NavItemType {
  id: string;
  name: string;
  href: string;
  targetBlank?: boolean;
  isNew?: boolean;
  emoji?: string;
  children?: NavItemType[];
  type: "dropdown" | "mega" | "none";
}

export interface NavigationItemProps {
  menuItem: INavigation;
}

const NavigationItem: FC<NavigationItemProps> = ({ menuItem }) => {
  const searchParams = useSearchParams();
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emojiRef.current && menuItem.emoji) {
      emojiRef.current.innerHTML = "&#" + menuItem.emoji + " ";
    }
  }, [emojiRef, menuItem]);

  // ===================== MENU MAIN MENU =====================
  const renderMainItem = (item: INavigation) => {
    const href = window.location.pathname;

    return (
      <div className="h-[34px] flex-shrink-0 flex items-center mr-5 space-x-[10px] box-border ">
        <Link
          className={`${
            href.replace("/", "") === item.slug ||
            href === item.slug ||
            (searchParams.get("_pt") === "Single" && item.slug === ("/" || "")) ||
            (searchParams.get("_pt") === "Merchant" && item.slug === ("/brands" || "brands"))
              ? "border-[--gray-text]"
              : "border-transparent"
          } text-menu-15 border-b-[2px] hover:border-[--gray-text] flex py-[8px]`}
          href={{
            pathname: item.slug || undefined,
          }}
        >
          {item.emoji && <div ref={emojiRef}>{item.emoji}</div>}
          {item.title}
        </Link>
        {item.isNew && (
          <div className="bg-[--brand-secondary3] h-[18px] box-border rounded-[10px] py-[3px] px-[8px] text-[--gray-white] font-[400] text-[10px] leading-[12.1px] flex justify-center items-center">
            New
          </div>
        )}
      </div>
    );
  };

  return <li className="menu-item flex-shrink-0">{renderMainItem(menuItem)}</li>;
};

export default NavigationItem;
