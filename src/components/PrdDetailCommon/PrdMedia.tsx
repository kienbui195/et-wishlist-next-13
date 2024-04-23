"use client";

import React from "react";
import { IProductState, prdDetailState } from "./prdDetailInterface";
import ClipIcon from "../../assets/svg/ClipIcon.svg";
import PhotoIcon from "../../assets/svg/photoDetailIcon.svg";
import ProductCurCarousel from "@/components/ProductCurations/ProductCurCarousel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { DefaultThumbnail2 } from "@/utils/svgExport";

interface PrdMediaProps {
  product: IProductState;
  setPrdDetail: React.Dispatch<React.SetStateAction<prdDetailState>>;
  prdDetail: prdDetailState;
}

const PrdMedia = ({ product, setPrdDetail, prdDetail }: PrdMediaProps) => {
  const pathname = usePathname();
  const hasVideo =
    product?.attributes?.shortClips.data &&
    product?.attributes?.shortClips.data[0]?.attributes?.clip?.data?.attributes?.url;
  return (
    <div className="relative flex overflow-hidden md:ml-0 md:mr-0 w-full md:rounded-10">
      <div className="hidden md:flex">
        {hasVideo ? (
          <div className="relative mr-[5px] hidden h-[493px] w-[262px] shrink-0 items-center bg-black md:flex sm:rounded-l-[10px] rounded-l-none">
            <video
              loop
              playsInline
              controls
              autoPlay
              muted
              className="absolute inset-0 h-full w-full object-contain sm:rounded-l-[10px] rounded-l-none"
              src={
                product?.attributes?.shortClips.data &&
                `${process.env.NEXT_PUBLIC_BE_URL}${product.attributes.shortClips.data[0]?.attributes?.clip?.data?.attributes?.url}`
              }
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div
            className="relative mr-[5px] hidden h-[493px] w-[262px] shrink-0 items-center bg-black md:flex sm:rounded-l-[10px] rounded-l-none"
            onClick={() => {
              document.body.classList.add("overflow-hidden");
              setPrdDetail({ ...prdDetail, showGallery: true });
            }}
          >
            <Image
              src={
                product?.attributes.images?.data
                  ? `${process.env.NEXT_PUBLIC_BE_URL}${product?.attributes.images?.data[0]?.attributes?.url}`
                  : DefaultThumbnail2
              }
              alt={""}
              width={0}
              height={0}
              sizes="100vw"
              className="h-full w-full object-cover cursor-pointer"
            />
          </div>
        )}
        <div className="w-full cursor-pointer grid max-h-[493px] grid-cols-[1 fr_244px] grid-rows-2 gap-[5px] galeryImageGrid">
          {Array.from(product?.attributes.images.data || []).map(
            (_i, idx) =>
              (hasVideo ? -1 : 0) < idx &&
              idx < (hasVideo ? 3 : 4) && (
                <div
                  key={idx}
                  className="relative col-span-1 hidden aspect-auto overflow-hidden first:row-span-2 first:block first:h-[485px] md:block md:first:aspect-auto md:first:h-auto"
                  onClick={() => {
                    document.body.classList.add("overflow-hidden");
                    setPrdDetail({ ...prdDetail, showGallery: true });
                  }}
                >
                  <Image
                    src={_i ? `${process.env.NEXT_PUBLIC_BE_URL}${_i.attributes.url}` : DefaultThumbnail2}
                    alt={""}
                    className="h-full w-full object-cover cursor-pointer"
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                </div>
              )
          )}
        </div>
        {hasVideo && (
          <Link href={`/product-clips/${pathname.replace("/", "")}`}>
            <div className="absolute bottom-5 left-5 flex justify-center space-x-2 items-center rounded-[8px] p-[4px_10px] w-fit h-[32px]  text-white md:left-3 md:top-3 bg-[--gray-text] text-menu-15">
              <div className="w-[24px] h-[24px] flex justify-center items-center">
                <Image src={ClipIcon} alt="" />
              </div>
              <div>Clips</div>
            </div>
          </Link>
        )}
        <div
          className="absolute bottom-5 right-5 flex justify-center space-x-2 h-[32px] w-fit cursor-pointer items-center rounded-[8px] bg-white p-[4px_8px] text-menu-15 text-[--gray-text] md:right-3 md:top-3 photoIcon"
          onClick={() => {
            document.body.classList.add("overflow-hidden");
            setPrdDetail({ ...prdDetail, showGallery: true });
          }}
        >
          <Image src={PhotoIcon} width="14" height="14" alt="" />
          Photos
        </div>
      </div>
      <div
        className="flex md:hidden h-auto w-full shrink-0"
        onClick={() => {
          document.body.classList.add("overflow-hidden");
          setPrdDetail({ ...prdDetail, showGallery: true });
        }}
      >
        <ProductCurCarousel
          images={
            product.attributes.images.data
              ? product.attributes.images.data.reduce((acc: any[], item: any) => {
                  acc.push({
                    attributes: {
                      url: item.attributes?.url,
                    },
                  });
                  return acc;
                }, [])
              : []
          }
          isAcceptClose={false}
          isAutoPlay={false}
          maxWidth="max-w-[100%]"
          imageWidth="w-full"
          maxHeight="max-h-[307px]"
          imageHeight="h-auto"
        />
      </div>
    </div>
  );
};

export default PrdMedia;
