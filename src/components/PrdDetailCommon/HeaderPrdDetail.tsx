import React from 'react'
import WorldIcon from '../../assets/svg/world_icon.svg'
import { IProductState, prdDetailState } from './prdDetailInterface'
import IconTextButton from 'components/IconTextButton'
import { ShareV2 } from 'utils/svgExport'

interface HeaderPrdDetailProps {
  product: IProductState
  setPrdDetail: React.Dispatch<React.SetStateAction<prdDetailState>>
  prdDetail: prdDetailState
  isDemo?: boolean
}

const HeaderPrdDetail = ({
  product,
  setPrdDetail,
  prdDetail,
  isDemo = false
}: HeaderPrdDetailProps) => {
  return (
    <div className="hidden md:block md:px-[16px] lg:px-0">
      <div className="mb-[13px] mt-1 inline-block cursor-pointer text-sm font-bold leading-none tracking-tight text-[--gray-text] sm:hidden">
        Back to Feed
      </div>

      <div className="flex justify-between break-normal sm:min-h-[62px]">
        <div className="mr-1 min-w-0 self-start">
          <div className="flex items-center">
            <div className="overflow-hidden text-ellipsis product-title-22 break-words  text-[--gray-text] sm:whitespace-nowrap h-[32px]">
              {product?.attributes.name}
            </div>
          </div>
          <h2 className="mt-[2px] break-words R-body-box text-[--gray-text] sm:truncate">
            {product?.attributes.prodDtl?.productHeadline}
          </h2>
        </div>
        <div className="h-14 grow flex items-center justify-end self-end space-x-3">
          <IconTextButton
            className="text-menu-15 text-[--gray-text] sm:!flex !hidden"
            startIcon={<img src={ShareV2} alt="" width={'24'} height={'24'} />}
            label="Share"
            onClick={() => {
              document.body.classList.add('overflow-hidden')
              setPrdDetail({
                ...prdDetail,
                showSharePrd: !prdDetail.showSharePrd,
              })
            }}
            whenHiddenLabel="sm"
          />
          <IconTextButton
            className="text-menu-15 text-[--gray-text] sm:!flex !hidden"
            startIcon={
              <img src={WorldIcon} alt="" width={'24'} height={'24'} />
            }
            label="Visit Site"
            onClick={() => {
              window.open(
                product?.attributes.prodDtl?.productPageLink
                  ? `${product?.attributes.prodDtl?.productPageLink}`
                  : '/',
                '_blank'
              )
            }}
            whenHiddenLabel="sm"
          />
        </div>
      </div>
    </div>
  )
}

export default HeaderPrdDetail
