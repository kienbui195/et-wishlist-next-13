import React, { FC } from "react";
import { IProductState } from "../list";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DefaultThumbnail2 } from "@/utils/svgExport";

interface ProductItemProps {
  value: IProductState;
}

const ProductItem: FC<ProductItemProps> = ({ value }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex h-10 items-center justify-between">
        <div className="flex">
          <div className="mr-5 h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={value.thumbnail?.data?.attributes?.url ? `${process.env.NEXT_PUBLIC_BE_URL}${value.thumbnail?.data?.attributes?.url}` : DefaultThumbnail2}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div title="tesst 1" className="product-title mb-1 text-sm font-medium leading-tight text-black">
              {value.name}
            </div>
            <div className="product-headline text-xs font-normal text-gray-1150">{value.sub_headline}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="h-5 whitespace-nowrap rounded bg-gray-2150 px-1.5 py-0.5 text-sm font-semibold text-gray-1150">
            Launch Date <span className="font-normal">{value.launch_date}</span>
          </div>
          <div className="text-grey-2650 flex h-7 items-center whitespace-nowrap rounded bg-white px-2 text-13 font-medium shadow-brandButton ml-[38px]">
            {value.page_approved ? "Page Approved" : value.page_submitted ? "Page Submitted" : "Page Not Submitted"}
            <div
              className="ml-2 block h-[7px] w-[7px] rounded-full"
              style={{
                background: value.page_approved ? "#00C71E" : value.page_submitted ? "#0078FF" : "#8E9DAE",
              }}
            ></div>
          </div>
          <button
            className="text-grey-2650 ml-2.5 h-7 whitespace-nowrap rounded bg-white px-2 text-13 font-medium shadow-brandButton"
            onClick={() => {
              router.push(`/brand-products/edit/${value.id}`);
            }}
          >
            Edit Page
          </button>
        </div>
      </div>
      <div className="el-divider el-divider--horizontal mb-[25px] mt-5 w-full border-gray-1350 border-t-[1px]" role="separator"></div>
    </>
  );
};

export default ProductItem;
