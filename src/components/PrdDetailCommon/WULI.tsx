import React from 'react'
import { IProductState } from './prdDetailInterface'

interface WULIProps {
  product: IProductState
}

function WULI({ product }: WULIProps) {
  return (
    <div className="pb-5 md:pb-3 pt-5 border-y border-gray-2400">
      <div className="pb-5 text-[22px] font-bold !font-[RobotoBold] leading-[30px] text-[--gray-text] md: md:text-[20px] tracking-[0.48px]">
        Product Advantages
      </div>
      <ul className="list-disc overflow-hidden pl-5">
        {Object.keys(product?.attributes.wyli || {}).map((_i, idx) => {
          return (
            _i !== 'id' && (product?.attributes.wyli as any)[_i] &&
            (product?.attributes.wyli as any)[_i] !== '' && (
              <li
                key={idx}
                className="mt-3 text-4 font-normal leading-6 text-slate-1150 text-[--gray-text] !font-[RobotoRegular]"
              >
                {(product?.attributes.wyli as any)[_i]}
              </li>
            )
          )
        })}
      </ul>
    </div>
  )
}

export default WULI
