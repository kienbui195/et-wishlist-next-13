import React, { FC, useState } from "react";
import { NewestBlack, NewestWhite, TrendingBlack, TrendingWhite } from "../../utils/svgExport";
import Image from "next/image";

interface ICurationTimerFilter {
  onChange?: (val: string) => void;
  isOnlyShowIcon?: boolean;
}

const CurationTimeFilter: FC<ICurationTimerFilter> = ({ onChange, isOnlyShowIcon = false }) => {
  const [selectedItem, setSelectedItem] = useState("most_voted");

  return (
    <div className="flex max-h-[35px] h-[35px] flex-nowrap border-[1px] border-[--gray-text] rounded-l-[6px] rounded-r-[6px]">
      <div
        onClick={() => {
          setSelectedItem("most_voted");
          onChange && onChange("most_voted");
        }}
        className={`flex justify-between items-center py-[6px] px-[10px] cursor-pointer select-none space-x-2 font-[RobotoBold] rounded-l-[4px] ${
          selectedItem === "most_voted"
            ? "transition bg-[--gray-text] text-[--gray-white] duration-100"
            : "transition bg-[--gray-white] text-[--gray-text] duration-100"
        }`}
      >
        <div>
          <Image src={selectedItem === "most_voted" ? TrendingWhite : TrendingBlack} alt="" />
        </div>
        {!isOnlyShowIcon && <div className="capitalize text-[14px] font-[500] leading-[20px]">Most Voted</div>}
      </div>
      <div
        onClick={() => {
          setSelectedItem("newest");
          onChange && onChange("newest");
        }}
        className={`flex justify-between items-center py-[6px] px-[10px] cursor-pointer select-none space-x-2 font-[RobotoBold] rounded-r-[4px] ${
          selectedItem === "newest"
            ? "transition bg-[--gray-text] text-[--gray-white] duration-100"
            : "transition bg-[--gray-white] text-[--gray-text] duration-100"
        }`}
      >
        <div>
          <Image src={selectedItem === "newest" ? NewestWhite : NewestBlack} alt="" />
        </div>
        {!isOnlyShowIcon && <div className="capitalize text-[14px] font-[500] leading-[20px]">Newly Published</div>}
      </div>
    </div>
  );
};

export default CurationTimeFilter;
