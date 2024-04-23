import React, { FC } from "react";
import s from "./style.module.css";
import Image from "next/image";
import { DefaultThumbnail2 } from "@/utils/svgExport";

export interface IProductCardSmallProps {
  name: string;
  headline: string;
  pageHeadline: string;
  thumbnail: string;
  hoverVideo: string;
}

const ProductCardMini: FC<IProductCardSmallProps> = ({
  name = "Product Name",
  headline = "Product Headline",
  pageHeadline = "Product Page Headline",
  thumbnail = "",
  hoverVideo = "",
}) => {
  return (
    <div
      className={`relative mb-8 mt-6 flex overflow-hidden rounded-lg border border-gray-1500 bg-white mx-[40px] max-w-full ${s.prodCardShadow}`}
    >
      <div className="group/items rounded-10 mr-5 flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-10 md:mr-[30px] md:h-[160px] md:w-[160px]">
        {hoverVideo !== "" && (
          <video
            src={hoverVideo !== "" ? `${process.env.REACT_APP_URL_BE}${hoverVideo}` : ""}
            className="h-full w-full object-cover hidden group-hover/items:block rounded-lg"
            loop
            playsInline
            muted
            autoPlay
          ></video>
        )}
        <Image
          src={thumbnail !== "" ? `${process.env.REACT_APP_URL_BE}${thumbnail}` : DefaultThumbnail2}
          className={`h-full max-h-full w-full max-w-full object-cover rounded-lg ${
            hoverVideo !== "" ? "group-hover/items:hidden" : ""
          }`}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
        />
      </div>
      <div className="mr-2 mt-[22px] grow md:mt-0 md:flex md:max-w-[390px] md:flex-col md:justify-center md:pb-[9px] md:pt-2.5">
        <div className="flex items-center text-xs font-bold leading-tight text-[--gray-text]">
          <h2 className="product-title">{name}</h2>
        </div>
        <h3 className="product-headline mt-1.5  text-lg font-semibold leading-tight text-[--gray-text] md:mt-2">
          {headline}
        </h3>
        <div className="mt-[11px] text-sm font-medium leading-[1.4] text-gray-2350 max-md:hidden text-[--gray-text]">
          {pageHeadline}
        </div>
        <div className="mt-2.5 flex flex-wrap"></div>
      </div>
    </div>
  );
};

export default ProductCardMini;
