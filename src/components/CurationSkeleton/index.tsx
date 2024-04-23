import useMediaQuery from '../../hooks/useMediaQuery'
import * as React from 'react'
import { MoreIcon, SingleDot } from '../../utils/svgExport'
import Image from 'next/image'

const CurationSkeleton = () => {
  const innerWidth = useMediaQuery()

  return (
    <div className=" border-[--gray-line] sm:border border-b hover:cursor-pointer min-[852px]:!w-[684px] !w-full">
      {/* <div className="gfl-product-wrap grid-width product-608486 bound border-[--gray-line] rounded-[10px] sm:border border-b hover:cursor-pointer"> */}
      <div className={`gfl-product${innerWidth <= 768 ? '-sm' : ''}`}>
        <div className="p-[8px_0_8px_16px]">
          <div className="flex justify-between h-[50px]">
            <div className="flex space-x-[14px] h-full">
              <div className="h-[45px] w-[45px] rounded-full object-cover animate-pulse bg-[--gray-line]"></div>
              <div className="h-full items-center flex">
                <div className="flex h-4 space-x-1">
                  <div className="h-[12px] w-[100px] font-semibold capitalize line-clamp-2 text-ellipsis animate-pulse bg-[--gray-line]"></div>
                  <div className="p-[4px] flex items-center justify-center text-[--gray]">
                    <Image src={SingleDot} alt="" />
                  </div>
                  <div className="h-[12px] w-[12px] text-[--gray] animate-pulse bg-[--gray-line]"></div>
                </div>
              </div>
            </div>
            <div className="h-full flex items-center cursor-default">
              <div className="cursor-pointer">
                <Image
                  src={MoreIcon}
                  width="28"
                  height="28"
                  className="h-[28px] w-[28px]"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="gfl-product-thumb h-[520px] w-full animate-pulse bg-[--gray-line] !rounded-none"></div>
        <div>
          <section className="p-[8px_16px_0] overflow-hidden">
            <div className="flex justify-between items-center my-1 h-[40px]">
              <div className="flex space-x-2 items-start h-full">
                <div className="flex space-x-2 cursor-pointer w-8">
                  <div className="w-[30px] h-[30px] flex justify-center animate-pulse bg-[--gray-line] rounded-full"></div>
                  <div className="w-3 h-6 flex m-auto">
                    <div className="w-3 h-4 m-auto animate-pulse bg-[--gray-line]"></div>
                  </div>
                </div>
                <div className="flex space-x-2 cursor-pointer w-8">
                  <div className="w-[30px] h-[30px] flex justify-center animate-pulse rounded-full bg-[--gray-line]"></div>
                  <div className="w-3 h-6 flex m-auto">
                    <div className="w-3 h-4 m-auto animate-pulse bg-[--gray-line]"></div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 items-start h-full ">
                <div className="flex space-x-2 items-stretch">
                  <div className="text-end mr-[10px]">
                    <div className="h-4 text-[--gray-text] animate-pulse">
                      <div className=" h-6 flex m-auto">
                        <div className="w-10 h-4 m-auto animate-pulse bg-[--gray-line]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 h-[30px] justify-end items-center">
                    <div className="w-[30px] h-[30px] flex justify-center animate-pulse rounded-full bg-[--gray-line]"></div>
                    <div className="w-[30px] h-[30px] flex justify-center animate-pulse rounded-full bg-[--gray-line]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="md:p-[16px] p-[10px_16px_16px] overflow-hidden">
            <div>
              <div className="flex justify-center flex-col cursor-pointer">
                <div className="h-[12px] w-14 mb-[6px] animate-pulse bg-[--gray-line]"></div>
                <div className="mb-[14px]">
                  <div className="product-headline text-title-18 h-[18px] w-64 text-[--gray-text] line-clamp-1 overflow-x-hidden text-ellipsis animate-pulse bg-[--gray-line]"></div>
                </div>
              </div>
              <div className="h-[22px] w-48 text-[#717171] line-clamp-2 text-ellipsis cursor-pointer animate-pulse bg-[--gray-line]">
                {/* <div className="max-md:hidden R-home-content text-[#717171] line-clamp-2 text-ellipsis cursor-pointer"> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CurationSkeleton