'use client'

import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { IImage, IProductTags, IVideo, TAward, TCurrency } from "@/data/wl-types";
import { useDispatch, useSelector } from "react-redux";
import { useAlertContext } from "@/context/alertContext";
import { setOpenModalLogin } from "@/lib/features/authenticate/loginSlice";
import apis from "@/apis";
import {
  MoreIcon,
  SingleDot,
  CurationVoted,
  CurationShare,
  CurationBookmarked,
  CurationBookmark,
  CurationCart,
  DefaultAvatar,
  DefaultThumbnail,
  HotDeal,
} from "@/utils/svgExport";
import { convertNumbThousand, formatDataNumber, formatInstagramDate, getCurrencyCode } from "@/utils/function";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { IProductState } from "@/components/PrdDetailCommon/prdDetailInterface";
import moment from "moment";
import useUserLogin from "@/hooks/useUserLogin";
import useMediaQuery from "@/hooks/useMediaQuery";
import Modal from "@/components/CustomModal";
import ModalShareProduct from "@/components/ModalShareProduct";
import IconButtonVoteAnimation from "@/components/IconButtonVoteAnimation";
import { WidthHeightRatio } from "@/components/MediaCard/Card1";
import { Card1, Card2, Card3, Card4 } from "@/components/MediaCard";
import PrdGalleryHomePage from "./PrdGalleryHomePage";
import Image from "next/image";
interface IProductCurrationsCardProps {
  id: number;
  name: string;
  slug: string;
  headline: string;
  subHeadline: string;
  thumbnail?: IImage;
  hoverVideo?: IVideo;
  discountType?: number;
  launcherDate?: Date;
  launchType?: number;
  launchStatus?: number;
  tags?: IProductTags[];
  voted?: boolean;
  bookmarked?: boolean;
  award?: TAward[];
  dateVoted?: string;
  countVoted?: number;
  navigate?: () => void;
  spPrdId?: number;
  prdImages:
    | {
        attributes: {
          url: string;
          height: number;
          width: number;
        };
      }[]
    | [];
  prdVideo?:
    | {
        attributes: {
          url: string;
          height: number;
          width: number;
        };
      }[]
    | [];
  shopVariantPrice?: number;
  shopVariantCurrency?: TCurrency;
  prdDetail: IProductState;
  votedId?: number;
  callback?: (productId: number, type: "bookmark" | "vote", voteId?: number) => void;
}

type PrdMedia =
  | {
      attributes: {
        url: string;
        height: number;
        width: number;
      };
    }[]
  | [];

export interface ShowPrdGalleryModal {
  openGallery: boolean;
  linkMedia: null | string;
}

export const DEFAULT_MEDIA_WIDTH = 678;

