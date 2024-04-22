import React from "react";


const ProductSkeleton = () => {
  return (
    <div className="w-full">
      <div className="relative animate-pulse border-[1px] border-[--gray-line] mb-2.5 flex h-[104px] w-full max-w-[764px] rounded-[10px] bg-white p-0 md:h-[160px] md:shadow-[0_4px_4px_0_#0000000D]">
        <div className="bg-[--gray-line] rounded-l-[10px] h-[72px] w-[72px] md:h-[160px] md:w-[160px] mt-4 mr-5 md:mt-0 md:mr-[30px]"></div>
        <div className="ml-0 flex w-1/2 flex-col md:pt-5 space-y-4 max-w-[382px]">
          <div className="h-[16px] max-w-[77px] md:max-w-[126px] bg-[--gray-line] rounded-full"></div>
          <div className="h-[16px] max-w-[236px] md:max-w-[382px] bg-[--gray-line] rounded-full"></div>
          <div className="h-[16px] max-w-[236px] md:max-w-[382px] bg-[--gray-line] rounded-full"></div>
          <div className="h-[16px] max-w-[144px] md:max-w-[233px] bg-[--gray-line] rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton