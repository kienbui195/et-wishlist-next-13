import CustomButton from "@/components/Header/CustomButton";
import { CTAButton as ICTAButon } from "@/components/PrdDetailCommon/prdDetailInterface";
import React, { useEffect, useRef, useState } from "react";
import chroma from "chroma-js";
import Image from "next/image";

const CTAButton = ({
  ctaButton,
  className,
  isPreview = false,
}: {
  ctaButton: ICTAButon;
  className?: string;
  isPreview?: boolean;
}) => {
  const handleBuyNow = (link: string) => {
    window.open(link, "_blank");
  };
  const getContrastTextColor = (color: string) => {
    return chroma.contrast(color, "black") >= 4.5 ? "black" : "white";
  };
  useEffect(() => {
    if (ctaButton?.bgColor && labelBtn.current) {
      labelBtn.current.style.color = getContrastTextColor(ctaButton.bgColor);
    }
  }, [ctaButton]);

  const labelBtn = useRef<HTMLHeadingElement>(null);

  if (!ctaButton) return null;
  return (
    <CustomButton
      className={`text-white text-[18px] !px-10 !py-4 leading-none rounded-lg bg-[--brand-primary] ${className}`}
      style={
        ctaButton.bgColor
          ? {
              backgroundColor: ctaButton.bgColor,
            }
          : {}
      }
      label={
        <div className="flex justify-between items-center space-x-2">
          <div className="flex flex-nowrap" ref={labelBtn}>
            {ctaButton.label}
          </div>
          {ctaButton.icon?.data && (
            <div className="w-6 h-6">
              <Image
                alt=""
                className="w-6 h-6"
                src={`${process.env.NEXT_PUBLIC_BE_URL}${ctaButton.icon?.data.attributes.url}`}
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
          )}
        </div>
      }
      onClick={() => {
        if (isPreview) return;
        handleBuyNow(ctaButton.link);
      }}
    />
  );
};

export default CTAButton;
