'use client'

import { useAlertContext } from "@/context/alertContext";
import { TCurrency, TDiscountCodeStatus } from "./prdDetailInterface";
import * as React from "react";
import { formatDataNumber, getCurrencyCode } from "@/utils/function";
import { CloseButton, CurationBookmark, CurationBookmarked, Info, UpVote, VotedIcon } from "@/utils/svgExport";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { ENUM_WL_SYS_CONFIG } from "@/utils/constants";
import Image from "next/image";
import CustomButton from "@/app/clips/CustomButton";

interface IVoteLandMobileProps {
  discountCode?: string;
  prodPageLink?: string;
  prodLink?: string;
  isVoted?: boolean;
  discountStatus?: TDiscountCodeStatus | string;
  prodPrice: number;
  prodCurrency: TCurrency;
  isBookmark?: boolean;
  votes: number;
  handleVote?: () => void;
  handleBookmark?: () => void;
  handleUnBookmarked?: () => void;
  disabled?: boolean;
  prodName?: string;
  className?: string;
  isHaveBookmarked?: boolean;
  isDemo?: boolean;
  priceSale?: number;
}

const VoteLandMobile: React.FC<IVoteLandMobileProps> = ({
  discountCode = "",
  prodLink = "/",
  isVoted = false,
  prodPrice = 0,
  discountStatus = "ACTIVE",
  prodCurrency = "USD",
  isBookmark = false,
  votes = 0,
  handleBookmark,
  handleUnBookmarked,
  handleVote,
  disabled = false,
  prodName = "",
  className = "",
  prodPageLink = "/",
  isHaveBookmarked = true,
  isDemo = false,
  priceSale,
}) => {
  const [showTips, setShowTips] = React.useState(false);
  const { showAlert } = useAlertContext();
  const wlMemberType = useSelector((state: RootState) => state.user.user).wl_member_type;

  const salePer = wlMemberType && wlMemberType.id === ENUM_WL_SYS_CONFIG.SUBSCRIBED_ET_MEMBER ? 40 : 20;
  // const priceSale = Math.ceil(prodPrice - prodPrice * (salePer / 100))
  const menuBarDisplay = useSelector((state: RootState) => state.menuBarDisplay.isShow);

  if (menuBarDisplay) return null;

  return (
    <div
      className={`rounded-t-10 bg-white px-5 py-6 shadow-voteBar transition-all duration-300 ease-in-out md:hidden fixed bottom-0 z-50 left-0 right-0 ${className}`}
    >
      {/* TODO: tooltips */}
      <div className="relative">
        <div className="w-full flex justify-center items-center">
          <div
            className={`${
              showTips ? "absolute -top-[130px]" : "hidden"
            } mx-3.5 overflow-hidden rounded-xl border border-gray-1350 bg-gray-2150 p-5 pr-12 shadow-voteBarInfo md:hidden w-fit`}
          >
            <div>
              <Image
                onClick={() => setShowTips(false)}
                src={CloseButton}
                alt=""
                width="14"
                height="14"
                className="absolute right-2 top-2 h-3.5 w-3.5 cursor-pointer"
              />
              {discountCode !== "" ? (
                <div className="text-15 leading-normal text-slate-1150">
                  Support{" "}
                  <span className="font-semibold" title={`${prodName}`}>
                    {prodName}{" "}
                  </span>
                  with an upvote and get a unique discount code to use while on their website.{" "}
                </div>
              ) : (
                <div className="text-15 leading-normal text-slate-1150">
                  Support{" "}
                  <span className="font-semibold" title={`${prodName}`}>
                    {prodName}{" "}
                  </span>
                  with an upvote or save your bookmarks{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* TODO: header */}
      <div className="flex  text-xl font-semibold leading-none text-slate-1150 font-[RobotoBold]">
        {`${isVoted ? "Thanks for voting!" : "UpVote Or Bookmark"}`}
        <Image
          src={Info}
          alt="info"
          width={0}
          height={0}
          className="ml-[5px] cursor-pointer"
          onClick={() => setShowTips(!showTips)}
          sizes="100vw"
        />
      </div>
      {/* TODO: price info*/}
      <div>
        <div className="mt-4 flex items-center space-x-2 text-22 leading-none text-slate-1150  ">
          <span className="text-red-500 font-semibold font-[RobotoBold]">{`${getCurrencyCode(
            prodCurrency
          )}${formatDataNumber(priceSale ? priceSale : prodPrice, 2)}`}</span>

          {priceSale !== prodPrice && (
            <div className=" text-slate-1150 ">
              <span className="font-normal line-through text-[16px]">{`${getCurrencyCode(
                prodCurrency
              )}${formatDataNumber(prodPrice, 2)}`}</span>
            </div>
          )}
          {/* <div
            className={`${
              discountCode !== '' ? 'flex space-x-2 items-center' : 'hidden'
            }`}
          >
            <div className="text-sm font-normal tracking-tight text-slate-1150 line-through space-x-1">
              <span className="font-bold text-red-500">{`${getCurrencyCode(
                prodCurrency
              )}${formatDataNumber(prodPrice, 2)}`}</span>
            </div>
            <div
              className={`h-auto items-center rounded-full bg-[--state-error] px-2 py-1 text-xs font-semibold leading-none text-white font-[RobotoBold]`}
            >
              {`${salePer}% OFF`}
            </div>
          </div> */}
        </div>
      </div>
      {/*TODO:: discount  info */}
      <div className="flex mt-5 w-full">
        <div className="flex flex-col space-y-2 items-stretch w-full">
          <div
            className={`${
              discountCode !== "" ? "flex" : "hidden"
            } justify-content h-[64px] w-full cursor-pointer flex-col items-center justify-center space-y-1 
            whitespace-nowrap rounded border px-1  text-xs font-semibold 
            leading-none ${
              discountStatus === "ACTIVE"
                ? "border-[--state-success] text-[--state-success]"
                : discountStatus === "LIMIT"
                ? "border-[--state-error] text-[--state-error]"
                : "border-[--state-warning] text-[--state-warning]"
            }`}
            onClick={() => {
              navigator.clipboard.writeText(discountCode);
              showAlert("success", "Copy Success!");
            }}
          >
            <div>
              {discountStatus === "ACTIVE"
                ? "CLICK TO COPY CODE"
                : discountStatus === "LIMIT"
                ? "YOUR DISCOUNT CODE IS APPLIED"
                : "YOUR DISCOUNT CODE IS EXPIRED"}
            </div>
            <div className="text-lg font-bold leading-none font-[RobotoBold]">{discountCode}</div>
          </div>
          {/* TODO: button */}
          <div className="flex space-x-2 items-center">
            {discountCode === "" ? (
              <CustomButton
                className="flex-1 w-full !h-[44px]"
                type={isVoted ? "normal" : "primary"}
                disabled={disabled}
                onClick={
                  !isDemo
                    ? () => {
                        if (isVoted) {
                          window.open(prodLink, "_blank");
                        } else {
                          handleVote && handleVote();
                        }
                      }
                    : () => {}
                }
                label={
                  <div className="font-semibold whitespace-nowrap font-[RobotoBold]">
                    {!disabled && isVoted ? (
                      <div className="flex items-center space-x-2 ">
                        <span>{`Buy Now`}</span>
                        <div>
                          <Image src={VotedIcon} alt="" />
                        </div>
                        <span>{formatDataNumber(votes, 0)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 ">
                        <span>{`UpVote`}</span>
                        <div>
                          <Image src={UpVote} alt="" />
                        </div>
                        <span>{formatDataNumber(votes, 0)}</span>
                      </div>
                    )}
                  </div>
                }
              />
            ) : (
              <CustomButton
                className="flex-1 w-full !h-[44px] "
                type={isVoted && discountStatus === "ACTIVE" ? "normal" : "primary"}
                disabled={disabled}
                onClick={
                  !isDemo
                    ? () => {
                        if (isVoted && discountStatus === "ACTIVE") {
                          window.open(prodLink, "_blank");
                        } else {
                          handleVote && handleVote();
                        }
                      }
                    : () => {}
                }
                label={
                  <div className="font-semibold whitespace-nowrap font-[RobotoBold]">
                    {discountStatus === "ACTIVE" ? (
                      "Buy With Discount"
                    ) : (
                      <div className="flex items-center space-x-2 ">
                        <span>{`UpVote `}</span>
                        <div>
                          <Image src={UpVote} alt="" />
                        </div>
                        <span>{formatDataNumber(votes, 0)}</span>
                      </div>
                    )}
                  </div>
                }
              />
            )}

            {!isVoted && !isHaveBookmarked && (
              <CustomButton
                className="!w-fit !h-[44px]"
                type={"normal"}
                disabled={disabled}
                onClick={() => {
                  window.open(prodPageLink, "_blank");
                }}
                label={<span className="font-[RobotoBold]">Buy Now</span>}
              />
            )}

            {isHaveBookmarked && (
              <div
                className={`${discountCode === "" ? "flex" : "hidden"}`}
                onClick={
                  !isDemo
                    ? !disabled && isBookmark
                      ? () => handleUnBookmarked && handleUnBookmarked()
                      : () => handleBookmark && handleBookmark()
                    : () => {}
                }
              >
                <Image
                  src={isBookmark ? CurationBookmarked : CurationBookmark}
                  alt=""
                  className="cursor-pointer h-[30px] w-[30px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteLandMobile;
