'use client'

import NavigationItem from "./NavigationItem";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";

interface Props {
  className?: string;
}

const Navigation: FC<Props> = ({ className = "flex" }) => {
  const navItems = useSelector((state: RootState) => state.header.header.navItems);    

  return (
    <ul className={`items-center ${className}`}>
      {navItems.map((item: any) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
};

export default Navigation;
