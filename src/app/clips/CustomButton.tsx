'use client'

import React, { FC, ReactNode } from "react";

interface IButton {
  label: ReactNode;
  type?: "primary" | "normal";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const CustomButton: FC<IButton> = ({
  label = <>Click me!</>,
  type = "primary",
  className = "",
  disabled = false,
  onClick,
}) => {
  let styleCss = "";
  switch (type) {
    case "normal":
      styleCss = `bg-[--gray-bg-tag] border-[2px] border-[--gray-line] ${
        !disabled ? "hover:!bg-[--gray-bg-hover] active:!bg-white " : ""
      } ${disabled ? "!text-white" : "!text-black"}`;

      break;
    default:
      styleCss = `bg-[--brand-primary] ${
        !disabled ? "hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]" : ""
      }  text-white`;
      break;
  }

  return (
    <div
      onClick={disabled ? () => {} : () => onClick && onClick()}
      className={`cursor-pointer box-border select-none flex items-center h-[56px] justify-center p-[16px_22px] rounded-[6px] text-link-16 ${styleCss} ${className} ${
        disabled ? "!bg-[--gray] !cursor-not-allowed" : ""
      }`}
    >
      {label}
    </div>
  );
};

export default CustomButton;