const ProductCurationsCard = ({
  id,
  name,
  headline = "",
  slug = "",
  subHeadline = "",
  thumbnail,
  hoverVideo,
  tags = [],
  voted = false,
  bookmarked,
  award = [],
  dateVoted,
  countVoted = 0,
  spPrdId,
  navigate,
  prdImages,
  prdVideo,
  shopVariantPrice,
  shopVariantCurrency,
  prdDetail,
  votedId = 0,
  callback,
}: IProductCurrationsCardProps) => {
  // const wlMemberType = useSelector(
  //   (state: RootState) => state.user.user
  // ).wl_member_type
  // const salePer =
  //   wlMemberType && wlMemberType.id === ENUM_WL_SYS_CONFIG.SUBSCRIBED_ET_MEMBER
  //     ? 40
  //     : 20
  const pricePrd = shopVariantPrice ? shopVariantPrice : 0;
  // const priceSale = Math.ceil(pricePrd - pricePrd * (salePer / 100))
  // const [discount, setDiscount] = useState('')
  const { showAlert } = useAlertContext();
  const [showSharedModal, setShowShareModal] = useState(false);
  const [showPrdGallery, setShowPrdGallery] = useState<ShowPrdGalleryModal>({
    openGallery: false,
    linkMedia: null,
  });
  const [disabled, setDisabled] = useState(false);
  const playVideoRef = useRef<HTMLVideoElement>(null);
  const [bookmark, setBookmark] = useState({
    isBookmarked: bookmarked,
    loading: false,
  });
  const [voteInfo, setVoteInfo] = useState({
    isVoted: voted,
    count: countVoted,
    votedId: votedId,
  });
  const { token } = useUserLogin();
  const innerWidth = useMediaQuery();
  const [shareNumber, setShareNumber] = useState<number | null>(prdDetail.attributes.shares);
  const companyDefault = useSelector((state: RootState) => state.companyDefault);
  const prdMedia = useRef<PrdMedia>(prdVideo && prdVideo.length > 0 ? [prdVideo[0], ...prdImages] : prdImages);
  const isWidthLargerThanHeight = useRef<WidthHeightRatio>("larger");
  const dispatch = useDispatch();
  const [cardHeight, setCardHeight] = useState(DEFAULT_MEDIA_WIDTH);
  const isHaveVideo = useRef<boolean>(prdVideo ? prdVideo.length > 0 : false);

  useEffect(() => {
    setBookmark((preState) => {
      return {
        ...preState,
        isBookmarked: bookmarked,
      };
    });
  }, [bookmarked]);

  const handleBookmark = (productId: number, type: "bookmark" | "unbookmark") => {
    if (!token) {
      dispatch(setOpenModalLogin(true));
      showAlert("warning", "This features require logging in to use");
    } else {
      setBookmark((preState) => ({ ...preState, loading: true }));
      apis
        .post(`wl-bookmarks/${type}`, {
          data: {
            product_id: productId,
          },
        })
        .then((res) => {
          setBookmark((preState) => ({
            ...preState,
            isBookmarked: type === "bookmark",
            loading: false,
          }));
          showAlert("success", `${type.charAt(0).toUpperCase() + type.slice(1)} successfully`);
          callback && callback(productId, "bookmark");
        })
        .catch((err) => {
          console.log(err);
          setBookmark((preState) => ({ ...preState, loading: false }));
          showAlert("error", `${type.charAt(0).toUpperCase() + type.slice(1)} Failed! Please try again later!`);
        });
    }
  };

  const handleVoteAction = () => {
    if (!token) {
      dispatch(setOpenModalLogin(true));
      showAlert("warning", "This features require logging in to use");
    } else {
      setDisabled(true);
      apis
        .upVoteCuration(id)
        // .upVote(id)
        .then((res) => {
          showAlert("success", "Vote successfully");
          setVoteInfo({
            isVoted: true,
            count: res.data?.votes || 0,
            votedId: res.data?.wlVote.id,
          });
          setDisabled(false);
        })
        .catch((err) => {
          console.log(err);
          setDisabled(false);
          showAlert("error", "Something went wrong! Please try again later");
        });
    }
  };

  const renderVoteAction = () => {
    if (voteInfo.isVoted) {
      return (
        <div
          className="h-[30px] flex justify-center w-[30px]"
          // onClick={!disabled ? handleUnVote : () => {}}
        >
          <Image src={CurationVoted} alt="" />
        </div>
      );
    } else {
      return (
        <div className="group h-[30px] w-[30px]">
          <IconButtonVoteAnimation mt="mt-[2px]" mode="btw" onClick={!disabled ? handleVoteAction : () => {}} />
        </div>
      );
    }
  };

  const handleCopyLink = () => {
    apis
      .update("wl-curations", prdDetail.id, {
        // .update('wl-products', prdDetail.id, {
        data: {
          shares: shareNumber ? shareNumber + 1 : 1,
        },
      })
      .then((res) => {
        const { data } = res.data;
        const { shares } = data.attributes;
        setShareNumber(shares);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setVoteInfo({ ...voteInfo, isVoted: voted, votedId: votedId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voted, votedId, token]);

  useEffect(() => {
    const video = playVideoRef.current;
    const calculateSizeVideoWrapper = () => {
      const windowHeight = window.innerHeight;
      let ImageHeight = windowHeight - 326;

      if (windowHeight <= 768) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 0.75;
      }
      if (windowHeight > 768 && windowHeight <= 900) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 0.9;
      }
      if (windowHeight > 900 && windowHeight <= 1060) {
        ImageHeight = DEFAULT_MEDIA_WIDTH;
      }
      if (windowHeight < 1230 && windowHeight > 1060) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 1.1;
      }
      if (windowHeight >= 1230) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 1.2;
      }

      setCardHeight(innerWidth < 631 ? innerWidth : ImageHeight);
    };

    video?.addEventListener("loadedmetadata", calculateSizeVideoWrapper);
    window.addEventListener("resize", calculateSizeVideoWrapper);
    calculateSizeVideoWrapper();

    return () => {
      video?.removeEventListener("loadedmetadata", calculateSizeVideoWrapper);
      window.removeEventListener("resize", calculateSizeVideoWrapper);
    };
  }, [innerWidth]);

  useEffect(() => {
    if (prdMedia.current.length > 0) {
      const width = prdMedia.current[0].attributes.width;
      const height = prdMedia.current[0].attributes.height;
      if (width > height) {
        isWidthLargerThanHeight["current"] = "larger";
      }
      if (width < height) {
        isWidthLargerThanHeight["current"] = "smaller";
      }
      if (width === height) {
        isWidthLargerThanHeight["current"] = "equal";
      }
    }
  }, []);

  return (
    <div className="gfl-product-wrap grid-width product-608486 bound border-[--gray-line] min-[852px]:border border-b hover:cursor-pointer">
      {/* <div className="gfl-product-wrap grid-width product-608486 bound border-[--gray-line] rounded-[10px] sm:border border-b hover:cursor-pointer"> */}
      <div className={`gfl-product${innerWidth <= 768 ? "-sm" : ""}`}>
        <div className="p-[8px_0_8px_16px]">
          <div className="flex justify-between h-[50px]">
            <div className="flex space-x-[14px] h-full">
              <div className="w-[50px] h-[50px]">
                <Image
                  src={
                    prdDetail.companyInfo?.logo
                      ? `${process.env.NEXT_PUBLIC_BE_URL}${prdDetail.companyInfo.logo.url}`
                      : companyDefault.logo
                      ? `${process.env.NEXT_PUBLIC_BE_URL}${companyDefault.logo?.data?.attributes.url}`
                      : DefaultAvatar
                  }
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-contain"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
              <div className="h-full items-center flex">
                <div className="flex h-4 space-x-1">
                  <div className="text-[12px] font-semibold capitalize line-clamp-2 text-ellipsis font-[RobotoBold]">
                    {prdDetail.companyInfo ? prdDetail.companyInfo?.name : companyDefault.name}
                  </div>
                  <div className="p-[4px] flex items-center justify-center text-[--gray]">
                    <Image src={SingleDot} alt="" />
                  </div>
                  <div className="text-[13px] text-[--gray]">
                    {prdDetail.attributes.launchDate
                      ? formatInstagramDate(moment(prdDetail.attributes.launchDate).toDate())
                      : formatInstagramDate(moment(prdDetail.attributes.publishedAt).toDate())}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full flex items-center">
              <div className="cursor-pointer">
                <Image src={MoreIcon} width="28" height="28" className="h-[28px] w-[28px]" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white">
          {prdMedia.current.length > 0 ? (
            prdMedia.current.length < 3 ? (
              <Card1
                showProdGallery={showPrdGallery.openGallery}
                media={prdMedia.current}
                cardHeight={
                  prdMedia.current.length === 1
                    ? prdMedia.current[0].attributes.height < cardHeight
                      ? prdMedia.current[0].attributes.height
                      : cardHeight
                    : cardHeight
                }
                isHaveVideo={isHaveVideo.current}
                setShowPrdGallery={setShowPrdGallery}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
              />
            ) : prdMedia.current.length < 4 ? (
              <Card2
                showProdGallery={showPrdGallery.openGallery}
                media={prdMedia.current}
                cardHeight={cardHeight}
                isHaveVideo={isHaveVideo.current}
                setShowPrdGallery={setShowPrdGallery}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
              />
            ) : prdMedia.current.length < 5 ? (
              <Card3
                showProdGallery={showPrdGallery.openGallery}
                media={prdMedia.current}
                cardHeight={cardHeight}
                isHaveVideo={isHaveVideo.current}
                setShowPrdGallery={setShowPrdGallery}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
              />
            ) : (
              <Card4
                showProdGallery={showPrdGallery.openGallery}
                media={prdMedia.current}
                cardHeight={cardHeight}
                isHaveVideo={isHaveVideo.current}
                setShowPrdGallery={setShowPrdGallery}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
              />
            )
          ) : (
            <Image alt="" src={DefaultThumbnail} width={0} height={0} className="w-full h-auto" sizes="100vw" />
          )}
        </div>

        <div>
          <section className="p-[8px_16px_0] overflow-hidden cursor-default">
            <div className="flex justify-between items-center my-1 h-[40px]">
              <div className="flex space-x-2 items-start h-full">
                <div className="flex space-x-2 cursor-pointer">
                  <div className="w-8">{renderVoteAction()}</div>
                  <div className="text-link-16 w-full h-6 flex justify-center items-center m-auto cursor-text">
                    {voteInfo.count ? convertNumbThousand(voteInfo.count) : 0}
                  </div>
                </div>
                <div className="flex space-x-2 cursor-pointer ">
                  <div className="w-8">
                    <div className="flex justify-center items-center w-8 h-8">
                      <Image
                        onClick={() => {
                          setShowShareModal(true);
                        }}
                        src={CurationShare}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="text-link-16 w-full h-6 flex justify-center m-auto cursor-text">{convertNumbThousand(shareNumber)}</div>
                </div>
              </div>
              <div className="flex space-x-3 items-start h-full ">
                <div className="flex space-x-2 items-stretch">
                  <Image alt="" src={HotDeal} className="w-5 h-5 m-auto" />
                  <div className="text-end flex m-auto">
                    <div className="text-link-16 text-[--gray-text]">
                      {shopVariantCurrency ? getCurrencyCode(shopVariantCurrency) : "$"}
                      {formatDataNumber(Number(pricePrd), 2)}
                    </div>
                  </div>
                  <div className="flex space-x-2 h-[30px] justify-end items-center">
                    <Link href={slug} rel="noreferrer">
                      <div className="w-[30px] h-[30px]">
                        <Image src={CurationCart} alt="" className="" />
                      </div>
                    </Link>
                    <div
                      className="cursor-pointer h-[30px] w-[30px]"
                      onClick={
                        !bookmark.loading
                          ? !bookmark.isBookmarked
                            ? () => handleBookmark(prdDetail.id, "bookmark")
                            : () => handleBookmark(prdDetail.id, "unbookmark")
                          : () => {}
                      }
                    >
                      <Image src={bookmark.isBookmarked ? CurationBookmarked : CurationBookmark} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="px-[16px] pb-2 overflow-hidden">
            <Link href={slug}>
              <div className="flex justify-center flex-col cursor-pointer">
                <div className="R-title-explan mb-1">{name}</div>
                <div className="mb-2">
                  <div className="product-headline text-title-18 text-[--gray-text] line-clamp-1 overflow-x-hidden text-ellipsis">{headline}</div>
                </div>
              </div>
              <div className="R-home-content text-[#717171] line-clamp-2 text-ellipsis cursor-pointer">
                {/* <div className="max-md:hidden R-home-content text-[#717171] line-clamp-2 text-ellipsis cursor-pointer"> */}
                {subHeadline}
              </div>
            </Link>

            <div className="flex-wrap flex space-x-[6px] mt-2">
              {/* <div className="flex-wrap hidden sm:flex md:space-x-[6px] mt-2.5"> */}
              {tags.map((_i, idx) => {
                return idx < 3 ? (
                  <Link key={idx} data-v-42920170="" href={`/tag${_i.slug}`}>
                    <div
                      data-v-42920170=""
                      className="flex min-h-[20px] items-center whitespace-normal px-[4px] py-[1px] md:min-h-[18px] bg-[--gray-bg-hover] text-[--gray] hover:bg-[--gray-bg-tag] R-14-light leading-5 rounded"
                      // className="sm:flex hidden min-h-[20px] items-center whitespace-normal px-[4px] py-[1px] md:min-h-[18px] bg-[--gray-bg-hover] text-[--gray] hover:bg-[--gray-bg-tag] R-14-light leading-5 rounded"
                    >
                      {_i.name}
                    </div>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
      {showSharedModal && (
        <div className="absolute w-full h-full z-[2010] top-0 left-0">
          <Modal onClose={() => setShowShareModal(false)} classNameContainer="w-full max-w-[700px] mt-[50px] h-fit !p-0 !rounded-[8px] !bg-white" className="!p-0">
            <ModalShareProduct
              prdDetail={prdDetail}
              onClose={() => setShowShareModal(false)}
              handleCopyLink={handleCopyLink}
              setShowPrdGallery={setShowPrdGallery}
            />
          </Modal>
        </div>
      )}
      {showPrdGallery.openGallery && (
        <PrdGalleryHomePage
          media={prdMedia.current}
          isHaveVideo={isHaveVideo.current}
          setShowPrdGallery={setShowPrdGallery}
          showPrdGallery={showPrdGallery}
          handleBookmark={handleBookmark}
          bookmark={bookmark}
          slug={slug}
          prdDetail={prdDetail}
          shopVariantCurrency={shopVariantCurrency}
          voteInfo={voteInfo}
          handleVoteAction={handleVoteAction}
          setShowShareModal={setShowShareModal}
          showSharedModal={showSharedModal}
          pricePrd={pricePrd}
          shareNumber={shareNumber}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default ProductCurationsCard;
