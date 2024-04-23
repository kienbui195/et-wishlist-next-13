import SvgIcon from "@/components/SvgIcon";
import { TAward } from "@/data/wl-types";
import React, { FC } from "react";
import WeekAwardIcon from "../../assets/svg/WeekAwardIcon.svg";
import MonthAwardIcon from "../../assets/svg/MonthAwardIcon.svg";
import YearAwardIcon from "../../assets/svg/YearAwardIcon.svg";
import Image from "next/image";

interface AwardItemProps {
  type: TAward;
  href?: string;
  onClick?: () => void;
}

const AwardItem: FC<AwardItemProps> = ({ type = "week", href, onClick }) => {
  return (
    <div className="mt-6 md:mt-3 flex flex-wrap" onClick={() => onClick && onClick()}>
      <div
        className={`md:p-2 flex space-x-1 rounded-[4px] text-white items-center w-fit h-8`}
        style={{
          background: `var(${type === "week" ? "--week-award" : type === "month" ? "--month-award" : "--year-award"})`,
        }}
      >
        {/* <Image src={cupWeek} className="h-[16px] w-[16px]" alt="" /> */}
        <SvgIcon
          className="md:!w-[12px] md:!h-[12px] !p-0 !h-[32px] !w-[32px]"
          icon={<Image src={type === "week" ? WeekAwardIcon : type === "month" ? MonthAwardIcon : YearAwardIcon} alt="" />}
        />
        <div className="text-[12px] leading-[12px] h-[12px] font-[400] text-white tracking-[0.2px] hidden sm:block whitespace-nowrap">
          {/* <div className="text-[12px] leading-[12px] font-[400] tracking-[0.2px] "> */}
          {type === "week" ? "Product of the Week" : type === "month" ? "Product of the Month" : "Product of the Year"}
        </div>
      </div>
    </div>
  );
};

export default AwardItem;
