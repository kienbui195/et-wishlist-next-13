import React, { FC, ReactNode } from "react";

interface ISvgIcon {
  icon: ReactNode;
  className?: string;
}

const SvgIcon: FC<ISvgIcon> = ({ icon = <></>, className = "" }) => {
  return <div className={`flex justify-center items-center w-[24px] h-[24px] box-border p-[2px] ${className}`}>{icon}</div>;
};

export default SvgIcon;
