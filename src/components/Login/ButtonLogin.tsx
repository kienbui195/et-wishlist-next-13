import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import { Loader } from "@/utils/svgExport";

interface ButtonLoginProps {
  icon?: StaticImageData;
  onClick?: () => void;
  className?: string;
  label: string;
  labelColor: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  loading?: boolean;
}

const ButtonLogin: FC<ButtonLoginProps> = ({ icon, onClick, className, label = "", labelColor, disabled = false, type = "submit", loading = false }) => {
  return (
    <button
      className={`flex justify-center items-center h-[40px] w-full border-[1px] rounded-[6px] p-[8px_0] cursor-pointer ${
        disabled || loading ? "opacity-[30%] hover:opacity-[30%]" : "hover:opacity-95"
      }  ${className}`}
      onClick={() => onClick && onClick()}
      type={type}
    >
      <div className="h-[20px] flex justify-center items-center space-x-1">
        <div className="w-[20px] h-[20px] flex justify-center items-center">
          {loading && <Image src={Loader} alt="" className="animate-spin w-[15px] h-[15px]" />}
        </div>
        {label && label !== "" ? (
          <div className={`R-body-box flex justify-center items-center whitespace-nowrap ${labelColor}`}>{label}</div>
        ) : (
          <Image className="w-6 h-6" src={icon ?? ""} alt="" />
        )}
        <div className="w-[20px] h-[20px]"></div>
      </div>
    </button>
  );
};

export default ButtonLogin;
