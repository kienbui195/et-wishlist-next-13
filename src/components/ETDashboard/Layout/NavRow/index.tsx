import React from "react";
import Link from "next/link";
import Image from "next/image";
interface NavRowProps {
  label: string;
  href: string;
  icon: string;
  selected: boolean;
}

const NavRow: React.FC<NavRowProps> = ({ label = "", href = "/#", icon = "", selected = false }) => {
  return (
    <Link
      href={href}
      target="_self"
      className={`font-xl flex sm:h-[65px] h-fit py-[10px] sm:py-0 w-full items-center rounded-md font-semibold leading-none tracking-tight text-black ${
        !selected ? "bg-transparent" : "bg-gray-1350"
      }`}
    >
      <div className="flex space-x-[30px] items-center sm:pl-[25px] pl-0 w-full justify-center sm:justify-start">
        <div className="sm:w-[32px] sm:h-[32px] w-[24px] h-[24px]">
          <Image src={icon} alt="" className="sm:w-[32px] sm:h-[32px] w-[24px] h-[24px]" />
        </div>
        <div className="capitalize sm:flex hidden font-[RobotoBold]">{label}</div>
      </div>
    </Link>
  );
};

export default NavRow;
