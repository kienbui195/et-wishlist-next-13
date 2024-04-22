import React from 'react'
import TableCate from '../../assets/svg/tabler_category.svg'
import UserCrown from '../../assets/svg/iconoir_user-crown.svg'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { IProductState } from './prdDetailInterface'
import { SquareLogoET } from 'utils/svgExport'

interface VendorDescProps {
  product: IProductState
  callback: () => void
}

const VendorDesc = ({ product, callback }: VendorDescProps) => {
  const matchRoute = window.location.pathname.split('/')[1]
  return (
    <div className="mt-[20px] pb-5 border-b border-gray-2400">
      <div
        className={`w-full ${
          matchRoute === 'brands-products' ? 'sm:max-w-[563px]' : ''
        } md:mt-0`}
      >
        <div className="flex justify-between">
          <div className="flex">
            <img
              src={UserCrown}
              alt=""
              className="mr-4 w-6 shrink-0 self-start"
            />
            <div>
              <span className="font-[RobotoBold]  font-bold leading-[18px] text-[15px] text-[--gray-text]">
                Created by
              </span>
              <div className="editor-block mt-0.5 whitespace-pre-wrap text-[12px] font-semibold leading-[15px] text-[--text-gray]">
                {product?.attributes.ourStory?.founderName}
              </div>
              <div
                className="mt-1 cursor-pointer font-medium text-[12px] leading-5 underline text-[--gray-text]"
                onClick={() => {
                  document.body.classList.add('overflow-hidden')
                  callback && callback()
                }}
              >
                Our Story
              </div>
            </div>
          </div>
          <img
            src={`${process.env.REACT_APP_URL_BE}${product?.attributes.ourStory?.founderImage.data?.attributes.url}`}
            alt=""
            className="h-20 w-20 shrink-0 rounded-full object-cover md:h-16 md:w-16"
          />
        </div>
        <div className="mt-6 flex">
          <img
            src={TableCate}
            alt=""
            className="mr-4 w-6 shrink-0 self-start"
          />
          <div>
            <span className="mb-1.5 font-[RobotoBold]  font-bold leading-[18px] text-[15px] text-[--gray-text]">
              Categories
            </span>
            <div>
              <Link
                to={
                  matchRoute === 'products'
                    ? `${window.location.origin}?category=${product?.attributes?.category?.data?.attributes.slug}`
                    : `${window.location.origin}/brands?category=${product?.attributes?.category?.data?.attributes.slug}`
                }
                className="font-medium text-[12px] leading-5"
              >
                <span className="underline underline-offset-[3px] text-[--gray-text]">
                  {product?.attributes?.category?.data?.attributes.name}
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 flex">
          <img
            src={SquareLogoET}
            alt=""
            className="mr-4 w-6 shrink-0 self-start"
          />
          <div>
            <span className="font-[RobotoBold] font-bold leading-[18px] text-[15px] text-[--gray-text]">
              Launched on ET Wishlist
            </span>
            <div className="mt-1 text-[14px] leading-5 text-[--text-gray] font-normal">
              {product?.attributes.launchDate
                ? moment(product?.attributes.launchDate).format('LL')
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDesc
