import React from 'react'
import { IProductState } from './prdDetailInterface'

interface PrdDescProps {
  product: IProductState
  prdDescRef: any
}

const PrdDesc = ({ product, prdDescRef }: PrdDescProps) => {
  return (
    <div
      className={`mt-0 ${
        product?.attributes?.lastProdOfMonth ||
        product?.attributes?.lastProdOfWeek ||
        product?.attributes?.lastProdOfYear
          ? 'md:mt-3'
          : 'md:mt-[38px]'
      } w-full`}
    >
      <div className="mb-3.5 mt-5 flex items-center md:hidden">
        <h1 className="overflow-hidden text-ellipsis break-words text-2x font-[RobotoBold] leading-tight text-slate-1150 md:whitespace-nowrap md:text-22">
          {product?.attributes.name}
        </h1>
      </div>
      <div
        className="break-words product-title-24 text-[--gray-text] md:mr-1 md:text-2xl"
        title=""
      >
        {product?.attributes.prodDtl?.productPageHeadline}
      </div>
      <div
        className="my-6 break-words text-base font-normal font-[RobotoRegular] leading-normal text-[--gray-text] md:mr-1"
        ref={prdDescRef}
      ></div>
    </div>
  )
}

export default PrdDesc
