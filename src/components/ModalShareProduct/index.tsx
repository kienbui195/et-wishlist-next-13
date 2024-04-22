import { useAdminContext } from 'context/adminContext'
import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FacebookIcon,
  PinterestIcon,
  LinkedinIcon,
  TwitterIcon,
  CloseButton,
} from 'utils/svgExport'
import { IProductState } from 'components/PrdDetailCommon/prdDetailInterface'
import { ShowPrdGalleryModal } from 'components/ProductCurations/ProductCurationsCard'

interface IModalSharePrdProps {
  prdDetail: IProductState | null
  onClose: () => void
  handleCopyLink: () => void
  setShowPrdGallery: React.Dispatch<React.SetStateAction<ShowPrdGalleryModal>>
}

const ModalShareProduct = ({
  prdDetail,
  onClose,
  handleCopyLink,
  setShowPrdGallery,
}: IModalSharePrdProps) => {
  const closeSharePrd = useRef()
  const { showAlert } = useAdminContext()
  const navigate = useNavigate()

  return (
    <div>
      <div
        className="flex w-full justify-end pb-4 pr-5 pt-5"
        ref={closeSharePrd.current}
      >
        <img
          src={CloseButton}
          alt=""
          className="my-px cursor-pointer"
          onClick={() => onClose()}
        />
      </div>
      <div className="mb-1.5 overflow-hidden text-ellipsis break-normal px-4 text-center text-2xl font-semibold leading-tight text-[--gray-text] font-[RobotoBold]">
        Don’t Keep {prdDetail?.attributes.name} a Secret!
      </div>
      <div className="break-normal text-center text-base font-normal leading-5 tracking-wide text-[--text-gray] mx-auto max-w-[382px]">
        Share {prdDetail?.attributes.name} with friends or on social media to
        boost its exposure and support its creators.
      </div>
      <div className="relative mb-8 mt-6 flex overflow-hidden rounded-lg border border-gray-1500 bg-white mx-[40px] max-w-full shadow-productShareInfo cardShare">
        <div className="group/items rounded-10 mr-5 flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-10 md:mr-[30px] md:h-[160px] md:w-[160px]">
          <video
            src={`${process.env.REACT_APP_URL_BE}${prdDetail?.attributes.hoverVideo?.data?.attributes.url}`}
            className="h-full w-full object-cover hidden group-hover/items:block"
            loop
            playsInline
            muted
            autoPlay
          ></video>
          <img
            src={`${process.env.REACT_APP_URL_BE}${prdDetail?.attributes.thumbnail?.data?.attributes.url}`}
            className="h-full max-h-full w-full max-w-full object-cover group-hover/items:hidden"
            alt=""
          />
        </div>
        <div className="mr-2 mt-[22px] grow md:mt-0 md:flex md:max-w-[390px] md:flex-col md:justify-center md:pb-[9px] md:pt-2.5">
          <div
            className="flex items-center text-xs font-bold leading-tight text-[--gray-text] cursor-pointer"
            onClick={() => {
              document.body.classList.remove('overflow-hidden')
              navigate(`/products/${prdDetail?.attributes?.slug}`)
            }}
          >
            <h2
              title={prdDetail?.attributes.name}
              className="product-title line-clamp-1 text-ellipsis font-[RobotoBold]"
            >
              {prdDetail?.attributes.name}
            </h2>
          </div>
          <h3
            className="product-headline mt-1.5 font-[RobotoBold]  text-lg font-semibold leading-tight cursor-pointer text-[--gray-text] md:mt-2 line-clamp-1 text-ellipsis"
            onClick={() => {
              document.body.classList.remove('overflow-hidden')
              setShowPrdGallery((preState) => ({
                ...preState,
                openGallery: false,
              }))
              navigate(`/products/${prdDetail?.attributes?.slug}`)
              onClose()
            }}
          >
            {prdDetail?.attributes.prodDtl?.productHeadline}
          </h3>
          <div
            className="mt-[11px] text-sm font-medium leading-[1.4] text-gray-2350 max-md:hidden cursor-pointer text-[--gray-text] line-clamp-3 text-ellipsis"
            onClick={() => {
              document.body.classList.remove('overflow-hidden')
              setShowPrdGallery((preState) => ({
                ...preState,
                openGallery: false,
              }))
              navigate(`/products/${prdDetail?.attributes?.slug}`)
              onClose()
            }}
          >
            {prdDetail?.attributes.prodDtl?.productPageHeadline}
          </div>
          <div className=" md:flex-wrap hidden md:flex mt-2.5">
            {Array.from(prdDetail?.attributes?.tags.data || []).map(
              (_i: any, idx: number) => {
                return idx < 3 ? (
                  <Link
                    key={idx}
                    to={`/tag/${_i.attributes.slug}?_pt=${prdDetail?.attributes.productType}`}
                    className="mb-1 mr-1 flex min-h-[24px] items-center whitespace-normal rounded px-1 py-0.5 text-15 font-semibold leading-4 md:min-h-[20px] md:leading-4 md:text-sm text-[--gray] tagPrd"
                    onClick={() => {
                      document.body.classList.remove('overflow-hidden')
                      setShowPrdGallery((preState) => ({
                        ...preState,
                        openGallery: false,
                      }))
                      onClose()
                    }}
                  >
                    {_i.attributes.name}
                  </Link>
                ) : null
              }
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap"></div>
        </div>
      </div>
      <div className="flex h-[74px] items-center justify-center shadow-productShareNetwork">
        <a className="share-network-facebook mr-2 cursor-pointer" href="/#">
          <img src={FacebookIcon} alt="" />
        </a>
        <a className="share-network-pinterest mr-2 cursor-pointer" href="/#">
          <img src={PinterestIcon} alt="" />
        </a>
        <a className="share-network-linkedin mr-2 cursor-pointer" href="/#">
          <img src={LinkedinIcon} alt="" />
        </a>
        <a className="share-network-twitter mr-2 cursor-pointer" href="/#">
          <img src={TwitterIcon} alt="" />
        </a>
        <div
          className={`select-none cursor-pointer font-[RobotoBold] flex h-9 items-center rounded-full bg-[--brand-primary] px-4 text-center text-sm font-semibold tracking-wide text-[--gray-white] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]`}
          onClick={() => {
            showAlert('success', 'Copied!')
            navigator.clipboard.writeText(
              `${window.location.href}products/${prdDetail?.attributes?.slug}`
            )
            handleCopyLink()
          }}
        >
          Copy Link
        </div>
      </div>
    </div>
  )
}

export default ModalShareProduct
