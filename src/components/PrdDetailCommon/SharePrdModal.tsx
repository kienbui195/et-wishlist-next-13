import React from 'react'
import { IProductState, prdDetailState } from './prdDetailInterface'
import CrossIcon from '../../assets/svg/Cross.svg'
import FacebookIcon from '../../assets/svg/Facebook.svg'
import PinterestIcon from '../../assets/svg/Pinterest.svg'
import LinkedinIcon from '../../assets/svg/Linkedin.svg'
import TwitterIcon from '../../assets/svg/Twitter.svg'
import { Link } from 'react-router-dom'
import { useAdminContext } from 'context/adminContext'
import apis from 'apis'

interface SharePrdModalProps {
  setPrdDetail: React.Dispatch<React.SetStateAction<prdDetailState>>
  prdDetail: prdDetailState
  closeSharePrd: any
  product: IProductState
  onShared?: (shares: number) => void
  isDemo?: boolean
}

const SharePrdModal = ({
  setPrdDetail,
  product,
  prdDetail,
  closeSharePrd,
  onShared,
  isDemo = false,
}: SharePrdModalProps) => {
  const { showAlert } = useAdminContext()

  const handleShare = () => {
    apis
      .update('wl-products', product.id, {
        data: {
          shares: product.attributes.shares + 1,
        },
      })
      .then((res) => {
        onShared && onShared(res.data.data.attributes.shares)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="el-overlay" style={{ zIndex: '2009' }} id="sharePrdModal">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="el-id-8149-4"
        aria-describedby="el-id-8149-5"
        className="el-overlay-dialog flex justify-center"
        style={{ display: 'flex' }}
      >
        <div
          className="el-dialog share-product-modal w-full max-w-[700px] mt-[50px] h-[458px]"
          tabIndex={-1}
        >
          <header className="el-dialog__header hidden">
            <button
              aria-label="Close this dialog"
              className="el-dialog__headerbtn"
              type="button"
              onClick={() => {
                document.body.classList.remove('overflow-hidden')
                setPrdDetail({
                  ...prdDetail,
                  showSharePrd: !prdDetail.showSharePrd,
                })
              }}
            >
              <i className="el-icon el-dialog__close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path
                    fill="currentColor"
                    d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                  ></path>
                </svg>
              </i>
            </button>
          </header>
          <div id="el-id-4766-7" className="el-dialog__body">
            <div
              className="flex w-full justify-end pb-4 pr-5 pt-5"
              ref={closeSharePrd.current}
            >
              <img
                src={CrossIcon}
                alt=""
                className="my-px h-3 w-3 cursor-pointer"
                onClick={() => {
                  document.body.classList.remove('overflow-hidden')
                  setPrdDetail({
                    ...prdDetail,
                    showSharePrd: !prdDetail.showSharePrd,
                  })
                }}
              />
            </div>
            <div className="mb-1.5 overflow-hidden text-ellipsis break-normal px-4 text-center text-2xl font-[RobotoBold] font-semibold leading-tight text-[--gray-text]">
              Don’t Keep {product?.attributes.name} a Secret!
            </div>
            <div className="break-normal text-center text-base font-normal leading-5 tracking-wide text-[--text-gray] mx-auto max-w-[382px]">
              Share {product?.attributes.name} with friends or on social media
              to boost its exposure and support its creators.
            </div>
            <div className="relative mb-8 mt-6 flex overflow-hidden rounded-lg border border-gray-1500 bg-white mx-[40px] max-w-full shadow-productShareInfo cardShare">
              <div className="group/items rounded-10 mr-5 flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-10 md:mr-[30px] md:h-[160px] md:w-[160px]">
                <video
                  src={`${process.env.NEXT_PUBLIC_BE_URL}${product?.attributes.hoverVideo?.data?.attributes.url}`}
                  className="h-full w-full object-cover hidden group-hover/items:block"
                  loop
                  playsInline
                  muted
                  autoPlay
                ></video>
                <img
                  src={`${process.env.NEXT_PUBLIC_BE_URL}${product?.attributes.thumbnail?.data?.attributes.url}`}
                  className="h-full max-h-full w-full max-w-full object-cover group-hover/items:hidden"
                  alt=""
                />
              </div>
              <div className="mr-2 mt-[22px] grow md:mt-0 md:flex md:max-w-[390px] md:flex-col md:justify-center md:pb-[9px] md:pt-2.5">
                <div className="flex items-center text-xs font-[RobotoBold] font-bold leading-tight text-[--gray-text]">
                  <h2
                    title={product?.attributes.name}
                    className="product-title line-clamp-1 text-ellipsis"
                  >
                    {product?.attributes.name}
                  </h2>
                </div>
                <h3 className="product-headline mt-1.5  text-lg font-semibold font-[RobotoBold] leading-tight text-[--gray-text] md:mt-2 line-clamp-1 text-ellipsis">
                  {product?.attributes.prodDtl?.productHeadline}
                </h3>
                <div className="mt-[11px] text-sm font-medium leading-[1.4] text-gray-2350 max-md:hidden text-[--gray-text] line-clamp-3 text-ellipsis">
                  {product?.attributes.prodDtl?.productPageHeadline}
                </div>
                <div className=" md:flex-wrap hidden md:flex mt-2.5">
                  {Array.from(product?.attributes?.tags.data || []).map(
                    (_i: any, idx: number) =>
                      !isDemo ? (
                        <Link
                          key={idx}
                          onClick={() => {
                            document.body.classList.remove('overflow-hidden')
                          }}
                          to={`/tag/${_i.attributes.slug}`}
                          className="mb-1 mr-1 flex min-h-[24px] items-center whitespace-normal rounded px-1 py-0.5 text-15 font-semibold leading-4 md:min-h-[20px] md:leading-4 md:text-sm text-[--gray] tagPrd"
                        >
                          {_i.attributes.name}
                        </Link>
                      ) : (
                        <div
                          key={idx}
                          className="mb-1 mr-1 flex min-h-[24px] items-center whitespace-normal rounded px-1 py-0.5 text-15 font-semibold leading-4 md:min-h-[20px] md:leading-4 md:text-sm text-[--gray] tagPrd"
                        >
                          {_i.attributes.name}
                        </div>
                      )
                  )}
                </div>
                <div className="mt-2.5 flex flex-wrap"></div>
              </div>
            </div>
            <div className="flex h-[74px] items-center justify-center shadow-productShareNetwork">
              {!isDemo ? (
                <>
                  <Link
                    className="share-network-facebook mr-2 cursor-pointer"
                    to="/#"
                  >
                    <img src={FacebookIcon} alt="" />
                  </Link>
                  <Link
                    className="share-network-pinterest mr-2 cursor-pointer"
                    to="/#"
                  >
                    <img src={PinterestIcon} alt="" />
                  </Link>
                  <Link
                    className="share-network-linkedin mr-2 cursor-pointer"
                    to="/#"
                  >
                    <img src={LinkedinIcon} alt="" />
                  </Link>
                  <Link
                    className="share-network-twitter mr-2 cursor-pointer"
                    to="/#"
                  >
                    <img src={TwitterIcon} alt="" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="share-network-facebook mr-2 cursor-pointer">
                    <img src={FacebookIcon} alt="" />
                  </div>
                  <div className="share-network-pinterest mr-2 cursor-pointer">
                    <img src={PinterestIcon} alt="" />
                  </div>
                  <div className="share-network-linkedin mr-2 cursor-pointer">
                    <img src={LinkedinIcon} alt="" />
                  </div>
                  <div className="share-network-twitter mr-2 cursor-pointer">
                    <img src={TwitterIcon} alt="" />
                  </div>
                </>
              )}
              <div
                className={`select-none cursor-pointer flex h-9 font-[RobotoBold] items-center rounded-full bg-[--brand-primary] px-4 text-center text-sm font-semibold tracking-wide text-[--gray-white] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]`}
                onClick={
                  !isDemo
                    ? () => {
                        showAlert('success', 'Copied!')
                        navigator.clipboard.writeText(window.location.href)
                        handleShare()
                      }
                    : () => {}
                }
              >
                Copy Link
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharePrdModal
